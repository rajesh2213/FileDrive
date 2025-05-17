const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const authModel = require('../models/authModel')
const passport = require('passport');


function login_get(req, res) {
    res.render('login', { errors: req.flash('error') })
}

const login_post = passport.authenticate('local', {
    failureFlash: true,
    successRedirect: '/',
    failureRedirect: '/login'
})

const signUp_get = (req, res) => {
    res.render('sign-up', { errors: null, user: {} })
}

async function signUp_post(req, res) {
    const errors = validationResult(req).array();
    if (errors.length != []) {
        console.log(errors)
        return res.render('sign-up', { errors: errors, user: req.body })
    }
    const { name, email, password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await authModel.insertUser(name, email, hashedPassword);
        if (!result.success) {
            return res.render('sign-up', {
                errors: [{ msg: result.message }],
                user: req.body
            });
        }
        res.redirect('/login')
    } catch (err) {
        console.log(err)
        res.send('Error Resgistering User...try again <a href="/sign-up">Sign Up</a>')
    }
}

const logout_get = (req, res)=>{
    req.logOut(()=>{
        res.redirect('/')
    })
}

module.exports = {
    login_get,
    login_post,
    signUp_get,
    signUp_post,
    logout_get
}