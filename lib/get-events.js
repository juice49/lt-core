'use strict'

const filter = require('through2-filter')
const { parseStream } = require('./event-key')

module.exports = async function getEvents ({ getDb, id }) {
  const { events } = await getDb()

  return events.createKeyStream()
    .pipe(parseStream())
    .pipe(filter.obj(event => !id || event.id === id))
}
