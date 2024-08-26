"use strict"
const utils = require('./utils');


async function createNodes(gatsbyApi, pluginOptions) {
  const {
    actions,
    reporter,
    createNodeId,
    createContentDigest
  } = gatsbyApi;
  const {
    createNode
  } = actions;
  const { summaryReview } = pluginOptions;

  const review = utils._cache.reviewConfig;
  const summary = utils._cache.summaryConfig;

  const stampedAssets = {};
  if (review && review.results) {
    for (const result of review.results) {
      if (result.review.productImageUrl) {
        const imageMetadata = await utils.getImageMetadata(result.review.productImageUrl);
        const assetNodeId = createNodeId(`StampedAsset-${result.review.id}`);

        const assetNodeData = {
          id: assetNodeId,
          parent: null,
          children: [],
          url: result.review.productImageUrl,
          width: imageMetadata.width,
          height: imageMetadata.height,
          mimeType: imageMetadata.mimeType,
          internal: {
            type: 'StampedAsset',
            content: JSON.stringify({
              url: result.review.productImageUrl,
              ...imageMetadata
            }),
            contentDigest: createContentDigest({
              url: result.review.productImageUrl,
              ...imageMetadata
            })
          }
        };

        createNode(assetNodeData);
        stampedAssets[result.review.id] = assetNodeData;
      };  
    };

    for (const result of review.results) {
      const nodeId = createNodeId(`StampedReview-${result.review.id}`);

      let productImage = null;
      if (result.review.productImageUrl) {
        const assetNodeData = stampedAssets[result.review.id];
        productImage = assetNodeData;
        delete result.review.productImageUrl;
      };

      const nodeData = {
        ...result,
        review: {
          ...result.review,
          productImage
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
  } else {
    reporter.warn('No review data found in the stamped API response.');
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