"use strict";
const utils = require('./utils');
const { downloadAssets } = require('./downloadAssets');
const { cacheAssets } = require('./cacheAssets');


async function createNodes(gatsbyApi, pluginOptions, reporter) {
  const {
    actions,
    createNodeId,
    createContentDigest
  } = gatsbyApi;
  const {
    createNode
  } = actions;
  const {
    assetsDir,
    summaryReview,
    downloadLocalImages
  } = pluginOptions;

  const review = utils._cache.reviewConfig;
  const summary = utils._cache.summaryConfig;

  if (!review || !review.results) {
    reporter.warn('No review data found in the stamped API response.');
    return;
  };

  if (downloadLocalImages && assetsDir) {
    try {
      await downloadAssets(gatsbyApi, pluginOptions, review.results);
    } catch (error) {
      reporter.error('Error downloading local images:', error);
      return;
    };
  };

  const stampedAssets = {};

  for (const result of review.results) {
    if (result.review.productImageUrl) {
      try {
        const imageUrl = result.review.productImageUrl;
        const localFileNode = await cacheAssets(gatsbyApi, imageUrl);
        
        if (!localFileNode) {
          reporter.warn(`Failed to create local file node for image ${imageUrl}`);
          continue;
        }

        const imageMetadata = await utils.getImageMetadata(imageUrl);
        const assetNodeId = createNodeId(`StampedAsset-${result.review.id}`);

        const assetNodeData = {
          id: assetNodeId,
          parent: null,
          children: [],
          url: imageUrl,
          width: imageMetadata.width,
          height: imageMetadata.height,
          mimeType: imageMetadata.mimeType,
          localFile: {
            ...localFileNode
          },
          internal: {
            type: 'StampedAsset',
            content: JSON.stringify({
              url: imageUrl,
              ...imageMetadata
            }),
            contentDigest: createContentDigest({
              url: imageUrl,
              ...imageMetadata
            })
          }
        };

        createNode(assetNodeData);
        stampedAssets[result.review.id] = assetNodeId;
      } catch (error) {
        reporter.error(`Error processing image for review ${result.review.id}:`, error);
      };
    };
  };

  for (const result of review.results) {
    const nodeId = createNodeId(`StampedReview-${result.review.id}`);

    const nodeData = {
      ...result,
      review: {
        ...result.review,
        productImageUrl: undefined,
        productImageAsset___NODE: stampedAssets[result.review.id] || null
      },
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: 'StampedReview',
        content: JSON.stringify(result),
        contentDigest: createContentDigest(result)
      }
    };

    createNode(nodeData);
  };

  if (summaryReview === true) {
    if (summary) {
      summary.forEach(result => {
        const nodeId = createNodeId(`StampedRatingSummary-${result.productId}`);
        const nodeData = {
          ...result,
          id: nodeId,
          parent: null,
          children: [],
          internal: {
            type: 'StampedRatingSummary',
            content: JSON.stringify(result),
            contentDigest: createContentDigest(result)
          }
        };

        createNode(nodeData);
      });
    } else {
      reporter.warn('No summary data found in the stamped API response.');
    };
  };
};

module.exports = {
  createNodes: createNodes
};