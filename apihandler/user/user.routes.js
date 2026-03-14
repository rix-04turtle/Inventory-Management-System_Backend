import express from 'express'
import userSignUp from './userSignUp.js'


const userRoutes = express()

userRoutes.post('/signup', userSignUp)


// BASE URL : /user

export default userRoutes
