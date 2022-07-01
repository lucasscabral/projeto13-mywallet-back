import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { signUp, signIn } from './controllers/authController.js'
import { getMovimentacao } from './controllers/userController.js'

dotenv.config()
const server = express()
server.use(cors())
server.use(express.json())

server.post('/cadastro', signUp)
server.post('/login', signIn)

server.get('/movimentacao', getMovimentacao)

const PORT = process.env.PORT
server.listen(PORT, () => console.log('servidor funfando'))
