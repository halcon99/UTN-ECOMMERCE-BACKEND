import express from 'express'
import { forgotPasswordController, loginController, recoveryPasswordController, registerController, verifyEmailController } from '../controllers/auth.controller.js'

const authRouter= express.Router()

authRouter.post('/register', registerController)

authRouter.get('/verify-email/:validation_token', verifyEmailController)

authRouter.post('/login', loginController)

authRouter.post('/forgot-password', forgotPasswordController)

authRouter.put('/recovery-password', recoveryPasswordController)

export default authRouter
