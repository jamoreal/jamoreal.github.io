const fs = require('fs-extra')
const ejs = require('ejs')

function parseToHtml(items) {
  fs.emptyDirSync('./dist')
  fs.emptyDirSync('./dist/s')
  const listTpl = fs.readFileSync('./tpls/list.ejs', 'utf8')
  const contentTpl = fs.readFileSync('./tpls/content.ejs', 'utf8')
  const headerTpl = fs.readFileSync('./tpls/header.ejs', 'utf8')
  const header = ejs.render(headerTpl)

  const pagesize = 30
  const pagenum = Math.ceil(items.length / pagesize)

  for (let i = 1; i <= pagenum; i++) {
    const pageItems = items.slice((i - 1) * pagesize, i * pagesize)
    pageItems.forEach((item) => {
      const html = ejs.render(contentTpl, {
        title: item.title,
        content: item.content,
        header
      })
      fs.writeFileSync(`./dist/s/${item.id}.html`, html)
    })

    const html = ejs.render(listTpl, {
      items: pageItems,
      page: i,
      pagenum,
      header
    })
    
    if (i == 1) {
      fs.writeFileSync(`./dist/index.html`, html)
    }

    fs.writeFileSync(`./dist/p${i}.html`, html)
  }
}

module.exports = {
  parseToHtml
}
