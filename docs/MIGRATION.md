# Migration

Difference between `1.x.x` and `2.0.0`:
* First of all `TeaBot.startPooling()` now is [`TeaBot.startPolling()`](https://github.com/strikeentco/teabot#teabotstartpollingoptions) (such a lame mistake :disappointed:) and has some other changes
* Built-in support for working with `DB` and `analytics` discontinued. Use separate [plugins](https://github.com/strikeentco/teabot#plugins) for it<br>
  In TeaBot `1.x.x` it was:
  ```js
  var Bot = require('teabot');

  var TeaBot = new Bot('TELEGRAM_BOT_TOKEN', 'TELEGRAM_BOT_NAME', {db: {type: 'aerospike', client: client}, analytics: {key: 'BOTAN_TOKEN'}})
  ```
  In TeaBot `2.0.0` it became:
  ```js
  var TeaBot = require('teabot')('TELEGRAM_BOT_TOKEN', 'TELEGRAM_BOT_NAME');

  TeaBot.use('db', require('teabot-aerospike')(client));
  TeaBot.use('analytics', require('teabot-botan')('BOTAN_TOKEN'));
  ```
* Now you can use [`dialog.performAction('/event')`](https://github.com/strikeentco/teabot#dialogperformactionaction) instead of `dialog.startAction('/event', true)`, backward compatibility is preserved
* Now all `API` methods, such as: `sendMessage`, `sendPhoto`, etc. Returns `Promise` with `body` object<br>
  In TeaBot `1.x.x` it was:
  ```js

  dialog.sendMessage().then(function(res) {
    console.log(res);
  });

  ```
  In TeaBot `2.0.0` it became:
  ```js

  dialog.sendMessage().then(function(res) {
    console.log(res.body);
  });

  ```
* [`InputFile object`](https://github.com/strikeentco/teabot/tree/master/docs/#inputfile-object) now is more clever<br>
  In TeaBot `1.x.x` it was:
  ```js

  dialog.sendPhoto({buffer: buf, fileName: filename}); // buf is a buffer with image

  ```
  In TeaBot `2.0.0` it became:
  ```js

  dialog.sendPhoto(buf); // buf is a buffer with image

  ```

For more info please see [examples](https://github.com/strikeentco/teabot#examples), they are up to date.
