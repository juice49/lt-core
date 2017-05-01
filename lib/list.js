'use strict'

const through2 = require('through2')
const { parseStream } = require('./event-key')
const { START_TIMER, STOP_TIMER } = require('../actions')

module.exports = async function list ({ getDb, id }) {
  const { events } = await getDb()

  return events.createKeyStream()
    .pipe(parseStream)
    .pipe(group(id))
    .pipe(sum())
}

function group (id) {
  const timers = {}

  return through2.obj(
    function (chunk, enc, next) {
      if (id && chunk.id !== id) {
        next()
        return
      }
      if (!timers[chunk.id]) {
        timers[chunk.id] = []
      }
      timers[chunk.id].push(chunk)
      next()
    },
    function (next) {
      Object.keys(timers)
        .forEach(group => this.push(timers[group]))
      next()
    }
  )
}

function sum () {
  return through2.obj(function (chunk, enc, next) {
    const finalEvent = chunk[chunk.length - 1]
    let isRunning = false

    if (finalEvent.event === START_TIMER) {
      isRunning = true

      chunk.push({
        id: finalEvent.id,
        event: STOP_TIMER,
        time: new Date().toISOString()
      })
    }

    this.push(
      chunk.reduce((reduced, event) => {
        if (event.event === START_TIMER) {
          reduced.start = event.time
          return reduced
        }

        if (event.event === STOP_TIMER) {
          return Object.assign(reduced, {
            sum: reduced.sum + (
              new Date(event.time) -
              new Date(reduced.start)
            ),
            start: null
          })
        }
      }, {
        id: finalEvent.id,
        start: null,
        sum: 0,
        isRunning
      })
    )
    next()
  })
}
