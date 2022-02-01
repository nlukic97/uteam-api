import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt'
import passport from 'passport'
import User from '../models/User'

export default passport.use(new JWTStrategy(
    {
        secretOrKey: process.env.ACCESS_TOKEN_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async(token, done)=>{
        try {
            const user = await User.findOne({
                where:{
                    username: token.username
                }
            })
            
            
            if(!user) return done(null,false)
            return done(null,user)
            
        } catch(err){
            return done(err,false)
        }
    }))