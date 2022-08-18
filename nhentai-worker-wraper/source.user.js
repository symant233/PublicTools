// ==UserScript==
// @name        nhentai's cf-worker
// @match       https://nhentai.net/*
// @icon        https://nhentai.net/favicon.ico
// @grant       none
// @version     1.1
// @author      symant233
// @run-at      document-end
// @description proxy image content with cloudflare worker
// ==/UserScript==
(function () {
  "use strict";
  const WORKER = ""; // replace with your raw cf-worker address
  // example: 'https://raw.yourName.workers.dev/?' according to your raw.js deployment
  function proxy(url) {
    return WORKER + url;
  }
  function replace() {
    document.querySelectorAll("img").forEach((el) => {
      if (el.dataset.src && el.dataset.src.startsWith("http")) {
        el.dataset.src = proxy(el.dataset.src);
        el.src = el.dataset.src;
      } else if (el.src && el.src.startsWith("http")) {
        el.dataset.src = proxy(el.src);
        el.src = el.dataset.src;
      }
    });
    watch();
  }
  function replaceReader() {
    const el = document.querySelector("#image-container img");
    if (el.src.startsWith("https://raw")) return; // change if your worker id is different !!!
    el.src = proxy(el.src);
  }
  function watch() {
    if (!window.reader) return;
    window.reader.media_url = WORKER + "https://i.nhentai.net/";
    new Promise((resolve) => {
      const container = window.reader.$image_container;
      if (container) {
        new MutationObserver((mutationList) => {
          mutationList.forEach((mutation) => {
            if (mutation.oldValue) replaceReader();
            console.log("trigger mutation observer");
          });
        }).observe(container, {
          attributes: true,
          attributeOldValue: true,
          subtree: true,
        });
      }
      resolve();
    });
  }
  setTimeout(() => {
    replace();
  }, 1000);
})();

// nhentai 助手 Custom Download Url:
// https://raw.yourName.workers.dev/?https://i.nhentai.net/galleries/{{mid}}/{{index}}.{{ext}}
