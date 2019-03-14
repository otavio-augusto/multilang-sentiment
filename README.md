## multilang-sentiment
#### Multi language AFINN-based sentiment analysis for Node.js

[![Build Status](https://travis-ci.org/marcellobarile/multilang-sentiment.svg?branch=develop)](https://travis-ci.org/marcellobarile/multilang-sentiment)
[![Coverage Status](https://coveralls.io/repos/github/marcellobarile/multilang-sentiment/badge.svg?branch=develop)](https://coveralls.io/github/marcellobarile/multilang-sentiment?branch=develop)

Multilang Sentiment (fork of [Sentiment](https://github.com/thisandagain/sentiment)) is a Node.js module that uses the [AFINN-165](http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=6010) wordlists translated in multiple languages and [Emoji Sentiment Ranking](http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0144296) to perform [sentiment analysis](http://en.wikipedia.org/wiki/Sentiment_analysis) on arbitrary blocks of input text. Multilang Sentiment provides several things:

- Performance (see benchmarks below)
- The ability to append and overwrite word / value pairs from the AFINN wordlist or to use custom tokens
- A build process that makes updating sentiment to future wordlists trivial

### Installation
```bash
npm install multilang-sentiment
```

### Usage
```javascript
var sentiment = require('multilang-sentiment');

var r1 = sentiment('Cats are stupid.', 'en');
console.dir(r1);        // Score: -2, Comparative: -0.666

var r2 = sentiment('Cats are totally amazing!'); // "en" by default
console.dir(r2);        // Score: 4, Comparative: 1
```

### Adding / overwriting words
You can append and/or overwrite values from AFINN by simply injecting key/value pairs into a sentiment method call:
```javascript
var sentiment = require('multilang-sentiment');

var result = sentiment('Cats are totally amazing!', 'en', {
    'words': {
        'cats': 5,
        'amazing': 2
    }
});
console.dir(result);    // Score: 7, Comparative: 1.75
```

### Passing custom tokens
There are languages that might require specific tokenizators, such as chinese or arabic.
In such a case you can pass your own tokens.

```javascript
var sentiment = require('multilang-sentiment');

var tokens = ['世界','就','是','一个','疯子','的','囚笼'];
var result = sentiment('世界就是一个疯子的囚笼', 'zh', {
    'tokens': tokens
});
console.dir(result);    // Score: -3, Comparative: -0.43
```

---

### How it works
#### AFINN 
AFINN is a list of words rated for valence with an integer between minus five (negative) and plus five (positive). Sentiment analysis is performed by cross-checking the string tokens(words, emojis) with the AFINN list and getting their respective scores. The comparative score is simply: `sum of each token / number of tokens`. So for example let's take the following:

`I love cats, but I am allergic to them.`

That string results in the following:
```javascript
{
    score: 1,
    comparative: 0.1111111111111111,
    tokens: [ { value: 'i', negate: false },
     { value: 'love', negate: false },
     { value: 'cats', negate: false },
     { value: 'but', negate: false },
     { value: 'i', negate: false },
     { value: 'am', negate: false },
     { value: 'allergic', negate: false },
     { value: 'to', negate: false },
     { value: 'them', negate: false } ],
    words: [
        'allergic',
        'love'
    ],
    positive: [
        'love'
    ],
    negative: [
        'allergic'
    ]
}
```

#### Supported languages
"af","am","ar","az","be","bg","bn","bs","ca","ceb","co","cs","cy","da","de","el","en","eo","es","et","eu","fa","fi",
"fr","fy","ga","gd","gl","gu","ha","haw","hi","hmn","hr","ht","hu","hy","id","ig","is","it","iw","ja","jw","ka","kk",
"km","kn","ko","ku","ky","la","lb","lo","lt","lv","mg","mi","mk","ml","mn","mr","ms","mt","my","ne","nl","no","ny",
"pa","pl","ps","pt","ro","ru","sd","si","sk","sl","sm","sn","so","sq","sr","st","su","sv","sw","ta","te","tg","th",
"tl","tr","uk","ur","uz","vi","xh","yi","yo","zh-tw","zh","zu"

* Returned Objects
    * __Score__: Score calculated by adding the sentiment values of recongnized words.
    * __Comparative__: Comparative score of the input string.
    * __Token__: All the tokens like words or emojis found in the input string.
    * __Words__: List of words from input string that were found in AFINN list. 
    * __Positive__: List of postive words in input string that were found in AFINN list.
    * __Negative__: List of negative words in input string that were found in AFINN list.
 
In this case, love has a value of 3, allergic has a value of -2, and the remaining tokens are neutral with a value of 0. Because the string has 9 tokens the resulting comparative score looks like:
`(3 + -2) / 9 = 0.11`

This approach leaves you with a mid-point of 0 and the upper and lower bounds are constrained to positive and negative 5 respectively (the same as each token! 😸). For example, let's imagine an incredibly "positive" string with 200 tokens and where each token has an AFINN score of 5. Our resulting comparative score would look like this:

```
(max positive score * number of tokens) / number of tokens
(5 * 200) / 200 = 5
```

#### Tokenization
Tokenization works by splitting the lines of input string, then removing the special characters, and finally splitting it using spaces. This is used to get list of words in the string. 

---

### Benchmarks
A primary motivation for designing `sentiment`, the forked module, was performance. As such, it includes a benchmark script within the test directory that compares it against the [Sentimental](https://github.com/thinkroth/Sentimental) module which provides a nearly equivalent interface and approach. Based on these benchmarks, running on a MacBook Pro with Node v6.9.1, `sentiment` is **twice as fast** as alternative implementations:

```bash
sentiment (Latest) x 448,788 ops/sec ±1.02% (88 runs sampled)
Sentimental (1.0.1) x 240,103 ops/sec ±5.13% (81 runs sampled)
```

To run the benchmarks yourself:
```bash
make benchmark
```

---

### Validation
While the accuracy provided by AFINN is quite good considering it's computational performance (see above) there is always room for improvement. Therefore the `multilang-sentiment` module is open to accepting PRs which modify or amend the AFINN / Emoji datasets or implementation given that they improve accuracy and maintain similar performance characteristics. In order to establish this, we test the `multilang-sentiment` module against [three labelled datasets provided by UCI](https://archive.ics.uci.edu/ml/datasets/Sentiment+Labelled+Sentences).

To run the validation tests yourself:
```bash
make validate
```

#### Rand Accuracy (AFINN Only)
```
Amazon:  0.70
IMDB:    0.76
Yelp:    0.67
```

#### Rand Accuracy (AFINN + Additions)
```
Amazon:  0.72 (+2%)
IMDB:    0.77 (+1%)
Yelp:    0.70 (+3%)
```

---

### Testing
```bash
npm test
```
