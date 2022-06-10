const express = require('express');
const router = express.Router();
const fileHelper = require('../fileHelper.js');
const config = require('config');
const CSV_FILE = config.get('data.CSV_FILE');

router.post('/', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.file;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(CSV_FILE, function (err) {
        if (err) return res.status(500).send(err);

        fileHelper.read();

        res.send('File uploaded and parsed');
    });
});

module.exports = router;
