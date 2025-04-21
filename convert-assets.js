const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const convertSvgToPng = async (inputPath, outputPath, width, height) => {
  try {
    const svgBuffer = fs.readFileSync(inputPath);
    
    await sharp(svgBuffer)
      .resize(width, height)
      .png()
      .toFile(outputPath);
    
    console.log(`Converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
  }
};

const main = async () => {
  const assetsDir = path.join(__dirname, 'assets');
  
  // Create PNGs from SVGs
  await convertSvgToPng(
    path.join(assetsDir, 'icon.svg'),
    path.join(assetsDir, 'icon.png'),
    1024,
    1024
  );
  
  await convertSvgToPng(
    path.join(assetsDir, 'splash.svg'),
    path.join(assetsDir, 'splash.png'),
    1242,
    2436
  );
  
  await convertSvgToPng(
    path.join(assetsDir, 'adaptive-icon.svg'),
    path.join(assetsDir, 'adaptive-icon.png'),
    1024,
    1024
  );
  
  await convertSvgToPng(
    path.join(assetsDir, 'favicon.svg'),
    path.join(assetsDir, 'favicon.png'),
    32,
    32
  );
  
  console.log('All assets converted successfully!');
};

main().catch(console.error);