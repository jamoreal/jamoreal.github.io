const fs = require('fs-extra')
const { loadHtml, isInRecentDays } = require('../utils/util')
const cheerio = require('cheerio')
const dayjs = require('dayjs')
const rootLink = `http://086wow.net/`
const jsonLink = `./data/086wow.json`
const oldData = getOldData()

const lastTime = oldData[0] ? oldData[0].time : ''
const newData = []
const seen = new Set()

function getOldData() {
  try {
    return JSON.parse(fs.readFileSync(jsonLink).toString() || '[]')
  } catch {
    return []
  }
}

async function getPagination(page) {
  try {
    const html = await loadHtml(`${rootLink}forum.php?mod=forumdisplay&fid=2&page=${page}`)
    const $ = cheerio.load(html)
    const links = $('#threadlisttableid tbody[id*=normalthread] tr').toArray()

    for (let k = 0; k < links.length; k++) {
      try {
        const item = $(links[k])
        const title = item.find('.s.xst').text()
        const link = rootLink + item.find('.s.xst').attr('href')
        const time = item.find('.by em a span').attr('title') || item.find('.by em a').text()

        if (title?.length >= 10 && dayjs(time).isBefore(dayjs())) {
          if (lastTime && dayjs(time).isBefore(dayjs(lastTime))) {
            console.log('已查询到上次的位置')
            const mergeData = [...newData, ...oldData].filter((item) => isInRecentDays(item.time))
            fs.writeFileSync(jsonLink, JSON.stringify(mergeData, null, 2))
            return
          }

          if (!isInRecentDays(time)) {
            fs.writeFileSync(jsonLink, JSON.stringify(newData, null, 2))
            return
          }

          if (!seen.has(title)) {
            const content = await getContent(link)
            console.log(time, title)
            newData.push({
              title,
              link,
              time,
              content
            })
            seen.add(title)
          }
        }
      } catch (err) {
        console.log('抓取内容异常')
        k--
      }
    }
  } catch (err) {
    console.log('抓取分页异常')
    page--
  }
  await getPagination(page + 1)
}

async function getContent(url) {
  const html = await loadHtml(url)
  const $ = cheerio.load(html)
  const content = $('.plhin .t_fsz .t_f').html()
  return content
}

async function bootstrap() {
  await getPagination(1)
}

module.exports = {
  bootstrap
}
