'use strict';
var https = require('https');
var qs = require('querystring');

function postHTTPS(params, data) {
  var options = {
    hostname: 'api.botan.io',
    path: '/track?' + qs.stringify(params),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };
  return new Promise(function(resolve, reject) {
    var req = https.request(options, function(response) {
      var d = '';
      response.setEncoding('utf8');
      response.on('data', function(chunk) {
        d += chunk;
      });

      response.on('end', function() {
        resolve(d);
      });
    }).on('error', function(e) {
      reject(new Error(e));
    });

    req.write(data, 'utf8');
    req.end();
  });
}

function postJSON(params, data) {
  return postHTTPS(params, JSON.stringify(data)).then(JSON.parse);
}

function Botan(token) {
  this.token = token;
}

Botan.prototype.track = function(uid, data, event) {
  var params = {
    token: this.token,
    uid: uid,
    name: event,
  };
  return postJSON(params, data);
};

module.exports = Botan;
