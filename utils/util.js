const got = require('got-iconv')
const fs = require('fs-extra')
const dayjs = require('dayjs')
const leven = require('leven')

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
        request: 5 * 1000
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

exports.removeDuplicates = (targetPath) => {
  if (!fs.pathExistsSync(targetPath)) return
  const filePath = targetPath
  const fileStr = fs.readFileSync(filePath).toString()
  const fileArr = fileStr
    .split('\n')
    .filter((item) => item !== '' && !item.toLowerCase().includes('mp4'))

  const newFileArr = Array.from(new Set(fileArr))
  const newFileStr = newFileArr.sort((a, b) => a.length - b.length).join('\n')

  if (fileArr.length !== newFileArr.length) {
    console.log('已去重' + Math.abs(newFileArr.length - fileArr.length) + '条数据')
  }
  fs.outputFileSync(filePath, newFileStr)
}

exports.removeDuplicates2 = (targetPath) => {
  if (!fs.pathExistsSync(targetPath)) return
  const filePath = targetPath
  const fileStr = fs.readFileSync(filePath).toString()
  const fileArr = fileStr
    .split('\n')
    .filter(
      (item) =>
        item !== '' &&
        (item.includes('【') || item.includes('『') || item.includes('《') || item.includes('〖'))
    )

  const newFileArr = Array.from(new Set(fileArr))
  const newFileStr = newFileArr.sort().join('\n')

  if (fileArr.length !== newFileArr.length) {
    console.log('已去重' + Math.abs(newFileArr.length - fileArr.length) + '条数据')
  }
  fs.outputFileSync(filePath, newFileStr)
}

exports.filterChineseCharacters = (str) => {
  return str.replace(/[\+\-\@\%\#]/g, '')
}

exports.isInRecentDays = (time) => {
  const diffMillseconds = dayjs().valueOf() - dayjs(time).valueOf()
  return diffMillseconds <= 10 * 24 * 60 * 60 * 1000
}

exports.getSimilarity = (s1, s2) => {
  if (s1 === s2) return 1
  const distance = leven(s1, s2)
  const maxLength = Math.max(s1.length, s2.length)
  return maxLength === 0 ? 1 : (maxLength - distance) / maxLength
}

const uuidSet = new Set()
exports.getUUID = () => {
  const str = '123456789'
  let uuid = ''
  while (uuid.length < 8) {
    const randomIndex = Math.floor(Math.random() * str.length)
    uuid += str[randomIndex]
  }
  if (uuidSet.has(uuid)) {
    return exports.getUUID()
  }
  uuidSet.add(uuid)
  return uuid
}
