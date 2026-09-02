const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const root = path.join(__dirname, '..', 'public');

    const walk = async (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(full);
        } else if (/\.webp$/i.test(entry.name)) {
          const out = full.replace(/\.webp$/i, '.jpg');
          console.log('Converting', full, '→', out);
          await sharp(full).jpeg({ quality: 85 }).toFile(out);
          console.log('Converted', out);
        }
      }
    };

    await walk(root);
    console.log('All conversions complete.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
