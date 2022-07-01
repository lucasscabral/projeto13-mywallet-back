import { MongoClient, ObjectId } from 'mongodb'
import joi from 'joi'
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()

const mongoClient = new MongoClient(process.env.MONGO_URI)
let db

mongoClient.connect().then(() => {
  db = mongoClient.db('MyWalletDB')
})

export async function getMovimentacao(req, res) {
  const { authorization } = req.headers
  const token = authorization?.replace('Bearer ', '')

  if (!token) return res.sendStatus(401)

  try {
    const session = await db.collections('sessions').findOne({ token })

    if (!session) {
      return res.sendStatus(401)
    }

    const user = await db.collections('users').findOne({
      _id: session.userId
    })

    if (user) {
      // ...
    } else {
      res.sendStatus(401)
    }
  } catch (error) {}
}
