var test = require('tap').test;
var tokenize = require('../../lib/tokenize');

test('spec', function (t) {
    t.type(tokenize, 'function');
    t.type(tokenize('foo'), 'object');
    t.equal(tokenize('foo bar').length, 2);

    t.throws(function () {
        tokenize(123);
    });
    t.throws(function () {
        tokenize({});
    });
    t.throws(function () {
        tokenize([]);
    });

    t.end();
});

test('english', function (t) {
    t.deepEqual(
        tokenize('The cat went over the wall.'),
        [
            {value: 'the', negate: false},
            {value: 'cat', negate: false},
            {value: 'went', negate: false},
            {value: 'over', negate: false},
            {value: 'the', negate: false},
            {value: 'wall', negate: false}
        ]
    );
    t.deepEqual(
        tokenize('That\'ll cause problems for the farmer\'s pigs'),
        [
            {value: 'that\'ll', negate: false},
            {value: 'cause', negate: false},
            {value: 'problems', negate: false},
            {value: 'for', negate: false},
            {value: 'the', negate: false},
            {value: 'farmer\'s', negate: false},
            {value: 'pigs', negate: false}
        ]
    );
    t.end();
});

test('diacritic', function (t) {
    t.deepEqual(
        tokenize('This approach is naïve.'),
        [
            {value: 'this', negate: false},
            {value: 'approach', negate: false},
            {value: 'is', negate: false},
            {value: 'naïve', negate: false}
        ]
    );
    t.deepEqual(
        tokenize('The puppy bowl team was very coöperative.'),
        [
            {value: 'the', negate: false}, 
            {value: 'puppy', negate: false},
            {value: 'bowl', negate: false},
            {value: 'team', negate: false},
            {value: 'was', negate: false},
            {value: 'very', negate: false},
            {value: 'coöperative', negate: false}
        ]
    );
    t.deepEqual(
        tokenize('The soufflé was delicious!'),
        [
            {value: 'the', negate: false},
            {value: 'soufflé', negate: false},
            {value: 'was', negate: false},
            {value: 'delicious', negate: false}
        ]
    );
    t.end();
});
