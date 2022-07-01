import { signUp, signIn } from '../controllers/authController.js'
import { Router } from 'express'
import {
  validateSignUp,
  validateSignIn
} from '../middlewares/userValidationMiddlewares.js'

const authRouter = Router()
authRouter.post('/cadastro', validateSignUp, signUp)
authRouter.post('/login', validateSignIn, signIn)

export default authRouter
