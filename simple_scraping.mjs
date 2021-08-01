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
const main =  async ()=> {
  const { JSDOM } = jsdom;
  const url      = await question('検索したいURLは？\n>');
  const selector = await question('取得したいセレクタは？\n>');
  console.log('スクレイピング中...')

  const res      = await fetch(url);
  const html     = await res.text();
  const dom      = new JSDOM(html);
  const document = dom.window.document;

  Array.from(document.querySelectorAll(selector)).map((dom) => {
    outputData += dom.textContent + "\r\n";
  });

  fs.writeFile("output.txt", outputData, (error) => {
    if (error) console.log(error);
    else console.log("スクレイピング完了");
  });
};

main();

