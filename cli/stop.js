'use strict'

const stop = require('../lib/stop')

module.exports = async function ({ getDb, cli }) {
  const actions = await stop({ getDb })

  actions.forEach(({ payload }) => {
    console.log(payload.message)
  })
}
