'use strict'

const through2 = require('through2')

function create ({ id, event, time = getTime(), order }) {
  return [ 'events', time, order, id, event ]
}

const createStream = () => through2.obj(function (chunk, enc, next) {
  this.push(create(chunk))
  next()
})

function parse (key, property) {
  const [ , time, order, id, event ] = key

  const data = {
    id,
    event,
    time,
    order
  }

  return property
    ? data[property]
    : data
}

const parseStream = () => through2.obj(function (chunk, enc, next) {
  chunk
    ? this.push(parse(chunk))
    : this.push(chunk)
  next()
})

function getTime () {
  return new Date().toISOString()
}

module.exports = {
  create,
  createStream,
  parse,
  parseStream
}
