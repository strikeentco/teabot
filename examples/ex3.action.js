'use strict';

const TeaBot = require('../main')('YOUR_TELEGRAM_BOT_TOKEN', 'YOUR_TELEGRAM_BOT_NAME');

TeaBot.onError(function (e) {
  console.error('Error:', e, e.stack);
});

TeaBot
  .defineCommand('/start', function (dialog, message) {
    if (message.getArgument()) {
      dialog.performAction('/start'); // action will be called immediately
    } else {
      dialog.startAction('/start').sendMessage('This is /start command'); // action will be called at the next incoming message
    }
  })
  .defineCommand('/cancel', function (dialog) {
    if (dialog.inAction()) {
      dialog
        .endAction()
        .sendMessage('Ok, now you can try something else.');
    } else {
      dialog.sendMessage('There is nothing to cancel, man.');
    }
  })
  .defineCommand(function (dialog) {
    dialog.sendMessage('Send me /help for more information.');
  });

TeaBot
  .defineAction('/start', function (dialog) {
    dialog
      .endAction() //endAction required here, if you want to start other action
      .startAction('/start:subaction:1')
      .sendMessage('This is /start action');
  })
  .defineAction('/start:subaction:1', function (dialog) {
    dialog
      .endAction() //endAction required here, if you want to start other action
      .startAction('/start:subaction:2')
      .sendMessage('This is start subaction 1');
  })
  .defineAction('/start:subaction:2', function (dialog) {
    dialog
      .endAction()
      .sendMessage('This is start subaction 2');
  });

TeaBot.startPolling(); // for webhook see ex1.webhook.js example
