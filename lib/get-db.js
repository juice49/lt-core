'use strict'

const level = require('level')
const sublevel = require('level-sublevel')
const mkdirp = require('mkdirp')
const migrate = require('./migrate')

module.exports = function getDb (path) {
  let main
  let events

  return async () => {
    if (!main) {
      await mkdir(path)
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

function mkdir (path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, err => {
      err
        ? reject(err)
        : resolve()
    })
  })
}

function mkdb (path) {
  return new Promise((resolve, reject) => {
    level(path, async (err, db) => {
      if (err) {
        return reject(err)
      }
      db = sublevel(db)
      await migrate(db)
      resolve(db)
    })
  })
}
