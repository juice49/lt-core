'use strict'

const path = require('path')
const tap = require('tap')
const level = require('level')
const testDbDirPath = path.join(__dirname, '_test-db', 'start')
const start = require('../start')
const stop = require('../stop')
const createGetDb = require('../get-db')
const { STOP_TIMER, NOOP } = require('../../actions')

tap.test('if there is a running timer', async test => {
  const testDbPath = path.join(testDbDirPath, 'okjoijo')
  const getDb = createGetDb(testDbPath)

  await start({
    id: 'foo',
    getDb
  })

  const actions = await stop({
    getDb
  })

  test.ok(
    actions[0].type === STOP_TIMER && actions[0].payload.id === 'foo',
    'it should stop the timer'
  )

  test.match(actions.length, 1, `it shouldn't do anything else`)
  level.destroy(testDbPath, test.end)
})

tap.test('if there is no running timer', async test => {
  const testDbPath = path.join(testDbDirPath, '90oidwio')
  const getDb = createGetDb(testDbPath)

  const actions = await stop({
    getDb
  })

  test.match(actions[0].type, NOOP, 'it should noop')
  test.match(actions.length, 1, `it shouldn't do anything else`)
  level.destroy(testDbPath, test.end)
})
