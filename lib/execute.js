'use strict'

const level = require('level')
const { create } = require('../lib/event-key')

module.exports = async function execute ({ getDb, actions, afterClose = () => {} }) {
  const { events, close } = await getDb()

  const operations = actions
    .filter(({ payload }) => typeof payload.id !== 'undefined')
    .map((action, order) => ({
      type: 'put',
      key: create({
        id: action.payload.id,
        event: action.type,
        order
      }),
      value: action.payload.value
    }))

  return new Promise((resolve, reject) => {
    events.batch(operations, err => {
      close(closeErr => {
        afterClose(closeErr)

        err
          ? reject(err)
          : resolve()
      })
    })
  })
}
