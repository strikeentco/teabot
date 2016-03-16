'use strict';

var fs = require('fs');
var Api = require('tg-yarl');
var matcher = require('matcher');
var Action = require('./lib/action');
var Chat = require('./lib/chat');
var Inline = require('./lib/inline');
var VERSION = require('./package.json').version;

function match(arr, str) {
  return arr.filter(function (v) {
    return matcher.isMatch(str, v);
  })[0];
}

function Teabot(token, name) {
  if (!(this instanceof Teabot)) {
    return new Teabot(token, name);
  }

  if (!token) {
    throw new Error('Telegram Bot token not provided!');
  }

  if (!name) {
    throw new Error('Telegram Bot name not provided!');
  }

  Api.call(this, token);

  this.version = VERSION;
  name = name.trim();
  this.name = (name[0] === '@') ? name : '@' + name;

  this.dialogs = {};
  this.commands = {};
  this.queries = {};
  this.actions = {};
  this.doOnce = {};
  this.plugins = {
    db: false,
    analytics: false,
    logging: false
  };

  Teabot.prototype.error = this.error.bind(this);
  Teabot.prototype._polling = this._polling.bind(this);
}

Teabot.prototype = Object.create(Api.prototype);

Teabot.prototype._getUpdate = function (dialog) {
  if (this.getPlugin('db')) {
    return this.getPlugin('db')._get(dialog.chatId + '_' + dialog.userId).then(function (data) {
      if (data) {
        dialog.userData = data.userData;
        dialog.tempData = data.tempData;
        dialog._toAction(data.action);
      }

      return dialog;
    });
  } else {
    return Promise.resolve(dialog);
  }
};

Teabot.prototype._putUpdate = function (dialog) {
  if (this.getPlugin('db')) {
    var data = {
      userData: dialog.userData,
      tempData: dialog.tempData,
      action: (dialog.action) ? dialog.action.getNames() : [],
    };
    this.getPlugin('db')._put(dialog.chatId + '_' + dialog.userId, data).catch(this.error);
  }
};

Teabot.prototype._preprocess = function (dialog, message) {
  !this.preprocess || this.preprocess(dialog, message);
};

Teabot.prototype._doOnce = function (type, dialog) {
  if (this.doOnce[type] && typeof this.doOnce[type] === 'function') {
    this.doOnce[type](dialog, dialog.message);
    this._track(dialog.userId, dialog.message, 'New  ' + type);

    return true;
  }

  return false;
};

Teabot.prototype._reinit = function () {
  var actions = this._getActions();

  actions.forEach(function (n) {
    var action = this._getAction(n);
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
  }.bind(this));

  Chat.prototype.error = this.error.bind(this);
  Chat.prototype._putUpdate = this._putUpdate.bind(this);
  Inline.prototype.error = this.error.bind(this);

  this._bool = true;
};

Teabot.prototype._polling = function () {
  this.getUpdates(this.offset, this.limit, this.timeout).then(function (update) {
    var result = update.body.result;
    var l = result.length;
    for (var i = 0; i < l; i++) {
      this.receive(result[i]);
      if (i === (l - 1)) {
        this.offset = result[i].update_id + 1;
        return true;
      }
    }
  }.bind(this)).then(this._polling);
};

Teabot.prototype._getCommand = function (name) {
  if (!name) {
    return false;
  } else {
    var command = (name.indexOf('@') !== -1 || name === '_default_') ? name : name + this.name;
    return this.commands[match(this._getCommands(), command)] || false;
  }
};

Teabot.prototype._getCommands = function () {
  return Object.keys(this.commands);
};

Teabot.prototype._getQuery = function (name) {
  return this.queries[match(this._getQueries(), name)] || false;
};

Teabot.prototype._getQueries = function () {
  return Object.keys(this.queries);
};

Teabot.prototype._getAction = function (name) {
  return this.actions[match(this._getActions(), name)] || false;
};

Teabot.prototype._getActions = function () {
  return Object.keys(this.actions);
};

Teabot.prototype.receive = function (data) {
  this._bool || this._reinit();

  if (data.inline_query) {
    data = data.inline_query;

    if (!data.from) {
      throw new Error('Something wrong with inline query object.');
    }

    var userId = data.from.id;

    this.dialogs.inline || (this.dialogs.inline = {});
    this.dialogs.inline[userId] || (this.dialogs.inline[userId] = new Inline(userId, this));

    this.dialogs.inline[userId]._processing(data, this);

    return this.dialogs.inline[userId];
  } else if (data.message) {
    data = data.message;

    if (!data.chat || !data.from) {
      throw new Error('Something wrong with message object.');
    }

    var chatId = data.chat.id;
    var userId = data.from.id;

    this.dialogs[chatId] || (this.dialogs[chatId] = {});
    this.dialogs[chatId][userId] || (this.dialogs[chatId][userId] = new Chat(chatId, userId, this));

    this.dialogs[chatId][userId]._processing(data, this);

    return this.dialogs[chatId][userId];
  }
};

Teabot.prototype.startPolling = function (options) {
  options || (options = {});
  this.offset = options.offset || 0;
  this.timeout = options.timeout || 60;
  this.limit = options.limit || 100;
  this.setWebhook('').then(this._polling);
};

Teabot.prototype.defineCommand = function (data, callback) {
  if (data && typeof data === 'function') {
    this.commands._default_ = data;
  } else if (data && Array.isArray(data)) {
    for (var i = 0; i < data.length; i++) {
      this.commands[data[i] + this.name] || (this.commands[data[i] + this.name] = callback);
    }
  } else if (data && typeof data === 'string') {
    this.commands[data + this.name] || (this.commands[data + this.name] = callback);
  } else {
    throw new TypeError('Command must be a string or an array.');
  }

  return this;
};

Teabot.prototype.inlineQuery = function (data, callback) {
  if (data && typeof data === 'function') {
    this.queries._default_ = data;
  } else if (data && Array.isArray(data)) {
    for (var i = 0; i < data.length; i++) {
      this.queries[data[i]] || (this.queries[data[i]] = callback);
    }
  } else if (data && typeof data === 'string') {
    this.queries[data] || (this.queries[data] = callback);
  } else {
    throw new TypeError('Query must be a string or an array.');
  }

  return this;
};

Teabot.prototype.defineAction = function (data, callback, subAction) {
  if (!data || (!Array.isArray(data) && !typeof data === 'string')) {
    throw new TypeError('Action must be a string or an array.');
  } else {
    var _def = function (data) {
      if (!this.actions[data]) {
        this.actions[data] = new ConfigAction(data, 1, callback, subAction);
        var cb = this.actions[data]._func;
        this.actions[data]._func = function () {
          if (arguments && arguments.length === 3) {
            var dialog = arguments[1];
            var message = arguments[2];

            this._track(dialog.userId, message, arguments[0]);
            cb.call(null, dialog, message);
          } else if (arguments) {
            cb.apply(null, arguments);
          }
        }.bind(this);
      }
    }.bind(this);

    if (typeof data === 'string') {
      _def(data);
    } else {
      for (var i = 0; i < data.length; i++) {
        _def(data[i]);
      }
    }
  }

  return this;
};

Teabot.prototype.use = function (type, plugin) {
  if (this.plugins[type] !== undefined) {
    if (type !== plugin._getType()) {
      throw new Error('Plugin has wrong type. ' + type + ' expected.');
    } else {
      this.plugins[type] = plugin;
    }
  } else {
    throw new Error('Currently supports only db, analytics and logging plugins.');
  }

  return this;
};

Teabot.prototype.getPlugin = function (type) {
  return this.plugins[type] || false;
};

Teabot.prototype._track = function (chatId, message, event, query) {
  if (this.getPlugin('analytics')) {
    if (!this.getPlugin('analytics')._getOption('manualMode')) {
      if (!query || this.getPlugin('analytics')._getOption('allowQuery')) {
        return this.track(chatId, message, event);
      }
    }
  }
};

Teabot.prototype.track = function (chatId, message, event) {
  if (this.getPlugin('analytics')) {
    var data = JSON.parse(JSON.stringify(message));
    if (data._origin_) {
      delete data._origin_;
    }

    return this.getPlugin('analytics')._track(chatId, data, event);
  } else {
    throw new Error('Unable to find an activated analytics plugin. For example you can use teabot-botan.');
  }
};

Teabot.prototype.beforeMessage = function (callback) {
  this.preprocess = callback;
  return this;
};

Teabot.prototype.error = function (e) {
  !this._error || this._error(e);
};

Teabot.prototype.onError = function (callback) {
  this._error = callback;
  return this;
};

Teabot.prototype.on = function (type, callback) {
  var event = [
    'text', 'audio', 'document', 'photo', 'sticker',
    'video', 'contact', 'location', 'voice', 'other'
  ];

  if (type && Array.isArray(type)) {
    type.forEach(function (n) {
      var message = n.toLowerCase();
      message = (message === 'message') ? 'text' : message;
      if (event.indexOf(message) !== -1) {
        this.doOnce[message] = callback;
      }
    }.bind(this));
  } else if (type && typeof type === 'string') {
    var message = type.toLowerCase();
    if (event.indexOf(message) !== -1) {
      this.doOnce[message] = callback;
    }
  } else {
    throw new TypeError('Type must be a string or an array.');
  }

  return this;
};

Teabot.prototype.onMessage = function (callback) {
  return this.on('text', callback);
};

Teabot.prototype.onPhoto = function (callback) {
  return this.on('photo', callback);
};

Teabot.prototype.onAudio = function (callback) {
  return this.on('audio', callback);
};

Teabot.prototype.onDocument = function (callback) {
  return this.on('document', callback);
};

Teabot.prototype.onSticker = function (callback) {
  return this.on('sticker', callback);
};

Teabot.prototype.onVideo = function (callback) {
  return this.on('video', callback);
};

Teabot.prototype.onLocation = function (callback) {
  return this.on('location', callback);
};

Teabot.prototype.onContact = function (callback) {
  return this.on('contact', callback);
};

Teabot.prototype.onVoice = function (callback) {
  return this.on('voice', callback);
};

Teabot.prototype.onOther = function (callback) {
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

ConfigAction.prototype.defineSubAction = function (action, callback, subAction) {
  if (!action) {
    throw new Error('Required action name!');
  } else if (typeof action === 'string') {
    this.subAction = new ConfigAction(action, this.level + 1, callback, subAction);
    var cb = this.subAction._func;
    this.subAction._func = function () {
      if (arguments && arguments.length === 3) {
        var dialog = arguments[1];
        var message = arguments[2];

        this._track(dialog.userId, message, arguments[0]);
        cb.call(null, dialog);
      } else if (arguments) {
        cb.apply(null, arguments);
      }
    };
  } else {
    throw new TypeError('SubAction must be a string.');
  }

  return this;
};

module.exports = Teabot;
