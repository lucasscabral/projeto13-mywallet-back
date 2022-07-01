import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'

import db from '../mongoDB/conexcaoMongo.js'

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
