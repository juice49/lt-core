#!/usr/bin/env node
'use strict'

const path = require('path')
const meow = require('meow')
const envPaths = require('env-paths')
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

if (!commandExists) {
  console.log(`${command} is not a valid command`)
}

if (commandExists) {
  try {
    require(`./${command}`)({ getDb, cli })
  } catch (err) {
    console.log('foo', err.message)
  }
}

if (!commandExists) {
  console.log(cli.help)
}
