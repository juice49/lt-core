'use strict'

const through2 = require('through2')
const map = require('through2-map')
const findLast = require('lodash.findlast')
const { parse } = require('./event-key')
const isStartStopEvent = require('./is-start-stop-event')
const { START_TIMER, STOP_TIMER, ADJUST_TIMER } = require('../actions')

module.exports = async function list ({ getDb, id }) {
  const { events } = await getDb()

  return events.createReadStream()
    .pipe(map.obj(({ key, value }) => Object.assign({},
      parse(key),
      { value }
    )))
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
    const finalEvent = findLast(chunk, isStartStopEvent)
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
        switch (event.event) {
          case START_TIMER:
            reduced.start = event.time
            return reduced
          case STOP_TIMER:
            return Object.assign(reduced, {
              sum: reduced.sum + (
                new Date(event.time) -
                new Date(reduced.start)
              ),
              start: null
            })
          case ADJUST_TIMER:
            return Object.assign(reduced, {
              sum: [ reduced.sum, event.value ]
                .reduce(
                  (sum, value) =>
                    sum + parseInt(value, 10),
                  0
                )
            })
        }

        throw new Error(`Unexpected event type "${event.event}".`)
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
