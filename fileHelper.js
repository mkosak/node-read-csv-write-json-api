const fs = require('fs');
const { parse } = require('csv-parse');
const config = require('config');

const CSV_FILE = config.get('data.CSV_FILE');
const JSON_FILE = config.get('data.JSON_FILE');

let jsonData = {};

const parseData = (row) => {
    jsonData[row[0]] = {
        X_Coordinate: row[1],
        Y_Coordinate: row[2],
        Y_Coordinate: row[3],
        Z_Coordinate: row[4],
        Easting_Coordinate: row[5],
        Northing_Coordinate: row[6],
    };
};

const read = () => {
    fs.createReadStream(CSV_FILE)
        .pipe(parse({ delimiter: ',', from_line: 2 }))
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
