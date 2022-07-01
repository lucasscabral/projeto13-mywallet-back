import { cadastroSchema, loginSchema } from '../validateJoi/validateUser.js'

export async function validateSignUp(req, res, next) {
  const dadosCadastro = req.body
  console.log(dadosCadastro)
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

export default { validateSignUp, validateSignIn }
