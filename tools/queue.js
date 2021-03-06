class Queue {
  constructor() {
    this.run_state = false
    this.queue = []
  }
  async run() {
    if (this.run_state) return
    let { length } = this.queue
    if (length === 0) return this.run_state = false
    this.run_state = true
    for (let i = 0; i < length; i++) {
      let tmpFunc = this.queue.shift()
      await tmpFunc()
    }
    this.run_state = false
    return await this.run()
  }
  push(callback) {
    this.queue.push(callback)
    if (!this.run_state) this.run()
  }
}

class UploadQueue {
  constructor() {
    this.list = {}
  }
  push(donate_id, callback) {
    if (!this.list[donate_id]) this.list[donate_id] = new Queue()
    this.list[donate_id].push(callback)
    clearTimeout(this.list[donate_id].timmer)
    this.list[donate_id].timmer = setTimeout(() => {
      delete this.list[donate_id]
    }, 1000 * 60 * 5);
  }
}

let uploadQueue = new UploadQueue()

module.exports = { Queue, uploadQueue }
