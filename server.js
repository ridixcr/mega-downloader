var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 3001));
app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.sendFile('./index.html');
});

app.get('/image', function(req, res) {
    console.log('download image');

    res.download('./image.jpg', function(err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', req.params.name);
        }
    });
});

app.get('/image-file', function(req, res) {
    console.log('send image file');

    res.sendFile('./image.jpg', { root: __dirname });
});

app.get('/mp3-file', function(req, res) {
    console.log('send mp3 file');

    res.sendFile('./song.mp3', { root: __dirname });
});

app.use('*', function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.listen(app.get('port'), function() {
    console.log('Example app listening on port %s!', app.get('port'));
});
