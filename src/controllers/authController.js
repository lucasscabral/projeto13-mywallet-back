import { v4 as uuid } from 'uuid'
import bcrypt, { compareSync, hashSync } from 'bcrypt'
import db from '../mongoDB/conexcaoMongo.js'

export async function signUp(req, res) {
  const { email, password } = res.locals.dadosCadastro
  console.log(email)
  try {
    console.log('Entrei')
    const emailUsuando = await db
      .collection('usuarios')
      .findOne({ email: email })
    console.log(emailUsuando)
    if (emailUsuando) {
      res.status(409).send('Esse email já está em uso')
      return
    }
    delete dadosCadastro.checkPassword
    const passwordCryptografada = hashSync(password, 10)
    console.log(passwordCryptografada)
    await db
      .collection('usuarios')
      .insertOne({ ...dadosCadastro, password: passwordCryptografada })

    res.sendStatus(201)
    return
  } catch (error) {
    res.sendStatus(500)
    return
  }
}

export async function signIn(req, res) {
  const dadosLogin = req.locals

  console.log(dadosLogin)
  try {
    const certificarEmailSenha = await db
      .collection('usuarios')
      .findOne({ email })
    if (!certificarEmailSenha) {
      res
        .status(401)
        .send('Email ou Senha inválido.(Caso não possua uma conta,cadastre-se)')
    }
    const buscarDadosUser = await db
      .collection('usuarios')
      .findOne({ email: dadosLogin.email })
    const passwordIdentico = compareSync(
      dadosLogin.password,
      buscarDadosUser.password
    )
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
