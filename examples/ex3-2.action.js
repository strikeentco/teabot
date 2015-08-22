var TeaBot = require('../main');

var Bot = new TeaBot(token, name);

Bot
  .defineCommand('/start', function(dialog) {
    if (dialog.message.getArgument()) {
      dialog.startAction('/start', true); //action will be called immediately
    } else {
      dialog.startAction('/start').sendMessage('This is /start command'); //action will be called at the next incoming message
    }
  })
  .defineCommand('/cancel', function(dialog) {
    if (dialog.inAction()) {
      dialog
        .endAction()
        .sendMessage('Ok, now you can try something else.');
    } else {
      dialog.sendMessage('There is nothing to cancel, man.');
    }
  })
  .defineCommand(function(dialog) {
    dialog.sendMessage('Send me /help for more information.');
  });

Bot
  .defineAction('/start', function(dialog) {
    dialog
      .endAction() //endAction required on this way, if you want to start other action
      .startAction('/start:subaction:1')
      .sendMessage('This is /start action');
  })
  .defineAction('/start:subaction:1', function(dialog) {
    dialog
      .endAction() //endAction required on this way, if you want to start other action
      .startAction('/start:subaction:2')
      .sendMessage('This is start subaction 1');
  })
  .defineAction('/start:subaction:2', function(dialog) {
    dialog
      .endAction()
      .sendMessage('This is start subaction 2');
  });

Bot.startPooling(); // for webhook see ex1.webhook.js example
