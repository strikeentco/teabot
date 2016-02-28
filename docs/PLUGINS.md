# Plugins

`TeaBot` allows you to use and create external plugins. At the moment `TeaBot` supports only `db` and `analytics` plugins, but in the future there will be more.

## Basic info

All plugins must meet the following requirements:
  * Plugin class name must be in `PascalCase` and must be like `TeabotNamePlugin` where `Name` is plugin name
  * Plugin must contain `_pluginType` property with plugin type
  * Plugin must contain `_getType` method, which returns `_pluginType`
  * All internal properties and methods must starts with `_`
  * If plugin stores some data, they should be in `_pluginData` property
  * If plugin has user options, they should be in `_pluginOptions` property
  * For `_pluginData` and `_pluginOptions` properties, should be created `_getData` and `getOption` methods

Example with basic plugin structure:
```js
'use strict';

function TeabotExamplePlugin() {
  if (!(this instanceof TeabotExamplePlugin)) {
    return new TeabotExamplePlugin();
  }

  this._pluginType = 'analytics';
}

TeabotExamplePlugin.prototype._getType = function () {
  return this._pluginType;
};
```

## Analytics plugins

Analytics plugins must also meet the following requirements:
  * Plugin must contain `_track` method, that accepts three parameters `(chatId, message, event)`
  * `_track` must be a `Promise` and `Promise` should resolve parsed JSON
  * Plugin must contain `manualMode` and `allowQuery` options

Example with analytics plugin structure:
```js
'use strict';

function TeabotExamplePlugin(token, opts) {
  if (!(this instanceof TeabotExamplePlugin)) {
    return new TeabotExamplePlugin(token, opts);
  }

  if (!token) {
    throw new Error('Analytics token not provided!');
  }

  opts || (opts = {});

  this._pluginType = 'analytics';
  this._pluginData = {
    token: token
  };
  this._pluginOptions = {
    manualMode: opts.manualMode || false,
    allowQuery: opts.allowQuery || false
  };
}

TeabotExamplePlugin.prototype._getType = function () {
  return this._pluginType;
};

TeabotExamplePlugin.prototype._getData = function (name) {
  return this._pluginData[name] || false;
};

TeabotExamplePlugin.prototype._getOption = function (name) {
  return this._pluginOptions[name] || false;
};

TeabotExamplePlugin.prototype._track = function (uid, data, event) {
  return request({ token: this._getData('token'), uid: uid, name: event }, JSON.stringify(data)).then(JSON.parse);
};
```

## DB plugins

DB plugins must also meet the following requirements:
  * Plugin must contain `_get` method, that accepts one parameters `(key)`
  * Plugin must contain `_put` method, that accepts two parameters `(key, data)`
  * `_get` and `_put` must be a `Promise` and `Promise` should resolve parsed JSON (only for `_get`)

Example with DB plugin structure:
```js
'use strict';

function TeabotExamplePlugin(client, set) {
  if (!(this instanceof TeabotExamplePlugin)) {
    return new TeabotExamplePlugin(client, set);
  }

  this._pluginType = 'db';
  this._pluginData = {
    client: client,
    SET: set || 'app:teabot'
  };
}

TeabotExamplePlugin.prototype._getType = function () {
  return this._pluginType;
};

TeabotExamplePlugin.prototype._getData = function (name) {
  return this._pluginData[name] || false;
};

TeabotExamplePlugin.prototype._get = function (key) {
  return new Promise(function (resolve, reject) {
    this._getData('client').get(this._getData('SET') + ':' + key, function (err, record) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(record));
      }
    });
  }.bind(this));
};

TeabotExamplePlugin.prototype._put = function (key, data) {
  return new Promise(function (resolve, reject) {
    this._getData('client').set(this._getData('SET') + ':' + key, JSON.stringify(data), function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  }.bind(this));
};
```

## Available plugins:
* DB:
  * Redis - [teabot-redis](https://github.com/strikeentco/teabot-redis)
  * Aerospike - [teabot-aerospike](https://github.com/strikeentco/teabot-aerospike)
* Analytics:
  * Botan - [teabot-botan](https://github.com/strikeentco/teabot-botan)
