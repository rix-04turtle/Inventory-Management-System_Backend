import express from 'express'
import userSignUp from './userSignUp.js'
import userLogin from './userLogin.js'


const userRoutes = express()

userRoutes.post('/signup', userSignUp)

userRoutes.post('/login', userLogin)


// BASE URL : /user

export default userRoutes
