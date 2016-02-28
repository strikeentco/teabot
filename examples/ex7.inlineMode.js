'use strict';

const TeaBot = require('../main')('YOUR_TELEGRAM_BOT_TOKEN', 'YOUR_TELEGRAM_BOT_NAME');

TeaBot.onError(function (e) {
  console.error('Error:', e, e.stack);
});

TeaBot
  .inlineQuery('tay*', function (query) { // wildcard
    query
      .addGif(
        { gif_url: 'https://33.media.tumblr.com/tumblr_m3xrtsmgs11rn435g.gif', thumb_url: 'https://33.media.tumblr.com/tumblr_m3xrtsmgs11rn435g.gif', gif_width: 500, gif_height: 247 }
      )
      .addGif(
        { gif_url: 'http://blog.admissions.illinois.edu/wp-content/uploads/2015/08/Screaming-Taylor-Swift.gif', thumb_url: 'http://blog.admissions.illinois.edu/wp-content/uploads/2015/08/Screaming-Taylor-Swift.gif', gif_width: 480, gif_height: 267 }
      )
      .answer();
  })
  .inlineQuery(function (query) {
    query
      .addArticles([
        { title: 'Tay 1', message_text: 'Tay tay' },
        { title: 'Tay 2', message_text: 'Tay tay' },
        { title: 'Tay 3', message_text: 'Tay tay' }
      ])
      .answer();
  });

TeaBot.defineCommand(function (dialog) {
  dialog.sendMessage('Hey Tay!');
});

TeaBot.startPolling();
