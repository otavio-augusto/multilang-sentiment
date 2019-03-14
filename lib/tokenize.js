/*eslint no-useless-escape: "off"*/

/**
 * Negators "flip" the sentiment of the following word.
 */
var negatorsClass = require('../build/languages/negators/');

/**
 * Remove special characters and return an array of tokens (words).
 * @param  {String} input The input string to be analyzed
 * @param {String} lang The language to be used
 * @return {Array} Array of tokens
 */
module.exports = function(input, lang) {
    if (!input) {
        return [];
    }

    var tmpTokens = input
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\_`~()\n]/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .match(/\b[\d\.]+|\S+/g);

    var tokens = [];
    for (var i=0,len=tmpTokens.length; i<len; i++) {
        var currToken = tmpTokens[i];

        if (i==len-1) {
            tokens.push({
                value: currToken,
                negate: false
            });
            continue;
        }

        // Trying to include negators in the tokens with
        // the possible combinations
        var nextToken = tmpTokens[i+1];
        var toCheck = tmpTokens[i] + nextToken;
        var toCheckAlt = tmpTokens[i] + ' ' + nextToken;
        if (negatorsClass.find(toCheck, lang)) {
            tokens.push({
                value: toCheck,
                negate: true
            });
            i++;
        } else if (negatorsClass.find(toCheckAlt, lang)) {
            tokens.push({
                value: toCheckAlt,
                negate: true
            });
            i++;
        } else if (negatorsClass.find(currToken, lang)) {
            tokens.push({
                value: currToken,
                negate: true
            });
        } else {
            tokens.push({
                value: currToken,
                negate: false
            });
        }
    }

    return tokens;
};
