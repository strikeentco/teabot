var TeaBot = require('../main');
var express = require('express');
var app = express();

var token = 'YOUR_TELEGRAM_BOT_TOKEN';
var name = 'YOUR_TELEGRAM_BOT_NAME';

var Bot = new TeaBot(token, name);

Bot
  .defineCommand('/help', function(dialog) {
    dialog.sendMessage('This is /help command');
  })
  .defineCommand(function(dialog) {
    dialog.sendMessage('Send me /help for more information.');
  });

app.post('/', function (req, res) {
  var message = req.body.message || false;
  if (message) {
    Bot.receive(message);
  }
  res.status(200).end();
});

app.listen(3000);
