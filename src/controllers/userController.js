import { db } from '../mongoDB/conexcaoMongo.js'
import dayjs from 'dayjs'

export async function getMovimentacao(req, res) {
  const { authorization } = req.headers
  const token = authorization?.replace('Bearer ', '')

  if (!token) return res.sendStatus(401)
  try {
    const session = await db.collection('sessions').findOne({ token })

    if (!session) {
      return res.sendStatus(401)
    }

    const user = await db.collection('usuarios').findOne({
      _id: session.userId
    })

    if (user) {
      const todasMovimentacoes = await db
        .collection('movimentacoes')
        .find({ emailUser: user.email })
        .toArray()
      res.status(200).send(todasMovimentacoes)
      return
    } else {
      res.sendStatus(401)
      return
    }
  } catch (error) {}
}
export async function postEntrada(req, res) {
  const token = res.locals.token
  try {
    const session = await db.collection('sessions').findOne({ token })

    if (!session) {
      return res.status(401).send('Transação não autorizada')
    }

    const user = await db.collection('usuarios').findOne({
      _id: session.userId
    })

    if (user) {
      await db.collection('movimentacoes').insertOne({
        ...req.body,
        tipo: 'entrada',
        data: dayjs().format('DD/MM'),
        emailUser: user.email
      })
      res.status(201).send('Transação bem sucedida')
      return
    } else {
      res.status(401).send('Não autorizado')
      return
    }
  } catch (error) {}
}
export async function postSaida(req, res) {
  const token = res.locals.token

  try {
    const session = await db.collection('sessions').findOne({ token })

    if (!session) {
      return res.sendStatus(401)
    }

    const user = await db.collection('usuarios').findOne({
      _id: session.userId
    })

    if (!user) {
      res.sendStatus(401)
      return
    }

    const valorSaida = res.locals.valorSaida
    const valoresMovimentacoes = await db
      .collection('movimentacoes')
      .find({ emailUser: user.email })
      .toArray()
    let valoresEntradas = 0
    const filtrarValores = valoresMovimentacoes.filter(valor => {
      if (valor.tipo === 'entrada') {
        valoresEntradas += Number(valor.valor)
      }
    })
    if (valoresEntradas.toFixed(2) - Number(valorSaida.valor).toFixed(2) <= 0) {
      res.status(401).send('Saldo Insuficiente!')
      return
    }

    await db.collection('movimentacoes').insertOne({
      ...req.body,
      tipo: 'saida',
      data: dayjs().format('DD/MM'),
      emailUser: user.email
    })
    res.sendStatus(201)
    return
  } catch (error) {}
}
