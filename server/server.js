require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static("public"))

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const storeItems = new Map ([
    [1, {priceInCents: 500, name:'$5 Donation'}],
    [2, {priceInCents: 1000, name:'$10 Donation'}],
    [3, {priceInCents: 2000, name:'$20 Donation'}],
    [4, {priceInCents: 5000, name:'$50 Donation'}],
    [5, {priceInCents: 10000, name:'$100 Donation'}],
])

app.post('/donate-to-the-lads', async (req, res) => {
    try { 
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.items.map(item => {
                const storeItem = storeItems.get(item.id)
                return {
                    price_data: {
                        currency: 'aud',
                        product_data: {
                            name: storeItem.name
                        },
                        unit_amount: storeItem.priceInCents
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${process.env.SERVER_URL}/success.html`,
            cancel_url: `${process.env.SERVER_URL}`,
        })
        res.json({ url: session.url})
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

app.listen(3010)