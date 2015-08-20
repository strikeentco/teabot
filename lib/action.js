'use strict';

function Action(action, level) {
  if (!action) {
    throw new Error('Required action name!');
  }

  this.name = action;
  this.subAction = false;
  this.level = level || 1;
}

Action.prototype.getNames = function(data) {
  var data = data || [];
  data.push(this.name);
  if (this.subAction) {
    this.subAction.getNames(data);
  }

  return data;
};

Action.prototype.count = function() {
  return (this.subAction) ? this.subAction.count() : this.level;
};

Action.prototype.getLevel = function(level) {
  return (this.level === level) ? this : ((this.subAction) ? this.subAction.getLevel(level) : undefined);
};

Action.prototype.setSubAction = function(action) {
  if (!action) {
    throw new Error('Required action name!');
  }

  this.subAction = new Action(action, this.level + 1);
};

module.exports = Action;
