# lt

lt is a small time tracking library and CLI. It is designed with extensibility
in mind; either by embedding the library or extending the CLI.

- Each task must have a unique id.
- One task can run at a time.

lt uses [LevelDB](http://leveldb.org) for data storage. Right now it only works
with node, but there are modules that enable the LevelDB API to be used with
IndexedDB—so we could probably make it work in browsers, too.

**Install `lt` CLI:**

`npm i -g lt-timer`

***

# cli usage

[lt start [$id]](#lt-start-id)  
[lt stop](#lt-stop)  
[lt add $id $value](#lt-add-id-value)  
[lt subtract $id $value](#lt-subtract-id-value)  
[lt ls [$id]](#lt-ls-id)  
[lt log](#lt-log)

***

## lt start [$id]

Start a timer. If there is a running timer, lt will stop it. If no id is
provided, lt will resume the last timer that was stopped.

`lt start foo`

## lt stop

Stop the running timer.

## lt add $id $value

Add a specific value to a timer. The value should include units, for example:

- 30m
- 0.5h
- 2hr
- 4d
- 4.5h
- 4h30m

`lt add foo 1h7m`

## lt subtract $id $value

Subtract a specific value from a timer. The value should include units,
for example:

- 30m
- 0.5h
- 2hr
- 4d
- 4.5h
- 4h30m

`lt subtract foo 37m`

## lt ls [$id]

List the existing timers and the current duration of each. If a timer is
running, it's id will be highlighted.

If an id is provided, only the matching timer will be listed.

## lt log

Event log for all timers.

***

🔥 it's lt