import express from 'express'
const router = express.Router()

import passport from 'passport'
import jwt from 'jsonwebtoken'

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


// POST method jwt auth middleware - if this is uncommented, no need to directly import the jwt auth, but still testing this
/* router.use(['/profiles','/companies'],(req,res,next)=>{   
    if(req.method === "POST") return passport.authenticate('jwt',{session:false})(req,res,next)
    return next()
})
// PUT method jwt auth middleware
router.use(['/profiles/:id','/companies/:id'],(req,res,next)=>{   
    if(req.method === "PUT") return passport.authenticate('jwt',{session:false})(req,res,next)
    return next()
}) */



// 1. --------- --------- --------- Profile routes
router.get('/profiles', ProfileController.getProfiles)
router.get('/profiles/:id', ProfileController.getProfileById)
router.post('/profiles', passport.authenticate('jwt',{session:false}), ProfileInsertValidation, ProfileController.insertNewProfile) // validation middleware!
router.put('/profiles/:id', passport.authenticate('jwt',{session:false}), ProfileUpdateValidation, ProfileController.updateProfile) // validation middleware!
router.delete('/profiles/:id', passport.authenticate('jwt',{session:false}), ProfileController.deleteProfile)

// 2. --------- --------- ---------  User routes
router.get('/countAllUsers', UserController.countAllUsers)
// router.post('/register', RegisterValidaton, UserController.register)
router.post('/register', UserController.register)

router.post('/login', LoginValidation, passport.authenticate('local',{session:false}), async (req,res)=>{
    if(req.isAuthenticated()){
        const accessToken: string | undefined = await jwt.sign({username: req.user.username}, process.env.ACCESS_TOKEN_SECRET)
        return res.status(200).json({message:'User is authenticated.',token:accessToken})
    }
    return res.sendStatus(401) //added this just as a failsafe since passport will handle it
})

// 3. --------- --------- --------- Company routes
router.get('/companies',CompanyController.getCompanies)
router.post('/companies', passport.authenticate('jwt',{session:false}), CompanyInsertValidation, CompanyController.insertNewCompany) // validation middleware!
router.get('/companies/:id',CompanyController.getCompanyById)
router.put('/companies/:id', passport.authenticate('jwt',{session:false}), CompanyUpdateValidation, CompanyController.updateCompany) // validation middleware!
router.delete('/companies/:id',passport.authenticate('jwt',{session:false}), CompanyController.deleteCompany)

// 4. --------- --------- --------- 404 errors for POST, PUT, and DELETE - !!Keep these routes at the bottom of this router page!!
router.get('*', AppController.wildcard) // AppController routes - requests to any non defined GET request will return a message
router.post('*',(_,res)=> res.sendStatus(404))
router.put('*',(_,res)=> res.sendStatus(404))
router.delete('*',(_,res)=> res.sendStatus(404))
router.patch('*',(_,res)=> res.sendStatus(404))

export default router
