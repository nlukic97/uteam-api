import express from 'express'
const router = express.Router()

import AuthMiddleware from '../middleware/Authenticate'

/** Controller imports */
import ProfileController from '../controllers/Profile.controller'
import UserController from '../controllers/User.controller'
import AppController from '../controllers/App.controller'

// Profile routes
router.get('/profiles', ProfileController.getProfiles)
router.get('/profiles/:id', ProfileController.getProfileById)
router.post('/profiles', ProfileController.insertNewProfile)

// User routes
router.get('/countAllUsers', AuthMiddleware, UserController.countAllUsers) //using the auth middleware
router.post('/register', UserController.register)
router.post('/login',UserController.login)

// AppController routes
router.get('*', AppController.wildcard)

export default router
