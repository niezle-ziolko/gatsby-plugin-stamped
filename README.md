<h2  align="center">gatsby-plugin-stamped</h2>
<p  align="center">Unofficial plugin source from <a  href="https://stamped.io/">Stamped.io</a></p>

## Installation

```shell
npm  install  gatsby-plugin-stamped
```

or

```shell
yarn  add  gatsby-plugin-stamped
```

## Configuration

For the basic configuration of the plug-in, you need `publicKey`, `secretKey` and `storeHash`, which you can find in your Stamped panel. You can learn more information on where to find both keys [here](https://stampedsupport.stamped.io/hc/en-us/articles/9069863110043-Account-API-Keys).

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve:  'gatsby-plugin-stamped',
      options: {
        publicKey: process.env.STAMPED_PUB,
        secretKey: process.env.STAMPED_SECRET,
        storeHash: process.env.STAMPED_HASH
      }
    }
  ]
};
```

### Options

| Key | Type | Description |
|--|--|--|
| `publicKey` | String (**required**) | The public API key with which you authenticate to the Stamped system from an external source. This can be found [here](https://stampedsupport.stamped.io/hc/en-us/articles/9069863110043-Account-API-Keys). |
| `secretKey` | String (**required**) | The secret API key with which you authenticate to the Stamped system from an external source. This can be found [here](https://stampedsupport.stamped.io/hc/en-us/articles/9069863110043-Account-API-Keys). |
| `storeHash` | String (**required**) | The hash number, which is the shop number and is used to complete the endpoint you are trying to connect to. This can be found [here](https://stampedsupport.stamped.io/hc/en-us/articles/9069863110043-Account-API-Keys). |
| `summaryReview` | Boolean _(Default: `true`)_ | An option to disable the downloading of the overall total of all Stamped assessments. |
| `downloadAssets` | Boolean _(Default: `false`)_ | Download and cache all product images used in the reviews to the app memory. |
| `assetsDir` | String _(Default: `.stamped`)_ | Set to the name of the local cache directory. |

### Features

- [Usage Stamped Review](#usage-stamped-review)
- [Usage Stamped rating summary](#usage-stamped-rating-summary)
- [Downloading local image assets](#downloading-local-image-assets)
- [Usage with `gatsby-plugin-image`](#usage-with-gatsby-plugin-image)

### Usage Stamped Review

All reviews and the resources from which the reviews consist are available in the `StampedReview` node.

```gql
{
  allStampedReview {
    nodes {
      review {
        id
      }
    }
  }
}
```

### Usage Stamped rating summary

All your reviews are aggregated and the resources associated with them you can always use using the `allStampedRatingSummary` node.

```gql
{
  allStampedRatingSummary {
    nodes {
      id
    }
  }
}
```

If you don't need to use just add `summaryReview` to the plugin settings.

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve:  'gatsby-plugin-stamped',
      options: {
        publicKey: process.env.STAMPED_PUB,
        secretKey: process.env.STAMPED_SECRET,
        storeHash: process.env.STAMPED_HASH,
        summaryReview: false
      }
    }
  ]
};
```

### Downloading local image assets

If you prefer, the source plugin also provides the option to download and cache Stamped assets in your Gatsby project.

To enable this, add `downloadAssets: true` to your plugin configuration. This downloads all assets.

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve:  'gatsby-plugin-stamped',
      options: {
        publicKey: process.env.STAMPED_PUB,
        secretKey: process.env.STAMPED_SECRET,
        storeHash: process.env.STAMPED_HASH,
        downloadAssets: true
      }
    }
  ]
};
```

This adds a `localFile` field to the `StampedAsset` type which resolves to the file node generated at build by [`gatsby-source-filesystem`](https://www.gatsbyjs.org/packages/gatsby-source-filesystem).

```gql
{
  allStampedAsset {
    nodes {
      localFile {
        childImageSharp {
          gatsbyImageData(placeholder: BLURRED)
        }
      }
    }
  }
}
```

### Usage with `gatsby-plugin-image`

> Requires [`gatsby-plugin-image`](https://www.gatsbyjs.com/plugins/gatsby-plugin-image) as a project dependency.

Use the `gatsbyImageData` resolver on your `StampedAsset` nodes. 

```gql
{
  allStampedAsset {
    nodes {
      gatsbyImageData(placeholder: DOMINANT_COLOR)
    }
  }
}
```

#### `gatsbyImageData` resolver arguments

| Key | Type | Description |
|--|--|--|
| `aspectRatio` | Float | Force a specific ratio between the image’s width and height. |
| `backgroundColor` | String | Background color applied to the wrapper. |
| `breakpoints` | [Int] | Output widths to generate for full width images. Default is to generate widths for common device resolutions. It will never generate an image larger than the source image. The browser will automatically choose the most appropriate. |
| `height` | Int | Change the size of the image. |
| `layout` | GatsbyImageLayout (`CONSTRAINED`/`FIXED`/`FULL_WIDTH`) | Determines the size of the image and its resizing behavior. |
| `outputPixelDensities` | [Float] | A list of image pixel densities to generate. It will never generate images larger than the source, and will always include a 1x image. The value is multiplied by the image width, to give the generated sizes. For example, a `400` px wide constrained image would generate `100`, `200`, `400` and `800` px wide images by default. Ignored for full width layout images, which use `breakpoints` instead. |
| `quality` | Int | The default image quality generated. This is overridden by any format-specific options. |
| `sizes` | String | [The `<img> sizes` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attributes), passed to the img tag. This describes the display size of the image, and does not affect generated images. You are only likely to need to change this if your are using full width images that do not span the full width of the screen. |
| `width` | Int | Change the size of the image. |

For more information on using `gatsby-plugin-image`, please see the [documentation](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/).

#### Authors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/niezle-ziolko">
        <img src="https://cdn.buymeacoffee.com/uploads/profile_pictures/2024/08/4I7EgETWU4MsmODA.jpg@300w_0e.webp" width="100px;" alt=""/>
        <br><sub><b>_realNormanik</b></sub></br>
      </a>
      <br></br>
      <a href="https://github.com/niezle-ziolko" title="Code">💻</a>
    </td>
    <td>
      <p>I don't like my current job so I do programming as a hobby. If you want to support my passion and help me get away from my full-time job at an outsourcing hotline then I encourage you to buy me a coffee 😃. </p>
   <a href="https://www.buymeacoffee.com/_realNormanik" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="150px"></a>
    </td>
  </tr>
</table>