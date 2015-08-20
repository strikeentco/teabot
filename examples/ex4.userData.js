var TeaBot = require('../main');

var Bot = new TeaBot(token, name);

Bot
  .defineCommand('/start', function(dialog) {
    if (!dialog.getUserData('name')) {
      dialog.sendMessage('Hello and welcome! You can specify your name with /setname command.');
    } else {
      dialog.sendMessage('Hello, ' + dialog.getUserData('name') + '!');
    }
  })
  .defineCommand('/setname', function(dialog) {
    if (!dialog.getUserData('name') ) {
      dialog.startAction('setName').sendMessage('What is your name?');
    } else {
      dialog.startAction('setName').sendMessage('Hello, ' + dialog.getUserData('name') + '! R u gonna change your name?\nSend me your new name or /cancel.');
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
  .defineCommand('/help', function(dialog) {
    dialog.sendMessage('/start\n/setname\n/cancel');
  })
  .defineCommand(function(dialog) {
    dialog.sendMessage('Send me /help for more information.');
  });

Bot
  .defineAction('setName', function(dialog) {
    var name = dialog.message.getArgument();
    if (name.trim() == '') {
      dialog.sendMessage('Name can\'t be empty. Try again or /cancel.');
    } else {
      dialog.setUserData('name', name);
      dialog.endAction().sendMessage('OK, now I\'ll call you ' + dialog.getUserData('name'));
    }
  });

Bot.startPooling(); // for webhook see webhook.js example
