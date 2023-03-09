var net = require('net');
var Promise = require('bluebird');
const express = require('express');
const app = express();
const port = 8080;

function checkConnection(host, port, timeout) {
    return new Promise(function(resolve, reject) {
        timeout = timeout || 10000;     // default of 10 seconds
        var timer = setTimeout(function() {
            reject("timeout");
            socket.end();
        }, timeout);
        var socket = net.createConnection(port, host, function() {
            clearTimeout(timer);
            resolve();
            socket.end();
        });
        socket.on('error', function(err) {
            clearTimeout(timer);
            reject(err);
        });
    });
}



app.get('/:url/:port', (req, res) => {
    var url = req.params.url
    var port = req.params.port;

    if(!url) {
        console.log('URL must be set!')
    }
    if(!port) {
        console.log('URL must be set!')
    }
    checkConnection(url, port).then(function() {
        console.log('The address ' + url + ' is reachable at port ' + port + ' via tcp protocol.');
        res.send('The address ' + url + ' is reachable at port ' + port + ' via tcp protocol.');
     }, function(err) {
        console.log('MSSQL Server is NOT reachable.');
        res.send('The address ' + url + ' is NOT reachable at port ' + port + ' via tcp protocol.');
     });
});

app.listen(port, () => {
    console.log('listening for request on port 8080');
});