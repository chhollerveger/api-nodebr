const { config } = require('dotenv')
const { join } = require('path')
const assert = require('assert')

const env = process.env.NODE_ENV || "dev"
assert.ok(env === "prod" || env === "dev", "o ambiente é inválido, ou dev ou prd")

const configPath = join(__dirname, '../config', `.env.${env}`)

config({ path: configPath })

const Hapi = require('@hapi/hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroiSchema')
const HeroRoute = require('./routes/heroRoutes')
const AuthRoute = require('./routes/authRoutes')
const HapiSwagger = require('hapi-swagger')
const Vision = require('@hapi/vision')
const Inert = require('@hapi/inert')
const HapiJwt = require('hapi-auth-jwt2')
const Postgres = require('./db/strategies/postgres/postgres')
const UsuarioSchema = require('./db/strategies/postgres/schemas/usuarioSchema')

const app = new Hapi.Server({
  port: process.env.PORT
})

function mapRoutes(instance, methods) {
  return methods.map(method => instance[method]())
}

async function main() {

  const connection = MongoDb.connect()
  const context = new Context(new MongoDb(connection, HeroiSchema))

  const connectionPostgres = await Postgres.connect()
  const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
  const contextPostgres = new Context(new Postgres(connectionPostgres, model))

  const swaggerOptions = {
    info: {
      title: 'API Herois - #CursoNodeBR',
      version: 'v1.0'
    },
    // lang: 'pt'
  }

  await app.register([
    HapiJwt,
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ])

  app.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_KEY,
    // options: {
    //   expiresIn: 20
    // },
    validate: async (dado, request) => {

      const [result] = await contextPostgres.read({
        username: dado.username.toLowerCase()
      })

      if (!result) {
        return { isValid: false }
      }

      return { isValid: true }
    }
  })

  app.auth.default('jwt')

  app.route([
    ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
    ...mapRoutes(new AuthRoute(process.env.JWT_KEY, contextPostgres), AuthRoute.methods())
  ])

  await app.start()
  console.log('Servidor rodando na porta:', app.info.port)

  return app
}

module.exports = main()