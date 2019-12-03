const Cache = require('../')

/* mock function to simulate a remote request */
async function fetchUser (id) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ id, name: 'Layla' })
    }, 1000)
  })
}

class Users {
  constructor () {
    this.cache = new Cache({ dir: 'tmp/example' })
  }

  async getUser (id) {
    let user
    try {
      /* cache.read() will resolve on hit, reject on miss */
      user = await this.cache.read(id)
    } catch (err) {
      if (err.code === 'ENOENT') {
        /* cache miss, fetch remote user */
        user = await fetchUser(id)
        this.cache.write(id, user)
      }
    }
    return user
  }
}

async function start () {
  console.time('getUser')
  const users = new Users()
  const user = await users.getUser(10)
  console.timeEnd('getUser')
  console.log(user)
}

start().catch(console.error)


