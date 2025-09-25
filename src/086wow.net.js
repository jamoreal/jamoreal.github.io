const BaseScraper = require('./baseScraper')

class WowScraper extends BaseScraper {
  constructor() {
    super({
      rootLink: 'http://086wow.net/',
      jsonLink: './data/086wow.json',
      pageUrlTemplate: (page) => `http://086wow.net/forum.php?mod=forumdisplay&fid=2&page=${page}`
    })
  }
}

async function bootstrap() {
  const scraper = new WowScraper()
  await scraper.start()
}

module.exports = {
  bootstrap
}
