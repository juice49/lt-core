'use strict'

const fun = require('funstream')
const getEvents = require('./get-events')
const { createStream } = require('./event-key')
const execute = require('./execute')
const { REMOVE_EVENT } = require('../actions')

module.exports = async function remove ({ getDb, id, afterClose = () => {} }) {
  const matches = await getEvents({ getDb, id })

  const operations = await matches
    .pipe(createStream())
    .pipe(fun())
    .map(key => ({
      type: 'del',
      key
    }))
    .list()

  const actions = operations.map(({ key }) => ({
    type: REMOVE_EVENT,
    payload: {
      key
    }
  }))

  await execute({
    getDb,
    operations,
    afterClose
  })

  return actions
}
