import {
  cadastroSchema,
  loginSchema,
  entradaSaida
} from '../validateJoi/validateUser.js'
import dotenv from 'dotenv'
dotenv.config()

export async function validateSignUp(req, res, next) {
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
  if (!(dadosCadastro.password === dadosCadastro.checkPassword)) {
    res
      .status(401)
      .send('Os campos (senha) e (confirme sennha) devem ser identicas')

    return
  }

  res.locals.dadosCadastro = dadosCadastro

  next()
}
export async function validateSignIn(req, res, next) {
  const dadosLogin = req.body
  const validou = loginSchema.validate(dadosLogin)
  if (validou.error) {
    res.status(422).send('Todos os campos são requeridos')
    return
  }
  res.locals.dadosLogin = dadosLogin

  next()
}
export async function validateMovimentacoes(req, res, next) {
  const { authorization } = req.headers
  const token = authorization?.replace('Bearer ', '')
  const dadosEntradaSaida = entradaSaida.validate(req.body)

  if (!token) return res.sendStatus(401)
  if (dadosEntradaSaida.error)
    return res.status(401).send('Todos os campos são obrigatórios')
  res.locals.token = token
  res.locals.valorSaida = req.body
  next()
}
