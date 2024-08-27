"use strict";
const { createRemoteFileNode } = require('gatsby-source-filesystem');


async function cacheAssets(gatsbyApi, imageUrl) {
  const {
    cache,
    store,
    actions,
    reporter,
    createNodeId,
    createContentDigest
  } = gatsbyApi;
  const { createNode } = actions;

  try {
    const fileNode = await createRemoteFileNode({
      url: imageUrl,
      store,
      cache,
      createNode,
      createNodeId,
      createContentDigest,
      reporter,
      parentNodeId: null
    });

    return fileNode;
  } catch (error) {
    reporter.panic(`Error adding image to Gatsby cache from ${imageUrl}:`, error);
    return null;
  }
};

module.exports = {
  cacheAssets: cacheAssets
};