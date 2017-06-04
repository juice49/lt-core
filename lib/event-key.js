'use strict'

const through2 = require('through2')

function create ({ id, event, time = getTime(), order }) {
  return [ time, order, id, event ].join('!')
}

function parse (key, property) {
  const [ time, order, id, event ] = key.split('!')
  const data = { id, event, time, order }

  return property
    ? data[property]
    : data
}

const parseStream = () => through2.obj(function (chunk, enc, next) {
  chunk
    ? this.push(parse(chunk.toString()))
    : this.push(chunk)
  next()
})

function getTime () {
  return new Date().toISOString()
}

module.exports = {
  create,
  parse,
  parseStream
}
