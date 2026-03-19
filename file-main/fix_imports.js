const fs = require('fs');
const path = require('path');

function processDirectory(directory) {
    const pattern = /^(\s*)import\s+(\w+)\s+from\s+['"]figma:asset\/[^'"]+['"];?\s*$/gm;
    let count = 0;

    function walkSync(currentDirPath) {
        fs.readdirSync(currentDirPath).forEach(function (name) {
            var filePath = path.join(currentDirPath, name);
            var stat = fs.statSync(filePath);
            if (stat.isFile() && /\.(tsx|ts|jsx|js)$/.test(filePath)) {
                let content = fs.readFileSync(filePath, 'utf8');
                let newContent = content.replace(pattern, (match, indent, varName) => {
                    let pathName = varName;
                    if (pathName.startsWith('imgImage')) {
                        pathName = pathName.substring(8);
                    } else if (pathName.startsWith('img')) {
                        pathName = pathName.substring(3);
                    }
                    if (pathName) {
                        pathName = pathName.charAt(0).toLowerCase() + pathName.slice(1);
                    } else {
                        pathName = "asset";
                    }
                    return `${indent}const ${varName} = "/${pathName}.png";`;
                });
                if (newContent !== content) {
                    fs.writeFileSync(filePath, newContent, 'utf8');
                    console.log(`Updated ${filePath}`);
                    count++;
                }
            } else if (stat.isDirectory() && name !== 'node_modules') {
                walkSync(filePath);
            }
        });
    }

    walkSync(directory);
    console.log(`Total files updated: ${count}`);
}

processDirectory("c:/Users/1sriv/Downloads/file-main/file-main/src");
