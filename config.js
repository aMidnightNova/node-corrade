
let config = {};

config.baseUrl = '';


config.server = 'bot.example.com';
config.protocol = 'https';
config.group = 'MySlGroup';
config.password = 'YourSuperStrongPassword';
config.basicAuth = {
    user: 'basicAuthUserName',
    password: 'YourSuperStrongPassword'
};
config.types = ['group', 'message'];



config.errors = [
    {code: 0, text: 'arguments need to be 4 or more characters'},
    {code: 1, text: 'no command given'},
    {code: 2, text: 'no one found by that name'},
    {code: 3, text: 'not subscribed too'},
    {code: 4, text: 'to many matches, be more specific'},
    {code: 5, text: 'invalid bot origin'}
];


module.exports = config;