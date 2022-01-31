import { Strategy as LocalStrategy } from "passport-local";
import { PassportStatic } from 'passport'

import bcrypt from 'bcryptjs'
import validator from "validator";

import User from "../models/User";


// local strategy for logging in
function InitLocal(passport:PassportStatic){
    
    passport.use(new LocalStrategy(async(name:string, password:string, done) =>{
        const key: string = (validator.isEmail(name)) ? 'email': 'username'
        
        
        const user = await User.findOne({where:{
            [key]:name
        }})

        console.log(user)
        
        /* if(user){
            console.log(user)
        }
        if(!user) return done(null,false)
        if(!bcrypt.compareSync(password, user.password)) return done(null,false)
        return done(null,user) */
        
    }))
}

export default InitLocal