import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import router from './routers/index.js'

dotenv.config()
const server = express()
server.use(cors())
server.use(express.json())

server.use(router)

const PORT = process.env.PORT
server.listen(PORT, () => console.log('servidor funfando'))
