'use strict';
function Aerospike(client, key) {
  key || (key = {});
  this.client = client;
  this.KEY = {};
  this.KEY.ns = key.ns || 'app';
  this.KEY.set = key.set || 'teabot';
  this.KEY.key;
}

Aerospike.prototype.get = function(key) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    _this.KEY.key = key;
    _this.client.get(_this.KEY, function(err, record) {
      if (err.code == 0) { //aerospike.status.AEROSPIKE_OK
        resolve(record);
      } else if (err.code == 602 || err.code == 2) { //aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND
        resolve(false);
      } else {
        reject(err);
      }
    });
  });
};

Aerospike.prototype.put = function(key, data) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    _this.KEY.key = key;
    _this.client.put(_this.KEY, data, {exists: 0}, function(err) { //aerospike.policy.exists.IGNORE
      if (err.code != 0) { //aerospike.status.AEROSPIKE_OK
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = Aerospike;
