import express from 'express'
const router = express.Router()

import passport from 'passport'
import jwt from 'jsonwebtoken'


// import AuthMiddleware from '../middleware/auth/Authenticate' // DEPRECATED, now we use passport-jwt (see ./strategies/JWTStrategy.ts)

// Validation middleware
import RegisterValidaton from '../middleware/validation/Register.middleware'
import LoginValidation from '../middleware/validation/Login.middleware'
import CompanyInsertValidation from '../middleware/validation/Company.insert.validation'
import CompanyUpdateValidation from '../middleware/validation/Company.update.validation'
import ProfileInsertValidation from '../middleware/validation/Profile.insert.validation'
import ProfileUpdateValidation from '../middleware/validation/Profile.update.validation'

/** Controller imports */
import AppController from '../controllers/App.controller'
import ProfileController from '../controllers/Profile.controller'
import UserController from '../controllers/User.controller'
import CompanyController from '../controllers/Company.controller'


/* --- Routes --- */
// Profile routes
router.get('/profiles', ProfileController.getProfiles)
router.get('/profiles/:id', ProfileController.getProfileById)
router.post('/profiles', ProfileInsertValidation, ProfileController.insertNewProfile) // profile insert validation middleware
router.put('/profiles/:id', passport.authenticate('jwt',{session:false}), ProfileUpdateValidation, ProfileController.updateProfile) // profile update validation middleware
router.delete('/profiles/:id', ProfileController.deleteProfile)

// User routes
// router.get('/countAllUsers', AuthMiddleware, UserController.countAllUsers) //auth middleware - DEPRECATED
router.get('/countAllUsers', passport.authenticate('jwt',{session:false}),UserController.countAllUsers) //auth middleware
router.post('/register', RegisterValidaton, UserController.register) // register validation middleware

// login validation middleware
// router.post('/login', LoginValidation, UserController.login) // DEPRECATED - see ./strategies/Local.ts for new method
router.post('/login', LoginValidation, passport.authenticate('local',{session:false}), async (req,res)=>{    
    if(req.isAuthenticated()){
        const accessToken: string | undefined = await jwt.sign({username: req.user.username}, process.env.ACCESS_TOKEN_SECRET)
        return res.status(200).json({message:'User is authenticated.',token:accessToken})
    }
    return res.sendStatus(401) //passport handles this, but just as a failsafe  
})

// Company routes
router.get('/companies',CompanyController.getCompanies)
router.post('/companies', CompanyInsertValidation, CompanyController.insertNewCompany) // company insert validation middleware
router.get('/companies/:id',CompanyController.getCompanyById)
router.put('/companies/:id',passport.authenticate('jwt',{session:false}), CompanyUpdateValidation, CompanyController.updateCompany) // company update validation middleware
router.delete('/companies/:id',CompanyController.deleteCompany)

// 404 errors for POST, PUT, and DELETE - Keep these routes at the bottom of this router page
router.get('*', AppController.wildcard) // AppController routes
router.post('*',(_,res)=> res.sendStatus(404))
router.put('*',(_,res)=> res.sendStatus(404))
router.delete('*',(_,res)=> res.sendStatus(404))
router.patch('*',(_,res)=> res.sendStatus(404))

export default router
