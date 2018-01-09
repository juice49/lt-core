'use strict'

const path = require('path')
const { load } = require('@ash/migrate')
const pify = require('pify')

module.exports = async function migrate (db) {
  load({
    stateStore: stateStore(db),
    migrationsDirectory: path.join(__dirname, '..', 'migrations')
  }, (err, set) => {
    if (err) {
      throw err
    }
    set.up({ args: db }, err => {
      if (err) {
        throw err
      }
    })
  })
  return db
}

const stateStore = db => ({
  async load (next) {
    const meta = getMeta(db)
    try {
      const [ lastRun, migrations ] = await Promise.all([
        pify(meta.get)('migrationsLastRun'),
        pify(meta.get)('migrations')
      ])
      next(null, {
        migrations: JSON.parse(migrations),
        lastRun
      })
    } catch (err) {
      if (err.notFound) {
        return next(null, {
          lastRun: null,
          migrations: null
        })
      }
      next(err)
    }
  },
  save (set, next) {
    const meta = getMeta(db)
    meta.batch([
      {
        type: 'put',
        key: 'migrationsLastRun',
        value: set.lastRun
      },
      {
        type: 'put',
        key: 'migrations',
        value: JSON.stringify(set.migrations)
      }
    ], next)
  }
})

function getMeta (db) {
  return db.sublevel('meta')
}
