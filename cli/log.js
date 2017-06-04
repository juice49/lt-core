'use strict'

const { EOL } = require('os')
const map = require('through2-map')

module.exports = async function log ({ getDb, cli }) {
  const { events } = await getDb()

  events.createReadStream({ reverse: true })
    .pipe(map.obj(({ key, value }) => {
      const output = [ key, value ]
        .filter(data => data !== '')

      return output.join(': ') + EOL
    }))
    .pipe(process.stdout)
}
