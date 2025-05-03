const axios = require('axios');
const cheerio = require('cheerio');

let visitedUrls = new Set();

async function crawlPage(url) {
  try {
    if (visitedUrls.has(url)) {
      return;
    }

    visitedUrls.add(url);

    let response = await axios.get(url);
    let $ = cheerio.load(response.data);
    let links = $('a');

    links.each((i, ele) => {
      let href = $(ele).attr('href');
      if (href) {
        crawlPage(urlRoot + href);
      }
    });

    return;

  } catch (err) {
    console.error('Erro na varredura\n');
    return err.message;
  }
}

// Servidor local
// python3 -m http.server

// let urlRoot = 'https://hmccl.github.io/sci-fi/';
let urlRoot = 'http://127.0.0.1:8000/sci-fi/';
let urlPage = 'duna.html';

async function main() {
  await crawlPage(urlRoot + urlPage)
    .catch(error => console.error('Erro ao acessar a página\n', error));

  console.log(Array.from(visitedUrls));
}

main();
