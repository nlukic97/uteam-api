import express from 'express'
const router = express.Router()

// Auth middleware
import AuthMiddleware from '../middleware/auth/Authenticate'

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
router.put('/profiles/:id', ProfileUpdateValidation, ProfileController.updateProfile) // profile update validation middleware
router.delete('/profiles/:id', ProfileController.deleteProfile)

// User routes
router.get('/countAllUsers', AuthMiddleware, UserController.countAllUsers) //auth middleware
router.post('/register', RegisterValidaton, UserController.register) // register validation middleware
router.post('/login', LoginValidation, UserController.login) // login validation middleware

// Company routes
router.get('/companies',CompanyController.getCompanies)
router.post('/companies', CompanyInsertValidation, CompanyController.insertNewCompany) // company insert validation middleware
router.get('/companies/:id',CompanyController.getCompanyById)
router.put('/companies/:id',CompanyUpdateValidation, CompanyController.updateCompany) // company update validation middleware
router.delete('/companies/:id',CompanyController.deleteCompany)

// 404 errors for POST, PUT, and DELETE - Keep these routes at the bottom of this router page
router.get('*', AppController.wildcard) // AppController routes
router.post('*',(_,res)=> res.sendStatus(404))
router.put('*',(_,res)=> res.sendStatus(404))
router.delete('*',(_,res)=> res.sendStatus(404))
router.patch('*',(_,res)=> res.sendStatus(404))

export default router
