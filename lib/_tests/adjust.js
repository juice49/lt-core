'use strict'

const path = require('path')
const tap = require('tap')
const level = require('level')
const shortid = require('shortid')
const testDbDirPath = path.join(__dirname, '_test-db', 'start')
const start = require('../start')
const adjust = require('../adjust')
const createGetDb = require('../get-db')
const { ADJUST_TIMER } = require('../../actions')

tap.test('if no id is provided', async test => {
  const result = method =>
    method('it should throw an error')

  try {
    await adjust({})
    result(test.fail)
  } catch (err) {
    result(test.pass)
  }
})

tap.test('if no value is provided', async test => {
  const result = method =>
    method('it should throw an error')

  try {
    await adjust({ id: 'foo' })
    result(test.fail)
  } catch (err) {
    result(test.pass)
  }
})

tap.test('if the value provided does not include a unit', async test => {
  const result = method =>
    method('it should throw an error')

  try {
    await adjust({
      id: 'foo',
      value: 1
    })
    result(test.fail)
  } catch (err) {
    result(test.pass)
  }
})

tap.test('if the specified timer does not exist', async test => {
  const testDbPath = path.join(testDbDirPath, shortid())
  const getDb = createGetDb(testDbPath)

  const result = method =>
    method('it should throw an error')

  try {
    await adjust({
      id: 'foo',
      value: '1m',
      getDb
    })
    result(test.fail)
  } catch (err) {
    result(test.pass)
  }

  level.destroy(testDbPath, test.end)
})

tap.test('if the specified timer exists', async test => {
  const testDbPath = path.join(testDbDirPath, shortid())
  const getDb = createGetDb(testDbPath)

  await start({
    id: 'foo',
    getDb
  })

  const actions = await adjust({
    id: 'foo',
    value: '1m',
    getDb
  })

  test.ok(
    actions[0].type === ADJUST_TIMER && actions[0].payload.id === 'foo',
    'it should adjust the timer'
  )

  test.match(
    actions[0].payload.value,
    60000,
    'it should adjust the timer by the duration passed in milliseconds'
  )

  test.match(actions.length, 1, `it shouldn't do anything else`)
  level.destroy(testDbPath, test.end)
})
