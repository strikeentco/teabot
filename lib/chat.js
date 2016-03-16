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

  Chat.prototype._api = new Api(ctx.token);
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

Chat.prototype.hideKeyboard = function (selective) {
  this._api.hideKeyboard(selective);
  return this;
};

Chat.prototype.setKeyboard = function (keyboard, resize, once, selective) {
  this._api.setKeyboard(keyboard, resize, once, selective);
  return this;
};

Chat.prototype.getUpdates = function (offset, limit, timeout) {
  return this._api.getUpdates(offset, limit, timeout).catch(this.error);
};

Chat.prototype.setWebhook = function (url, cert) {
  return this._api.setWebhook(url, cert).catch(this.error);
};

Chat.prototype.getMe = function () {
  return this._api.getMe().catch(this.error);
};

Chat.prototype.sendMessage = function (text, options) {
  return this._api.sendMessage(this.chatId, text, options).catch(this.error);
};

Chat.prototype.forwardMessage = function (fromChatId, messageId, disableNotification) {
  return this._api.forwardMessage(this.chatId, fromChatId, messageId, disableNotification).catch(this.error);
};

Chat.prototype.sendPhoto = function (data, options) {
  return this._api.sendPhoto(this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendPhotoFromUrl = function (data, options) {
  return this._api.sendPhotoFromUrl(this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendAudio = function (data, options) {
  return this._api.sendAudio(this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendAudioFromUrl = function (data, options) {
  return this._api.sendAudioFromUrl(this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendDocument = function (data, options) {
  return this._api.sendDocument(this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendDocumentFromUrl = function (data, options) {
  return this._api.sendDocumentFromUrl(this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendSticker = function (data, options) {
  return this._api.sendSticker(this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendStickerFromUrl = function (data, options) {
  return this._api.sendStickerFromUrl(this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendVideo = function (data, options) {
  return this._api.sendVideo(this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendVideoFromUrl = function (data, options) {
  return this._api.sendVideoFromUrl(this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendVoice = function (data, options) {
  return this._api.sendVoice(this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendVoiceFromUrl = function (data, options) {
  return this._api.sendVoiceFromUrl(this.chatId, data, options).catch(this.error);
};

Chat.prototype.sendLocation = function (lat, lon, options) {
  return this._api.sendLocation(this.chatId, lat, lon, options).catch(this.error);
};

Chat.prototype.sendChatAction = function (action) {
  return this._api.sendChatAction(this.chatId, action).catch(this.error);
};

Chat.prototype.getUserProfilePhotos = function (offset, limit) {
  return this._api.getUserProfilePhotos(this.userId, offset, limit).catch(this.error);
};

Chat.prototype.getFile = function (fileId) {
  return this._api.getFile(fileId).catch(this.error);
};

Chat.prototype.downloadFile = function (fileId, path) {
  return this._api.downloadFile(fileId, path).catch(this.error);
};

module.exports = Chat;
