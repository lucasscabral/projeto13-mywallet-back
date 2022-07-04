import { v4 as uuid } from 'uuid'
import bcrypt, { compareSync, hashSync } from 'bcrypt'
import { db } from '../mongoDB/conexcaoMongo.js'

export async function signUp(req, res) {
  const { email, password } = res.locals.dadosCadastro

  try {
    const emailUsado = await db.collection('usuarios').findOne({ email: email })
    if (emailUsado) {
      res.status(409).send('Esse email já está em uso')
      return
    }
    delete res.locals.dadosCadastro.checkPassword
    const passwordCryptografada = hashSync(password, 10)
    await db.collection('usuarios').insertOne({
      ...res.locals.dadosCadastro,
      password: passwordCryptografada
    })

    res.sendStatus(201)
    return
  } catch (error) {
    res.sendStatus(500)
    return
  }
}

export async function signIn(req, res) {
  const { email, password } = res.locals.dadosLogin
  try {
    const certificarEmailSenha = await db
      .collection('usuarios')
      .findOne({ email })
    if (!certificarEmailSenha) {
      res
        .status(401)
        .send('Email ou Senha inválido.(Caso não possua uma conta,cadastre-se)')
    }
    const buscarDadosUser = await db.collection('usuarios').findOne({ email })
    const passwordIdentico = compareSync(password, buscarDadosUser.password)
    if (passwordIdentico) {
      const token = uuid()
      await db
        .collection('sessions')
        .insertOne({ token, userId: buscarDadosUser._id })
      delete buscarDadosUser.email
      delete buscarDadosUser.password
      res.send({ ...buscarDadosUser, token })
      return
    } else {
      res
        .status(401)
        .send('Email ou Senha inválido.(Caso não possua uma conta,cadastre-se)')
      return
    }
  } catch (error) {}
}
