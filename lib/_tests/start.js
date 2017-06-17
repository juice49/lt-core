'use strict'

const path = require('path')
const tap = require('tap')
const level = require('level')
const testDbDirPath = path.join(__dirname, '_test-db', 'start')
const start = require('../start')
const stop = require('../stop')
const createGetDb = require('../get-db')
const { START_TIMER, STOP_TIMER, NOOP } = require('../../actions')

tap.test('if no id is provided and there are no other timers', async test => {
  const testDbPath = path.join(testDbDirPath, '4')
  const getDb = createGetDb(testDbPath)

  const actions = await start({
    getDb
  })

  test.match(actions[0].type, NOOP, 'it should noop')
  test.match(actions.length, 1, `it shouldn't do anything else`)
  level.destroy(testDbPath, test.end)
})

tap.test('if no id is provided and there is a stopped timer', async test => {
  const testDbPath = path.join(testDbDirPath, 'jpioj89')
  const getDb = createGetDb(testDbPath)

  await start({
    id: 'foo',
    getDb
  })

  await stop({
    id: 'foo',
    getDb
  })

  const actions = await start({
    getDb
  })

  test.match(actions[0].type, START_TIMER, 'it should start the timer')
  test.match(actions.length, 1, `it shouldn't do anything else`)
  level.destroy(testDbPath, test.end)
})

tap.test('if no id is provided and there is a running timer', async test => {
  const testDbPath = path.join(testDbDirPath, 'goi4uh')
  const getDb = createGetDb(testDbPath)

  await start({
    id: 'foo',
    getDb
  })

  const actions = await start({
    getDb
  })

  test.match(actions[0].type, NOOP, 'it should noop')
  test.match(actions.length, 1, `it shouldn't do anything else`)
  level.destroy(testDbPath, test.end)
})

tap.test('if an id is provided and there are no other timers', async test => {
  const testDbPath = path.join(testDbDirPath, '1')
  const getDb = createGetDb(testDbPath)

  const actions = await start({
    id: 'foo',
    getDb
  })

  test.match(actions[0].type, START_TIMER, 'it should start the timer')
  test.match(actions.length, 1, `it shouldn't do anything else`)
  level.destroy(testDbPath, test.end)
})

tap.test('if an id is provided and another timer is running', async test => {
  const testDbPath = path.join(testDbDirPath, '3')
  const getDb = createGetDb(testDbPath)

  await start({
    id: 'foo',
    getDb
  })

  const actions = await start({
    id: 'bar',
    getDb
  })

  test.match(actions[0].type, STOP_TIMER, 'it should stop the running timer')
  test.ok(actions[1].type === START_TIMER && actions[1].payload.id === 'bar', 'it should start the timer')
  test.match(actions.length, 2, `it shouldn't do anything else`)
  level.destroy(testDbPath, test.end)
})

tap.test('if an id is provided and another timer is stopped', async test => {
  const testDbPath = path.join(testDbDirPath, '78ny87y')
  const getDb = createGetDb(testDbPath)

  await start({
    id: 'foo',
    getDb
  })

  await stop({
    id: 'foo',
    getDb
  })

  const actions = await start({
    id: 'bar',
    getDb
  })

  test.match(actions[0].type, START_TIMER, 'it should start the timer')
  test.match(actions.length, 1, `it shouldn't do anything else`)
  level.destroy(testDbPath, test.end)
})

tap.test('if an id is provided and that timer is already running', async test => {
  const testDbPath = path.join(testDbDirPath, 'iyn987y')
  const getDb = createGetDb(testDbPath)

  await start({
    id: 'foo',
    getDb
  })

  const actions = await start({
    id: 'foo',
    getDb
  })

  test.match(actions[0].type, NOOP, 'it should noop')
  test.match(actions.length, 1, `it shouldn't do anything else`)
  level.destroy(testDbPath, test.end)
})

tap.test('if an id is provided and that timer is stopped', async test => {
  const testDbPath = path.join(testDbDirPath, 'opjerp8')
  const getDb = createGetDb(testDbPath)

  await start({
    id: 'foo',
    getDb
  })

  await stop({
    id: 'foo',
    getDb
  })

  const actions = await start({
    id: 'foo',
    getDb
  })

  test.ok(
    actions[0].type === START_TIMER && actions[0].payload.id === 'foo',
    'it should start the timer'
  )

  test.match(actions.length, 1, `it shouldn't do anything else`)
  level.destroy(testDbPath, test.end)
})
