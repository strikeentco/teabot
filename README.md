teabot
==========
[![license](https://img.shields.io/github/license/strikeentco/teabot.svg?style=flat)](https://github.com/strikeentco/teabot/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/teabot.svg?style=flat)](https://www.npmjs.com/package/teabot) [![bitHound Score](https://www.bithound.io/github/strikeentco/teabot/badges/score.svg)](https://www.bithound.io/github/strikeentco/teabot)

Teabot allows you to create highly interactive Telegram bot for Node.js with some additional cool features.

## Features
* Written for creating interactive bots
* Data storage in Redis, Aerospike (more in the future)
* Built-in support analytics [botan.io](http://botan.io)
* Supports deep linking mechanism
* Supports /command@BotName commands
* Has own wrapper over Telegram API to enhance existing functionality

# Usage

```sh
npm install teabot
```

```js
var TeaBot = require('teabot');

var token = 'YOUR_TELEGRAM_BOT_TOKEN';
var name = 'YOUR_TELEGRAM_BOT_NAME';

var Bot = new TeaBot(token, name);
Bot.defineCommand(function(dialog) {
  var message = dialog.message;
  dialog.sendMessage('Echo: ' + message.text);
});

Bot.startPooling();
```

## Quick navigation
* [Methods](#methods)
  * [Bot object](#bot-object)
    * [Constructor](#new-teabottoken-name-options)
    * [Commands](#botcommands)
      * [defineCommand(command, callback)](#botdefinecommandcommand-callback)
      * [defineCommand(callback)](#botdefinecommandcallback)
    * [Actions](#botactions)
      * [defineAction(action, callback, [subAction])](#botdefineactionaction-callback-subaction)
      * [defineSubAction(action, callback, [subAction])](#actiondefinesubactionaction-callback-subaction)
    * [Start methods](#start-methods)
      * [receive(message)](#botreceivemessage)
      * [startPooling([options])](#botstartpoolingoptions)
    * [Analytics](#bot-analytics)
      * [track(userId, message, event)](#bottrackuserid-message-event)
  * [Dialog object](#dialog-object)
    * [Action](#dialogaction)
      * [inAction()](#dialoginaction)
      * [startAction(action, [perform])](#dialogstartactionaction-perform)
      * [endAction([saveTemp])](#dialogendactionsavetemp)
    * [User data](#dialoguserdata)
      * [getUserData(property)](#dialoggetuserdataproperty)
      * [setUserData(property, data)](#dialogsetuserdataproperty-data)
      * [delUserData(property)](#dialogdeluserdataproperty)
      * [clearUserData()](#dialogclearuserdata)
    * [Temp data](#dialogtempdata)
      * [getTempData(property)](#dialoggettempdataproperty)
      * [setTempData(property, data)](#dialogsettempdataproperty-data)
      * [delTempData(property)](#dialogdeltempdataproperty)
      * [clearTempData()](#dialogcleartempdata)
    * [Telegram API](#telegram-api)
      * [sendMessage(text, [options])](#dialogsendmessagetext-options)
      * [forwardMessage(fromChatId, messageId)](#dialogforwardmessagefromchatid-messageid)
      * [sendPhoto(photo, [options])](#dialogsendphotophoto-options)
      * [sendAudio(audio, [options])](#dialogsendaudioaudio-options)
      * [sendDocument(document, [options])](#dialogsenddocumentdocument-options)
      * [sendSticker(sticker, [options])](#dialogsendstickersticker-options)
      * [sendVideo(video, [options])](#dialogsendvideovideo-options)
      * [sendVoice(audio, [options])](#dialogsendvoiceaudio-options)
      * [sendLocation(latitude, longitude, [options])](#dialogsendlocationlatitude-longitude-options)
      * [sendChatAction(action)](#dialogsendchatactionaction)
      * [getUserProfilePhotos()[offset], [limit]](#dialoggetuserprofilephotosoffset-limit)
    * [Extra](#extra)
      * [setKeyboard(keyboard, [resize], [once], [selective]](#dialogsetkeyboardkeyboard-resize-once-selective)
      * [setKeyboard([hide_keyboard], [selective])](#dialogsetkeyboardhide_keyboard-selective)
      * [InputFile object](#inputfile-object)
  * [Message object](#message-object)
    * [getType()](#messagegettype)
    * [isCommand()](#messageiscommand)
    * [getCommand()](#messagegetcommand)
    * [getArgument()](#messagegetargument)
* [Databases](#databases)
  * [Redis](#redis)
  * [Aerospike](#aerospike)
* [Analytics](#analytics)
  * [Botan](#botan)
* [Weird stuff](#weird-stuff)
* [Examples](#examples)
* [Documentation](#documentation)

# Methods

## Bot object

Bot object stores all commands, actions, settings, and also all the dialogues bot.

### new TeaBot(token, name, [options])

#### Params
* **token** (*String*) - Telegram Bot token.
* **name** (*String*) - Telegram Bot name.
* **[options]** (*Object*) - Config options:
  * **db** (*Object*) - [DB config](#databases).
  * **analytics** (*Object*) - [Analytics config](#analytics).

```js
var TeaBot = require('teabot');

var Bot = new TeaBot(token, name);
```

## Bot.commands

Commands always start with /.

### Bot.defineCommand(command, callback)

#### Params
* **command** (*String|Array*) - Command or an array of commands.
* **callback** (*Function*) - Callback which is invoked for this command/commands.

### Bot.defineCommand(callback)

#### Params
* **callback** (*Function*) - Callback which is invoked if the given command is not defined or is not available.

```js
var Bot = new TeaBot(token, name);
Bot
  .defineCommand(['/start', '/help'], function(dialog) {
    var message = dialog.message;
    dialog.sendMessage('Hi there. This is a ' + message.getCommand() + ' command.');
  })
  .defineCommand(function(dialog) {
    dialog.sendMessage('Send me /help for more information.');
  });
```

## Bot.actions

Actions are singly linked list of unlimited length.<br>
The first action is always set using `defineAction`, and all others using the `defineSubAction` in the previous action.

### Bot.defineAction(action, callback, [subAction])

#### Params
* **action** (*String|Array*) - Action or an array of actions.
* **callback** (*Function*) - Callback which is invoked for this action/actions.
* **[subAction]** (*Function*) - Callback is used to determine the sub-action.

### action.defineSubAction(action, callback, [subAction])

#### Params
* **action** (*String|Array*) - Sub-action.
* **callback** (*Function*) - Callback which is invoked for this sub-action.
* **[subAction]** (*Function*) - Callback is used to determine the sub-action.

```js
var Bot = new TeaBot(token, name);
Bot
  .defineCommand('/start', function(dialog) {
    dialog.startAction('/start').sendMessage('This is /start command');
  })
  .defineCommand(function(dialog) {
    dialog.sendMessage('Send me /help for more information.');
  });

Bot
  .defineAction('/start', function(dialog) {
    dialog.startAction('subaction 1').sendMessage('This is /start action');
  }, function(action) {
    action.defineSubAction('subaction 1', function(dialog) {
      dialog.startAction('subaction 2').sendMessage('This is subaction 1');
    }, function(action) {
      action.defineSubAction('subaction 2', function(dialog) {
        dialog.endAction().sendMessage('This is subaction 2');
      })
    })
  });
```

## Start methods

Depending on what type of connection with Telegram is used (webhook or long pooling), there are 2 methods to start the bot.

### Bot.receive(message)

To work with webhook.

#### Params
* **message** (*Object*) - Message object received from Telegram using the webhook.

[Example webhook](https://github.com/strikeentco/teabot/tree/master/examples/ex1.webhook.js)

### Bot.startPooling([options])

To work with long pooling.

#### Params
* **[options]** (*Object*) - Pooling options:
  * **offset** (*Integer*) - Identifier of the first update to be returned.
  * **timeout** (*Integer*) - Timeout in seconds for long polling.
  * **limit** (*Integer*) - Limits the number of updates to be retrieved.
  * **interval** (*Integer*) - Interval request updates from Telegram. In milliseconds (2000 by default).

[Example long pooling](https://github.com/strikeentco/teabot/tree/master/examples/ex2.pooling.js)

## Bot analytics

### Bot.track(userId, message, event)

#### Params
* **userId** (*Integer*) - User id to track.
* **message** (*Object*) - Message object.
* **event** (*String*) - Event name.

## Dialog object

Dialog object stores bot current dialogue with the user, as well as commands for communication.<br>
It can be obtained in `defineCommand`, `defineAction`, `defineSubAction` callbacks, or directly from Bot object.

## dialog.action

It is an object that contains a list of actions in the form of linked list.

### dialog.inAction()

Checks whether the user is in a state of action, and if so action will returned, otherwise false.

### dialog.startAction(action, [perform])

Start the action. Then all processes occur in `defineAction` or `defineSubAction` callbacks.

#### Params
* **action** (*String*) - Name of action defined in `defineAction` or `defineSubAction` for start.
* **[perform]** (*Boolean*) - If true, the action callback will be called immediately. Otherwise, it will happen at the next incoming message.

### dialog.endAction([saveTemp])

Ends the action and clears `dialog.tempData`.

#### Params
* **[saveTemp]** (*Boolean*) - If true, then `dialog.tempData` will not be cleared.

[Example with action: 1st way](https://github.com/strikeentco/teabot/tree/master/examples/ex3-1.action.js)<br>
[Example with action: 2nd way](https://github.com/strikeentco/teabot/tree/master/examples/ex3-2.action.js)

## dialog.userData

It is an object that can store user data (such as the bot settings).

### dialog.getUserData(property)

Gets user data on the property name.

#### Params
* **property** (*String*) - Property name.

### dialog.setUserData(property, data)

Sets the user data.

#### Params
* **property** (*String*) - Property name.
* **data** (*Mixed*) - User data.

### dialog.delUserData(property)

Deletes user data on the property name.

#### Params
* **property** (*String*) - Property name.

### dialog.clearUserData()

Clears the user data.

[Example with user data](https://github.com/strikeentco/teabot/tree/master/examples/ex4.userData.js)

## dialog.tempData

It is an object that can store temporary data to be transmitted between the actions.<br>
Deleted automatically when calling `endAction()`.

### dialog.getTempData(property)

Gets temporary data on the property name.

#### Params
* **property** (*String*) - Property name.

### dialog.setTempData(property, data)

Sets the temporary data.

#### Params
* **property** (*String*) - Property name.
* **data** (*Mixed*) - Temporary data.

### dialog.delTempData(property)

Deletes temporary data on the property name.

#### Params
* **property** (*String*) - Property name.

### dialog.clearTempData()

Clears the temporary data.

## Telegram API

All methods return a `Promise`, unless otherwise indicated. All methods are sent to the current chat/user.

### dialog.sendMessage(text, [options])

Send text message.

#### Params:

* **text** (*String*) - Text of the message to be sent.
* **[options]** (*Object*) - Message options:
  * **parse_mode** (*String*) - Send `Markdown`, if you want Telegram apps to show [bold, italic and inline URLs](https://core.telegram.org/bots/api#using-markdown) in your bot's message.
  * **disable_web_page_preview** (*Boolean*) - Disables link previews for links in this message.
  * **reply_to_message_id** (*Integer*) - If the message is a reply, ID of the original message.
  * **reply_markup** - Additional interface options.

### dialog.forwardMessage(fromChatId, messageId)

Forward messages of any kind.

#### Params:

* **fromChatId** (*Integer*) - Unique identifier for the chat where the original message was sent.
* **messageId** (*Integer*) - Unique message identifier.

### dialog.sendPhoto(photo, [options])

Send photo.

#### Params:

* **photo** (*String|Object*) - Object with file path, Stream, Buffer or `file_id`. See [InputFile object](#inputfile-object) for more info.
* **[options]** (*Object*) - Photo options:
  * **caption** (*String*) - Photo caption.
  * **reply_to_message_id** (*Integer*) - If the message is a reply, ID of the original message.
  * **reply_markup** - Additional interface options.

### dialog.sendAudio(audio, [options])

Send audio.

#### Params:

* **audio** (*String|Object*) - Object with file path, Stream, Buffer or `file_id`. See [InputFile object](#inputfile-object) for more info.
* **[options]** (*Object*) - Audio options:
  * **duration** (*Integer*) - Duration of sent audio in seconds.
  * **performer** (*String*) - Performer of sent audio.
  * **title** (*String*) - Title of sent audio.
  * **reply_to_message_id** (*Integer*) - If the message is a reply, ID of the original message.
  * **reply_markup** - Additional interface options.

### dialog.sendDocument(document, [options])

Send document.

#### Params:

* **document** (*String|Object*) - Object with file path, Stream, Buffer or `file_id`. See [InputFile object](#inputfile-object) for more info.
* **[options]** (*Object*) - Document options:
  * **reply_to_message_id** (*Integer*) - If the message is a reply, ID of the original message.
  * **reply_markup** - Additional interface options.

### dialog.sendSticker(sticker, [options])

Send .webp stickers.

#### Params:

* **sticker** (*String|Object*) - Object with file path, Stream, Buffer or `file_id`. See [InputFile object](#inputfile-object) for more info.
* **[options]** (*Object*) - Sticker options:
  * **reply_to_message_id** (*Integer*) - If the message is a reply, ID of the original message.
  * **reply_markup** - Additional interface options.

### dialog.sendVideo(video, [options])

Send video.

#### Params:

* **video** (*String|Object*) - Object with file path, Stream, Buffer or `file_id`. See [InputFile object](#inputfile-object) for more info.
* **[options]** (*Object*) - Video options:
  * **duration** (*Integer*) - Duration of sent video in seconds.
  * **caption** (*String*) - Video caption.
  * **reply_to_message_id** (*Integer*) - If the message is a reply, ID of the original message.
  * **reply_markup** - Additional interface options.

### dialog.sendVoice(audio, [options])

Send voice.

#### Params:

* **audio** (*String|Object*) - Object with file path, Stream, Buffer or `file_id`. See [InputFile object](#inputfile-object) for more info.
* **[options]** (*Object*) - Voice options:
  * **duration** (*Integer*) - Duration of sent video in seconds.
  * **reply_to_message_id** (*Integer*) - If the message is a reply, ID of the original message.
  * **reply_markup** - Additional interface options.

### dialog.sendLocation(latitude, longitude, [options])

Send location.

#### Params:

* **latitude** (*Float*) - Latitude of location.
* **longitude** (*Float*) - Longitude of location.
* **[options]** (*Object*) - Location options:
  * **reply_to_message_id** (*Integer*) - If the message is a reply, ID of the original message.
  * **reply_markup** - Additional interface options.

### dialog.sendChatAction(action)

Send chat action.

`typing` for text messages, `upload_photo` for photos, `record_video` or `upload_video` for videos, `record_audio` or `upload_audio` for audio files, `upload_document` for general files, `find_location` for location data.

#### Params:

* **action** (*String*) - Type of action to broadcast.

### dialog.getUserProfilePhotos([offset], [limit])

Use this method to get a list of profile pictures for a user.

#### Params:

* **[offset]** (*Integer*) - Sequential number of the first photo to be returned. By default, all photos are returned.
* **[limit]** (*Integer*) - Limits the number of photos to be retrieved. Values between 1—100 are accepted. Defaults to 100.

## Extra

### dialog.setKeyboard(keyboard, [resize], [once], [selective])

Custom keyboard.

#### Params:

* **keyboard** (*Array of Array of Strings*) - Array of button rows, each represented by an Array of Strings.
* **[resize]** (*Boolean*) - Requests clients to resize the keyboard vertically for optimal fit.
* **[once]** (*Boolean*) - Requests clients to hide the keyboard as soon as it's been used.
* **[selective]** (*Boolean*) - Use this parameter if you want to show the keyboard to specific users only.

### dialog.setKeyboard([hide_keyboard], [selective])

Hide custom keyboard.

#### Params:

* **[hide_keyboard]** (*True*) - Requests clients to hide the custom keyboard.
* **[selective]** (*Boolean*) - Use this parameter if you want to show the keyboard to specific users only.

If you just want to hide the keyboard, then do this:
```js
dialog.setKeyboard().sendMessage('Text');
//or
dialog.setKeyboard(true);
dialog.sendMessage('Text');
```
If you want to hide the keyboard to specific users only, then do this:
```js
dialog.setKeyboard(true, true).sendMessage('Text');
//or
dialog.setKeyboard(true, true);
dialog.sendMessage('Text');
```

### InputFile object

If buffer:
```js
var inputFile = {
  buffer: new Buffer(),
  fileName: 'file.png'
};
```
If stream:
```js
var inputFile = {
  stream: fs.createReadStream('file.png'),
  fileName: 'file.png'
};
```
If path:
```js
var inputFile = 'file.png';
```
If `file_id`:
```js
var inputFile = 'file_id';
//or
var inputFile = {fileId: 'file_id'};
```

## Message object

Message object stores processed incoming message, as well as its original copy.<br>
It can be obtained from `dialog.message`.

### message.getType()

Returns the type of message: `text`, `audio`, `document`, `photo`, `sticker`, `video`, `contact`, `location`, `voice` or `other`.

### message.isCommand()

If is message is command returns `true` else `false`.

### message.getCommand()

Returns command.

### message.getArgument()

It returns the rest of the message, if it contains a command or the entire message.

[Example with message](https://github.com/strikeentco/teabot/tree/master/examples/ex5.message.js)

# Databases

By default, all data is stored in memory, but for synchronization between servers or nodes, you may need a database.

## Redis

By default `key = 'app:teabot'`.

```js
var redis = require('redis');
var client = redis.createClient();

var config = {
  db: {
    type: 'redis',
    client: client,
    key: 'bot:telegram'
  }
};
var Bot = new TeaBot(token, name, config);
```

## Aerospike

By default `key = {ns: 'app', set: 'teabot'}`.

```js
var aerospike = require('aerospike');
var client = aerospike.client({
  hosts: [{
    addr: '127.0.0.1',
    port: 4000,
  }]
}).connect(function(response) {
  if (response.code == 0) {
    console.log('Connection to Aerospike cluster succeeded!');
  }
});

var config = {
  db: {
    type: 'aerospike',
    client: client,
    key: {
      ns: 'bot', set: 'telegram'
    }
  }
};
var Bot = new TeaBot(token, name, config);
```

# Analytics

TeaBot has built-in support analytics from [botan.io](http://botan.io).

## Botan

By default, all events are sent automatically at the `defineCommand`, `defineAction`, `defineSubAction`.<br>
And it looks like this:
![botanio](https://cloud.githubusercontent.com/assets/2401029/9345280/fa520b18-4617-11e5-838a-b8e2aff464d0.jpg)

But you can send they manually using the [Bot.track](#bottrackuserid-message-event), if you specify `manualMode` property to true.

```js
var config = {
  analytics: {
    key: 'KEY',
    manualMode: true
  }
};
var Bot = new TeaBot(token, name, config);

Bot
  .defineCommand(['/start', '/help'], function(dialog) {
    var message = dialog.message;
    dialog.sendMessage('Hi there. This is a ' + message.getCommand() + ' command.');
    Bot.track(dialog.userId, message, message.getCommand());
  })
  .defineCommand(function(dialog) {
    dialog.sendMessage('Send me /help for more information.');
    Bot.track(dialog.userId, message, 'Default');
  });
```

# Weird stuff

It's weird but you can even let your users create their own command!

**Note:** Currently it'll correctly work only with default memory storage in single node environment.

```js
Bot
  .defineCommand('/add', function(dialog) {
    dialog.startAction('/add').sendMessage('Send me new command');
  })
  .defineCommand('/cancel', function(dialog) {
    dialog.endAction().sendMessage('Ok, now you can try something else.');
  })
  .defineCommand(function(dialog) {
    dialog.sendMessage('Send me /help for more information.');
  });

Bot
  .defineAction('/add', function(dialog) {
    dialog.setTempData('command', dialog.message.text);
    dialog.startAction('message').sendMessage('Send me message for new command');
  }, function(action) {
    action.defineSubAction('message', function(dialog) {
      var message = dialog.message.text;
      Bot.defineCommand(dialog.getTempData('command'), function(dialog) {
        dialog.sendMessage(message);
      });
      dialog.sendMessage('New command ' + dialog.getTempData('command') + ' was successfully added!');
      dialog.endAction();
    })
  });
```

[Simple example](https://github.com/strikeentco/teabot/tree/master/examples/ex6.userCommand.js)

# Examples
* [@WezaBot](https://telegram.me/WezaBot) - [strikeentco/WezaBot](https://github.com/strikeentco/WezaBot)


* Webhook - [ex1.webhook.js](https://github.com/strikeentco/teabot/tree/master/examples/ex1.webhook.js)
* Long pooling - [ex2.pooling.js](https://github.com/strikeentco/teabot/tree/master/examples/ex2.pooling.js)
* Action: 1st way - [ex3-1.action.js](https://github.com/strikeentco/teabot/tree/master/examples/ex3-1.action.js)
* Action: 2nd way - [ex3-2.action.js](https://github.com/strikeentco/teabot/tree/master/examples/ex3-2.action.js)
* User data - [ex4.userData.js](https://github.com/strikeentco/teabot/tree/master/examples/ex4.userData.js)
* Message - [ex5.message.js](https://github.com/strikeentco/teabot/tree/master/examples/ex5.message.js)
* Weird stuff - [ex6.userCommand.js](https://github.com/strikeentco/teabot/tree/master/examples/ex6.userCommand.js)

# Documentation
  Coming soon.

# License

The MIT License (MIT)<br/>
Copyright (c) 2015 Alexey Bystrov
