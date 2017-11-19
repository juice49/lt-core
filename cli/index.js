#!/usr/bin/env node
'use strict'

const path = require('path')
const meow = require('meow')
const envPaths = require('env-paths')
const chalk = require('chalk')
const paths = envPaths('lt')
const getDb = require('../lib/get-db')(path.join(paths.data, 'db'))

const commands = [
  'start',
  'stop',
  'add',
  'subtract',
  'rm',
  'ls',
  'log'
]

const cli = meow(`
  Usage
    $ lt
    $ lt start [$id]
    $ lt stop
    $ lt add $id $value
    $ lt subtract $id $value
    $ lt rm [$id]
    $ lt ls [$id]
    $ lt log
`)

const command = cli.input[0]
const commandExists = command && commands.includes(command)

const logError = message =>
  console.error(chalk.red(message))

if (!commandExists) {
  logError(`${command} is not a valid command.`)
}

if (commandExists) {
  (async () => {
    try {
      await require(`./${command}`)({ getDb, cli })
    } catch (err) {
      logError(err.message)
    }
  })()
}

if (!commandExists) {
  console.log(cli.help)
}
