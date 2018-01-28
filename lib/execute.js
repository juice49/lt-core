'use strict'

const { create } = require('../lib/event-key')

module.exports = async function execute ({
  getDb,
  actions,
  operations,
  afterClose = () => {}
}) {
  const { main, close } = await getDb()

  if (actions) {
    operations = actions
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
  }

  return new Promise((resolve, reject) => {
    main.batch(operations, err => {
      close(closeErr => {
        afterClose(closeErr)

        err
          ? reject(err)
          : resolve()
      })
    })
  })
}
