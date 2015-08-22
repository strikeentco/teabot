'use strict';
var fs = require('fs');
var Api = require('teabot-telegram-api');
var Action = require('./lib/action');
var Chat = require('./lib/chat');

function Tea(token, name, options) {
  if (!name) {
    throw new Error('Telegram Bot name not provided!');
  }

  name = name.trim();
  this.name = (name[0] == '@') ? name : '@' + name;

  if (!token) {
    throw new Error('Telegram Bot token not provided!');
  }

  this.token = token;
  this.url = 'https://api.telegram.org/bot' + token + '/';

  options || (options = {});
  options.analytics || (options.analytics = {});
  options.analytics.key || (options.analytics.key = false);
  options.analytics.manualMode || (options.analytics.manualMode = false);
  options.db || (options.db = {});
  options.db.type || (options.db.type = false);
  options.db.client || (options.db.client = false);
  options.db.key || (options.db.key = {});
  this.options = options;

  this.db = (!options.db.type || !options.db.client) ? false : this._db();

  this.analytics = (!options.analytics.key) ? false : this._analytics();

  this.dialogs = {};
  this.commands = {};
  this.actions = {};
  this.doOnce = {};
}

Tea.prototype.__proto__ = Api.prototype;

Tea.prototype._db = function() {
  var db = this.options.db;
  var path = __dirname + '/lib/db/' + db.type.toLowerCase();
  if (fs.existsSync(path + '.js')) {
    var Driver = require(path);
    return new Driver(db.client, db.key);
  } else {
    throw new Error('Wrong DB type!');
  }
};

Tea.prototype._analytics = function() {
  var Analytics = require('./lib/analytics/botan');
  return new Analytics(this.options.analytics.key);
};

Tea.prototype._getUpdate = function(dialog, callback) {
  if (this.db) {
    this.db.get(dialog.chatId + '_' + dialog.userId).then(function(data) {
      if (data) {
        dialog.userData = data.userData;
        dialog.tempData = data.tempData;
        dialog._toAction(data.action);
      }

      callback(null);
    }).catch(function(e) {
      console.error(e.stack);
    });
  } else {
    try {
      callback(null);
    } catch (e) {
      console.error(e.stack);
    }
  }
};

Tea.prototype._putUpdate = function(dialog) {
  if (this.db) {
    var data = {
      userData: dialog.userData,
      tempData: dialog.tempData,
      action: (dialog.action) ? dialog.action.getNames() : [],
    };
    this.db.put(dialog.chatId + '_' + dialog.userId, data).catch(function(e) {
      console.error(e.stack);
    });
  }
};

Tea.prototype._preprocess = function(message) {
  if (this.preprocess) {
    this.preprocess(message);
  }
};

Tea.prototype._doOnce = function(type, dialog) {
  if (this.doOnce[type] && typeof this.doOnce[type] === 'function') {
    this.doOnce[type](dialog, dialog.message[type]);
    if (this.analytics && !this.options.analytics.manualMode) {
      this.track(dialog.userId, dialog.message, 'New  ' + type);
    }

    return true;
  }

  return false;
};

Tea.prototype._reinit = function() {
  var _this = this;
  var actions = _this.getActions();

  actions.forEach(function(n) {
    var action = _this.getAction(n);
    if (action) {
      action._def && action._def(action);
      var count = action.count();
      if (count > 1) {
        for (var i = 1; i < count; i++) {
          var subAction = action.getLevel(i + 1);
          subAction._def && subAction._def(subAction);
          count = action.count();
        }
      }
    }
  });

  this._bool = true;
};

Tea.prototype._pooling = function() {
  var _this = this;

  _this.getUpdates(_this.offset, _this.limit, _this.timeout).then(function(update) {
    var result = update.result;
    var l = result.length;
    for (var i = 0; i < l; i++) {
      _this.receive(result[i].message);
      if (i === (l - 1)) {
        _this.offset = result[i].update_id + 1;
        return true;
      }
    }
  }).then(function() {
    setTimeout(_this._pooling.bind(_this), _this.interval);
  });
};

Tea.prototype.receive = Tea.prototype.start = function(data) {
  this._bool || this._reinit();

  if (!data || !data.chat || !data.from) {
    throw new Error('Something wrong with message object.');
  }

  var chatId = data.chat.id;
  var userId = data.from.id;

  this.dialogs[chatId] || (this.dialogs[chatId] = {});
  this.dialogs[chatId][userId] || (this.dialogs[chatId][userId] = new Chat(chatId, userId));

  this.dialogs[chatId][userId]._processing(data, this);

  return this.dialogs[chatId][userId];
};

Tea.prototype.startPooling = function(options) {
  options || (options = {});
  this.offset = options.offset || 0;
  this.timeout = options.timeout || 0;
  this.limit = options.limit || 0;
  this.interval = (options.interval !== undefined && options.interval >= 0) ? options.interval : 2000;
  var _this = this;
  this.setWebhook('').then(function() {
    _this._pooling();
  });
};

Tea.prototype.getCommand = function(name) {
  if (!name) {
    return false;
  } else {
    var command = (name.indexOf('@') !== -1 || name == '_default_') ? name : name + this.name;
    return this.commands[command] || false;
  }
};

Tea.prototype.getCommands = function() {
  return Object.keys(this.commands);
};

Tea.prototype.defineCommand = function(data, callback) {
  if (data && typeof data === 'function') {
    this.commands['_default_'] = data;
  } else if (data && Array.isArray(data)) {
    for (var i = 0; i < data.length; i++) {
      this.commands[data[i] + this.name] || (this.commands[data[i] + this.name] = callback);
    }
  } else if (data && typeof data === 'string') {
    this.commands[data + this.name] || (this.commands[data + this.name] = callback);
  } else {
    throw new Error('Command must be string or array.');
  }

  return this;
};

Tea.prototype.getAction = function(name) {
  if (!name) {
    return false;
  } else {
    return this.actions[name] || false;
  }
};

Tea.prototype.getActions = function() {
  return Object.keys(this.actions);
};

Tea.prototype.defineAction = function(data, callback, subAction) {
  if (data && Array.isArray(data)) {
    for (var i = 0; i < data.length; i++) {
      if (!this.actions[data[i]]) {
        this.actions[data[i]] = new ConfigAction(data[i], 1, callback, subAction);
        var cb = this.actions[data[i]]._func;
        this.actions[data[i]]._func = function() {
          if (arguments && arguments.length === 2) {
            var dialog = arguments[1];
            if (this.analytics && !this.options.analytics.manualMode) {
              this.track(dialog.userId, dialog.message, arguments[0]);
            }

            cb.call(null, dialog);
          } else if (arguments && arguments.length === 1) {
            cb.call(null, arguments[0]);
          }
        };
      }
    }
  } else if (data && typeof data === 'string') {
    if (!this.actions[data]) {
      this.actions[data] = new ConfigAction(data, 1, callback, subAction);
      var cb = this.actions[data]._func;
      this.actions[data]._func = function() {
        if (arguments && arguments.length === 2) {
          var dialog = arguments[1];
          if (this.analytics && !this.options.analytics.manualMode) {
            this.track(dialog.userId, dialog.message, arguments[0]);
          }

          cb.call(null, dialog);
        } else if (arguments && arguments.length === 1) {
          cb.call(null, arguments[0]);
        }
      };
    }
  } else {
    throw new Error('Action must be string or array.');
  }

  return this;
};

Tea.prototype.track = function(chatId, message, event) {
  if (this.analytics) {
    var data = JSON.parse(JSON.stringify(message));
    if (data._origin_) {
      delete data._origin_;
    }

    return this.analytics.track(chatId, data, event);
  } else {
    throw new Error('Analytics token not provided!');
  }
};

Tea.prototype.beforeMessage = function(callback) {
  this.preprocess = callback;
  return this;
};

Tea.prototype.on = function(type, callback) {
  var event = [
    'text', 'audio', 'document', 'photo', 'sticker', 'video', 'contact', 'location', 'other',
  ];
  var _this = this;
  if (type && Array.isArray(type)) {
    type.forEach(function(n) {
      var message = n.toLowerCase();
      message = (message == 'message') ? 'text' : message;
      if (event.indexOf(message) != -1) {
        _this.doOnce[message] = callback;
      }
    });

    return this;
  } else if (type && typeof type === 'string') {
    var message = type.toLowerCase();
    if (event.indexOf(message) != -1) {
      this.doOnce[message] = callback;
    }

    return this;
  } else {
    throw new Error('Type must be string or array.');
  }
};

Tea.prototype.onMessage = function(callback) {
  return this.on('text', callback);
};

Tea.prototype.onPhoto = function(callback) {
  return this.on('photo', callback);
};

Tea.prototype.onAudio = function(callback) {
  return this.on('audio', callback);
};

Tea.prototype.onDocument = function(callback) {
  return this.on('document', callback);
};

Tea.prototype.onSticker = function(callback) {
  return this.on('sticker', callback);
};

Tea.prototype.onVideo = function(callback) {
  return this.on('video', callback);
};

Tea.prototype.onLocation = function(callback) {
  return this.on('location', callback);
};

Tea.prototype.onContact = function(callback) {
  return this.on('contact', callback);
};

Tea.prototype.onOther = function(callback) {
  return this.on('other', callback);
};

function ConfigAction(action, level, cb, sa) {
  if (!action) {
    throw new Error('Required action name!');
  }

  this.name = action;
  this.subAction = false;
  this.level = level || 1;
  this._func = cb;
  this._def = sa;
}

ConfigAction.prototype.__proto__ = Action.prototype;

ConfigAction.prototype.defineSubAction = function(action, callback, subAction) {
  if (!action) {
    throw new Error('Required action name!');
  } else if (typeof action === 'string') {
    this.subAction = new ConfigAction(action, this.level + 1, callback, subAction);
    var cb = this.subAction._func;
    this.subAction._func = function() {
      if (arguments && arguments.length === 2) {
        var dialog = arguments[1];
        if (this.analytics && !this.options.analytics.manualMode) {
          this.track(dialog.userId, dialog.message, arguments[0]);
        }

        cb.call(null, dialog);
      } else if (arguments && arguments.length === 1) {
        cb.call(null, arguments[0]);
      }
    };
  } else {
    throw new Error('SubAction must be string.');
  }

  return this;
};

module.exports = Tea;
