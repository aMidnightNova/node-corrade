
## Node Corade

Sorta like a brain for your Corrade bot.

### How do I use?

That's a good question!


### Info

Node Corrade is built using Promises everything should resolve or reject back to your main file.


## Classes

<dl>
<dt><a href="#Corrade">Corrade</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#REGISTERED_MODULES">REGISTERED_MODULES</a> : <code>Object</code></dt>
<dd><p>Object containing registered modules.</p>
</dd>
</dl>

<a name="Corrade"></a>

## Corrade
**Kind**: global class  

* [Corrade](#Corrade)
    * [new Corrade(config)](#new_Corrade_new)
    * _instance_
        * ["line"](#Corrade+event_line)
    * _inner_
        * [~query(options, autoEscape)](#Corrade..query) ⇒ <code>Promise</code>
        * [~loadModules(modules, authorizedRoles, allowedTypes)](#Corrade..loadModules)
        * [~runModule(moduleName, params)](#Corrade..runModule) ⇒ <code>Promise</code>
        * [~corradeGetGroupMembersByName(arrayOfNames)](#Corrade..corradeGetGroupMembersByName) ⇒ <code>Promise</code>
        * [~corradeGetGroupMemberByName(singleName)](#Corrade..corradeGetGroupMemberByName) ⇒ <code>Promise</code>
        * [~checkIfCommandAndReturnFormattedData(data)](#Corrade..checkIfCommandAndReturnFormattedData) ⇒ <code>Promise</code>

<a name="new_Corrade_new"></a>

### new Corrade(config)
Create an object that will interact with your corrade bot.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | Configuration options needed to establish a TCP connection with the corrade bot. |
| config.protocol | <code>string</code> | The protocol that you will use: http, https. |
| config.host | <code>string</code> | fqdn hostname or ip where the corrade bot is. |
| config.port | <code>number</code> | The port the tcp connection is on. |
| config.group | <code>string</code> | Second Life group name. |
| config.password | <code>string</code> | Second Life Corrade group password. |
| config.types | <code>array</code> | array of notification types you will subscribe to. |
| config.basicAuth | <code>object</code> | http basic auth credentials. |
| config.basicAuth.user | <code>string</code> | http basis auth username. |
| config.basicAuth.password | <code>string</code> | http basic auth password. |

**Example**  
```js
let config = {};
config.host = 'bot.example.com';
config.protocol = 'https';
config.group = 'MyGroupHere';
config.password = 'SuperAwesomeStrongPassword';
config.basicAuth = {
    user: 'corrade',
    password: 'Somepassword'
};
config.port = 9000;
config.types = ['group', 'message', 'statistics'];


let Corrade = require('./corrade.js');
let corrade = new Corrade(config);
```
<a name="Corrade+event_line"></a>

### "line"
Snowball event.

**Kind**: event emitted by [<code>Corrade</code>](#Corrade)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| parsedDate | <code>string</code> | returns data that is emitted from the tcp Interface. |

<a name="Corrade..query"></a>

### Corrade~query(options, autoEscape) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>Corrade</code>](#Corrade)  
**Returns**: <code>Promise</code> - parsedData - returns a promise object which will contain querystring parsed data, is csv format.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | case specific options needed to send a http(s) query to corrade. |
| autoEscape | <code>boolean</code> | querystring escape all contents of the options object. |

**Example**  
```js
corrade.query({
    command: 'tell',
    entity: 'avatar',
    agent: '<agent uuid>',
    message: 'Some Text Here'
}, false);
```
<a name="Corrade..loadModules"></a>

### Corrade~loadModules(modules, authorizedRoles, allowedTypes)
**Kind**: inner method of [<code>Corrade</code>](#Corrade)  

| Param | Type | Description |
| --- | --- | --- |
| modules | <code>array</code> | array of modules to load. |
| authorizedRoles | <code>array</code> | array of authorized group roles from your second life group that have access to this module. |
| allowedTypes | <code>array</code> | notification types this belongs to. |

**Example**  
```js
corrade.loadModules([ban], ['Staff', 'Owners'], ['message']);
```
<a name="Corrade..runModule"></a>

### Corrade~runModule(moduleName, params) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>Corrade</code>](#Corrade)  
**Returns**: <code>Promise</code> - returns a promise object which will contain the data of the registered function after it runs.  

| Param | Type | Description |
| --- | --- | --- |
| moduleName | <code>string</code> | string name of the registered module. |
| params | <code>object</code> | object of data for the module to run. |

**Example**  
```js
corrade.loadModules([ban], ['Staff', 'Owners'], ['message']);
```
<a name="Corrade..corradeGetGroupMembersByName"></a>

### Corrade~corradeGetGroupMembersByName(arrayOfNames) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>Corrade</code>](#Corrade)  
**Returns**: <code>Promise</code> - returns a promise object which will contain a csv of names unless any one of the names do not match.  

| Param | Type | Description |
| --- | --- | --- |
| arrayOfNames | <code>array</code> | array of legacy names or partial names. |

**Example**  
```js
corrade.corradeGetGroupMembersByName(['bunny','bob','sunny']).then(function (res) {
             //do things
         });
```
<a name="Corrade..corradeGetGroupMemberByName"></a>

### Corrade~corradeGetGroupMemberByName(singleName) ⇒ <code>Promise</code>
**Kind**: inner method of [<code>Corrade</code>](#Corrade)  
**Returns**: <code>Promise</code> - returns a promise object which will contain the full name unless it does not match anyone in the group.  

| Param | Type | Description |
| --- | --- | --- |
| singleName | <code>string</code> | single legacy name or partial name. |

**Example**  
```js
corrade.corradeGetGroupMembersByName('bunny').then(function (res) {
             //do things
         });
```
<a name="Corrade..checkIfCommandAndReturnFormattedData"></a>

### Corrade~checkIfCommandAndReturnFormattedData(data) ⇒ <code>Promise</code>
expects the initial message from corrade (ater its been trasformed though querystring)  to go into this function then formats the data to be more
javascript friendly if the first part of the message string is a command.

**Kind**: inner method of [<code>Corrade</code>](#Corrade)  
**Returns**: <code>Promise</code> - returns a promise object which will contain the firstName, lastName, messageAsString, messageAsArray, command, uuid, and type paramaters.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | corrade data object. |

**Example**  
```js
corrade.corradeGetGroupMembersByName('bunny').then(function (res) {
             //do things
         });
```
<a name="REGISTERED_MODULES"></a>

## REGISTERED_MODULES : <code>Object</code>
Object containing registered modules.

**Kind**: global variable  
