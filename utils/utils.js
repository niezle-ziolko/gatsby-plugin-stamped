"use strict";
const fs = require('fs');
const sharp = require('sharp');
const fetch = require('node-fetch');


const _cache = {};

async function getImageMetadata(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    const metadata = await sharp(buffer).metadata();
    
    return {
      width: metadata.width,
      height: metadata.height,
      mimeType: `image/${metadata.format}`
    };
  } catch (error) {
    reporter.warn(`Failed to fetch image metadata for ${imageUrl}: ${error.message}`);
    return {};
  };
};

async function downloadImage(imageUrl, filePath) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${imageUrl}`);
  };

  const buffer = await response.buffer();
  fs.writeFileSync(filePath, buffer);
};

function generateRandomString(length = 32) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  };

  return result;
};

module.exports = {
  _cache,
  downloadImage,
  getImageMetadata,
  generateRandomString
};