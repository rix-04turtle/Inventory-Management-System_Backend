import express from 'express'
import userSignUp from './userSignUp.js'
import userLogin from './userLogin.js'
import authMiddleware from '../../middleware/authMiddleware.js'
import { getUserCart, updateUserCart } from './cart.js'
import myAuth from './me.js'


const userRoutes = express()

userRoutes.post('/signup', userSignUp)

userRoutes.post('/login', userLogin)

userRoutes.get('/me', authMiddleware, myAuth)

userRoutes.get('/cart', authMiddleware, getUserCart)
userRoutes.post('/cart', authMiddleware, updateUserCart)

// BASE URL : /user

export default userRoutes
