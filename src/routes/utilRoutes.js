const BaseRoute = require('./base/baseRoute')
const { join } = require('path')

class utilRoutes extends BaseRoute {

    coverage() {
      return {
        path: '/coverage/{param*}',
        method: 'GET',
        config: {
          auth: false
        },
        handler: {
          directory: {
            path: join(__dirname, '../../coverage'),
            index: ['index.html', 'default.html'],
            redirectToSlash: true
          }
        }
      }
    }
}

module.exports = utilRoutes