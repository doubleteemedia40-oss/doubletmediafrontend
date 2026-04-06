import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedCount = 0;
walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace text-white/10, text-white/20, text-white/30, etc.
    content = content.replace(/text-white\/(\d{1,2})/g, (match, p1) => {
      let val = parseInt(p1, 10);
      if (val >= 10 && val <= 60) {
        return `text-white/${val + 30}`;
      } else if (val < 10 && val > 0) {
        return `text-white/30`;
      }
      return match;
    });

    // Replace text-white/[0.04], text-white/[0.06] patterns
    content = content.replace(/text-white\/\[0\.(\d+)\]/g, (match, p1) => {
        let val = parseInt(p1, 10); // e.g. "06" -> 6
        if(p1.startsWith('0')) { // Like 0.06
             return `text-white/30`;
        } else {
             // Like 0.4 meaning 40%
             let percent = val;
             if(p1.length === 1) percent *= 10;
             if (percent >= 10 && percent <= 60) {
                 return `text-white/${percent + 30}`;
             }
             return `text-white/30`;
        }
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
      modifiedCount++;
    }
  }
});

console.log(`Successfully updated ${modifiedCount} files.`);
