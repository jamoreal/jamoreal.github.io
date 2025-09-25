const fs = require('fs-extra')
const { loadHtml, isInRecentDays } = require('../utils/util')
const cheerio = require('cheerio')
const dayjs = require('dayjs')

class BaseScraper {
  constructor(config) {
    this.rootLink = config.rootLink
    this.jsonLink = config.jsonLink
    this.oldData = this.getOldData()
    this.lastTime = this.oldData[0] ? this.oldData[0].time : ''
    this.newData = []
    this.seen = new Set()
    this.pageUrlTemplate = config.pageUrlTemplate
    this.contentSelector = config.contentSelector || '.plhin .t_fsz .t_f'
    this.itemSelector = '#threadlisttableid tbody[id*=normalthread] tr'
    this.titleSelector = '.s.xst'
  }

  getOldData() {
    try {
      return JSON.parse(fs.readFileSync(this.jsonLink).toString() || '[]')
    } catch {
      return []
    }
  }

  async getPageUrl(page) {
    return typeof this.pageUrlTemplate === 'function'
      ? this.pageUrlTemplate(page)
      : this.pageUrlTemplate.replace('{page}', page)
  }

  async processItem(item, $) {
    const title = $(item).find(this.titleSelector).text()
    const link = this.rootLink + $(item).find(this.titleSelector).attr('href')
    const time = $(item).find('.by em a span').attr('title') || $(item).find('.by em a').text()

    return { title, link, time }
  }

  async getContent(url) {
    const html = await loadHtml(url)
    const $ = cheerio.load(html)
    return $(this.contentSelector).html()
  }

  async processPage(page) {
    try {
      const pageUrl = await this.getPageUrl(page)
      const html = await loadHtml(pageUrl)
      const $ = cheerio.load(html)
      const items = $(this.itemSelector).toArray()

      for (const item of items) {
        try {
          const { title, link, time } = await this.processItem(item, $)

          if (title?.length >= 10 && dayjs(time).isBefore(dayjs())) {
            if (this.lastTime && dayjs(time).isBefore(dayjs(this.lastTime))) {
              console.log('已查询到上次的位置')
              const mergeData = [...this.newData, ...this.oldData].filter((item) =>
                isInRecentDays(item.time)
              )
              fs.writeFileSync(this.jsonLink, JSON.stringify(mergeData, null, 2))
              return false
            }

            if (!isInRecentDays(time)) {
              fs.writeFileSync(this.jsonLink, JSON.stringify(this.newData, null, 2))
              return false
            }

            if (!this.seen.has(title)) {
              const content = await this.getContent(link)
              console.log(time, title)
              this.newData.push({
                title,
                link,
                time,
                content
              })
              this.seen.add(title)
            }
          }
        } catch (err) {
          console.log('抓取内容异常', err.message)
          continue
        }
      }
      return true
    } catch (err) {
      console.log('抓取分页异常', err.message)
      return false
    }
  }

  async start() {
    let page = 1
    while (true) {
      const shouldContinue = await this.processPage(page++)
      if (!shouldContinue) break
    }
  }
}

module.exports = BaseScraper
