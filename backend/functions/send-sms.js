const accountSid = 'ACf70e8c65a6cf30b3fd08a7ec8a08932c';
const authToken = '5b83d7488c671585a36a4b91e2fe09e4';

const client = require('twilio')(accountSid, authToken);

client.messages.create({
    to: '+14012481248',
    from: '+14012101818',
    body: 'Access code is'
})
.then((message) => console.log(message.sid  ))