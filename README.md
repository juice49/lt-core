# `lt-core`

`lt-core` is a small time tracking library designed with extensibility in mind.

- Each task must have a unique id.
- One task can run at a time.

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

`lt-core` uses [LevelDB](http://leveldb.org) for data storage. Right now it only
works with node, but there are modules that enable the LevelDB API to be used
with IndexedDB—so we could probably make it work in browsers, too.

## cli

[There's a cli for `lt-core`](https://github.com/juice49/lt-cli).

***

🔥 it's `lt`