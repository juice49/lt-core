'use strict'

const path = require('path')
const tap = require('tap')
const level = require('level')
const shortid = require('shortid')
const testDbDirPath = path.join(__dirname, '_test-db', 'start')
const start = require('../start')
const remove = require('../remove')
const createGetDb = require('../get-db')
const { parse } = require('../event-key')
const { START_TIMER, STOP_TIMER, REMOVE_EVENT } = require('../../actions')

tap.test('if a timer id is provided', async test => {
  const testDbPath = path.join(testDbDirPath, shortid())
  const getDb = createGetDb(testDbPath)

  await start({
    id: 'foo',
    getDb
  })

  await start({
    id: 'bar',
    getDb
  })

  const actions = await remove({
    id: 'foo',
    getDb
  })

  const expectedEvents = [
    {
      targetId: 'foo',
      targetType: START_TIMER,
      type: REMOVE_EVENT
    },
    {
      targetId: 'foo',
      targetType: STOP_TIMER,
      type: REMOVE_EVENT
    }
  ]

  const events = actions.map(({ type, payload }) => ({
    targetId: parse(payload.key, 'id'),
    targetType: parse(payload.key, 'event'),
    type
  }))

  test.same(events, expectedEvents, 'it should remove all matching events')
  test.match(actions.length, 2, `it shouldn't do anything else`)
  level.destroy(testDbPath, test.end)
})

tap.test('if no timer id is provided', async test => {
  const testDbPath = path.join(testDbDirPath, shortid())
  const getDb = createGetDb(testDbPath)

  await start({
    id: 'foo',
    getDb
  })

  await start({
    id: 'bar',
    getDb
  })

  const actions = await remove({ getDb })

  const expectedEvents = [
    {
      targetId: 'foo',
      targetType: START_TIMER,
      type: REMOVE_EVENT
    },
    {
      targetId: 'foo',
      targetType: STOP_TIMER,
      type: REMOVE_EVENT
    },
    {
      targetId: 'bar',
      targetType: START_TIMER,
      type: REMOVE_EVENT
    }
  ]

  const events = actions.map(({ type, payload }) => ({
    targetId: parse(payload.key, 'id'),
    targetType: parse(payload.key, 'event'),
    type
  }))

  test.same(events, expectedEvents, 'it should remove all events')
  test.match(actions.length, 3, `it shouldn't do anything else`)
  level.destroy(testDbPath, test.end)
})
