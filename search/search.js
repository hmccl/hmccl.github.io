import axios from 'axios';
import * as cheerio from 'cheerio';

async function crawlPage(url) {
  try {
    let response = await axios.get(url);
    let $ = cheerio.load(response.data);

    let links = [];
    $('a').each((i, el) => {
      let text = $(el).text();
      let href = $(el).attr('href');
      if (href) {
        let absoluteHref = new URL(href, url).toString();
        links.push({ text, absoluteHref });
      }
    });

    console.log('Links da página\n', links);

  } catch (err) {
    console.log('Erro ao acessar a página!\n', err.message);
  }
}

//crawlPage('https://hmccl.github.io/sci-fi/blade_runner.html')

// Servidor local
// python3 -m http.server
crawlPage('http://127.0.0.1:8000/sci-fi/blade_runner.html')

