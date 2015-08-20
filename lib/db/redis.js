'use strict';
function Redis(client, set) {
  this.client = client;
  this.SET = set || 'app:teabot';
}

Redis.prototype.get = function(key) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    _this.client.get(_this.SET + ':' + key, function(err, record) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(record));
      }
    });
  });
};

Redis.prototype.put = function(key, data) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    _this.client.set(_this.SET + ':' + key, JSON.stringify(data), function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = Redis;
