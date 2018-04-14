module.exports = {
    negators: require('./all.json'),
    defaultCoeff: 1,
    find: function(word) {
        for (var i in this.negators) {
            for (var j in this.negators[i]) {
                if (this.negators[i][j] === word) return true;
            }
        }
        return false;
    }
};
