import {
  getMovimentacao,
  postEntrada,
  postSaida
} from '../controllers/userController.js'
import { validateMovimentacoes } from '../middlewares/userValidationMiddlewares.js'
import { Router } from 'express'

const userRouter = Router()

userRouter.get('/movimentacao', getMovimentacao)
userRouter.post('/entrada', validateMovimentacoes, postEntrada)
userRouter.post('/saida', validateMovimentacoes, postSaida)

export default userRouter
