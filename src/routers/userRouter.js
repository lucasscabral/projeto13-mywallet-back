import { getMovimentacao } from '../controllers/userController.js'
import { Router } from 'express'

const userRouter = Router()

userRouter.get('/movimentacao', getMovimentacao)

export default userRouter
