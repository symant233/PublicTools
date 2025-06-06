const wallpaper = require('wallpaper');

const file = './images/current.png';
(async () => {
	await wallpaper.set(file);
})();