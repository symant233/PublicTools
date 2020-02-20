const wallpaper = require('wallpaper');
const request = require('request');
const fs = require('fs');

const file = './images/current.png';
const domain = 'https://cn.bing.com';
const regex = /<div id="bgImgProgLoad" data-ultra-definition-src="(\/.+)" data-explicit-bing-load/g;

var download = function (uri, filename) {
    request(uri).pipe(fs.createWriteStream(filename));
};

request(domain, (err, res) => {
    if (err) console.log(err);
    else {
        const link = domain + regex.exec(res.body)[1];
        request(link)
            .pipe(fs.createWriteStream(file))
            .on('end', function () {
                wallpaper.set('./images/current.png');
            });
    }
}); // 我服, request nb 老子不用node写爬虫行了吧

// wallpaper.set('./images/current.png');
