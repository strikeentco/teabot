## Quick navigation
* [Migration Guide](#migration-guide)
* [Methods](#methods)
  * [Bot object](#bot-object)
    * [Constructor](#teabottoken-name-options)
    * [Commands](#teabotcommands)
      * [defineCommand(command, callback)](#teabotdefinecommandcommand-callback)
      * [defineCommand(callback)](#teabotdefinecommandcallback)
    * [Actions](#teabotactions)
      * [defineAction(action, callback)](#teabotdefineactionaction-callback)
    * [Inline mode](#inline-mode)
      * [inlineQuery(query, callback)](#teabotinlinequeryquery-callback)
      * [inlineQuery(callback)](#teabotinlinequerycallback)
    * [Plugins](#teabotplugins)
      * [use(name, plugin)](#teabotusename-plugin)
      * [getPlugin(type)](#teabotgetplugintype)
    * [Start methods](#start-methods)
      * [receive(message)](#teabotreceivemessage)
      * [startPolling([options])](#teabotstartpollingoptions)
  * [Dialog object](#dialog-object)
    * [Action](#dialogaction)
      * [getAction()](#dialoggetaction)
      * [inAction()](#dialoginaction)
      * [startAction(action)](#dialogstartactionaction)
      * [performAction(action)](#dialogperformactionaction)
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
      * [sendVoice(voice, [options])](#dialogsendvoicevoice-options)
      * [sendLocation(latitude, longitude, [options])](#dialogsendlocationlatitude-longitude-options)
      * [sendChatAction(action)](#dialogsendchatactionaction)
      * [getUserProfilePhotos([offset], [limit])](#dialoggetuserprofilephotosoffset-limit)
      * [getFile(file_id)](#dialoggetfilefile_id)
    * [Extra](#extra)
      * [downloadFile(file_id, path)](#dialogdownloadfilefile_id-path)
      * [setKeyboard(keyboard, [resize], [once], [selective]](#dialogsetkeyboardkeyboard-resize-once-selective)
      * [setKeyboard([hide_keyboard], [selective])](#dialogsetkeyboardhide_keyboard-selective)
      * [InputFile object](#inputfile-object)
  * [Message object](#message-object)
    * [getType()](#messagegettype)
    * [isCommand()](#messageiscommand)
    * [getCommand()](#messagegetcommand)
    * [setCommand(command)](#messagesetcommandcommand)
    * [getArgument()](#messagegetargument)
    * [setArgument(argument)](#messagesetargumentargument)
  * [Query object](#query-object)
    * [addArticle(article)](#queryaddarticlearticle)
    * [addArticles(articles)](#queryaddarticlesarticles)
    * [addPhoto(photo)](#queryaddphotophoto)
    * [addPhotos(photos)](#queryaddphotosphotos)
    * [addGif(gif)](#queryaddgifgif)
    * [addGifs(gifs)](#queryaddgifsgifs)
    * [addMpeg4Gif(mpeg4gif)](#queryaddmpeg4gifmpeg4gif)
    * [addMpeg4Gifs(mpeg4gifs)](#queryaddmpeg4gifsmpeg4gifs)
    * [addVideo(video)](#queryaddvideovideo)
    * [addVideos(videos)](#queryaddvideosvideos)
    * [answer(results, [options])](#queryanswerresults-options)
    * [answer([options])](#queryansweroptions)
    * [answerInlineQuery(results, [options])](#queryanswerinlinequeryresults-options)
* [Additional methods](#additional-methods)
  * [beforeMessage(callback)](#teabotbeforemessagecallback)
  * [on(type, callback)](#teabotontype-callback)
  * [onMessage(callback)](#teabotonmessagecallback)
  * [onPhoto(callback)](#teabotonphotocallback)
  * [onAudio(callback)](#teabotonaudiocallback)
  * [onDocument(callback)](#teabotondocumentcallback)
  * [onSticker(callback)](#teabotonstickercallback)
  * [onVideo(callback)](#teabotonvideocallback)
  * [onLocation(callback)](#teabotonlocationcallback)
  * [onContact(callback)](#teabotoncontactcallback)
  * [onVoice(callback)](#teabotonvoicecallback)
  * [onOther(callback)](#teabotonothercallback)
* [Errors handling](#errors-handling)
  * [error(error)](#teabotberrorerror)
  * [onError(callback)](#teabotonerrorcallback)
* [Weird stuff](#weird-stuff)
* [Examples](#examples)

# Migration Guide

Migration Guide [here](https://github.com/strikeentco/teabot/tree/master/MIGRATION.md).

# Methods

## Bot object

Bot object stores all commands, actions, settings, plugins, and also all the dialogues bot. Object also inherits all methods from [`tg-yarl`](https://github.com/strikeentco/tg-yarl), so you can do whatever you want like if it were a an ordinary `tg-yarl` package.

### TeaBot(token, name, [options])

#### Params
* **token** (*String*) - Telegram Bot token.
* **name** (*String*) - Telegram Bot name.

```js
const TeaBot = require('teabot')(token, name);
```

## TeaBot.commands

`Commands` always starts with `/`.

### TeaBot.defineCommand(command, callback)

#### Params
* **command** (*String|Array*) - Command or an array of commands. Also supports wildcards (Use `*` to match zero or more characters. A pattern starting with `!` will be negated).
* **callback** (*Function*) - Callback which is invoked for this command/commands.

### TeaBot.defineCommand(callback)

#### Params
* **callback** (*Function*) - Callback which is invoked if the given command is not defined or is not available.

```js
TeaBot
  .defineCommand(['/start', '/help'], function(dialog, message) {
    dialog.sendMessage('Hi there. This is a ' + message.getCommand() + ' command.');
  })
  .defineCommand('/hi*', function(dialog, message) { // wildcard
    dialog.sendMessage('This command ' + message.getCommand() + ', starts with /hi');
  })
  .defineCommand(function(dialog) {
    dialog.sendMessage('Send me /help for more information.');
  });
```

### ↥ [Jump to navigation](#quick-navigation).

## TeaBot.actions

You can define some `actions` if you want to add interactivity to your bot. Or you want to split your code.

### TeaBot.defineAction(action, callback)

#### Params
* **action** (*String|Array*) - Action or an array of actions. Also supports wildcards (Use `*` to match zero or more characters. A pattern starting with `!` will be negated).
* **callback** (*Function*) - Callback which is invoked for this action/actions when it starts.

```js
TeaBot
  .defineCommand('/help', function(dialog, message) {
    if (message.getArgument()) {
      dialog.performAction('/help:1'); // /help argument
    } else {
      dialog.startAction('/help:2').sendMessage('This is /help command.'); // /help
    }
  })
  .defineCommand(function(dialog) {
    dialog.sendMessage('Send me /help for more information.');
  });

TeaBot
  .defineAction('/help:*', function(dialog) { // wildcard
    dialog.endAction().sendMessage('This is ' + dialog.getAction() + ' action'); // if /help was with argument, then /help:1 action, otherwise /help:2
  });
```

### ↥ [Jump to navigation](#quick-navigation).

## Inline mode

### TeaBot.inlineQuery(query, callback)

#### Params
* **query** (*String|Array*) - Query or an array of queries. Also supports wildcards (Use `*` to match zero or more characters. A pattern starting with `!` will be negated).
* **callback** (*Function*) - Callback which is invoked for this query/queries.

### TeaBot.inlineQuery(callback)

#### Params
* **callback** (*Function*) - Callback which is invoked if the given query is not defined, is not available or is empty.

```js
TeaBot
  .inlineQuery('tay*', function(query) { // wildcard
    query
      .addGif(
        { gif_url: 'https://33.media.tumblr.com/tumblr_m3xrtsmgs11rn435g.gif', thumb_url: 'https://33.media.tumblr.com/tumblr_m3xrtsmgs11rn435g.gif', gif_width: 500, gif_height: 247 },
      )
      .addGif(
        { gif_url: 'http://blog.admissions.illinois.edu/wp-content/uploads/2015/08/Screaming-Taylor-Swift.gif', thumb_url: 'http://blog.admissions.illinois.edu/wp-content/uploads/2015/08/Screaming-Taylor-Swift.gif', gif_width: 480, gif_height: 267 }
      )
      .answer();
  })
  .inlineQuery(function(query) {
    query
      .addArticles([
        { title: 'Test 1', message_text: 'test' },
        { title: 'Test 2', message_text: 'test' },
        { title: 'Test 3', message_text: 'test' }
      ])
      .answer();
  });
```

### ↥ [Jump to navigation](#quick-navigation).

## TeaBot.plugins

You can expand functionality with additional `plugins`. At the moment `TeaBot` supports only `db` and `analytics` plugins, but in the future there will be more. Also you can write your own plugin, [click here](https://github.com/strikeentco/teabot/tree/master/docs/PLUGINS.md) for more information.

### TeaBot.use(name, plugin)

#### Params
* **type** (*String*) - Plugin type: `db` or `analytics`.
* **plugin** (*Object*) - Object with plugin.

### TeaBot.getPlugin(type)

Returns plugin `object` or `false`.

#### Params
* **type** (*String*) - Plugin type: `db` or `analytics`.

Only for `analytics` plugins, you can use internal `track` method, in all other cases you can use external methods with `getPlugin()` command.

```js
TeaBot.use('analytics', require('teabot-botan')('BOTAN_TOKEN', {manualMode: true}));

TeaBot.defineCommand(function(dialog, message) {
  dialog.sendMessage('Echo: ' + message.text);
  TeaBot.track(dialog.userId, message, message.getCommand()); // internal method
  TeaBot.getPlugin('analytics').shortenUrl(dialog.userId, 'https://github.com'); // external method
});
```

### ↥ [Jump to navigation](#quick-navigation).

## Start methods

Depending on what type of connection with Telegram is used (`webhook` or `long polling`), there are 2 methods to start the bot.

### TeaBot.receive(message)

To work with `webhook`.

#### Params
* **message** (*Object*) - Message object received from Telegram using the webhook.

### TeaBot.startPolling([options])

To work with `long polling`.

#### Params
* **[options]** (*Object*) - Polling options:
  * **offset** (*Integer*) - Identifier of the first update to be returned (0 by default).
  * **limit** (*Integer*) - Limits the number of updates to be retrieved (100 by default).
  * **timeout** (*Integer*) - Timeout in seconds for long polling (60 by default).

### ↥ [Jump to navigation](#quick-navigation).

## Dialog object

`Dialog object` stores bot current dialogue with the `user`, as well as commands ([full list here](#telegram-api)) for communication.<br>
It can be obtained from the first parameter in `defineCommand` and `defineAction` callbacks, or directly from `TeaBot` object.

## dialog.action

It is an `object` which shows the current action, otherwise `false`.

### dialog.getAction()

Checks whether the user is in a state of action, and if so `action name` will be returned, otherwise `false`.

### dialog.inAction()

Checks whether the user is in a state of action, and if so `action object` will returned, otherwise `false`.

### dialog.startAction(action)

Start the action. Then all processes occur in `defineAction` callbacks. Action callback will be called at the next incoming message.

#### Params
* **action** (*String*) - Name of the action defined in `defineAction`.

### dialog.performAction(action)

Perform the action. Then all processes occur in `defineAction` callbacks. Action callback will be called `immediately`.

#### Params
* **action** (*String*) - Name of the action defined in `defineAction`.

### dialog.endAction([saveTemp])

Ends the action and clears `dialog.tempData`.

#### Params
* **[saveTemp]** (*Boolean*) - If true, then `dialog.tempData` will not be cleared.

### ↥ [Jump to navigation](#quick-navigation).

## dialog.userData

It is an `object` that can store user data (such as the bot settings).

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

### ↥ [Jump to navigation](#quick-navigation).

## dialog.tempData

It is an `object` that can store temporary data to be transmitted between the actions.<br>
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

### ↥ [Jump to navigation](#quick-navigation).

## Telegram API

All methods are:
* return a `Promise`
* sent to the current chat/user
* inherited from [`tg-yarl`](https://github.com/strikeenco/tg-yarl) with a small piece of magic :sparkles:

### dialog.sendMessage(text, [options])

Send text message.

#### Params:

* **text** (*String*) - Text of the message to be sent.
* **[options]** (*Object*) - Message options:
  * **parse_mode** (*String*) - Send `Markdown`, if you want Telegram apps to show [bold, italic and inline URLs](https://core.telegram.org/bots/api#using-markdown) in your bot's message.
  * **disable_web_page_preview** (*Boolean*) - Disables link previews for links in this message.
  * **disable_notification** (*Boolean*) - Sends the message silently.
  * **reply_to_message_id** (*Integer*) - If the message is a reply, ID of the original message.
  * **reply_markup** - Additional interface options.

### dialog.forwardMessage(fromChatId, messageId, disableNotification)

Forward messages of any kind.

#### Params:

* **fromChatId** (*Integer|String*) - Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`)
* **messageId** (*Integer*) - Unique message identifier.
* **[disableNotification]** (*Boolean*) - Sends the message silently.

### dialog.sendPhoto(photo, [options])

Send photo.

#### Params:

* **photo** (*String|Object*) - Object with file path, Stream, Buffer or `file_id`. See [InputFile object](#inputfile-object) for more info.
* **[options]** (*Object*) - Photo options:
  * **caption** (*String*) - Photo caption.
  * **disable_notification** (*Boolean*) - Sends the message silently.
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
  * **disable_notification** (*Boolean*) - Sends the message silently.
  * **reply_to_message_id** (*Integer*) - If the message is a reply, ID of the original message.
  * **reply_markup** - Additional interface options.

### dialog.sendDocument(document, [options])

Send document.

#### Params:

* **document** (*String|Object*) - Object with file path, Stream, Buffer or `file_id`. See [InputFile object](#inputfile-object) for more info.
* **[options]** (*Object*) - Document options:
  * **caption** (*String*) - Document caption (may also be used when resending documents by file_id), 0-200 characters.
  * **disable_notification** (*Boolean*) - Sends the message silently.
  * **reply_to_message_id** (*Integer*) - If the message is a reply, ID of the original message.
  * **reply_markup** - Additional interface options.

### dialog.sendSticker(sticker, [options])

Send .webp stickers.

#### Params:

* **sticker** (*String|Object*) - Object with file path, Stream, Buffer or `file_id`. See [InputFile object](#inputfile-object) for more info.
* **[options]** (*Object*) - Sticker options:
  * **disable_notification** (*Boolean*) - Sends the message silently.
  * **reply_to_message_id** (*Integer*) - If the message is a reply, ID of the original message.
  * **reply_markup** - Additional interface options.

### dialog.sendVideo(video, [options])

Send video.

#### Params:

* **video** (*String|Object*) - Object with file path, Stream, Buffer or `file_id`. See [InputFile object](#inputfile-object) for more info.
* **[options]** (*Object*) - Video options:
  * **duration** (*Integer*) - Duration of sent video in seconds.
  * **width** (*Integer*) - Video width.
  * **height** (*Integer*) - Video height.
  * **caption** (*String*) - Video caption (may also be used when resending videos by file_id), 0-200 characters
  * **disable_notification** (*Boolean*) - Sends the message silently.
  * **reply_to_message_id** (*Integer*) - If the message is a reply, ID of the original message.
  * **reply_markup** - Additional interface options.

### dialog.sendVoice(voice, [options])

Send voice.

#### Params:

* **voice** (*String|Object*) - Object with file path, Stream, Buffer or `file_id`. See [InputFile object](#inputfile-object) for more info.
* **[options]** (*Object*) - Voice options:
  * **duration** (*Integer*) - Duration of sent audio in seconds.
  * **disable_notification** (*Boolean*) - Sends the message silently.
  * **reply_to_message_id** (*Integer*) - If the message is a reply, ID of the original message.
  * **reply_markup** - Additional interface options.

### dialog.sendLocation(latitude, longitude, [options])

Send location.

#### Params:

* **latitude** (*Float*) - Latitude of location.
* **longitude** (*Float*) - Longitude of location.
* **[options]** (*Object*) - Location options:
  * **disable_notification** (*Boolean*) - Sends the message silently.
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

### dialog.getFile(file_id)

Use this method to get basic info about a file and prepare it for downloading.

### Params:

* **file_id** (*String*) - File identifier to get info about.

### ↥ [Jump to navigation](#quick-navigation).

## Extra

### dialog.downloadFile(file_id, path)

Download file to specified path.

#### Params:

* **file_id** (*String*) - File identifier to download.
* **path** (*String|WritableStream*) - File will be written to specified `WritableStream` or new `WritableStream` will be created with specified path.

```js
dialog.downloadFile('AgADAgADjagxGxAR6gbMzfh8LDtkU-9GhCoABOmH973MjLOBq7sAAgI', './file.jpg');
```

### dialog.setKeyboard(keyboard, [resize], [once], [selective])

Custom keyboard.

#### Params:

* **keyboard** (*Array of Array of Strings*) - Array of button rows, each represented by an Array of Strings.
* **[resize]** (*Boolean*) - Requests clients to resize the keyboard vertically for optimal fit.
* **[once]** (*Boolean*) - Requests clients to hide the keyboard as soon as it's been used.
* **[selective]** (*Boolean*) - Use this parameter if you want to show the keyboard to specific users only.

### dialog.setKeyboard([hide_keyboard], [selective])

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

#### Params:

* **[hide_keyboard]** (*True*) - Requests clients to hide the custom keyboard.
* **[selective]** (*Boolean*) - Use this parameter if you want to show the keyboard to specific users only.

### InputFile object

For `path`, `file_id`, `Buffer` and local `Stream` just pass into variable:
```js
var inputFile = './file.png'; //path
//or
var inputFile = 'AgADAgADjagxGxAR6gbMzfh8LDtkU-9GhCoABOmH973MjLOBq7sAAgI'; //file_id
//or
var inputFile = new Buffer(); //Buffer
//or
var inputFile = require('fs').createReadStream('./file.png'); //local Stream

dialog.sendPhoto('chatId', inputFile);
```

For remote `Stream`:
```js
var inputFile = {
  value: require('https').request('https://avatars1.githubusercontent.com/u/2401029'),
  filename: 'image.jpg'
};

dialog.sendPhoto('chatId', inputFile);
```

### ↥ [Jump to navigation](#quick-navigation).

## Message object

`Message object` stores processed incoming message, as well as its original copy.<br>
It can be obtained from `dialog.message` or from the second parameter in `defineCommand` and `defineAction` callbacks.

### message.getType()

Returns the type of message: `text`, `audio`, `document`, `photo`, `sticker`, `video`, `contact`, `location`, `voice` or `other`.

### message.isCommand()

If is message is command returns `true` else `false`.

### message.getCommand()

Returns command.

### message.setCommand(command)

Sets the command.

#### Params
* **command** (*String*) - Command.

### message.getArgument()

It returns the rest of the message, if it contains a `command` or the entire `message`.

### message.setArgument(argument)

Sets the argument.

#### Params
* **argument** (*String*) - Argument.

### ↥ [Jump to navigation](#quick-navigation).

## Query object

`Query object` is like `dialog object` but for `inline mode`, it stores current dialogue with the `user` and commands for communication.<br>
It can be obtained from the first parameter in `inlineQuery` callback, or directly from `TeaBot` object.

### query.addArticle(article)

Creates an object which represents a link to an article or web page.

#### Params
* **article** (*Object*) - Object with article:
  * **id** (*String*) - Unique identifier for this result, 1-64 Bytes (**Note:** By default, `TeaBot` will generate id of object using `md5` by yourself, but you can provide own id).
  * **title** (*String*) - Title of the result.
  * **message_text** (*String*) - Text of the message to be sent, 1-4096 characters.
  * **[parse_mode]** (*String*) - Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
  * **[disable_web_page_preview]** (*Boolean*) - Disables link previews for links in the sent message.
  * **[url]** (*String*) - URL of the result.
  * **[hide_url]** (*Boolean*) - Pass True, if you don't want the URL to be shown in the message.
  * **[description]** (*String*) - Short description of the result.
  * **[thumb_url]** (*String*) - Url of the thumbnail for the result.
  * **[thumb_width]** (*Integer*) - Thumbnail width.
  * **[thumb_height]** (*Integer*) - Thumbnail height.

### query.addArticles(articles)

#### Params
* **articles** (*Array of Objects*) - Array of articles objects.

### query.addPhoto(photo)

Creates an object which represents a link to a photo. By default, this photo will be sent by the user with optional `caption`. Alternatively, you can provide `message_text` to send it instead of photo.

#### Params
* **photo** (*Object*) - Object with photo:
  * **id** (*String*) - Unique identifier for this result, 1-64 Bytes (**Note:** By default, `TeaBot` will generate id of object using `md5` by yourself, but you can provide own id).
  * **thumb_url** (*String*) - URL of the thumbnail for the photo.
  * **photo_url** (*String*) - A valid URL of the photo. Photo must be in `jpeg` format. Photo size must not exceed 5MB.
  * **[photo_width]** (*Integer*) - Width of the photo.
  * **[photo_height]** (*Integer*) - Height of the photo.
  * **[title]** (*String*) - Title for the result.
  * **[description]** (*String*) - Short description of the result.
  * **[caption]** (*String*) - Caption of the photo to be sent, 0-200 characters.
  * **[message_text]** (*String*) - Text of a message to be sent instead of the photo, 1-4096 characters.
  * **[parse_mode]** (*String*) - Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
  * **[disable_web_page_preview]** (*Boolean*) - Disables link previews for links in the sent message.

### query.addPhotos(photos)

#### Params
* **photos** (*Array of Objects*) - Array of photos objects.

### query.addGif(gif)

Creates an object which represents a link to an animated GIF file. By default, this animated GIF file will be sent by the user with optional `caption`. Alternatively, you can provide `message_text` to send it instead of the animation.

#### Params
* **gif** (*Object*) - Object with gif:
  * **id** (*String*) - Unique identifier for this result, 1-64 Bytes (**Note:** By default, `TeaBot` will generate id of object using `md5` by yourself, but you can provide own id).
  * **thumb_url** (*String*) - URL of the static thumbnail (`jpeg` or `gif`) for the result.
  * **gif_url** (*String*) - A valid URL for the GIF file. File size must not exceed 1MB
  * **[gif_width]** (*Integer*) - Width of the GIF.
  * **[gif_height]** (*Integer*) - Height of the GIF.
  * **[title]** (*String*) - Title for the result.
  * **[caption]** (*String*) - Caption of the GIF to be sent, 0-200 characters.
  * **[message_text]** (*String*) - Text of a message to be sent instead of the animation, 1-4096 characters.
  * **[parse_mode]** (*String*) - Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
  * **[disable_web_page_preview]** (*Boolean*) - Disables link previews for links in the sent message.

### query.addGifs(gifs)

#### Params
* **gifs** (*Array of Objects*) - Array of gifs objects.

### query.addMpeg4Gif(mpeg4gif)

Creates an object which represents a link to a video animation (H.264/MPEG-4 AVC video without sound). By default, this animated MPEG-4 file will be sent by the user with optional `caption`. Alternatively, you can provide `message_text` to send it instead of the animation.

#### Params
* **mpeg4gif** (*Object*) - Object with mpeg4gif:
  * **id** (*String*) - Unique identifier for this result, 1-64 Bytes (**Note:** By default, `TeaBot` will generate id of object using `md5` by yourself, but you can provide own id).
  * **thumb_url** (*String*) - URL of the static thumbnail (`jpeg` or `gif`) for the result.
  * **mpeg4_url** (*String*) - A valid URL for the MP4 file. File size must not exceed 1MB.
  * **[mpeg4_width]** (*Integer*) - Video width.
  * **[mpeg4_height]** (*Integer*) - Video height.
  * **[title]** (*String*) - Title for the result.
  * **[caption]** (*String*) - Caption of the MPEG-4 file to be sent, 0-200 characters.
  * **[message_text]** (*String*) - Text of a message to be sent instead of the animation, 1-4096 characters.
  * **[parse_mode]** (*String*) - Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
  * **[disable_web_page_preview]** (*Boolean*) - Disables link previews for links in the sent message.

### query.addMpeg4Gifs(mpeg4gifs)

#### Params
* **mpeg4gifs** (*Array of Objects*) - Array of mpeg4gifs objects.

### query.addVideo(video)

Creates an object which represents link to a page containing an embedded video player or a video file.

#### Params
* **video** (*Object*) - Object with video:
  * **id** (*String*) - Unique identifier for this result, 1-64 Bytes (**Note:** By default, `TeaBot` will generate id of object using `md5` by yourself, but you can provide own id).
  * **thumb_url** (*String*) - URL of the thumbnail (`jpeg` only) for the video.
  * **video_url** (*String*) - A valid URL for the embedded video player or video file.
  * **[video_width]** (*Integer*) - Video width.
  * **[video_height]** (*Integer*) - Video height.
  * **[video_duration]** (*Integer*) - Video duration in seconds.
  * **mime_type** (*String*) - Mime type of the content of video url, “text/html” or “video/mp4”.
  * **message_text** (*String*) - Text of the message to be sent with the video, 1-4096 characters.
  * **title** (*String*) - Title for the result.
  * **[description]** (*String*) - Short description of the result.
  * **[parse_mode]** (*String*) - Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
  * **[disable_web_page_preview]** (*Boolean*) - Disables link previews for links in the sent message.

### query.addVideos(videos)

#### Params
* **videos** (*Array of Objects*) - Array of videos objects.

### query.answer(results, [options])

This method will combine results which were added with previous methods and results specified by parameter, after that they will be sent.

#### Params
* **results** (*Array of [InlineQueryResult](https://core.telegram.org/bots/api#inlinequeryresult)*) - Array of results for the inline query.
* **[options]** (*Object*) - Answer options:
  * **cache_time** (*Integer*) - The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300.
  * **is_personal** (*Boolean*) - Pass True, if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query.
  * **next_offset** (*String*) - Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don‘t support pagination. Offset length can’t exceed 64 bytes.

### query.answer([options])

This method sends results which were added with previous methods only.

#### Params
* **[options]** (*Object*) - Answer options:
  * **cache_time** (*Integer*) - The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300.
  * **is_personal** (*Boolean*) - Pass True, if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query.
  * **next_offset** (*String*) - Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don‘t support pagination. Offset length can’t exceed 64 bytes.

All methods above is a syntactic sugar, so if you are bold person, you can only use the next method which is inherited from [`tg-yarl`](https://github.com/strikeenco/tg-yarl).

### query.answerInlineQuery(results, [options])

Use this method to send answers to an inline query. On success, True is returned.<br>
No more than 50 results per query are allowed.

#### Params:

* **results** (*Array of [InlineQueryResult](https://core.telegram.org/bots/api#inlinequeryresult)*) - A JSON-serialized array of results for the inline query.
* **[options]** (*Object*) - Inline Query options:
  * **cache_time** (*Integer*) - The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300.
  * **is_personal** (*Boolean*) - Pass True, if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query.
  * **next_offset** (*String*) - Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don‘t support pagination. Offset length can’t exceed 64 bytes.

### ↥ [Jump to navigation](#quick-navigation).

# Additional methods

### TeaBot.beforeMessage(callback)

With this method you able to manipulate with [dialog.message](#message-object) object before it will be passed to `defineCommand()`, `defineAction()`, `onMessage()`, etc.

#### Params
* **callback** (*Function*) - Callback which is invoked before message processing.

```js
TeaBot
  .beforeMessage(function(dialog, message) {
    if (message.getCommand() === '/test') {
      message.setCommand('/start');
    }
  });

TeaBot
  .defineCommand('/test', function(dialog) {
    // This callback will never be invoked
  })
  .defineCommand('/start', function(dialog) {
    // This callback will be invoked for /start and /test command
  })
  .defineCommand(function(dialog) {
    // This callback will be invoked in other cases
  });
```

### TeaBot.on(type, callback)

With this method you able to write your own handler for each types of the messages.

If you want to use `TeaBot.defineCommand()` you shouldn't define methods which will affect to text messages (i.e. `TeaBot.on()` with `text` and `message` types and `TeaBot.onMessage()` methods).

Each type can be defined only once, all of the subsequent will overwrite the previous one.

#### Params
* **type** (*String|Array*) - One or more types of the message: `text` (or `message`), `audio`, `document`, `photo`, `sticker`, `video`, `contact`, `location`, `voice`, `other`.
* **callback** (*Function*) - Callback which is invoked for this type of the message.

```js
TeaBot
  .on(['audio', 'voice'], function(dialog, message) {
    // This callback will be invoked if type of the incoming message is audio or voice
    dialog.performAction('/some:audio:voice:action');
  })
  .onLocation(function(dialog, message) {
    // This callback will be invoked if type of the incoming message is location
  });

TeaBot
  .defineCommand('/start', function(dialog) {
    // This callback will be invoked if type of the incoming message is text and contains /start command
  })
  .defineCommand(function(dialog) {
    // This callback will be invoked if type of the incoming message is text, document, photo, sticker, video, contact, other
  });

TeaBot
  .defineAction('/some:audio:voice:action', function(dialog) {
    // This callback will be invoked with every audio and voice messages
    dialod.endAction();
  });
```

Methods below is like a previous but with the specified type:
### TeaBot.onMessage(callback)
### TeaBot.onPhoto(callback)
### TeaBot.onAudio(callback)
### TeaBot.onDocument(callback)
### TeaBot.onSticker(callback)
### TeaBot.onVideo(callback)
### TeaBot.onLocation(callback)
### TeaBot.onContact(callback)
### TeaBot.onVoice(callback)
### TeaBot.onOther(callback)

### ↥ [Jump to navigation](#quick-navigation).

# Errors

By default, no errors are displayed, except for those that may interfere start the bot. But with these methods you be able to handle errors by yourself.

### TeaBot.error(error)

Use this method in `Promise`, `Callback` functions and whenever you want.

#### Params
* **error** (*Object*) - Error object.

### TeaBot.onError(callback)

When error occurs or when `TeaBot.error()` is used, callback will be invoked.

#### Params
* **callback** (*Function*) - Callback which is invoked when `TeaBot.error()` is called (including internal call).

```js
TeaBot.onError(function (e) {
  console.error('TeaBot error:', e.stack);
});

TeaBot.defineCommand(function(dialog, message) {
  dialog.sendMessage('Echo: ' + message.text).then(function() {
    throw new Error('Test error 1');
  }).catch(TeaBot.error);
  throw new Error('Test error 2');
});
```

### ↥ [Jump to navigation](#quick-navigation).

# Weird stuff

It's weird but you can even let your users create their own command!

**Note:** Currently it'll correctly work only with default memory storage in single node environment.

```js
TeaBot
  .defineCommand('/add', function (dialog) {
    dialog.startAction('/add').sendMessage('Send me new command');
  })
  .defineCommand('/cancel', function (dialog) {
    dialog.endAction().sendMessage('Ok, now you can try something else.');
  })
  .defineCommand(function (dialog) {
    dialog.sendMessage('Send me /help for more information.');
  });

TeaBot
  .defineAction('/add', function (dialog, message) {
    dialog.setTempData('command', message.getCommand());
    dialog
      .endAction(true)
      .startAction('message')
      .sendMessage('Send me message for new command');
  })
  .defineAction('message', function (dialog, message) {
    TeaBot.defineCommand(dialog.getTempData('command'), function (dialog) {
      dialog.sendMessage(message.getArgument());
    });

    dialog.sendMessage('New command ' + dialog.getTempData('command') + ' was successfully added!');
    dialog.endAction();
  });
```

### ↥ [Jump to navigation](#quick-navigation).

# Examples
* [@WezaBot](https://telegram.me/WezaBot) - [strikeentco/WezaBot](https://github.com/strikeentco/WezaBot) - weather bot written with TeaBot.

Other examples [here](https://github.com/strikeentco/teabot/tree/master/examples/).
