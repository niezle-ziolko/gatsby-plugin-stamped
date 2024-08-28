"use strict";
const path = require('path');
const filesystem = require('gatsby-source-filesystem');


async function cacheAssets(gatsbyApi, imageUrl) {
  const {
    cache,
    store,
    actions,
    reporter,
    getCache,
    createNodeId
  } = gatsbyApi;
  const { createNode } = actions;

  const fileName = path.basename(new URL(imageUrl).pathname);
  const ext = path.extname(fileName);
  const name = path.basename(fileName, ext);

  const createFileNode = {
    createNode,
    createNodeId,
    getCache,
    cache,
    store,
    reporter,
    name,
    ext
  };

  try {
    const fileNode = await filesystem.createRemoteFileNode({
      url: imageUrl,
      ...createFileNode
    });

    return fileNode;
  } catch (error) {
    reporter.panic(`Error adding image to Gatsby cache from ${imageUrl}:`, error);
    return null;
  };
};

module.exports = { cacheAssets };