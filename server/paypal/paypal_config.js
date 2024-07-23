const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const paypal = require('paypal-rest-sdk');

require('dotenv').config()


paypal.configure({
    'mode': 'live', // Sandbox or live
    'client_id': process.env.paypal_clientID,
    'client_secret': process.env.paypal_secretKey 
  });


console.log('Paypal Connected');


module.exports = paypal;
