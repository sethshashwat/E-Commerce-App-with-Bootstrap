const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/User')
const User1 = require('../models/Contact')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const app = express()

router.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')))
router.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'views', 'register.html')))
router.get('/settings', (req, res) => res.sendFile(path.join(__dirname, 'views', 'settings.html')))
router.get('/updateinfo', (req, res) => res.sendFile(path.join(__dirname, 'views', 'updateinfo.html')))
router.get('/delete', (req, res) => res.sendFile(path.join(__dirname, 'views', 'delete.html')))
router.get('/firebase.js', (req, res) => res.sendFile(path.join(__dirname, 'views', 'firebase.js')))

router.post('/updateinfo', (req, res) => {
    const { name, email, email1, password } = req.body;
    let errors = [];
    if (!name || !email || !password || !email1) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if (errors.length > 0) {
        res.sendFile(path.join(__dirname, 'views', 'updateinfo.html'))
    } else {
        const newUser = new User({
            name,
            email,
            password
        })
        bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                User.updateOne(
                    { email: email1 },
                    {
                        $set: {
                            "name": newUser.name,
                            "password": newUser.password,
                            "email": newUser.email
                        }
                    },
                    function (err, result) {
                        res.sendFile(path.join(__dirname, 'views', 'login.html'))
                    })
            }))
    }
})

router.post('/delete', (req, res) => {
    const { email } = req.body;
    let errors = [];
    if ( !email ) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if (errors.length > 0) {
        res.sendFile(path.join(__dirname, 'views', 'delete.html'))
    } else {
                User.deleteOne(
                    { email: email },
                    function (err, result) {
                        res.sendFile(path.join(__dirname, 'views', 'register.html'))
                    })
            }
    }
)
    
router.get('/logout', function (req, res) {
    res.redirect('/users/login')
});

router.use(express.static(__dirname + '/E-Commerce'))
router.get('/htmlpage', (req, res) => res.sendFile(path.join(__dirname, 'E-Commerce', 'htmlpage.html')))

router.post('/register', (req, res) => {
    const { name, email, password, password2} = req.body;
    let errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        res.sendFile(path.join(__dirname, 'views', 'register.html'))
    } else {
        const newUser = new User({
            name,
            email,
            password
        })
        bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;

                newUser.save()
                    .then(user => {
                        res.redirect('/users/login')
                    })
                    .catch(err => console.log(err))
            }))
    }
})

router.post('/contact', (req, res) => {
    const { name, email, msg } = req.body;
    let errors = [];
    if (!name || !email || !msg) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (errors.length > 0) {
        res.sendFile(path.join(__dirname, 'E-Commerce', 'htmlpage.html'))
    } else {
        const newUser = new User1({
            name,
            email,
            msg
        })
           newUser.save()
            .then(user => {
                res.sendFile(path.join(__dirname, 'E-Commerce', 'htmlpage.html'))
                    })
                    .catch(err => console.log(err))
            }
    }
)

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/htmlpage',
        failureRedirect: '/users/login'
    })(req, res, next);
});


module.exports = router;