const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');


async function downloadAssets(pluginOptions, reviewResults) {
  const { assetsDir, downloadLocalImages } = pluginOptions;

  if (downloadLocalImages !== true || !assetsDir) {
    return;
  };

  const folderPath = path.resolve(process.cwd(), assetsDir);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  };

  const downloadImage = async (imageUrl, filePath) => {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${imageUrl}`);
    }
    const buffer = await response.buffer();
    fs.writeFileSync(filePath, buffer);
  };

  for (const result of reviewResults) {
    if (result.review && result.review.productImageUrl) {
      const imageUrl = result.review.productImageUrl;
      const imageName = path.basename(new URL(imageUrl).pathname);
      const filePath = path.join(folderPath, imageName);
      try {
        await downloadImage(imageUrl, filePath);
        console.log(`Image downloaded and saved to: ${filePath}`);
      } catch (error) {
        console.error(`Error downloading image from ${imageUrl}:`, error);
      };
    };
  };
};

module.exports = {
  downloadAssets: downloadAssets
};