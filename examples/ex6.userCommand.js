'use strict';

const TeaBot = require('../main')('YOUR_TELEGRAM_BOT_TOKEN', 'YOUR_TELEGRAM_BOT_NAME');

TeaBot.onError(function (e) {
  console.error('Error:', e, e.stack);
});

TeaBot
  .defineCommand('/add', function (dialog) {
    dialog.startAction('/add').sendMessage('Send me new command');
  })
  .defineCommand('/cancel', function (dialog) {
    dialog.endAction().sendMessage('Ok, now you can try something else.');
  })
  .defineCommand(function (dialog) {
    dialog.sendMessage('Send me /help for more information.');
  });

TeaBot
  .defineAction('/add', function (dialog, message) {
    dialog.setTempData('command', message.getCommand());
    dialog
      .endAction(true)
      .startAction('message')
      .sendMessage('Send me message for new command');
  })
  .defineAction('message', function (dialog, message) {
    TeaBot.defineCommand(dialog.getTempData('command'), function (dialog) {
      dialog.sendMessage(message.getArgument());
    });

    dialog.sendMessage('New command ' + dialog.getTempData('command') + ' was successfully added!');
    dialog.endAction();
  });

TeaBot.startPolling(); // for webhook see ex1.webhook.js example
