#!/usr/bin/env node
import fetch from "node-fetch";
import jsdom from "jsdom";
import fs from "fs";

const { JSDOM } = jsdom;

let csvData = "";
let url =
  "https://job.rikunabi.com/2022/search/company/result/?fw=&ms=0&kk=0&wk=2&wk=3&wk=4&wk=5&aot=&apr=&cwr=&cmr=&rry=3&rr=&ggr=1&gr=&awy=&wer=&wmr=&ad=7&ad=11&ad=12&exr=1&hu=1";

const scraping = async (url) => {
  const res = await fetch(url);
  const html = await res.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;

  Array.from(document.querySelectorAll(".ts-h-search-cassette")).map((dom) => {
    const name = dom.querySelector(
      ".ts-h-search-cassetteTitleMain"
    ).textContent;

    const remainingPeople = dom.querySelector(
      ".ts-h-search-cassetteRemainingTextCounter"
    ).textContent;

    csvData += name + "," + remainingPeople + "\r\n";
  });
  const nextPageButton = document.querySelector(".ts-h-search-pagerBtn_next");
  const nextUrl =
    "https://job.rikunabi.com/" + nextPageButton.getAttribute("href");

  fs.writeFile("out.txt", csvData, (err) => {
    if (err) console.log(err);
    else console.log("write end");
  });

  if (nextUrl) {
    scraping(nextUrl);
  } else {
    return false;
  }
};

scraping(url);
