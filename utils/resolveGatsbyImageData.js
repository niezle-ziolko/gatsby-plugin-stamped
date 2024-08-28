"use strict";
const path = require('path');
const promises = require('fs/promises');
const { getDominantColor } = require('gatsby-plugin-sharp');
const { fetchRemoteFile } = require('gatsby-core-utils/fetch-remote-file');
const { generateImageData, getLowResolutionImageURL } = require('gatsby-plugin-image');
const { getPluginOptions, doMergeDefaults } = require('gatsby-plugin-sharp/plugin-options');


function isImage(mimeType) {
  return mimeType.startsWith('image/') && mimeType.indexOf('/svg') === -1;
};
function getBase64DataURI(imageBase64) {
  return `data:image/png;base64,${imageBase64}`;
};
function generateImageSource(url, width, height, format) {
  if (!Number.isFinite(height)) height = width;

  return { width, height, format, src: url };
};

async function resolveGatsbyImageData(image, options, _context, _info, { reporter, cache }) {
  if (!isImage(image.mimeType)) return null;

  let format = image.mimeType.split('/')[1];
  if (format === 'jpeg') {
    format = 'jpg';
  };

  const sourceMetadata = {
    width: image.width,
    height: image.height,
    format: format
  };

  const sharpOptions = getPluginOptions();
  const userDefaults = sharpOptions.defaults;
  const defaults = {
    tracedSVGOptions: {},
    blurredOptions: {},
    jpgOptions: {},
    pngOptions: {},
    webpOptions: {},
    gifOptions: {},
    avifOptions: {},
    quality: 50,
    placeholder: `dominantColor`,
    ...userDefaults,
  };
  
  options = doMergeDefaults(options, defaults);
  
  if (options.placeholder && options.placeholder === 'tracedSVG') {
    if (!haveWarnedAboutPlaceholder) {
      reporter.warn('Does not support tracedSVG');
      haveWarnedAboutPlaceholder = true;
    };

    options.placeholder = 'dominantColor';
  };

  const imageDataArgs = {
    ...options,
    pluginName: 'gatsby-source-stamped-io',
    sourceMetadata,
    filename: image.url,
    generateImageSource,
    options
  };

  const imageData = generateImageData(imageDataArgs);
  if (
    options.placeholder === 'blurred' ||
    options.placeholder == 'dominantColor'
  ) {
    const lowResImageUrl = getLowResolutionImageURL(imageDataArgs, 20);
    
    const ext = path.extname(image.url) || '.jpg';
    
    const filePath = await fetchRemoteFile({
      url: lowResImageUrl,
      name: image.url,
      directory: cache.directory,
      ext: ext,
      cacheKey: image.internal.contentDigest,
    });

    if (options.placeholder === 'blurred') {
      const buffer = await promises.readFile(filePath);
      const base64 = buffer.toString('base64');
      
      imageData.placeholder = {
        fallback: getBase64DataURI(base64)
      };
    } else {
      imageData.backgroundColor = await getDominantColor(filePath);
    };
  };

  return imageData;
};

module.exports = { resolveGatsbyImageData };