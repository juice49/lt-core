'use strict'

const { EOL } = require('os')
const chalk = require('chalk')
const prettyMs = require('pretty-ms')
const boxen = require('boxen')
const list = require('../lib/list')

module.exports = async function ({ getDb, cli }) {
  const id = cli.input[1]
  const timers = await list({ getDb, id })
  const output = []

  timers
    .on('data', timer => {
      const title = timer.isRunning
        ? chalk.green.inverse(timer.id)
        : timer.id

      output.push(`${chalk.bold(title)} ${chalk.gray('•')} ${chalk.dim(prettyMs(timer.sum))}`)
    })
    .on('end', () => {
      console.log(
        boxen(output.join(EOL), {
          margin: 1,
          padding: 1,
          borderColor: 'green'
        })
      )
    })
}
