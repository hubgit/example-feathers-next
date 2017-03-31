'use strict'

// Initializes the `articles` service on path `/articles`
const createService = require('feathers-mongoose')
const createModel = require('../../models/articles.model')
const hooks = require('./articles.hooks')
const filters = require('./articles.filters')

module.exports = function () {
  const app = this
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    name: 'articles',
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/articles', createService(options))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('articles')

  service.hooks(hooks)

  if (service.filter) {
    service.filter(filters)
  }
}
