'use strict'

const getTimer = require('../lib/get-timer')
const { parse } = require('../lib/event-key')
const execute = require('../lib/execute')
const { STOP_TIMER, START_TIMER, NOOP } = require('../actions')

module.exports = async function stop ({ getDb, afterClose = () => {} }) {
  const timer = await getTimer({ getDb })
  const running = timer && parse(timer, 'event') === START_TIMER
  const actions = []

  if (running) {
    actions.push({
      type: STOP_TIMER,
      payload: {
        id: parse(timer, 'id'),
        message: `Stopped timer ${parse(timer, 'id')}.`
      }
    })
  }

  if (!running) {
    actions.push({
      type: NOOP,
      payload: {
        message: `There isn't a timer to stop.`
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
