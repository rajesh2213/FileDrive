const pasport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs') 
const passport = require('passport');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();


pasport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
    try{
        const user = await prisma.user.findUnique({
            where: { email: email }
        });
        if(!user){
            return done(null, false, {message: 'No user with that email'})
        }
        const match = await bcrypt.compare(password, user.password)
        if(match){
            return done(null, user)
        }else{
            return done(null, false, {message: 'Incorrect Password'})
        }
    }catch(err){
        return done(err)
    }
}))

pasport.serializeUser((user, done)=> done(null, user.id))
passport.deserializeUser(async (id, done)=>{
    try{
        const user = await prisma.user.findUnique({
            where: {id: id}
        })
        if(!user){
            return done(null, false)
        }
        return done(null, user);
    }catch(err){
        return done(err)
    }
})