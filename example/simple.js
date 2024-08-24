import Cache from 'cache-point'
import { setTimeout as sleep } from 'node:timers/promises'

/* mock function to simulate a slow, remote request */
async function fetchUser (id) {
  await sleep(1000)
  return { id, name: 'Layla' }
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

console.time('getUser')
const users = new Users()
const user = await users.getUser(10)
console.timeEnd('getUser')
console.log(user)
