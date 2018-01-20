'use strict'

const level = require('level')
const sublevel = require('level-sublevel')
const mkdirp = require('make-dir')
const pathExists = require('path-exists')
const pify = require('pify')
const { up, sortMigrations } = require('minigrate')
const migrations = require('../migrations')
const DB_VERSION_KEY = 'dbVersion'

module.exports = function getDb (path) {
  let main
  let events

  return async () => {
    if (!main) {
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
  const exists = await pathExists(path)
  await mkdirp(path)
  const db = sublevel(level(path))
  await migrate(db, !exists)
  return db
}

function migrate (db, isNew) {
  const meta = getMeta(db)

  if (migrations.length === 0) {
    return
  }

  if (isNew) {
    // If the database is new, we don't need to run any migrations. Instead,
    // we'll set the current db version to the latest migration.
    const dbVersion = sortMigrations(migrations)[migrations.length - 1]
    return pify(meta.put)(DB_VERSION_KEY, dbVersion.name)
  }

  return up({
    args: [ db ],
    async getCurrentMigration () {
      try {
        return await pify(meta.get)(DB_VERSION_KEY)
      } catch (err) {
        if (err.notFound) {
          return
        }
        throw err
      }
    },
    setCurrentMigration (name) {
      return pify(meta.put)(DB_VERSION_KEY, name)
    },
    migrations
  })
}
