import express from 'express'
const router = express.Router()

import passport from 'passport'

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


// 1. --------- --------- --------- Profile routes
router.get('/profiles', ProfileController.getProfiles)
router.get('/profiles/:id', ProfileController.getProfileById)
router.post('/profiles', passport.authenticate('jwt',{session:false}), ProfileInsertValidation, ProfileController.insertNewProfile) // validation middleware!
router.put('/profiles/:id', passport.authenticate('jwt',{session:false}), ProfileUpdateValidation, ProfileController.updateProfile) // validation middleware!
router.delete('/profiles/:id', passport.authenticate('jwt',{session:false}), ProfileController.deleteProfile)

// 2. --------- --------- ---------  User routes
router.get('/countAllUsers', UserController.countAllUsers)
router.post('/register', RegisterValidaton, UserController.register)
router.post('/login', LoginValidation, passport.authenticate('local',{session:false}), UserController.login)

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
