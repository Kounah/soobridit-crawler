#!/usr/bin/env node
'use strict';

const process = require('process');
const Crawler = require('../src/crawler/crawler.class');
const parseArgs = require('kouna-lib/functions/parse-args');

let args = parseArgs(process.argv);

(async () => {
  let crawler = new Crawler({
    soobridit: args.soobridit,
    category: args.category,
    browser: {
      headless: Boolean(args.headless)
    }
  });

  await crawler.crawl();
})();
