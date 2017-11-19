'use strict'

const ms = require('parse-duration')
const getTimer = require('./get-timer')
const execute = require('./execute')
const { ADJUST_TIMER } = require('../actions')

module.exports = async function adjust ({ getDb, id, value, scale = 1, afterClose = () => {} }) {
  const actions = []

  if (!id) {
    throw new Error(`You must specify the timer id to adjust.`)
  }

  if (!value) {
    throw new Error(`You must specify the value to adjust the timer by.`)
  }

  if (typeof value === 'number') {
    throw new Error(`You must specify a unit. For example: "${value}h".`)
  }

  const timer = await getTimer({ id, getDb })

  actions.push({
    type: ADJUST_TIMER,
    payload: {
      message: `Adjusted timer ${id}.`,
      value: ms(value) * scale,
      id
    }
  })

  await execute({
    getDb,
    actions,
    afterClose
  })

  if (timer === null) {
    throw new Error(`Timer "${id}" does not exist.`)
  }

  return actions
}
