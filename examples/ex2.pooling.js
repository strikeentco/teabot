var TeaBot = require('../main');

var Bot = new TeaBot(token, name);

Bot
  .defineCommand('/help', function(dialog) {
    dialog.sendMessage('This is /help command');
  })
  .defineCommand(function(dialog) {
    dialog.sendMessage('Send me /help for more information.');
  });

Bot.startPooling();
