require('./config/db')

const mongoose = require('mongoose')
const app = require('express')()

const port = process.env.PORT || 3000;

const UserRouter = require('./api/User')

const bodyParser = require('express').json;
app.use(bodyParser())



app.use('/user', UserRouter)

app.listen(port, () => {
    console.log(`Server is Running on Port Number ${port}`)
})
