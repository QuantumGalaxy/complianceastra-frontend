import { favicons } from "favicons";
import { writeFile, mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, "../src/app/icon.png");
const dest = join(__dirname, "../public");

const response = await favicons(src, {
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
  console.log("Generated public/favicon.ico");
} else {
  console.error("favicon.ico not found in output");
  process.exit(1);
}
