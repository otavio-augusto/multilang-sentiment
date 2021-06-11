const data = require('./data/AraHate-CHI.json');
const oldData = require('../../build/languages/AFINN-ar.json');

const { chiToAfinn, minMaxScore } = require('./utils');

const run = () => {
  const output = { ...oldData };
  let duplicatedCount = 0;
  let newTermsCount = 0;
  const minMax = minMaxScore(data);

  for (const record of data) {
    const newAfinnScore = chiToAfinn(record.score, minMax[0], minMax[1]);

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
          'CHI: ',
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
    'CHI terms: ',
    Object.keys(data).length,
    'Duplicated: ',
    duplicatedCount,
    'New: ',
    newTermsCount
  );

  console.log(JSON.stringify(output));
};

run();
