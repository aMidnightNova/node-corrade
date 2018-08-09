
## Node Corade

Sorta like a brain for your Corrade bot.

### How do I use?

That's a good question!


### Info

Node Corrade is built using Promises everything should resolve or reject back to your main file.

#### setup

First we need some configuration stuff.

```javascript
let config = {};


config.host = 'bot.example.com'; //fqdn or ip of the host your bot(corrade) is located at.
config.protocol = 'https'; //http pr https
config.group = 'MyGroupHere'; // Your Second Life group name.
config.password = 'SuperAwesomeStrongPassword'; // Password for that group that you put into corrade
config.basicAuth = { // If you use basic auth with your https requests.
    user: 'corrade',
    password: 'Somepassword'
};
config.port = 9000; // the TCP port corrade is listening on.

config.types = ['group', 'message', 'statistics']; // the "types" of notifications you are subscribing too.

```


Now that we have a good ol' config object made lets use it.



```javascript
let Corrade = require('./corrade.js'); // he location of the main file.


let corrade = new Corrade(config); // construct the Corrade object with that config we made a moment ago.

```


### Methods

The corrade object will have the following methods available for use.