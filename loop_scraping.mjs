#!/usr/bin/env node

import fetch    from "node-fetch";
import jsdom    from "jsdom";
import fs       from "fs";
import readline from 'readline';

const question = (question) => {
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    readlineInterface.question(question, (answer) => {
      console.log('');
      resolve(answer);
      readlineInterface.close();
    });
  })
}

let outputData = "";
let scraping_count = 1;
const url      = await question('検索したいURLは？\n>');
const domain   = await question('検索したいURLのドメインは？\n>');
const selector = await question('取得したいセレクタは？\n>');
const next     = await question('次のページヘのセレクタは？\n>');
console.log('スクレイピング開始...');

const main =  async (url)=> {
  const { JSDOM } = jsdom;
  const res      = await fetch(url);
  const html     = await res.text();
  const dom      = new JSDOM(html);
  const document = dom.window.document;

  Array.from(document.querySelectorAll(selector)).map((dom) => {
    outputData += dom.textContent + "\r\n";
  });

  fs.writeFile("output.txt", outputData, (error) => {
    if (error) console.log(error);
  });

  try {
    const nextPageButton = document.querySelector(next);
    const nextUrl        = domain + nextPageButton.getAttribute("href");
    if(nextUrl) main(nextUrl);
    console.log(`${scraping_count}回目: スクレイピング完了`);
    scraping_count ++;
  }catch{
    console.log('スクレイピング終了');
    return false;
  }
};

main(url);

