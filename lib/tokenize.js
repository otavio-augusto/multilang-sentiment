/*eslint no-useless-escape: "off"*/

var negatorsClass = require('../build/languages/negators/');

/**
 * Remove special characters and return an array of tokens (words).
 * @param  {string} input Input string
 * @param {string} lang Language 
 * @return {array}        Array of tokens
 */
module.exports = function(input, lang) {
    if (!input) return [];

    var tmpTokens = input
        .toLowerCase()
        .replace(/\n/g, ' ')
        .replace(/[.,\/#!$%\^&\*;:{}=\_`~()]/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .match(/\b[\d\.]+|\S+/g);

    var tokens = [];
    for (var i=0,len=tmpTokens.length; i<len; i++) {
        var currToken = tmpTokens[i];

        if (i==len-1) {
            tokens.push(currToken);
            continue;
        }

        var nextToken = tmpTokens[i+1];
        var toCheck = tmpTokens[i] + nextToken;
        var toCheckAlt = tmpTokens[i] + " " + nextToken;
        
        if (negatorsClass.find(toCheck, lang)) {
            tokens.push(toCheck);
            i++;
        } else if (negatorsClass.find(toCheckAlt, lang)) {
            tokens.push(toCheckAlt);
            i++;
        } else {
            tokens.push(currToken);
        }
    }
    return tokens;
};
