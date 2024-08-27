"use strict";
const fetch = require('node-fetch');


async function createReviewSummary(reviewConfig, pluginOptions, reporter) {
  const {
    publicKey,
    storeHash,
    summaryReview
  } = pluginOptions;

  if (summaryReview === true) {
    try {
      const productIds = reviewConfig.results.map(result => ({
        productId: result.review.productId
      }));
  
      const requestBody = {
        productIds: productIds,
        apiKey: publicKey,
        storeUrl: storeHash
      };
  
      const response = await fetch('https://stamped.io/api/widget/badges?isIncludeBreakdown=true&isincludehtml=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        reporter.warn(`Failed to fetch StampedReviewSummary: ${response.statusText}`);
        return;
      };
  
      const data = await response.json();
      reporter.success('fetching StampedRatingSummary');

      return data;
    } catch (error) {
      reporter.panicOnBuild(`Error fetching StampedReviewSummary: ${error.message}`);
    };
  };
};

module.exports = {
  createReviewSummary: createReviewSummary
};