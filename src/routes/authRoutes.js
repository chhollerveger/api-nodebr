const BaseRoute = require('./base/baseRoute')
const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const Jwt = require('jsonwebtoken')
const PasswordHelper = require('./../helpers/passwordHelper')

const failAction = (request, headers, erro) => {
  throw erro
}

const USER = {
  username: 'chaves',
  password: '1234'
}

class AuthRoutes extends BaseRoute {
  constructor(secret, db) {
    super()
    this.secret = secret
    this.db = db
  }

  login() {

    return {
      path: '/login',
      method: 'POST',
      config: {
        auth: false,
        tags: ['api'],
        description: 'Deve obter token',
        notes: 'Faz login com usuario e senha do banco',
        validate: {
          failAction,
          payload: Joi.object({
            username: Joi.string().required().min(3).max(100),
            password: Joi.string().required().min(2).max(100),
          })
        }
      },
      handler: async (request) => {

        const { username, password } = request.payload

        // if (username.toLowerCase() !== USER.username || password !== USER.password) {
        //   return Boom.unauthorized()
        // }

        const [usuario] = await this.db.read({
          username: username.toLowerCase()
        })

        if (!usuario) {
          return Boom.unauthorized('O usuário informado não existe!')
        }

        const match = await PasswordHelper.comparePassword(password, usuario.password)

        if (!match) {
          return Boom.unauthorized('Senha inválida!')
        }

        const token = Jwt.sign({
          username: username,
          id: usuario.id
        }, this.secret)

        return { token }
      }
    }
  }
}

module.exports = AuthRoutes