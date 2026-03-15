import { favicons } from "favicons";
import sharp from "sharp";
import { writeFile, unlink } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, "../src/app/icon.png");
const dest = join(__dirname, "../public");
const appDir = join(__dirname, "../src/app");

// Step 1: Ensure we have a square icon (crop center, resize to 512x512 for best quality)
const img = await sharp(src);
const meta = await img.metadata();
const { width, height } = meta;
const size = Math.min(width, height);
const left = Math.floor((width - size) / 2);
const top = Math.floor((height - size) / 2);

const squarePng = await sharp(src)
  .extract({ left, top, width: size, height: size })
  .resize(512, 512)
  .png()
  .toBuffer();

// Step 2: Save optimized icon.png (32x32) and apple-icon.png (180x180) to app dir
const icon32 = await sharp(squarePng).resize(32, 32).png().toBuffer();
const apple180 = await sharp(squarePng).resize(180, 180).png().toBuffer();

await writeFile(join(appDir, "icon.png"), icon32);
await writeFile(join(appDir, "apple-icon.png"), apple180);
console.log("Updated src/app/icon.png (32x32) and apple-icon.png (180x180)");

// Step 3: Generate favicon.ico from square source (write temp file for favicons)
const tempSquare = join(__dirname, "../.temp-icon-square.png");
await writeFile(tempSquare, squarePng);

const response = await favicons(tempSquare, {
  path: "/",
  icons: {
    favicons: true,
    appleIcon: false,
    android: false,
    windows: false,
    yandex: false,
  },
});

const faviconImage = response.images.find((img) => img.name === "favicon.ico");
if (faviconImage) {
  await writeFile(join(dest, "favicon.ico"), faviconImage.contents);
  await writeFile(join(appDir, "favicon.ico"), faviconImage.contents);
  console.log("Generated public/favicon.ico and src/app/favicon.ico");
} else {
  console.error("favicon.ico not found in output");
  process.exit(1);
}

// Cleanup temp
await unlink(tempSquare).catch(() => {});
