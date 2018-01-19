'use strict'

const level = require('level')
const sublevel = require('level-sublevel')
const mkdirp = require('make-dir')
const pify = require('pify')
const { up } = require('minigrate')
const migrations = require('../migrations')

module.exports = function getDb (path) {
  let main
  let events

  return async () => {
    if (!main) {
      await mkdirp(path)
      main = await mkdb(path)
      events = main.sublevel('events')
    }

    return {
      close: afterClose => {
        main.close(err => {
          if (!err) {
            main = null
            events = null
          }
          afterClose(err)
        })
      },
      main,
      events
    }
  }
}

function getMeta (db) {
  return db.sublevel('meta')
}

async function mkdb (path) {
  const db = sublevel(level(path))
  await migrate(db)
  return db
}

function migrate (db) {
  const meta = getMeta(db)
  return up({
    args: [ db ],
    async getCurrentMigration () {
      try {
        return await pify(meta.get)('migrationsLastRun')
      } catch (err) {
        if (err.notFound) {
          return
        }
        throw err
      }
    },
    setCurrentMigration (name) {
      return pify(meta.put)('migrationsLastRun', name)
    },
    migrations
  })
}
