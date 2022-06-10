const fs = require('fs');
const { parse } = require('csv-parse');
const config = require('config');

const CSV_FILE = config.get('data.CSV_FILE');
const JSON_FILE = config.get('data.JSON_FILE');

let jsonData = [];

const parseData = (row) => {
    let address = row.slice(2).join(' ');

    jsonData.push({
        firstName: row[0],
        lastName: row[1],
        address: address,
    });
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
