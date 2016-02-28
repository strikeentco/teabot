'use strict';

var Api = require('tg-yarl');
var Action = require('./action');
var Message = require('./message');

function Chat(chatId, userId, ctx) {
  this.chatId = chatId;
  this.userId = userId;
  this.userData = {};
  this.tempData = {};
  this.action = false;
  this.url = ctx.url;

  Chat.prototype._putUpdate = ctx._putUpdate.bind(ctx);
  Chat.prototype.error = ctx.error.bind(ctx);
}

Chat.prototype._processing = function (data, config) {
  config._getUpdate(this).then(function () {
    this._actions = config.actions;
    this.message = new Message(data);
    config._preprocess(this, this.message);
    var command = this.message.getCommand();

    if (!this.inAction()) {
      if (!config._doOnce(this.message.getType(), this)) {
        if (this.message.isCommand() && config._getCommand(command)) {
          config._getCommand(command)(this, this.message);
          config._track(this.userId, this.message, 'Command: ' + command);
        } else if (config._getCommand('_default_')) {
          config._getCommand('_default_')(this, this.message);
        }
      }
    } else if (this.message.isCommand() && command.indexOf('/cancel') !== -1 && config._getCommand(command)) {
      config._getCommand(command)(this, this.message);
    } else {
      var action = config._getAction(this.action.name);
      if (action) {
        var count = this.action.count();
        if (count > 1) {
          var subAction = action.getLevel(count);
          subAction._func.call(config, 'Subaction: ' + subAction.name, this, this.message);
        } else {
          action._func('Action: ' + action.name, this, this.message);
        }
      }
    }
  }.bind(this)).catch(this.error);
};

Chat.prototype._toAction = function (data) {
  this.startAction();

  var length = data.length;
  for (var i = 0; i < length; i++) {
    this.startAction(data[i]);
  }
};

Chat.prototype.setUserData = function (property, data) {
  if (property && data) {
    this.userData[property] = data;
    this._putUpdate(this);
    return this.userData[property];
  } else {
    return false;
  }
};

Chat.prototype.getUserData = function (property) {
  if (property && this.userData[property]) {
    return this.userData[property];
  } else {
    return false;
  }
};

Chat.prototype.delUserData = function (property) {
  if (property && this.userData[property]) {
    delete this.userData[property];
    this._putUpdate(this);
  }
};

Chat.prototype.clearUserData = function () {
  this.userData = {};
  this._putUpdate(this);
};

Chat.prototype.setTempData = function (property, data) {
  if (property && data) {
    this.tempData[property] = data;
    this._putUpdate(this);
    return this.tempData[property];
  } else {
    return false;
  }
};

Chat.prototype.getTempData = function (property) {
  if (property && this.tempData[property]) {
    return this.tempData[property];
  } else {
    return false;
  }
};

Chat.prototype.delTempData = function (property) {
  if (property && this.tempData[property]) {
    delete this.tempData[property];
    this._putUpdate(this);
  }
};

Chat.prototype.clearTempData = function () {
  this.tempData = {};
  this._putUpdate(this);
};

Chat.prototype.inAction = function () {
  return (!this.action) ? false : this.action.getLevel(this.action.count());
};

Chat.prototype.getAction = function () {
  return (!this.action) ? false : this.inAction().name;
};

Chat.prototype.startAction = function (data, _perform) {
  if (!data) {
    this.action = false;
  } else if (this.inAction()) {
    var level = this.action.count();
    if (this.action.getLevel(level).name != data) {
      this.action.getLevel(level).setSubAction(data);
      if (_perform) {
        var action = this._actions[this.action.name] || false;
        if (action) {
          var subAction = action.getLevel(level + 1);
          subAction._func('Subaction: ' + subAction.name, this, this.message);
        }
      }
    }
  } else {
    this.action = new Action(data);
    if (_perform) {
      var action = this._actions[this.action.name] || false;
      if (action) {
        action._func('Action: ' + action.name, this, this.message);
      }
    }
  }

  this._putUpdate(this);
  return this;
};

Chat.prototype.performAction = function (data) {
  return this.startAction(data, true);
};

Chat.prototype.endAction = function (saveTemp) {
  if (!saveTemp) {
    this.clearTempData();
  }

  this.action = false;
  this._putUpdate(this);
  return this;
};

Chat.prototype.setKeyboard = function (keyboard, resize, once, selective) {
  return Api.prototype.setKeyboard.call(this, keyboard, resize, once, selective);
};

Chat.prototype.getUpdates = function (offset, limit, timeout) {
  return Api.prototype.getUpdates.call(this, offset, limit, timeout).catch(this.error);
};

Chat.prototype.setWebhook = function (url, cert) {
  return Api.prototype.setWebhook.call(this, url, cert).catch(this.error);
};

Chat.prototype.getMe = function () {
  return Api.prototype.getMe.call(this).catch(this.error);
};

Chat.prototype.sendMessage = function (text, options) {
  return Api.prototype.sendMessage.call(this, this.chatId, text, options).catch(this.error);
};

Chat.prototype.forwardMessage = function (fromChatId, messageId, disableNotification) {
  return Api.prototype.forwardMessage.call(this, this.chatId, fromChatId, messageId, disableNotification).catch(this.error);
};

Chat.prototype.sendPhoto = function (data, options) {
  return Api.prototype.sendPhoto.call(this, this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendAudio = function (data, options) {
  return Api.prototype.sendAudio.call(this, this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendDocument = function (data, options) {
  return Api.prototype.sendDocument.call(this, this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendSticker = function (data, options) {
  return Api.prototype.sendSticker.call(this, this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendVideo = function (data, options) {
  return Api.prototype.sendVideo.call(this, this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendVoice = function (data, options) {
  return Api.prototype.sendVoice.call(this, this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendLocation = function (lat, lon, options) {
  return Api.prototype.sendLocation.call(this, this.chatId, lat, lon, options).catch(this.error);
};

Chat.prototype.sendChatAction = function (action) {
  return Api.prototype.sendChatAction.call(this, this.chatId, action).catch(this.error);
};

Chat.prototype.getUserProfilePhotos = function (offset, limit) {
  return Api.prototype.getUserProfilePhotos.call(this, this.userId, offset, limit).catch(this.error);
};

Chat.prototype.getFile = function (fileId) {
  return Api.prototype.getFile.call(this, fileId).catch(this.error);
};

Chat.prototype.downloadFile = function (fileId, path) {
  return Api.prototype.downloadFile.call(this, fileId, path).catch(this.error);
};

module.exports = Chat;
