#!/usr/bin/env node
'use strict';

const process = require('process');
const readline = require('readline');
const Crawler = require('../src/crawler/crawler.class');

let rl = readline.createInterface(process.stdin, process.stdout);

/**
 * asks a question and returns the answer
 * @param {string} query 
 * @returns {Promise.<string>}
 */
async function question(query) {
  return await new Promise(resolve => {
    rl.question(query, (answer) => {
      resolve(answer);
    })
  });
}

(async () => {
  let crawler = new Crawler({
    soobridit: 'Lolification',
    category: 'new',
    browser: {
      headless: false
    }
  });

  await crawler.crawl();
})();
