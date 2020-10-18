const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = 'Carlos@123'
const HASH = '$2b$04$p1vBJaHOvy6nay18eZtuk.MFRnySSFtUziNpwxNceKF0j.VGGJ6L.'

describe('UserHelper test suite', function () {
  
  it('deve gerar um hash a partir de uma senha', async () => {
    const result = await PasswordHelper.hashPassword(SENHA)

    assert.ok(result.length > 10)
  })

  it('deve comparar uma senha e seu hash', async () => {
    const result = await PasswordHelper.comparePassword(SENHA, HASH)

    assert.ok(result)
  })
})