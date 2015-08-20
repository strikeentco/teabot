var TeaBot = require('../main');

var Bot = new TeaBot(token, name);

Bot
  .defineCommand('/add', function(dialog) {
    dialog.startAction('/add').sendMessage('Send me new command');
  })
  .defineCommand('/cancel', function(dialog) {
    dialog.endAction().sendMessage('Ok, now you can try something else.');
  })
  .defineCommand(function(dialog) {
    dialog.sendMessage('Send me /help for more information.');
  });

Bot
  .defineAction('/add', function(dialog) {
    dialog.setTempData('command', dialog.message.text);
    dialog.startAction('message').sendMessage('Send me message for new command');
  }, function(action) {
    action.defineSubAction('message', function(dialog) {
      var message = dialog.message.text;
      Bot.defineCommand(dialog.getTempData('command'), function(dialog) {
        dialog.sendMessage(message);
      });
      dialog.sendMessage('New command ' + dialog.getTempData('command') + ' was successfully added!');
      dialog.endAction();
    })
  });

Bot.startPooling(); // for webhook see webhook.js example
