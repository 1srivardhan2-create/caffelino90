const fs = require('fs');
const path = 'c:/Users/1sriv/Downloads/file-main/file-main/src/components/MeetupChatBilling.tsx';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.includes('selectedCafe')) {
        console.log(`${i + 1}: ${line.trim()}`);
    }
});
