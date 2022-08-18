// ==UserScript==
// @name        nhentai's cf-worker
// @match       https://nhentai.net/*
// @icon        https://nhentai.net/favicon.ico
// @grant       unsafeWindow
// @grant       GM_addStyle
// @version     2.0
// @author      symant233
// @run-at      document-end
// @description proxy image content with cloudflare worker
// ==/UserScript==
(function () {
  "use strict";
  const WORKER = ""; // replace with your raw cf-worker address
  const STARTID = "https://raw"; // change if your worker id is different !!!
  // example: 'https://raw.yourName.workers.dev/?' according to your raw.js deployment
  function proxy(url) {
    return WORKER + url;
  }
  function replace() {
    unsafeWindow._n_app.lazy_loader.$images.forEach((el) => {
      if (
        el.dataset.src &&
        el.dataset.src.startsWith("http") &&
        !el.dataset.src.startsWith(STARTID)
      ) {
        el.dataset.src = proxy(el.dataset.src);
        el.src = el.dataset.src;
      }
      if (el.src && el.src.startsWith("http") && !el.src.startsWith(STARTID)) {
        el.dataset.src = proxy(el.src);
        el.src = el.dataset.src;
      }
    });
  }
  function replaceReader() {
    const el = document.querySelector("#image-container img");
    if (el.src.startsWith(STARTID)) return;
    el.src = proxy(el.src);
  }
  // function watch() {
  //   if (!window.reader) return;
  //   window.reader.media_url = WORKER + "https://i.nhentai.net/";
  //   new Promise((resolve) => {
  //     const container = window.reader.$image_container;
  //     if (container) {
  //       new MutationObserver((mutationList) => {
  //         mutationList.forEach((mutation) => {
  //           if (mutation.oldValue) replaceReader();
  //           console.log("trigger mutation observer");
  //         });
  //       }).observe(container, {
  //         attributes: true,
  //         attributeOldValue: true,
  //         subtree: true,
  //       });
  //     }
  //     resolve();
  //   });
  // }
  setTimeout(() => {
    replace();
    // watch();
    replaceReader();
    Object.defineProperty(unsafeWindow._n_app, "get_cdn_url", {
      configurable: true,
      value: function (t) {
        if (t.startsWith(STARTID)) return t;
        var e = this.options.media_server;
        return (
          WORKER +
          t.replace(/\/\/([it])\d*\./, function (t, n) {
            return "//".concat(n).concat(e, ".");
          })
        );
      },
    });
    Object.defineProperty(
      unsafeWindow._n_app.lazy_loader,
      "handle_image_loaded",
      {
        configurable: true,
        value: function (t) {
          if (t.src.startsWith(STARTID)) return;
          t.src = WORKER + t.dataset.src;
        },
      }
    );
  }, 1000);
  GM_addStyle(`.alert.alert-danger{display: none !important;}`); // hide network alert
})();

// nhentai 助手 Custom Download Url:
// https://raw.yourName.workers.dev/?https://i.nhentai.net/galleries/{{mid}}/{{index}}.{{ext}}
