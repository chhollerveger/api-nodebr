const assert = require('assert')
const api = require('../api')
const Context = require('./../db/strategies/base/contextStrategy')
const Postgres = require('./../db/strategies/postgres/postgres')
const UsuarioSchema = require('./../db/strategies/postgres/schemas/usuarioSchema')

let app = {}

const USER = {
  username: 'chaves',
  password: '123'
}

const USER_DB = {
  ...USER,
  password: '$2b$04$FVJsNPVeae6FZMoCJ8cOMepuJVfKQ7/xTKi6MOSaLJKWYjQ/XwGeW'
}

describe('Auth test suite', function  () {
  this.beforeAll(async () => {
    app = await api

    const connectionPostgres = await Postgres.connect()
    const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
    const postgres = new Context(new Postgres(connectionPostgres, model))
    await postgres.update(null, USER_DB, true)
  })

  it('deve obter um token', async () => {
    const result = await app.inject({
      method: 'POST',
      url: `/login`,
      payload: USER
    })

    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode

    assert.deepStrictEqual(statusCode, 200)
    assert.ok(dados.token.length > 10)
  })

  it('deve retornar uma mensagem de erro sobre o usuario', async () => {
    const result = await app.inject({
      method: 'POST',
      url: `/login`,
      payload: {
        username: 'carloshenrique',
        password: '123456'
      }
    })

    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode

    assert.deepStrictEqual(statusCode, 401)
    assert.ok(dados.message, "O usuário informado não existe!")
  })

  it('deve retornar uma mensagem de erro sobre a senha', async () => {
    const result = await app.inject({
      method: 'POST',
      url: `/login`,
      payload: {
        ...USER,
        password: "gremio1903"
      }
    })

    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode

    assert.deepStrictEqual(statusCode, 401)
    assert.ok(dados.message, "Senha inválida!")
  })
})