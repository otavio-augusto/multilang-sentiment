const fs = require('fs');

module.exports = {
  minMaxScore: (data) => {
    let min = 0;
    let max = 0;

    for (const record of data) {
      const { score } = record;
      if (score < min) {
        min = score;
      } else if (score > max) {
        max = score;
      }
    }

    return [min, max];
  },
  // TODO: Do we need different way to convert scores
  bnsToAfinn: (score, min, max) => {
    return -Math.ceil(((score - min) * (5 - -5)) / (max - min) + -5);
  },
  chiToAfinn: (score, min, max) => {
    return -Math.ceil(((score - min) * (5 - -5)) / (max - min) + -5);
  },
  pmiToAfinn: (score, min, max) => {
    return -Math.ceil(((score - min) * (5 - -5)) / (max - min) + -5);
  },
  writeToFile: (data, destPath) => {
    try {
      fs.writeFileSync(destPath, JSON.stringify(data));
      console.log('Output: ', destPath);
    } catch (err) {
      console.warn(err);
    }
  },
};
