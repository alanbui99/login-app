const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// set up twilio
const accountSid = 'ACf70e8c65a6cf30b3fd08a7ec8a08932c';
const authToken = '12e9f05da28f344a1cac28ebf5390a31';
const client = require('twilio')(accountSid, authToken);

// set up firebase
var serviceAccount = require("./permissions.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://login-app-b2651.firebaseio.com"
});

const app = express();
const db = admin.firestore();

app.use(cors({ origin: true }));

//Routes

// (POST) CreateNewAccessCode
app.post('/api/create/:phonenumber', (req, res) => {
    (async () => {
        try {

            //create random 6-digit access code
            const accessCode = Math.floor(100000 + Math.random() * 900000);
            
            //send sms
            client.messages.create({
                to: req.params.phonenumber,
                from: '+14012101818',
                body: `Your access code is ${accessCode}`
            })
            .then((message) => console.log(message.sid))

            // send phone number as a document and access code as a field of that document to firebase 
            await db.collection('access-codes').doc('/' + req.params.phonenumber + '/')
            .create({
                code: accessCode
            });
            // Return: a random 6-digit access code
            return res.json(accessCode);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// (POST) ValidateAccessCode
app.post('/api/validate/:phone/:code', (req, res) => {
    (async () => {
        try {
            // find access code by phone number from db
            const document = db.collection('access-codes').doc(req.params.phone);
            let code = await document.get();
            let response = code.data();

            //check if two codes match
            if (req.params.code == response.code) {
                return res.json({success: true});
            }

            return res.json({success: false});
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Export API to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
