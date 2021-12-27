import express from 'express'
const router = express.Router()

/** Controller imports */
import AppController from '../controllers/App.controller'
import UserController from '../controllers/User.controller'

// AppController routes
router.get('*', AppController.wildcard)

// User routes
router.get('/getAllUsers', UserController.getAllUsers)
router.post('/insertNewUser', UserController.insertNewUser)

export default router
