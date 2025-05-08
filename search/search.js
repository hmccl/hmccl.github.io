const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

let visitedUrls = new Set();
let crawlResults = [];
const crawlFile = 'crawlResults.json';

async function crawlPage(url) {
  try {
    if (visitedUrls.has(url)) {
      return;
    }

    visitedUrls.add(url);

    let response = await axios.get(url);
    let $ = cheerio.load(response.data);
    let links = $('a');
    let content = $.html();
    let hyperlinks = [];

    links.each((i, ele) => {
      let href = $(ele).attr('href');
      if (href) {
        href = new URL(href, url).href;
        hyperlinks.push(href);
        crawlPage(href);
      }
    });

    crawlResults.push({ url, content, hyperlinks });
    fs.writeFileSync(crawlFile, JSON.stringify(crawlResults, null, "\t"));
    return;

  } catch (err) {
    console.error('Erro na varredura\n');
    return err.message;
  }
}

async function crawl(url) {
  await crawlPage(url)
    .catch(error => console.error('Erro ao acessar a página\n', error));
}

// Servidor local
// python3 -m http.server

// let urlPage = 'https://hmccl.github.io/sci-fi/duna.html';
let urlPage = 'http://127.0.0.1:8000/sci-fi/blade_runner.html';

crawl(urlPage);
