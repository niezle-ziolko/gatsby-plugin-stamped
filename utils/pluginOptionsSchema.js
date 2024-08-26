"use strict"
const Joi = require('joi');

module.exports = {
  publicKey: Joi.string().required(),
  privateKey: Joi.string().required(),
  storeHash: Joi.string().required(),
  summaryReview: Joi.boolean().default(true),
  
  downloadLocalImages: Joi.boolean().default(false),
  concurrency: Joi.number().integer().min(1).default(50),
  interval: Joi.number().min(300).default(1000),
  assetsDir: Joi.string().default('.assets')
};