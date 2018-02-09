# Remotes

A _remote_ is a service that `lt-core` can push time entries to.

## Adapters

To use a service as a remote, an adapter must be defined.

```js
  const request = require('r2')

  module.exports = {
    // Note the name of the _remote adapter_ and the name of the _remote_ are separate.
    name: 'jira',
    // Config required to create a remote using the adapter.
    config: [
      {
        name: 'url',
        description: `The url of the Jira instance you'd like to connect to.`,
        type: 'text'
      },
      {
        name: 'username',
        type: 'text'
      },
      {
        name: 'password',
        type: 'password'
      }
    ],
    // The function called to push time entries.
    async push ({ requestConfig, retry, cache, entries }) {
      const { accessToken, url } = await cache.get(
        'connection',
        () => connect({ requestConfig, cache })
      )

      try {
        await push()
      } catch (error) {
        if (error.auth) {
          await connect({ requestConfig, cache })
          return retry()
        }
      }
    }
  }

  async function connect ({ requestConfig, cache }) {
    // Pause for user input.
    const config = await requestConfig()

    // Try to login.
    const accessToken = await getAccessToken(config.username, config.password)

    const connection = {
      url: config.url,
      accessToken
    }

    // Cache the access token and Jira URL.
    await cache.put(connection)
    return connection
  }

  async function getAccessToken (username, password) {
    const headers = await r2(/* jira url */).headers
    return headers['set-cookie']
  }

  function push (entries, accessToken) {
    return r2.post(`${url}/worklogs`, {
      json: entries
    })
  }
```

`lt-core` provides an api for adding remotes:

```js
const lt = require('lt-core')

const remote = lt.addRemote(jira, {
  name: 'myJira'
})
```

Many remotes can be added, but each must have a unique name.

Remote adapters can cache information in the database. Remove the remote to
clean this up:

```js
(async () => {
  console.log('removing myJira')
  await lt.removeRemote(remote)
  console.log('removed myJira')
})()
```
