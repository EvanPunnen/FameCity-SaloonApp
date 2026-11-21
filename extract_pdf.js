const fs = require('fs');
const path = require('path');

const pdfPath = 'C:\\Users\\evanp\\.gemini\\antigravity\\brain\\2cdac102-daf6-449d-b67f-654beefe5e4d\\.user_uploaded\\media_1795289459042_fe0fe066.pdf';
const buf = fs.readFileSync(pdfPath);
console.log('PDF length:', buf.length);

let start = 0;
let count = 0;
while (true) {
  const jpgStart = buf.indexOf(Buffer.from([0xFF, 0xD8, 0xFF]), start);
  if (jpgStart === -1) break;
  const jpgEnd = buf.indexOf(Buffer.from([0xFF, 0xD9]), jpgStart);
  if (jpgEnd === -1) break;
  count++;
  console.log('Found JPG ' + count + ': start ' + jpgStart + ', end ' + jpgEnd + ', size ' + (jpgEnd + 2 - jpgStart));
  fs.writeFileSync('logo_' + count + '.jpg', buf.subarray(jpgStart, jpgEnd + 2));
  start = jpgEnd + 2;
}
if (count === 0) {
  console.log('Searching PDF stream object...');
}
