'use strict'

const { EOL } = require('os')
const fun = require('funstream')

module.exports = async function log ({ getDb, cli }) {
  const { main } = await getDb()

  const events = main.createReadStream({
    reverse: true,
    gte: [ 'events' ],
    lte: [ 'events', undefined ]
  })

  await fun(events)
    .map(({ key, value }) => [ key, value ]
      .filter(data => data !== '')
      .join(': ') + EOL
    )
    .pipe(process.stdout)
}
