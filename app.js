const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000
const db = require('./config/keys').MongoURI
const db1 = require('./config/contacts').MongoURI
const passport = require('passport')
require('./config/passport')(passport)

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.json())

mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))

mongoose.connect(db1, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))

app.use(express.urlencoded({ extended: false}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.listen(PORT, () => console.log('Server Started'))