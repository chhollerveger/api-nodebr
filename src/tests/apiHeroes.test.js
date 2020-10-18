const assert = require('assert')
const api = require('../api')

let app = {}

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNoYXZlcyIsImlkIjoxLCJpYXQiOjE2MDI5NDI1Mjd9.hxI195iA1EGmQnVzsuDETUVV7MyO6iS_rySAhZeP2ek'

const headers = {
  Authorization: TOKEN
}

const MOCK_HEROI_CADASTRAR = {
  nome: 'Chapolin Gremista',
  poder: 'Marreta Biônica'
}

const MOCK_HEROI_INICIAL = {
  nome: 'Gavião Negro',
  poder: 'Mira'
}

let MOCK_ID = ''

describe('Suite de testes da API', function () {
  this.beforeAll(async () => {
    app = await api
    const result = await app.inject({
      method: 'POST',
      url: `/herois`,
      headers,
      payload: MOCK_HEROI_INICIAL
    })
    const dados = JSON.parse(result.payload)
    MOCK_ID = dados._id
  })

  it('listar /herois', async () => {
    const result = await app.inject({
      method: 'GET',
      headers,
      url: '/herois'
    })

    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode

    assert.deepStrictEqual(statusCode, 200)
    assert.ok(Array.isArray(dados))
  })

  it('listar /herois - deve retornar somente 10 registros', async () => {
    const TAMANO_LIMITE = 3
    const result = await app.inject({
      method: 'GET',
      headers,
      url: `/herois?skip=0&limit=${TAMANO_LIMITE}`
    })

    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode

    assert.deepStrictEqual(statusCode, 200)
    assert.ok(dados.length === TAMANO_LIMITE)
  })

  it('listar /herois - deve retornar erro sobre limit', async () => {
    const TAMANO_LIMITE = "abcd"
    const result = await app.inject({
      method: 'GET',
      headers,
      url: `/herois?skip=0&limit=${TAMANO_LIMITE}`
    })

    const errorResult = {
      "statusCode":400,"error":"Bad Request","message":"\"limit\" must be a number","validation":{"source":"query","keys":["limit"]}
    }
    assert.deepStrictEqual(result.statusCode, 400)
    assert.deepStrictEqual(result.payload, JSON.stringify(errorResult))
  })

  it('cadastrar /herois', async () =>{
    const result = await app.inject({
      method: 'POST',
      url: `/herois`,
      headers,
      payload: MOCK_HEROI_CADASTRAR
    })
  
    const { message, _id } = JSON.parse(result.payload)
    const statusCode = result.statusCode

    assert.ok(statusCode === 200)
    assert.notDeepStrictEqual(_id, undefined)
    assert.deepStrictEqual(message, "Heroi cadastrado com sucesso")
  })

  it('atualizar /herois/:id', async () =>{
    const _id = MOCK_ID
    const expected = { poder: 'Super Mira' }
    const result = await app.inject({
      method: 'PATCH',
      headers,
      url: `/herois/${_id}`,
      payload: expected
    })
  
    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode

    assert.ok(statusCode === 200)
    assert.deepStrictEqual(dados.message, "Heroi atualizado com sucesso")
  })

  it('atualizar /herois/:id - não deve atualizar', async () =>{
    const _id = `9f8a26283a1934adf902979c`
    const result = await app.inject({
      method: 'PATCH',
      headers,
      url: `/herois/${_id}`,
      payload: { poder: 'Super Mira' }
    })
  
    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode
    const expected = {
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'Id não encontrado no banco'
    }

    assert.ok(statusCode === 412)
    assert.deepStrictEqual(dados, expected)
  })

  it('remover /herois/:id', async () =>{
    const _id = MOCK_ID
    const result = await app.inject({
      method: 'DELETE',
      headers,
      url: `/herois/${_id}`
    })
  
    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode

    assert.ok(statusCode === 200)
    assert.deepStrictEqual(dados.message, "Heroi removido com sucesso")
  })

  it('remover /herois/:id - não deve remover', async () =>{
    const _id = `9f8a26283a1934adf902979c`
    const result = await app.inject({
      method: 'DELETE',
      headers,
      url: `/herois/${_id}`
    })
  
    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode
    const expected = {
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'Id não encontrado no banco'
    }

    assert.ok(statusCode === 412)
    assert.deepStrictEqual(dados, expected)
  })
})