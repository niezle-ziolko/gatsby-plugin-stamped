"use strict";
const utils = require('./utils/utils');

const pluginOptions = require('./utils/pluginOptionsSchema');
const { createReview } = require('./utils/createReview');
const { createReviewSummary } = require('./utils/createReviewSummary');
const { schemaCustomization } = require('./utils/schemaCustomization');
const { createNodes } = require('./utils/createNodes');


exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object(pluginOptions);
};

exports.createSchemaCustomization = async (args, options) => {
  const { reporter } = args;

  const reviewConfig = await createReview(options, reporter);
  const summaryConfig = await createReviewSummary(reviewConfig, options, reporter);

  utils._cache.reviewConfig = reviewConfig;
  utils._cache.summaryConfig = summaryConfig;

  await schemaCustomization(args);
};

exports.sourceNodes = async (args, options) => {
  const { reporter } = args;

  await createNodes(args, options, reporter);
};