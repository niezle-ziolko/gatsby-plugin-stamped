"use strict"
const Joi = require('joi');

module.exports = {
  publicKey: Joi.string().required(),
  privateKey: Joi.string().required(),
  storeHash: Joi.string().required(),
  summaryReview: Joi.boolean().default(true),
  downloadLocalImages: Joi.boolean().default(false),
  assetsDir: Joi.string().default('.assets')
};