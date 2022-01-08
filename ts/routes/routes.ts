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
router.put('/profiles/:id', ProfileController.updateProfile)
router.delete('/profiles/:id', ProfileController.deleteProfile)

// User routes
router.get('/countAllUsers', AuthMiddleware, UserController.countAllUsers) //using the auth middleware
router.post('/register', UserController.register)
router.post('/login', UserController.login)

// AppController routes
router.get('*', AppController.wildcard)

// 404 errors for POST, PUT, and DELETE - Keep these routes at the bottom of this router page
router.post('*',(_,res)=> res.sendStatus(404))
router.put('*',(_,res)=> res.sendStatus(404))
router.delete('*',(_,res)=> res.sendStatus(404))
router.patch('*',(_,res)=> res.sendStatus(404))

export default router
