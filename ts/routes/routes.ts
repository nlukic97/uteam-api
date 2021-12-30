import express from 'express'
const router = express.Router()

import AuthMiddleware from '../middleware/Authenticate'

/** Controller imports */
import AppController from '../controllers/App.controller'
import UserController from '../controllers/User.controller'

// User routes
router.get('/getAllUsers', AuthMiddleware, UserController.getAllUsers) //using the auth middleware
router.post('/register', UserController.register)
router.post('/login',UserController.login)

// AppController routes
router.get('*', AppController.wildcard)

export default router
