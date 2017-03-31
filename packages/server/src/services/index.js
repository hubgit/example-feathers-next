'use strict'

const articles = require('./articles/articles.service.js')

module.exports = function () {
  const app = this // eslint-disable-line no-unused-vars
  app.configure(articles)
}
