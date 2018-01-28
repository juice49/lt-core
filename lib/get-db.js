'use strict'

const level = require('level')
const charwise = require('charwise')
const mkdirp = require('make-dir')
const pathExists = require('path-exists')
const { up, sortMigrations } = require('minigrate')
const migrations = require('../migrations')
const DB_VERSION_KEY = 'dbVersion'

module.exports = function getDb (path) {
  let db

  return async () => {
    if (!db) {
      db = await mkdb(path)
    }

    return {
      close: afterClose => {
        db.close(err => {
          if (!err) {
            db = null
          }
          afterClose(err)
        })
      },
      main: db
    }
  }
}

async function mkdb (path) {
  const exists = await pathExists(path)
  await mkdirp(path)
  const db = level(path, { keyEncoding: charwise })
  await migrate(db, !exists)
  return db
}

function migrate (db, isNew) {
  if (migrations.length === 0) {
    return
  }

  if (isNew) {
    // If the database is new, we don't need to run any migrations. Instead,
    // we'll set the current db version to the latest migration.
    const dbVersion = sortMigrations(migrations)[migrations.length - 1]
    return db.put([ 'meta', DB_VERSION_KEY ], dbVersion.name)
  }

  return up({
    args: [ db ],
    async getCurrentMigration () {
      try {
        return await db.get([ 'meta', DB_VERSION_KEY ])
      } catch (err) {
        if (err.notFound) {
          return
        }
        throw err
      }
    },
    setCurrentMigration (name) {
      return db.put([ 'meta', DB_VERSION_KEY ], name)
    },
    migrations
  })
}
