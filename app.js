require('dotenv').config()
const express = require('express')
const path = require('path')
const passport  = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const {PrismaClient} = require('./generated/prisma');
const prisma = new PrismaClient();

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const driveRouter = require('./routes/myDrive') 

require('./middlewares/initalizePassport')
const commonHandler = require('./middlewares/handler')

const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(session({
    store: new PrismaSessionStore(
        prisma,
        {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
        }
    ),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 24 * 1000,
        sameSite: 'lax'
    }
}))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session())



app.use(commonHandler.logError, commonHandler.isAuth, 
    commonHandler.logCurrentUser, commonHandler.formatCreatedDate)

app.use('/', indexRouter, authRouter, driveRouter)

app.listen((process.env.PORT), ()=>{
    console.log(`Connected and listening to PORT ${process.env.PORT}`)
})