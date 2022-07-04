import joi from 'joi'

export const cadastroSchema = joi.object({
  email: joi
    .string()
    .email()
    .pattern(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i)
    .required(),
  name: joi.string().required(),
  password: joi.required(),
  checkPassword: joi.required()
})

export const loginSchema = joi.object({
  email: joi
    .string()
    .email()
    .pattern(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i)
    .required(),
  password: joi.required()
})

export const entradaSaida = joi.object({
  valor: joi.number().required(),
  descricao: joi.string().required()
})

export default { cadastroSchema, loginSchema, entradaSaida }
