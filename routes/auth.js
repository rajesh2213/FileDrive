const { Router } = require('express')
const router = Router()
const authCtrl = require('../controllers/authController')
const {body} = require('express-validator')

/*****************Login***************/
router.get('/login', authCtrl.login_get)
router.post('/login', [
    body('email')
        .trim()
        .notEmpty().withMessage('Please enter a Email'),
    body('password')
        .trim()
        .notEmpty().withMessage('Please enter a Password')
],authCtrl.login_post)

/*****************LogOut***************/
router.get('/logout', authCtrl.logout_get)

/*****************Sign-Up**************/
router.get('/sign-up', authCtrl.signUp_get)
router.post('/sign-up', [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is Required'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is Required')
        .isEmail().withMessage('Invalid Email Adress'),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is Required')
        .isLength({ min: 6 }).withMessage('Password must be atleast 6 characters'),
    body('confirmPwd')
        .trim()
        .notEmpty().withMessage('Confirm Password cant be left empty. Please Re-Type Password')
        .custom((value, { req }) => {
            console.log(`Confirm Pwd: ${value} and Pwd: ${req.password}`)
            if (value != req.body.password) {
                throw new Error('Passwords do not match')
            }
            return true
        })
],authCtrl.signUp_post)


module.exports = router