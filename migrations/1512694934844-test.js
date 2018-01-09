'use strict'

exports.up = function up (db, next) {
  console.log('migrate', db)
  next()
}

exports.down = function down (next) {
  console.log('down')
  next()
}
