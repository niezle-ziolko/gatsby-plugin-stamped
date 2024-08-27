"use strict";
const fetch = require('node-fetch');


async function createReview(pluginOptions, reporter) {
  const {
    publicKey,
    storeHash,
    privateKey
  } = pluginOptions;

  if (!storeHash) {
    reporter.panicOnBuild('You must provide a storeHash option.');
    return;
  };

  if (!publicKey || !privateKey) {
    reporter.panicOnBuild('You must provide both publicKey or privateKey.');
    return;
  };

  const apiUrl = `https://stamped.io/api/v2/${storeHash}/dashboard/reviews`;
  const auth = Buffer.from(`${publicKey}:${privateKey}`, 'utf8').toString('base64');

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      reporter.warn(`Failed to fetch StampedReview: ${response.statusText}`);
      return;
    };

    const data = await response.json();
    reporter.success('fetching StampedReview');

    return data;
  } catch (error) {
    reporter.panicOnBuild(`Error fetching StampedReview: ${error.message}`);
  };
};

module.exports = {
  createReview: createReview
};