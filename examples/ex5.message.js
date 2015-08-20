var TeaBot = require('../main');

var Bot = new TeaBot(token, name);

Bot
  .defineCommand(function(dialog) {
    var message = dialog.message;
    if (message.isCommand()) {
      if (message.getArgument() == '') {
        dialog.sendMessage('It\'s just a command.');
      } else {
        dialog.sendMessage('It\'s command with argument.');
      }
    } else {
      dialog.sendMessage('It\'s a ' + message.getType());
    }
  });

Bot.startPooling(); // for webhook see webhook.js example
