const express = require('express');
const fs = require('fs');
const router = express.Router();
const config = require('config');
const JSON_FILE = config.get('data.JSON_FILE');

router.get('/', (req, res) => {
    fs.readFile(JSON_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send(`No ${JSON_FILE} was found.`);
        }

        res.send(JSON.parse(data));
    });
});

module.exports = router;
