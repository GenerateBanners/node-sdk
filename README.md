<p align="center">
  <img src="https://user-images.githubusercontent.com/494686/197189894-5fc1f4da-2051-47a9-95ec-2c4649cf0d1b.png" alt="GenerateBanners logo" width="128px">
</p>

<p align="center">
  <a href="https://www.generatebanners.com/">GenerateBanners.com</a> •
  <a href="https://www.generatebanners.com/documentation/api">API documentation</a> •
  <a href="https://twitter.com/GenerateBanners">Twitter</a>
</p>


> Automate image generation with ease.
>
> Use the GenerateBanners.com visual editor to create your templates. Use this SDK to generate many image variations.


## Table of contents

1. [Installation](#installation)
2. [Loading and configuring the module](#loading-and-configuring-the-module)
3. [Common usage](#common-usage)
    1. [Create an image url from a template](#create-an-image-url-from-a-template)
    2. [Generate an image and download it](#generate-an-image-and-download-it)

## Installation

To install the GenerateBanners SDK with NPM, run:

```
npm i @generatebanners/node-sdk
```

If you want to install it with Yarn instead, run:

```
yarn add @generatebanners/node-sdk
```

## Loading and configuring the module

Load the module via `require`:

```javascript
const GenerateBanners = require('@generatebanners/node-sdk');
```

Get your API key and secret on the [account page](https://www.generatebanners.com/app/account). We recommand you use environment variables to keep your crendentials secure.

```javascript
const client = new GenerateBanners({
    apiKey: process.env.GB_API_KEY,
    apiSecret: process.env.GB_API_SECRET,
});
```

You would then run your file in the following way (if you have called your file `index.js`):

```
GB_API_KEY=p_123 GB_API_SECRET=s_123 node index.js
```

## Common usage

### Create an image url from a template

```javascript
const GenerateBanners = require('@generatebanners/node-sdk');

const client = new GenerateBanners({
    apiKey: process.env.GB_API_KEY,
    apiSecret: process.env.GB_API_SECRET,
});

// Find TEMPLATE_ID by going to https://www.generatebanners.com/app then clicking on your template
const imageUrl = sdk.image.signedUrl({
  templateId: "TEMPLATE_ID",
  variables: {
    title_text: "My title",
  },
});
```

### Generate an image and download it

```javascript
const fs = require("fs").promises;
const GenerateBanners = require('@generatebanners/node-sdk');

async function main() {
    const client = new GenerateBanners({
        apiKey: process.env.GB_API_KEY,
        apiSecret: process.env.GB_API_SECRET,
    });

    // Find TEMPLATE_ID by going to https://www.generatebanners.com/app then clicking on your template
    const imageUrl = sdk.image.signedUrl({
      templateId: "TEMPLATE_ID",
      variables: {
        title_text: "My title",
      },
    });
    
    const img = await sdk.utils.download(imageUrl);
    await fs.writeFile(`./generated-${Date.now()}.jpg`, img);
}

main();
```
