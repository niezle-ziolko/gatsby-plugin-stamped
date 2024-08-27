"use strict";
const graphql = require('gatsby-plugin-image/graphql-utils');
const feature = require('gatsby-plugin-utils/has-feature');

const image = require('./resolveGatsbyImageData');


async function schemaCustomization(gatsbyApi) {
  const {
    schema,
    actions
  } = gatsbyApi;
  const { createTypes } = actions;

  const objectType = schema.buildObjectType({
    name: 'StampedAsset',
    fields: {
      gatsbyImageData: {
        ...graphql.getGatsbyImageFieldConfig(async (...args) => 
        image.resolveGatsbyImageData(...args, gatsbyApi)),
        type: feature.hasFeature('graphql-typegen') ? 'GatsbyImageData' : 'JSON'
      },
      placeholderUrl: {
        type: 'String',
      },
      localFile: {
        type: 'File',
        extensions: {
          link: {
            from: 'fields.localFile'
          }
        }
      }
    },
    interfaces: ['Node']
  });

  const assetType = objectType;
  createTypes(assetType);
};

module.exports = {
  schemaCustomization: schemaCustomization
};