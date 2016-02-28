'use strict';

const TeaBot = require('../main')('YOUR_TELEGRAM_BOT_TOKEN', 'YOUR_TELEGRAM_BOT_NAME');

TeaBot.onError(function (e) {
  console.error('Error:', e, e.stack);
});

TeaBot
  .defineCommand('/help', function (dialog) {
    dialog.sendMessage('This is /help command');
  })
  .defineCommand(function (dialog) {
    dialog.sendMessage('Send me /help for more information.');
  });

TeaBot.startPolling();
