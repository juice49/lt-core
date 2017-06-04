'use strict'

const filter = require('through2-filter')
const { parseStream } = require('./event-key')
const isStartStopEvent = require('./is-start-stop-event')

module.exports = async function getTimer ({ getDb, id }) {
  const { events } = await getDb()

  return new Promise((resolve, reject) => {
    const eventStream = events.createKeyStream({ reverse: true })
      .pipe(parseStream())
      .pipe(filter.obj(isStartStopEvent))
      .pipe(filter.obj(event => !id || event.id === id))
      .on('data', event => {
        eventStream.destroy()
        resolve(event)
      })
      .on('end', () => resolve(null))
  })
}
