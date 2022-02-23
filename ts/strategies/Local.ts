import { Strategy as LocalStrategy } from "passport-local";
import passport from 'passport'

import bcrypt from 'bcryptjs'
import validator from "validator";

import User from "../models/User";




export default passport.use(new LocalStrategy({
    usernameField:'name',
    passwordField:'password'
},

async(name:string, password:string, done) =>{
    const key: string = (validator.isEmail(name)) ? 'email': 'username'
    
    const user = await User.findOne({where:{
        [key]:name
    }})
    
    if(!user) return done(null,false)
    if(!bcrypt.compareSync(password, user.password)) return done(null,false)
    return done(null,user)
    
}))