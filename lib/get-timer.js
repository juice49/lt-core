'use strict'

module.exports = async function getTimer ({ getDb, id }) {
  const { events } = await getDb()

  const options = Object.assign({
    reverse: true,
    limit: 1
  }, getRange(id))

  return new Promise((resolve, reject) => {
    events.createKeyStream(options)
      .on('data', resolve)
      .on('end', () => resolve(null))
  })
}

function getRange (id) {
  if (!id) {
    return {}
  }

  return {
    gt: `${id}!`,
    lt: `${id}~`
  }
}
