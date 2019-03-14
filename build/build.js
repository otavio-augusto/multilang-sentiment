var async = require('async');
var fs = require('fs');
var path = require('path');

// File paths
var AFINN_PATH = path.resolve(__dirname, 'languages');
var EMOJI_PATH = path.resolve(__dirname, 'emojis/Emoji_Sentiment_Data_v1.0.csv');
var RESULT_PATH = path.resolve(__dirname, 'output/build-{lang}.json');

/**
 * Read emoji data from original format (CSV).
 * @param  {object}   hash     Result hash
 * @param  {Function} callback Callback
 * @return {void}
 */
function processEmoji(hash, callback) {
    // Read file
    fs.readFile(EMOJI_PATH, 'utf8', function (err, data) {
        if (err) return callback(err);

        // Split data by new line
        data = data.split(/\n/);

        // Iterate over dataset and add to hash
        for (var i in data) {
            var line = data[i].split(',');

            // Validate line
            if (i == 0) continue;               // Label
            if (line.length !== 9) continue;    // Invalid

            // Establish sentiment value
            var emoji = String.fromCodePoint(line[1]);
            var occurences = line[2];
            var negCount = line[4];
            var posCount = line[6];
            var score = (posCount / occurences) - (negCount / occurences);
            var sentiment = Math.floor(5 * score);

            // Validate score
            if (Number.isNaN(sentiment)) continue;
            if (sentiment === 0) continue;

            // Add to hash
            hash[emoji] = {
                coeff: sentiment,
                lang: '*'
            };
        }

        callback(null, hash);
    });
}

/**
 * Read AFINN data from original format (TSV).
 * @param  {object}   hash     Result hash
 * @param  {Function} callback Callback
 * @return {void}
 */
function processAFINN(hash, callback) {
    var initialHash = Object.assign({}, hash);

    fs.readdirSync(AFINN_PATH).forEach(function(file) {
        if (file.indexOf('AFINN') < 0) {
            return;
        }

        var filePath = AFINN_PATH + '/' + file;
        var lang = file.match(/AFINN-(.*)\.json/);
        var langHash = Object.assign({}, initialHash);

        if (fs.lstatSync(filePath).isDirectory()) {
            return;
        }

        var jsonContent = JSON.parse(
            fs.readFileSync(filePath, 'utf8')
        );

        for(var i in jsonContent) {
            if (i.length > 1) {
                var index = i.toLowerCase();
                var obj = {
                    coeff: jsonContent[i],
                    lang: lang[1]
                };
                langHash[index] = obj;
                hash[index] = obj;
            }
        }

        var langHashStr = JSON
            .stringify(langHash)
            .replace(/\s(?=([^"]*"[^"]*")*[^"]*$)/, '');

        fs.writeFile(
            RESULT_PATH.replace('{lang}', lang[1]),
            langHashStr,
            function (err) {
                if (err) return callback(err);
            }
        );
    });

    callback(null, hash);
}

// Execute build process
async.waterfall([
    function (cb) {
        cb(null, {});
    },
    processEmoji,
    processAFINN
], function(err, result) {
    if (err) throw new Error(err);
    process.stderr.write(
        'Complete: ' +
        Object.keys(result).length +
        ' entries.\n'
    );
});
