'use strict'

const { prompt } = require('inquirer')
const remove = require('../lib/remove')

module.exports = async function ({ getDb, cli }) {
  const id = cli.input[1]
  const all = typeof id === 'undefined'
  const force = cli.flags.f

  if (!force) {
    const { confirm } = await prompt([
      {
        name: 'confirm',
        type: 'confirm',
        message: all
          ? 'Remove all timers?'
          : `Remove timer "${id}"?`
      }
    ])

    if (!confirm) {
      return
    }
  }

  const actions = await remove({ getDb, id })

  if (actions.length === 0) {
    throw new Error(`Timer "${id}" does not exist.`)
  }

  if (all) {
    console.log('Removed all timers.')
    return
  }

  console.log(`Removed timer "${id}".`)
}
