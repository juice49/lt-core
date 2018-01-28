'use strict'

const { DIRECTION_UP } = require('minigrate')
const fun = require('funstream')

module.exports = {
  name: '1517157368635-charwise-key-encoding',
  async [DIRECTION_UP] (db) {
    const batch = db.batch()

    await fun(db.createReadStream({ keyEncoding: 'utf8' }))
      .forEach(({ key, value }) => {
        const [ , , time, order, id, event ] = key.split('!')
        batch.del(key, { keyEncoding: 'utf8' })
        batch.put([ 'events', time, order, id, event ], value)
      })

    return batch.write()
  }
}
