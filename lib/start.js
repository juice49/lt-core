'use strict'

const getTimer = require('../lib/get-timer')
const { parse } = require('../lib/event-key')
const execute = require('../lib/execute')
const { START_TIMER, STOP_TIMER, NOOP } = require('../actions')

module.exports = async function start ({ getDb, id, afterClose = () => {} }) {
  const timer = await getTimer({ getDb })
  const actions = []

  const running = (
    timer &&
    parse(timer, 'event') === START_TIMER
  )

  const specifiedTimerRunning = (
    running &&
    parse(timer, 'id') === id
  )

  if (!id && !timer) {
    actions.push({
      type: NOOP,
      payload: {
        message: `There isn't a timer to resume. Please provide a timer id to start a new one.`
      }
    })
  }

  if (!id && running) {
    actions.push({
      type: NOOP,
      payload: {
        message: `Timer ${parse(timer, 'id')} is already running.`
      }
    })
  }

  if (!id && timer && !running) {
    actions.push({
      type: START_TIMER,
      payload: {
        id: parse(timer, 'id'),
        message: `Resumed timer ${parse(timer, 'id')}.`
      }
    })
  }

  if (id && timer && !specifiedTimerRunning && running) {
    actions.push({
      type: STOP_TIMER,
      payload: {
        id: parse(timer, 'id'),
        message: `Stopped timer ${parse(timer, 'id')}.`
      }
    })
  }

  if (id && specifiedTimerRunning) {
    actions.push({
      type: NOOP,
      payload: {
        message: `Timer ${id} is already running.`
      }
    })
  }

  if (id && !specifiedTimerRunning) {
    actions.push({
      type: START_TIMER,
      payload: {
        message: `Started timer ${id}.`,
        id
      }
    })
  }

  await execute({
    getDb,
    actions,
    afterClose
  })

  return actions
}
