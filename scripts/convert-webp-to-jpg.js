const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const dir = path.join(__dirname, '..', 'public', 'logos');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.webp'));
    if (files.length === 0) {
      console.log('No .webp files found in', dir);
      return;
    }
    for (const file of files) {
      const input = path.join(dir, file);
      const output = path.join(dir, file.replace(/\.webp$/i, '.jpg'));
      console.log('Converting', input, '→', output);
      await sharp(input).jpeg({ quality: 85 }).toFile(output);
      console.log('Converted', output);
    }
    console.log('All conversions complete.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
