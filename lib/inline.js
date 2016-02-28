'use strict';

var Api = require('tg-yarl');
var crypto = require('crypto');

function md5(object) {
  return crypto.createHash('md5').update(JSON.stringify(object)).digest('hex');
}

function Inline(userId, ctx) {
  this.userId = userId;
  this.results = [];
  this.url = ctx.url;

  Inline.prototype.error = ctx.error.bind(ctx);
}

Inline.prototype._processing = function (data, config) {
  var query = data.query;
  this.query = data;

  if (config._getQuery(query)) {
    config._getQuery(query)(this, this.query);
    config._track(this.userId, this.query, 'Inline query: ' + query, true);
  } else if (config._getQuery('_default_')) {
    config._getQuery('_default_')(this, this.query);
    config._track(this.userId, this.query, 'Inline query: ' + query, true);
  }
};

Inline.prototype._addToResults = function (object, type) {
  object.type = type;

  if (!object.id) {
    object.id = md5(object);
  }

  this.results.push(object);
  return this;
};

Inline.prototype.addArticle = function (object) {
  if (!object || !object.title || !object.message_text) {
    throw new Error('Article object must contain title and message_text!');
  }

  return this._addToResults(object, 'article');
};

Inline.prototype.addArticles = function (array) {
  var l = array.length;

  for (var i = 0; i < l; i++) {
    this.addArticle(array[i]);
  }

  return this;
};

Inline.prototype.addPhoto = function (object) {
  if (!object || !object.photo_url || !object.thumb_url) {
    throw new Error('Photo object must contain photo_url and thumb_url!');
  }

  return this._addToResults(object, 'photo');
};

Inline.prototype.addPhotos = function (array) {
  var l = array.length;

  for (var i = 0; i < l; i++) {
    this.addPhoto(array[i]);
  }

  return this;
};

Inline.prototype.addGif = function (object) {
  if (!object || !object.gif_url || !object.thumb_url) {
    throw new Error('Gif object must contain gif_url and thumb_url!');
  }

  return this._addToResults(object, 'gif');
};

Inline.prototype.addGifs = function (array) {
  var l = array.length;

  for (var i = 0; i < l; i++) {
    this.addGif(array[i]);
  }

  return this;
};

Inline.prototype.addMpeg4Gif = function (object) {
  if (!object || !object.mpeg4_url || !object.thumb_url) {
    throw new Error('Mpeg4Gif object must contain mpeg4_url and thumb_url!');
  }

  return this._addToResults(object, 'mpeg4_gif');
};

Inline.prototype.addMpeg4Gifs = function (array) {
  var l = array.length;

  for (var i = 0; i < l; i++) {
    this.addMpeg4Gif(array[i]);
  }

  return this;
};

Inline.prototype.addVideo = function (object) {
  if (!object || !object.video_url || !object.thumb_url || !object.mime_type || !object.title || !object.message_text) {
    throw new Error('Video object must contain video_url, thumb_url, mime_type, title and message_text!');
  }

  return this._addToResults(object, 'video');
};

Inline.prototype.addVideos = function (array) {
  var l = array.length;

  for (var i = 0; i < l; i++) {
    this.addVideo(array[i]);
  }

  return this;
};

Inline.prototype.answerInlineQuery = function (results, options) {
  return Api.prototype.answerInlineQuery.call(this, this.query.id, results, options).catch(this.error);
};

Inline.prototype.answer = function (results, options) {
  var res = this.results;

  if (Array.isArray(results)) {
    res = res.concat(results);
  } else {
    options = results;
  }

  this.results = [];
  return this.answerInlineQuery.call(this, res, options);
};

module.exports = Inline;
