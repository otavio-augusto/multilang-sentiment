const AFINN_PATH = '../../build/languages/AFINN-ar.json';
const { resolve } = require('path');
const data = require('./data/AraHate-BNS.json');
const oldData = require(AFINN_PATH);
const { bnsToAfinn, minMaxScore, writeToFile } = require('./utils');

const run = () => {
  const output = { ...oldData };
  let duplicatedCount = 0;
  let newTermsCount = 0;
  const minMax = minMaxScore(data);

  for (const record of data) {
    const newAfinnScore = bnsToAfinn(record.score, minMax[0], minMax[1]);

    if (output[record.term]) {
      duplicatedCount++;

      if (
        (output[record.term] < 0 && newAfinnScore > 0) ||
        (output[record.term] > 0 && newAfinnScore < 0)
      ) {
        console.log(
          'term: ',
          record.term,
          'AFINN: ',
          output[record.term],
          'new AFINN: ',
          newAfinnScore,
          'BNS: ',
          record.score
        );
      }
    } else {
      newTermsCount++;
      output[record.term] = newAfinnScore;
    }
  }

  console.log(
    'AFINN terms: ',
    Object.keys(output).length,
    'BNS terms: ',
    Object.keys(data).length,
    'Duplicated: ',
    duplicatedCount,
    'New: ',
    newTermsCount
  );

  writeToFile(output, resolve(AFINN_PATH));
};

run();
