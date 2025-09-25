const fs = require('fs-extra')
const ejs = require('ejs')
const dayjs = require('dayjs')

function parseToHtml(items) {
  const hour = dayjs().hour()
  if (hour == 23 || hour == 0) {
    fs.emptyDirSync('./dist')
    fs.emptyDirSync('./dist/s')
  } else {
    fs.ensureDirSync('./dist')
    fs.ensureDirSync('./dist/s')
  }

  fs.copyFileSync('./tpls/favicon.png', './dist/favicon.png')
  fs.copyFileSync('./tpls/logo.png', './dist/logo.png')
  fs.copyFileSync('./tpls/bg.jpg', './dist/bg.jpg')
  fs.copyFileSync('./tpls/nv.png', './dist/nv.png')
  fs.copyFileSync('./tpls/404.html', './dist/404.html')

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
