const fs = require('fs-extra')
const dayjs = require('dayjs')
const path = require('path')
const md5 = require('blueimp-md5')
const cheerio = require('cheerio')
const wow086 = require('./src/086wow.net.js')
const wow200 = require('./src/200wow.com.js')
const wow118 = require('./src/118wow.cc.js')
const wow9awar = require('./src/9awar.cc.js')
const wow99nets = require('./src/99nets.net.js')
const wowi9 = require('./src/i9wow.com.js')
const wow920 = require('./src/920wow.com.js')
const wow521 = require('./src/wow521.com.js')
const toHtml = require('./src/to-html.js')
const { getSimilarity } = require('./utils/util.js')

async function mergeFiles(dirPath) {
  try {
    const files = await fs.readdir(dirPath)
    const jsonFiles = files.filter((file) => path.extname(file).toLowerCase() === '.json')
    let mergedData = []
    for (const file of jsonFiles) {
      const filePath = path.join(dirPath, file)
      const fileContent = await fs.readFile(filePath, 'utf8')
      const jsonData = JSON.parse(fileContent)
      if (Array.isArray(jsonData)) {
        mergedData = mergedData.concat(jsonData)
      } else {
        console.warn(`文件 ${file} 不是数组，跳过合并。`)
      }
    }

    return mergedData.sort((a, b) => dayjs(b.time).valueOf() - dayjs(a.time).valueOf())
  } catch (err) {
    console.error('读取或解析文件时出错:', err)
    throw err
  }
}

function dedupeByTitle(arr, threshold = 0.9) {
  const kept = []
  return arr.filter((item) => {
    const currentTitle = item.title
    for (const keptTitle of kept) {
      if (getSimilarity(currentTitle, keptTitle) >= threshold) {
        // console.log('发现相似标题：' + currentTitle + '，过滤掉....')
        return false
      }
    }
    kept.push(currentTitle)
    return true
  })
}

function getCleanContent(content) {
  const $ = cheerio.load(content)
  $('img').remove()
  return $.html()
}

function getUnPornItems(data) {
  return data
    .filter((item) => {
      return !item.content.toLowerCase().includes('telegram')
    })
    .map((item) => {
      return {
        id: md5(item.title + item.time),
        title: item.title,
        time: item.time,
        link: item.link,
        content: getCleanContent(item.content)
      }
    })
}

async function boostrap() {
  console.log('查询086wow')
  await wow086.bootstrap()

  console.log('查询200wow')
  await wow200.bootstrap()

  console.log('查询118wow')
  await wow118.bootstrap()

  console.log('查询9awar')
  await wow9awar.bootstrap()

  console.log('查询99nets')
  await wow99nets.bootstrap()

  console.log('查询i9wow')
  await wowi9.bootstrap()

  console.log('查询920wow')
  await wow920.bootstrap()

  console.log('查询wow521')
  await wow521.bootstrap()

  console.log('开始合并')
  console.time('合并耗时')
  const data = await mergeFiles('./data')
  console.timeEnd('合并耗时')

  console.log('开始去重及过滤')
  console.time('去重及过滤耗时')
  const dedupedData = dedupeByTitle(getUnPornItems(data))
  console.timeEnd('去重及过滤耗时')

  console.log('开始渲染html')
  console.time('渲染html耗时')
  toHtml.parseToHtml(dedupedData)
  console.timeEnd('渲染html耗时')

  console.log('发布成功!')
}

boostrap()
