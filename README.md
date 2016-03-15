teabot
==========
[![license](https://img.shields.io/github/license/strikeentco/teabot.svg?style=flat)](https://github.com/strikeentco/teabot/blob/master/LICENSE) [![node](https://img.shields.io/node/v/teabot.svg)](https://www.npmjs.com/package/teabot) [![npm](https://img.shields.io/npm/v/teabot.svg?style=flat)](https://www.npmjs.com/package/teabot) [![bitHound Score](https://www.bithound.io/github/strikeentco/teabot/badges/score.svg)](https://www.bithound.io/github/strikeentco/teabot)

`TeaBot` allows you to create highly interactive Telegram bots for Node.js with some additional cool features.

## Features
* Written for creating interactive bots
* Supports [plugins](#plugins)
  * Data storage in Redis, Aerospike ([with plugins](#plugins))
  * Analytics [botan.io](http://botan.io) ([with plugins](#plugins))
* Supports [Inline Mode](#inline-mode)
* Supports `/command@BotName` commands
* Has own [wrapper](https://github.com/strikeentco/tg-yarl) over Telegram API to enhance existing functionality

Difference between TeaBot `1.x.x` and TeaBot `2.0.0` [here](https://github.com/strikeentco/teabot/tree/master/docs/MIGRATION.md).

# Usage

```sh
$ npm install teabot --save
```

Simple echo bot:
```js
const TeaBot = require('teabot')('TELEGRAM_BOT_TOKEN', 'TELEGRAM_BOT_NAME');

TeaBot.defineCommand(function (dialog, message) {
  dialog.sendMessage('Echo: ' + message.text);
});

TeaBot.startPolling();
```

## Quick navigation
* [Methods](#methods)
  * [Start methods](#start-methods)
  * [Dialog object](#dialog-object)
  * [Message object](#message-object)
  * [Commands](#commands)
  * [Actions](#actions)
  * [Inline mode](#inline-mode)
  * [Plugins](#plugins)
  * [Errors](#errors)
* [Documentation](#documentation)
* [Examples](#examples)

# Methods

`TeaBot` based on [`tg-yarl`](https://github.com/strikeentco/tg-yarl) (wrapper over Telegram Bot Api with additional features) package, it means `TeaBot` inherits all methods from [`tg-yarl`](https://github.com/strikeentco/tg-yarl).

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

## Dialog object

`Dialog object` stores bot current dialogue with the `user`, as well as commands ([full list here](https://github.com/strikeentco/teabot/tree/master/docs/#telegram-api)) for communication.<br>
It can be obtained from the first parameter in `defineCommand` and `defineAction` callbacks, or directly from `TeaBot` object.

### dialog.getAction()

Checks whether the user is in a state of action, and if so `action name` will be returned, otherwise `false`.

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

#### More `dialog object` methods [in docs](https://github.com/strikeentco/teabot/tree/master/docs/#dialog-object).

## Message object

`Message object` stores processed incoming message, as well as its original copy.<br>
It can be obtained from `dialog.message` or from the second parameter in `defineCommand` and `defineAction` callbacks.

### message.getCommand()

Returns `command` or empty string.

### message.getArgument()

It returns the rest of the message, if it contains a `command` or the entire `message`.

#### More `message object` methods [in docs](https://github.com/strikeentco/teabot/tree/master/docs/#message-object).

## Commands

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
  .defineCommand(['/start', '/help'], function (dialog, message) {
    dialog.sendMessage('Hi there. This is a ' + message.getCommand() + ' command.');
  })
  .defineCommand('/hi*', function (dialog, message) { // wildcard
    dialog.sendMessage('This command ' + message.getCommand() + ', starts with /hi');
  })
  .defineCommand(function (dialog) {
    dialog.sendMessage('Send me /help for more information.');
  });
```

## Actions

You can define some `actions` if you want to add interactivity to your bot. Or you want to split your code.

### TeaBot.defineAction(action, callback)

#### Params
* **action** (*String|Array*) - Action or an array of actions. Also supports wildcards (Use `*` to match zero or more characters. A pattern starting with `!` will be negated).
* **callback** (*Function*) - Callback which is invoked for this action/actions when it starts.

```js
TeaBot
  .defineCommand('/help', function (dialog, message) {
    if (message.getArgument()) {
      dialog.performAction('/help:1'); // /help argument
    } else {
      dialog.startAction('/help:2').sendMessage('This is /help command.'); // /help
    }
  })
  .defineCommand(function (dialog) {
    dialog.sendMessage('Send me /help for more information.');
  });

TeaBot
  .defineAction('/help:*', function (dialog) { // wildcard
    dialog.endAction().sendMessage('This is ' + dialog.getAction() + ' action'); // if /help was with argument, then /help:1 action, otherwise /help:2
  });
```

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
        { title: 'Test 1', message_text: 'test' },
        { title: 'Test 2', message_text: 'test' },
        { title: 'Test 3', message_text: 'test' }
      ])
      .answer();
  });
```

#### More info about `inline mode` [in docs](https://github.com/strikeentco/teabot/tree/master/docs/#inline-mode).
#### More info about `query object` [in docs](https://github.com/strikeentco/teabot/tree/master/docs/#query-object).

## Plugins

At the moment `TeaBot` supports only `db` and `analytics` plugins, but in the future there will be more.

### TeaBot.use(name, plugin)

#### Params
* **type** (*String*) - Plugin type: `db` or `analytics`.
* **plugin** (*Object*) - Object with plugin.

```js
const TeaBot = require('teabot')('TELEGRAM_BOT_TOKEN', 'TELEGRAM_BOT_NAME');

TeaBot.use('analytics', require('teabot-botan')('BOTAN_TOKEN'));

TeaBot.defineCommand(function (dialog, message) {
  dialog.sendMessage('Echo: ' + message.text); // all message events will be sent directly to botan.io
});

TeaBot.startPolling();
```

### Available plugins:
* DB:
  * Redis - [teabot-redis](https://github.com/strikeentco/teabot-redis)
  * Aerospike - [teabot-aerospike](https://github.com/strikeentco/teabot-aerospike)
* Analytics:
  * Botan - [teabot-botan](https://github.com/strikeentco/teabot-botan)

#### More info about `plugins` [in docs](https://github.com/strikeentco/teabot/tree/master/docs/#teabotplugins).
#### Information about how to write your own plugin [here](https://github.com/strikeentco/teabot/tree/master/docs/PLUGINS.md).

## Errors

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

TeaBot.defineCommand(function (dialog, message) {
  dialog.sendMessage('Echo: ' + message.text).then(function () {
    throw new Error('Test error 1');
  }).catch(TeaBot.error);
  throw new Error('Test error 2');
});
```

# [Documentation](https://github.com/strikeentco/teabot/tree/master/docs/)

# Examples
* [@WezaBot](https://telegram.me/WezaBot) - [strikeentco/WezaBot](https://github.com/strikeentco/WezaBot) - weather bot written with TeaBot.

Other examples [here](https://github.com/strikeentco/teabot/tree/master/examples/).

# License

The MIT License (MIT)<br/>
Copyright (c) 2015-2016 Alexey Bystrov
