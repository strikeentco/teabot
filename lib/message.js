'use strict';

function messageType(m) {
  if (m.text) {
    return 'text';
  } else if (m.audio) {
    return 'audio';
  } else if (m.document) {
    return 'document';
  } else if (m.photo) {
    return 'photo';
  } else if (m.sticker) {
    return 'sticker';
  } else if (m.video) {
    return 'video';
  } else if (m.contact) {
    return 'contact';
  } else if (m.location) {
    return 'location';
  } else if (m.voice) {
    return 'voice';
  } else {
    return 'other';
  }
}

function Message(data) {
  if (!data || !data.chat || !data.from || !data.message_id) {
    throw new Error('Something wrong with message object.');
  }

  this.id = data.message_id;
  this.type = messageType(data);
  if (this.type && this.type == 'text') {
    this.text = data.text.trim();
    this.command = (this.text.length && this.text[0] == '/') ? this.text.split(' ')[0].trim() : 0;
    this.argument = (this.isCommand()) ? this.text.replace(this.command, '').trim() : this.text;
  } else if (this.type) {
    this[this.type] = data[this.type];
  }

  this._origin_ = data;
}

Message.prototype.getType = function() {
  return this.type;
};

Message.prototype.isCommand = function() {
  return (this.command) ? true : false;
};

Message.prototype.getCommand = function() {
  return this.command;
};

Message.prototype.getArgument = function() {
  return this.argument;
};

module.exports = Message;
