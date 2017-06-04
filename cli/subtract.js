'use strict'

const adjust = require('../lib/adjust')

module.exports = async function subtract ({ getDb, cli }) {
  const [ , id, value ] = cli.input
  const actions = await adjust({ getDb, id, value, scale: -1 })

  actions.forEach(({ payload }) => {
    console.log(payload.message)
  })
}
