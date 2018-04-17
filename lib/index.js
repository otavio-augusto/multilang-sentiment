/**
 * Negators "flip" the sentiment of the following word.
 */
var negatorsClass = require('../build/languages/negators/');

var supportedLanguages = require('../build/languages/list.json');
var tokenize = require('./tokenize');
var Fuse = require('fuse.js');
var langLists = [];
var fuseDbs = [];
var fuseOpts = {
    includeMatches: true,
    threshold: 0.2,
    location: 0,
    distance: 10,
    maxPatternLength: 20,
    minMatchCharLength: 1,
    keys: ['word']
};
var fuzzySearchMaxLength = 100; // Will not perform a fuzzy search on long texts
var maxNegationDistance = 4; // TODO: Make it configurable + write description

/**
 * Builds the Fuse DBs and creates dictionaries
 * @param {Object} langs The list of supported languages
 */
function buildFuseDbs(langs) {
    langs.forEach(function(lang) {
        var afinnWords = [];
        langLists[lang] = require('../build/output/build-' + lang + '.json');
        Object.keys(langLists[lang]).forEach(function(k) {
            afinnWords.push({
                word: k
            });
        });
        fuseDbs[lang] = new Fuse(afinnWords, fuseOpts);
    });
}

// Let's build fuse dbs at bootstrap
buildFuseDbs(supportedLanguages);

/**
 * Performs sentiment analysis on the provided input 'phrase'.
 *
 * @param {String} Input phrase
 * @param {Object} Optional sentiment additions to AFINN (hash k/v pairs)
 *
 * @return {Object}
 */
module.exports = function (phrase, lang, inject, callback) {
    // Parse arguments
    if (typeof phrase === 'undefined') phrase = '';
    if (typeof lang === 'undefined') lang = 'en';
    if (typeof inject === 'undefined') inject = null;
    if (typeof inject === 'function') callback = inject;
    if (typeof callback === 'undefined') callback = null;

    var afinnLang = Object.assign({}, langLists[lang]);
    var fuse = fuseDbs[lang];
    var i, j;
    var customTokens = [];

    // Merge
    if (inject !== null) {
        if (typeof inject.words !== 'undefined') {
            for(i in inject.words) {
                inject.words[i] = {
                    coeff: inject.words[i],
                    lang: lang
                };
            }
            afinnLang = Object.assign(afinnLang, inject.words);
        }

        if (typeof inject.tokens !== 'undefined') {
            for (i in inject.tokens) {
                customTokens.push({
                    value: inject.tokens[i],
                    negate: negatorsClass.find(inject.tokens[i], lang)
                });
            }
        }
    }

    // Storage objects
    var tokens      = customTokens.length > 0
            ? customTokens
            : tokenize(phrase, lang),
        score       = 0,
        words       = [],
        positive    = [],
        negative    = [];

    // Utils
    var utils = {
        round: function(value, precision) {
            var multiplier = Math.pow(10, precision || 0);
            return Math.round(value * multiplier) / multiplier;
        }
    };

    // Iterate over tokens
    var nearNegator = false;
    var nearNegatorCount = 0;
    var len = tokens.length;
    for(i=0; i<len; i++) {
        var obj = tokens[i].value;
        if (obj === '') continue;

        if (tokens[i].negate) {
            nearNegator = true;
            continue;
        }

        if (nearNegatorCount >= maxNegationDistance) {
            nearNegator = false;
            nearNegatorCount = 0;
        }
        nearNegatorCount++;

        if (!afinnLang.hasOwnProperty(obj)) {
            // TODO: Handling of typos or plurals in single words
            // has to be further improved.The following implementation
            // is a good compromise.
            if (tokens.length >= fuzzySearchMaxLength) continue;

            var foundSimilar = false;
            var search = fuse.search(obj);
            for (j in search) {
                var fuseItem = search[j];
                if (
                    fuseItem
                    && fuseItem.item
                    && fuseItem.item.word
                    // The initials should be the same in order to
                    // avoid false-positives
                    && obj[0] === fuseItem.item.word[0]
                    // Checking the length helps to identify plurals
                    && obj.length == fuseItem.item.word.length
                ) {
                    foundSimilar = true;
                    obj = fuseItem.matches[0].value;
                    break;
                }
            }
            
            if (!foundSimilar) continue;
        }

        if (
            afinnLang[obj].lang != '*'
            && afinnLang[obj].lang !== lang
        ) continue;

        var item = Object.assign({}, afinnLang[obj]);

        // Check for near negation
        if (nearNegator) item.coeff = -item.coeff;

        words.push(obj);

        if (item.coeff > 0) positive.push(obj);
        if (item.coeff < 0) negative.push(obj);

        score += item.coeff;
    }

    // Handle optional async interface
    var result = {
        score:          score,
        comparative:    tokens.length > 0
            ? utils.round(score / tokens.length, 2)
            : 0,
        tokens:         tokens,
        words:          words,
        positive:       positive,
        negative:       negative
    };

    if (callback === null) return result;
    process.nextTick(function () {
        callback(null, result);
    });
};
