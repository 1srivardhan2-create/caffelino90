const fs = require('fs');
const path = require('path');

const srcIcon = `C:\\Users\\1sriv\\.gemini\\antigravity\\brain\\b1d3b4f4-ab83-4420-99d8-24a8e8c2c499\\caffelino_app_icon_1779979888101.png`;
const srcSplash = `C:\\Users\\1sriv\\.gemini\\antigravity\\brain\\b1d3b4f4-ab83-4420-99d8-24a8e8c2c499\\caffelino_splash_screen_1779979905575.png`;

const destDir = path.join(__dirname, 'assets');
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(srcIcon, path.join(destDir, 'icon.png'));
fs.copyFileSync(srcSplash, path.join(destDir, 'splash.png'));

console.log('✅ Assets copied successfully to file-main/assets/!');
