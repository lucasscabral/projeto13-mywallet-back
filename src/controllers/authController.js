import { MongoClient, ObjectId } from 'mongodb'
import joi from 'joi'
import { v4 as uuid } from 'uuid'
import bcrypt, { compareSync, hashSync } from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()

const mongoClient = new MongoClient(process.env.MONGO_URI)
let db

mongoClient.connect().then(() => {
  db = mongoClient.db('MyWalletDB')
})

const cadastroSchema = joi.object({
  email: joi
    .string()
    .email()
    .pattern(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i)
    .required(),
  name: joi.string().required(),
  password: joi.required(),
  checkPassword: joi.required()
})

const loginSchema = joi.object({
  email: joi
    .string()
    .email()
    .pattern(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i)
    .required(),
  password: joi.required()
})

export async function signUp(req, res) {
  const dadosCadastro = req.body
  const validou = cadastroSchema.validate(dadosCadastro)
  if (validou.error) {
    res
      .status(422)
      .send(
        'Todos os campos são requeridos e certifique-se de que o email é válido'
      )
    return
  }
  if (!(dadosCadastro.password === dadosCadastro.checkPassword))
    return res
      .status(401)
      .send('Os campos (senha) e (confirme sennha) devem ser identicas')
  try {
    const emailUsuando = await db
      .collection('usuarios')
      .findOne({ email: dadosCadastro.email })
    if (emailUsuando) {
      res.status(409).send('Esse email já está em uso')
      return
    }
    delete dadosCadastro.checkPassword
    const passwordCryptografada = hashSync(dadosCadastro.password, 10)

    await db
      .collection('usuarios')
      .insertOne({ ...dadosCadastro, password: passwordCryptografada })

    res.sendStatus(201)
  } catch (error) {
    res.sendStatus(500)
  }
}

export async function signIn(req, res) {
  console.log(req.body)
  const { email, password } = req.body
  const validou = loginSchema.validate({ email, password })
  if (validou.error) {
    res.status(422).send('Todos os campos são requeridos')
    return
  }
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
