// paypalRoutes.js
const express = require('express');
const QRCode = require('qrcode');
const paypal = require('../paypal/paypal_config');

const router = express.Router();

// Route to create a PayPal payment and generate QR code
router.post('/create-payment', async (req, res) => {
    const { amount } = req.body;

    const paymentData = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        redirect_urls: {
            return_url: 'http://localhost:5173/success', // Adjust to your frontend URL
            cancel_url: 'http://localhost:5173/cancel'   // Adjust to your frontend URL
        },
        transactions: [{
            item_list: {
                items: [{
                    name: 'item',
                    sku: 'item',
                    price: amount,
                    currency: 'USD',
                    quantity: 1
                }]
            },
            amount: {
                currency: 'USD',
                total: amount
            },
            description: 'This is the payment description.'
        }]
    };

    try {
        // Create a PayPal payment
        paypal.payment.create(paymentData, async (error, payment) => {
            if (error) {
                console.error('PayPal Error:', error);
                res.status(500).json({ error: 'Could not create PayPal payment.' });
            } else {
                const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
                const qrCodeUrl = await QRCode.toDataURL(approvalUrl);
                res.json({ qrCodeUrl });
            }
        });
    } catch (err) {
        console.error('Error creating PayPal payment:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Route to check PayPal payment status
router.get('/payment-status', async (req, res) => {
    const paymentId = req.query.paymentId;

    try {
        // Retrieve PayPal payment details by payment ID
        paypal.payment.get(paymentId, (error, payment) => {
            if (error) {
                console.error('PayPal Error:', error);
                res.status(500).json({ error: 'Could not get PayPal payment details.' });
            } else {
                // Check payment state to determine success or failure
                const paymentState = payment.state;
                res.json({ paymentState });
            }
        });
    } catch (err) {
        console.error('Error retrieving PayPal payment details:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
