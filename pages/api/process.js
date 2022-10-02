const DomParser = require('dom-parser');

export default async function handler(req, res) {
    const { query } = req.body

    const link = 'https://' + query
        .filter(e => !e.includes('http'))
        .join('/')

    let imgLink = link
    const page = await fetch(link)
    const pageHtml = await page.text()

    const parser = new DOMParser();
    const doc = parser.parseFromString(pageHtml, 'text/html');


    console.log({ page, doc })

    return res.status(200).json({ link })
}