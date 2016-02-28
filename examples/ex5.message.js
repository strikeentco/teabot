'use strict';

const TeaBot = require('../main')('YOUR_TELEGRAM_BOT_TOKEN', 'YOUR_TELEGRAM_BOT_NAME');

TeaBot.onError(function (e) {
  console.error('Error:', e, e.stack);
});

TeaBot
  .defineCommand(function (dialog, message) {
    if (message.isCommand()) {
      if (!message.getArgument()) {
        dialog.sendMessage('It\'s just a command.');
      } else {
        dialog.sendMessage('It\'s command with argument.');
      }
    } else {
      dialog.sendMessage('It\'s a ' + message.getType());
    }
  });

TeaBot.startPolling(); // for webhook see ex1.webhook.js example
