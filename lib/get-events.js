'use strict'

const filter = require('through2-filter')
const { parseStream } = require('./event-key')

module.exports = async function getEvents ({ getDb, id }) {
  const { main } = await getDb()

  return main.createKeyStream({ gte: [ 'events' ], lte: [ 'events', undefined ] })
    .pipe(parseStream())
    .pipe(filter.obj(event => !id || event.id === id))
}
