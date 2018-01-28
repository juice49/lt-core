'use strict'

const { EOL } = require('os')
const map = require('through2-map')

module.exports = async function log ({ getDb, cli }) {
  const { main } = await getDb()

  main.createReadStream({ reverse: true, gte: [ 'events' ], lte: [ 'events', undefined ] })
    .pipe(map.obj(({ key, value }) => {
      const output = [ key, value ]
        .filter(data => data !== '')

      return output.join(': ') + EOL
    }))
    .pipe(process.stdout)
}
