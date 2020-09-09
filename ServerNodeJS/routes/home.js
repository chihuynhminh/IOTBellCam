const mongoose = require('mongoose');
const LogCam = require('../models/LogCam.model');

module.exports = function (app) {
    app.get('/home', function (req, res) {
        res.render('home');
    });

    app.post('/open', function (req, res) {
        var fs = require('fs');
        fs.writeFile('./file/data.txt', 1, (err) => {
            if (err) return console.log(err);
        });

    });

    app.post('/close', function (req, res) {
        var fs = require('fs');
        fs.writeFile('./file/data.txt', 0, (err) => {
            if (err) return console.log(err);
        });

    });

    app.get('/openDoor', function (req, res) {
        var fs = require('fs');
        fs.readFile('./file/data.txt', 'utf8', (err, contents) => {
            res.json(parseInt(contents));
            res.status = 200;
        });
    });

    app.post('/log', async function (req, res) {
        const logcam = new LogCam();
        logcam.noiDung = "Log camera";
        await logcam.save()
            .then(result => {
                console.log("Saved log " + result);
            })
            .catch(err => {
                console.log(err);
            })
        res.send("done");
    });
}