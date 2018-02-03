'use strict'

const fun = require('funstream')
const chalk = require('chalk')
const prettyMs = require('pretty-ms')
const boxen = require('boxen')
const table = require('text-table')
const stripAnsi = require('strip-ansi')
const list = require('../lib/list')

module.exports = async function ({ getDb, cli }) {
  const id = cli.input[1]
  const timers = await list({ getDb, id })

  const rows = await timers
    .pipe(fun())
    .map(formatTimer)
    .list()

  console.log(formatOutput(formatTable(rows)))
}

function formatTimer (timer) {
  const title = timer.isRunning
    ? chalk.green.inverse(timer.id)
    : timer.id

  const formattedSum = prettyMs(timer.sum, {
    secDecimalDigits: 0
  })

  return [
    chalk.bold(title),
    timer.isRunning
      ? chalk.bold(formattedSum)
      : chalk.dim(formattedSum)
  ]
}

function formatTable (rows) {
  return table(rows, {
    stringLength: string => stripAnsi(string).length
  })
}

function formatOutput (output) {
  return boxen(output, {
    margin: 1,
    padding: 1,
    borderColor: 'green'
  })
}
