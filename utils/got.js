const got = require('got-iconv')

exports.sleep = async (n) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, n * 1000)
  })
}

exports.loadAjax = (url, opts) => {
  return new Promise(function (resolve, reject) {
    got(url, {
      ...opts,
      timeout: {
        request: 30 * 1000
      }
    })
      .then((res) => {
        resolve(JSON.parse(res.body))
      })
      .catch((e) => {
        reject(e)
      })
  })
}

exports.getRandomString = (num = 16, isPureNumber = false) => {
  const a = 'abcdefghijklmnopqrstuvwxyz'
  const n = '1234567890'
  const s = []
  const r = isPureNumber ? n : a
  const l = r.length
  while (s.length < num) {
    const v = r[Math.floor(Math.random() * l)]
    s.push(Math.random() > 0.5 ? v : v.toUpperCase())
  }
  return s.join('')
}

exports.loadHtml = (url, opts) => {
  return new Promise(function (resolve, reject) {
    got(url, {
      ...opts,
      method: 'get',
      timeout: {
        request: 5 * 1000
      },
      https: {
        rejectUnauthorized: false
      }
    })
      .then((res) => {
        resolve(res.body)
      })
      .catch((e) => {
        reject(e)
      })
  })
}
