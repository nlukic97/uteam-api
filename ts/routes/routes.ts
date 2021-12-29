import express from 'express'
const router = express.Router()

/** Controller imports */
import AppController from '../controllers/App.controller'
import UserController from '../controllers/User.controller'

// User routes
router.get('/getAllUsers', UserController.getAllUsers)
router.post('/register', UserController.register)
router.post('/login',UserController.login)

// AppController routes
router.get('*', AppController.wildcard)

export default router
