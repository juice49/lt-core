'use strict'

const getTimer = require('../lib/get-timer')
const execute = require('../lib/execute')
const { STOP_TIMER, START_TIMER, NOOP } = require('../actions')

module.exports = async function stop ({ getDb, afterClose = () => {} }) {
  const timer = await getTimer({ getDb })
  const running = timer && timer.event === START_TIMER
  const actions = []

  if (running) {
    actions.push({
      type: STOP_TIMER,
      payload: {
        id: timer.id,
        message: `Stopped timer ${timer.id}.`
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
