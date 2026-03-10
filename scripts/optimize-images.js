const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'images');

async function convertToWebP(inputPath, outputPath, options = {}) {
    const { width, quality = 80 } = options;
    let pipeline = sharp(inputPath);
    if (width) {
        pipeline = pipeline.resize(width);
    }
    await pipeline.webp({ quality }).toFile(outputPath);
    const stats = fs.statSync(outputPath);
    console.log(`  -> ${path.basename(outputPath)} (${(stats.size / 1024).toFixed(1)}KB)`);
}

async function optimizeHero() {
    console.log('\n--- Hero images ---');
    const desktop = path.join(IMAGES_DIR, 'hero', 'ekaterina-main.png');
    const mobile = path.join(IMAGES_DIR, 'hero', 'ekaterina-main-mobile.png');

    if (fs.existsSync(desktop)) {
        await convertToWebP(desktop, desktop.replace('.png', '.webp'));
        for (const w of [1920, 1280, 960]) {
            await convertToWebP(desktop, desktop.replace('.png', `-${w}w.webp`), { width: w });
        }
    }

    if (fs.existsSync(mobile)) {
        await convertToWebP(mobile, mobile.replace('.png', '.webp'));
        for (const w of [853, 640]) {
            await convertToWebP(mobile, mobile.replace('.png', `-${w}w.webp`), { width: w });
        }
    }
}

async function optimizeGallery() {
    console.log('\n--- Gallery images ---');
    const galleryDir = path.join(IMAGES_DIR, 'gallery');
    const files = fs.readdirSync(galleryDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f) && !f.endsWith('.webp'));

    for (const file of files) {
        const inputPath = path.join(galleryDir, file);
        const ext = path.extname(file);
        const baseName = file.replace(ext, '');
        const outputPath = path.join(galleryDir, `${baseName}.webp`);

        console.log(`Processing: ${file}`);
        await convertToWebP(inputPath, outputPath);
        // Thumbnail 400w
        await convertToWebP(inputPath, path.join(galleryDir, `${baseName}-400w.webp`), { width: 400 });
    }
}

async function optimizeVideo() {
    console.log('\n--- Video covers ---');
    const videoDir = path.join(IMAGES_DIR, 'video');
    const files = fs.readdirSync(videoDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));

    for (const file of files) {
        const inputPath = path.join(videoDir, file);
        const ext = path.extname(file);
        const outputPath = path.join(videoDir, file.replace(ext, '.webp'));

        console.log(`Processing: ${file}`);
        await convertToWebP(inputPath, outputPath);
    }
}

async function optimizeBranding() {
    console.log('\n--- Branding images ---');
    const brandingDir = path.join(IMAGES_DIR, 'branding');
    const files = fs.readdirSync(brandingDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));

    for (const file of files) {
        const inputPath = path.join(brandingDir, file);
        const ext = path.extname(file);
        const outputPath = path.join(brandingDir, file.replace(ext, '.webp'));

        console.log(`Processing: ${file}`);
        await convertToWebP(inputPath, outputPath);
    }
}

async function main() {
    console.log('Starting image optimization...');
    await optimizeHero();
    await optimizeGallery();
    await optimizeVideo();
    await optimizeBranding();
    console.log('\nDone!');
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
