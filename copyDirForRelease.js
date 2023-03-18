const fs = require('fs');
const path = require('path');

// Define the source and destination directories
const srcDir = './';
const destDir = 'prod';

// Copy the *.production.min.js files from srcDir/dist
const distDir = path.join(srcDir, 'dist');
fs.readdir(distDir, (err, files) => {
  if (err) {
    console.error(err);
  } else {
    files.forEach(file => {
      if (
        file.endsWith('.production.min.js') ||
        file.endsWith('.production.min.js.map')
      ) {
        const srcFile = path.join(distDir, file);
        const destFile = path.join(destDir, file);
        fs.copyFile(srcFile, destFile, err => {
          if (err) {
            console.error(err);
          } else {
            console.log(`File ${srcFile} copied successfully.`);
          }
        });
      }
    });
  }
});

// Copy the dist/*.d.ts files
const copyDirRecursive = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    if (fs.statSync(srcFile).isDirectory()) {
      copyDirRecursive(srcFile, destFile);
    } else {
      if (srcFile.endsWith('.d.ts')) {
        fs.copyFile(srcFile, destFile, err => {
          if (err) {
            console.error(err);
          } else {
            console.log(`File ${srcFile} copied successfully.`);
          }
        });
      }
    }
  });
};

copyDirRecursive(path.join(srcDir, 'dist'), path.join(destDir));
