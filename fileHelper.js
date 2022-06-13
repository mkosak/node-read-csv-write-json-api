const fs = require('fs');
const { parse } = require('csv-parse');
const config = require('config');

const CSV_FILE = config.get('data.CSV_FILE');
const JSON_FILE = config.get('data.JSON_FILE');

let jsonData = {
    features: [],
    type: 'FeatureCollection',
};

const parseData = (row) => {
    // remove unused header
    if (row[0] && row[0] === 'GUID') return;

    // collect stands data
    const stands = [row[3], row[4], row[5], row[6], row[7]].filter(Boolean);

    // do not store anything without stand data
    if (!stands.length) return;

    // collect data map object for each stand
    if (stands.length > 1) {
        stands.map((stand) => {
            jsonData.features.push({
                geometry: {
                    coordinates: [row[8], row[9]],
                    type: 'Point',
                },
                properties: {
                    name: row[1],
                    stand: stand,
                },
                type: 'Feature',
            });
        });
    } else {
        // collect single stand data map object
        jsonData.features.push({
            geometry: {
                coordinates: [row[8], row[9]],
                type: 'Point',
            },
            properties: {
                name: row[1],
                stand: row[3],
            },
            type: 'Feature',
        });
    }
};

const read = () => {
    fs.createReadStream(CSV_FILE)
        .pipe(parse({ delimiter: ',', from_line: 2, skipLines: 3 }))
        .on('data', function (csvRow) {
            parseData(csvRow);
        })
        .on('end', function () {
            console.log('File parse finished');

            write(JSON_FILE, jsonData);
        })
        .on('error', function (error) {
            console.log(error.message);
        });
};

const write = (filename, data) => {
    const fileData = JSON.stringify(data);

    fs.writeFileSync(filename, fileData, 'utf8');

    console.log('File written successfully\n');
};

const fileHelper = { read, write };

module.exports = fileHelper;
