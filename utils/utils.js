"use strict"
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

module.exports = {
  _cache: _cache,
  getImageMetadata: getImageMetadata
};