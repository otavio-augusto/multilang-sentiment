const sentiment = require('../../lib/index');
const { resolve } = require('path');
const { writeToFile } = require('./utils');
// const benchmark = require('./data/AraHate-test.json');

// let mismatchesCount = 0;
// let totalCount = 0;

// for (const record of benchmark) {
//   totalCount++;

//   const { msg, category } = record;
//   const { score, comparative, category: scoreCategory } = sentiment(msg, 'ar');

//   if (category !== scoreCategory) {
//     mismatchesCount++;

//     console.log(
//       'Msg: ',
//       msg,
//       'Category: ',
//       category,
//       'Score: ',
//       score,
//       'Comparative: ',
//       comparative,
//       'Score category: ',
//       scoreCategory
//     );
//   }
// }

// console.log(`Done - ${mismatchesCount}/${totalCount}`);
// Last run: 3873 / 5846

const tweet = 'https://twitter.com/jamalfayad/status/1387464969072033794?s=20';
const expected = 'neutral';
const msg = `في حلقة اليوم من #عشرين_عشرين فادي ابراهيم  وكارمن لبّس يبدعان بأداء رائع بكل معنى الكلمة ...
أما الرائع قصيّ خولي ... فقد خلص الكلام عنه!`;
const score = sentiment(msg, 'ar');

console.log('Done');
writeToFile(
  {
    tweet,
    expected,
    msg,
    result: score,
  },
  resolve(`./output/sent_${new Date().getTime()}.json`)
);
