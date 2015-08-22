var TeaBot = require('../main');

var Bot = new TeaBot(token, name);

Bot
  .defineCommand('/start', function(dialog) {
    dialog.startAction('/start').sendMessage('This is /start command');
  })
  .defineCommand('/shift', function(dialog) {
    dialog.startAction('/shift').sendMessage('This is /shift command');
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
    dialog.startAction('start subaction 1').sendMessage('This is /start action');
  }, function(action) {
    action.defineSubAction('start subaction 1', function(dialog) {
      dialog.startAction('start subaction 2').sendMessage('This is start subaction 1');
    }, function(action) {
      action.defineSubAction('start subaction 2', function(dialog) {
        dialog.endAction().sendMessage('This is start subaction 2');
      })
    })
  })
  .defineAction('/shift', function(dialog) {
    dialog
      .startAction('shift subaction 1') //skip subaction 1
      .startAction('shift subaction 2') //go to subaction 2
      .sendMessage('This is /shift action');
  }, function(action) {
    action.defineSubAction('shift subaction 1', function(dialog) {
      dialog.startAction('shift subaction 2').sendMessage('This is shift subaction 1'); //never fired
    }, function(action) {
      action.defineSubAction('shift subaction 2', function(dialog) {
        dialog.endAction().sendMessage('This is shift subaction 2');
      })
    })
  });

Bot.startPooling(); // for webhook see ex1.webhook.js example
