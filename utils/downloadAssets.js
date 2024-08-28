"use strict";
const fs = require('fs');
const path = require('path');

const utils = require('./utils');
const { cacheAssets } = require('./cacheAssets');


async function downloadAssets(gatsbyApi, pluginOptions, reviewResults) {
  const {
    assetsDir,
    downloadLocalImages
  } = pluginOptions;

  if (downloadLocalImages !== true || !assetsDir) {
    return;
  };

  const folderPath = path.resolve(process.cwd(), assetsDir);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  };

  for (const result of reviewResults) {
    if (result.review && result.review.productImageUrl) {
      const imageUrl = result.review.productImageUrl;
      const imageName = path.basename(new URL(imageUrl).pathname);

      const randomFolderName = utils.generateRandomString();
      const randomFolderPath = path.join(folderPath, randomFolderName);

      if (!fs.existsSync(randomFolderPath)) {
        fs.mkdirSync(randomFolderPath, { recursive: true });
      };

      const filePath = path.join(randomFolderPath, imageName);
      try {
        await utils.downloadImage(imageUrl, filePath);
        await cacheAssets(gatsbyApi, imageUrl);

      } catch (error) {
        console.error(`Error downloading image from ${imageUrl}:`, error);
      };
    };
  };
};

module.exports = { downloadAssets };