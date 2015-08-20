'use strict';
var Api = require('teabot-telegram-api');
var Action = require('./action');
var Message = require('./message');

function Chat(chatId, userId) {
  this.chatId = chatId;
  this.userId = userId;
  this.userData = {};
  this.tempData = {};
  this.action = false;
}

Chat.prototype._processing = function(data, config) {
  var _this = this;

  config._getUpdate(_this, function(err) {
    _this.url = config.url;
    _this.message = new Message(data);
    config._preprocess(_this.message);

    var command = _this.message.command || '';

    if (!config._doOnce(_this.message.type, _this)) {
      if (!_this.inAction()) {
        if (_this.message.isCommand() && config.getCommand(command)) {
          config.getCommand(command)(_this);
          if (config.analytics && !config.options.analytics.manualMode) {
            config.track(_this.userId, _this.message, 'Command: ' + command);
          }
        } else if (config.getCommand('_default_')) {
          config.getCommand('_default_')(_this);
        }
      } else if (_this.message.isCommand() && command.indexOf('/cancel') !== -1 && config.getCommand(command)) {
        config.getCommand(command)(_this);
      } else {
        var action = config.getAction(_this.action.name);
        if (action) {
          var count = _this.action.count();
          if (count > 1) {
            var subAction = action.getLevel(count);
            subAction._func(_this);
            if (config.analytics && !config.options.analytics.manualMode) {
              config.track(_this.userId, _this.message, 'Subaction: ' + subAction.name);
            }
          } else {
            action._func(_this);
            if (config.analytics && !config.options.analytics.manualMode) {
              config.track(_this.userId, _this.message, 'Action: ' + action.name);
            }
          }
        }
      }
    }

    config._putUpdate(_this);
  });
};

Chat.prototype._toAction = function(data) {
  this.startAction();

  var length = data.length;
  for (var i = 0; i < length; i++) {
    this.startAction(data[i]);
  }

  //return this.action;
};

Chat.prototype.setUserData = function(property, data) {
  if (property && data) {
    this.userData[property] = data;
    return this.userData[property];
  } else {
    return false;
  }
};

Chat.prototype.getUserData = function(property) {
  if (property && this.userData[property]) {
    return this.userData[property];
  } else {
    return false;
  }
};

Chat.prototype.delUserData = function(property) {
  if (property && this.userData[property]) {
    delete this.userData[property];
  }
};

Chat.prototype.clearUserData = function() {
  this.userData = {};
};

Chat.prototype.setTempData = function(property, data) {
  if (property && data) {
    this.tempData[property] = data;
    return this.tempData[property];
  } else {
    return false;
  }
};

Chat.prototype.getTempData = function(property) {
  if (property && this.tempData[property]) {
    return this.tempData[property];
  } else {
    return false;
  }
};

Chat.prototype.delTempData = function(property) {
  if (property && this.tempData[property]) {
    delete this.tempData[property];
  }
};

Chat.prototype.clearTempData = function() {
  this.tempData = {};
};

Chat.prototype.inAction = function() {
  return (!this.action) ? false : this.action.getLevel(this.action.count());
};

Chat.prototype.startAction = function(data) {
  if (!data) {
    this.action = false;
  } else if (this.inAction()) {
    var level = this.action.count();
    if (this.action.getLevel(level).name != data) {
      this.action.getLevel(level).setSubAction(data);
    }
  } else {
    this.action = new Action(data);
  }

  return this;
};

Chat.prototype.endAction = function() {
  this.clearTempData();
  this.action = false;
  return this;
};

Chat.prototype.setKeyboard = function(keyboard, resize, once, selective) {
  Api.prototype.setKeyboard.call(this, keyboard, resize, once, selective);
  return this;
};

Chat.prototype.getUpdates = function(offset, limit, timeout) {
  return Api.prototype.getUpdates.call(this, offset, limit, timeout);
};

Chat.prototype.setWebhook = function(url) {
  return Api.prototype.setWebhook.call(this, url);
};

Chat.prototype.getMe = function() {
  return Api.prototype.getMe.call(this);
};

Chat.prototype.sendMessage = function(text, options) {
  return Api.prototype.sendMessage.call(this, this.chatId, text, options);
};

Chat.prototype.forwardMessage = function(fromChatId, messageId) {
  return Api.prototype.forwardMessage.call(this, this.chatId, fromChatId, messageId);
};

Chat.prototype.sendPhoto = function(data, options) {
  return Api.prototype.sendPhoto.call(this, this.chatId, data, options);
};

Chat.prototype.sendAudio = function(data, options) {
  return Api.prototype.sendAudio.call(this, this.chatId, data, options);
};

Chat.prototype.sendDocument = function(data, options) {
  return Api.prototype.sendDocument.call(this, this.chatId, data, options);
};

Chat.prototype.sendSticker = function(data, options) {
  return Api.prototype.sendSticker.call(this, this.chatId, data, options);
};

Chat.prototype.sendVideo = function(data, options) {
  return Api.prototype.sendVideo.call(this, this.chatId, data, options);
};

Chat.prototype.sendVoice = function(data, options) {
  return Api.prototype.sendVoice.call(this, this.chatId, data, options);
};

Chat.prototype.sendLocation = function(lat, lon, options) {
  return Api.prototype.sendLocation.call(this, this.chatId, lat, lon, options);
};

Chat.prototype.sendChatAction = function(action) {
  return Api.prototype.sendChatAction.call(this, this.chatId, action);
};

Chat.prototype.getUserProfilePhotos = function(offset, limit) {
  return Api.prototype.getUserProfilePhotos.call(this, this.userId, offset, limit);
};

module.exports = Chat;
