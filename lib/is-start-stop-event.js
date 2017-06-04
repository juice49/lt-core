'use strict'

const { START_TIMER, STOP_TIMER } = require('../actions')

module.exports = ({ event }) =>
  [ START_TIMER, STOP_TIMER ].includes(event)
