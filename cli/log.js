'use strict'

const { EOL } = require('os')
const fun = require('funstream')
const formatDate = require('date-fns/format')
const chalk = require('chalk')
const prettyMs = require('pretty-ms')
const { START_TIMER, STOP_TIMER, ADJUST_TIMER } = require('../actions')
const { parse } = require('../lib/event-key')

const strings = {
  [START_TIMER]: chalk.green`[start]`,
  [STOP_TIMER]: chalk.yellow`[stop]`,
  [ADJUST_TIMER]: chalk.magenta`[adjust]`
}

module.exports = async function log ({ getDb, cli }) {
  const { main } = await getDb()

  const events = main.createReadStream({
    reverse: true,
    gte: [ 'events' ],
    lte: [ 'events', undefined ]
  })

  await fun(events)
    .map(format)
    .pipe(process.stdout)
}

function format ({ key, value }) {
  const { id, event, time } = parse(key)

  const label = [
    chalk.dim(formatDate(time, 'DD/MM/YY HH:mm:ss')),
    strings[event],
    chalk.bold(id)
  ].join(' ')

  return [ label, formatValue(parseValue(value)) ]
    .filter(data => typeof data !== 'undefined')
    .join(' ') + EOL
}

function formatValue (value) {
  if (typeof value === 'undefined') {
    return
  }

  return chalk.dim.italic(value.sign + value.pretty)
}

function parseValue (value) {
  if (value.length === 0) {
    return
  }

  return {
    pretty: prettyMs(Math.abs(value)),
    sign: value < 0
      ? '-'
      : '+'
  }
}
