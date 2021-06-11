var tokenize = require('./tokenize');
var Fuse = require('fuse.js');
var utils = require('./utils');

var langLists = [];
var fuseDbs = [];
var fuseOpts = {
  includeMatches: true,
  threshold: 0.2,
  location: 0,
  distance: 10,
  maxPatternLength: 20,
  minMatchCharLength: 1,
  keys: ['word'],
};

// Will not perform a fuzzy search on long texts
var fuzzySearchMaxLength = 100;

// Defines the distance, expressed in number of
// tokens, within which a negator has effect
var maxNegationDistance = 5;

// Volatile list of already built languages
var builtLanguages = [];

/**
 * Builds the Fuse DBs and creates dictionaries.
 * In case the given language has been already built, the
 * iteration is skipped.
 * @param {Object} langs The list of supported languages
 */
function buildFuseDbs(langs) {
  langs.forEach(function (lang) {
    if (builtLanguages.indexOf(lang) > -1) {
      return;
    }

    var afinnWords = [];
    langLists[lang] = require('../build/output/build-' + lang + '.json');
    Object.keys(langLists[lang]).forEach(function (k) {
      afinnWords.push({
        word: k,
      });
    });
    fuseDbs[lang] = new Fuse(afinnWords, fuseOpts);
    builtLanguages.push(lang);
  });
}

/**
 * Performs sentiment analysis on the provided input 'phrase'.
 *
 * @param {String} phrase The phrase to be analyzed
 * @param {String} lang The language to be used
 * @param {Object} inject Custom additions (words/tokens)
 * @param {Function} callback An optional callback
 * @return {Object}
 */
// TODO: Support multiple langs to be passed
module.exports = function (phrase, lang, inject, callback) {
  // Parse arguments
  if (typeof phrase === 'undefined') phrase = '';
  if (typeof lang === 'undefined') lang = 'en';
  if (typeof inject === 'undefined') inject = null;
  if (typeof inject === 'function') callback = inject;
  if (typeof callback === 'undefined') callback = null;

  // Let's build fuse dbs at bootstrap
  buildFuseDbs([lang]);

  var i, j;
  var customTokens = [];
  var afinnLang = Object.assign({}, langLists[lang]);
  var fuse = fuseDbs[lang];

  // Merge custom words/tokens with our dictionary
  if (inject !== null) {
    if (typeof inject.words !== 'undefined') {
      for (i in inject.words) {
        inject.words[i] = {
          coeff: inject.words[i],
          lang: lang,
        };
      }
      afinnLang = Object.assign(afinnLang, inject.words);
    }

    if (typeof inject.tokens !== 'undefined') {
      for (i in inject.tokens) {
        customTokens.push({
          value: inject.tokens[i],
          negate: utils.isNegator(inject.tokens[i], lang),
        });
      }
    }
  }

  // Storage objects
  var tokens = customTokens.length > 0 ? customTokens : tokenize(phrase, lang),
    score = 0,
    positiveScore = 0,
    negativeScore = 0,
    words = [],
    positive = [],
    negative = [];

  // Iterate over tokens
  var nearNegator = false,
    nearNegatorCount = 0,
    tokensLen = tokens.length;

  for (i = 0; i < tokensLen; i++) {
    var tokenizedWord = tokens[i].value;
    if (tokenizedWord === '') continue;

    if (tokens[i].negate) {
      nearNegator = true;
      continue;
    }

    if (nearNegatorCount >= maxNegationDistance) {
      nearNegator = false;
      nearNegatorCount = 0;
    }
    nearNegatorCount++;

    if (
      !Object.prototype.hasOwnProperty.call(afinnLang, tokenizedWord) &&
      tokens.length < fuzzySearchMaxLength
    ) {
      // TODO: Handling of typos or plurals in single words
      // has to be further improved.The following implementation
      // is a good compromise.

      var foundSimilar = false;
      var search = fuse.search(tokenizedWord);

      for (j in search) {
        var fuseItem = search[j];
        var fuseWord = fuseItem.item.word;
        var partialFuseWord = fuseWord.substring(0, fuseWord.length - 1);
        var partialWord = tokenizedWord.substring(0, tokenizedWord.length - 1);

        if (
          fuseItem &&
          fuseItem.item &&
          fuseItem.item.word &&
          // To avoid false-positives the words
          // should be identical except for
          // the final char
          partialFuseWord === partialWord
        ) {
          foundSimilar = true;
          tokenizedWord = fuseItem.matches[0].value;
          break;
        }
      }

      if (!foundSimilar) {
        continue;
      }
    }

    words.push(tokenizedWord);

    var item = Object.assign({}, afinnLang[tokenizedWord]);
    item.coeff = nearNegator ? -item.coeff : item.coeff;

    if (item.coeff > 0) {
      positive.push(tokenizedWord);
      positiveScore += item.coeff;
    } else if (item.coeff < 0) {
      negative.push(tokenizedWord);
      negativeScore += item.coeff;
    }

    if (isNaN(item.coeff)) {
      continue;
    }

    score += item.coeff;
  }

  let positiveOverNegativeScore =
    +(positiveScore / negativeScore).toFixed(2) || 0;

  if (positiveScore === 0) {
    positiveOverNegativeScore = negativeScore;
  } else if (negativeScore === 0) {
    positiveOverNegativeScore = positiveScore;
  } else {
    if (positiveOverNegativeScore === Number.POSITIVE_INFINITY) {
      positiveOverNegativeScore = positiveScore;
    } else if (positiveOverNegativeScore === Number.NEGATIVE_INFINITY) {
      positiveOverNegativeScore = negativeScore;
    }
  }

  const comparativeScore =
    score !== 0
      ? +(score / tokens.length + positiveOverNegativeScore).toFixed(2)
      : 0;

  let category;
  if (score === 0) {
    category = 'neutral';
  } else if (comparativeScore > 0) {
    category = 'positive';
  } else {
    category = 'negative';
  }

  var result = {
    score,
    positiveScore,
    negativeScore,
    comparative: comparativeScore,
    category,
    tokens,
    words,
    positive,
    negative,
  };

  if (callback === null) {
    return result;
  }

  process.nextTick(function () {
    callback(null, result);
  });
};
