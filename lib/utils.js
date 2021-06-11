var negatorsClass = require('../build/languages/negators/');

module.exports = {
  /**
   * Returns TRUE if the given word is a negator in the given language
   */
  isNegator: function (word, lang) {
    return negatorsClass.find(word, lang);
  },
  /**
   * Returns TRUE if the given language is a "right-to-left" one
   */
  isRTLLanguage: function (lang) {
    return ['ar', 'az', 'dv', 'he', 'ku', 'fa', 'ur', 'yi'].includes(lang);
  },
};
