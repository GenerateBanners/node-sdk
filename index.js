const fetch = require("node-fetch");
const sha256 = require("js-sha256");

const defaultDomain = "https://api.generatebanners.com";

function signWithHmac(toSign, secret) {
  const hmac = sha256.hmac(secret, toSign);
  return toSign + `&hmac=${hmac}`;
}

function encodeVariables(variables = {}) {
  return Object.keys(variables).map(
    (key) => encodeURIComponent(key) + "=" + encodeURIComponent(variables[key])
  ).join`&`;
}

function checkStatus(res) {
  if (res.ok) {
    // res.status >= 200 && res.status < 300
    return res;
  } else {
    throw new Error(res.statusText);
  }
}

class Template {
  constructor({ apiKey, apiSecret, domain = defaultDomain }) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.domain = domain;
  }

  async browse({ page, limit }) {
    return await fetch(
      `${this.domain}/api/v1/${this.apiKey}/template?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      }
    )
      .then(checkStatus)
      .then((r) => r.json());
  }

  async add({ template }) {
    return await fetch(`${this.domain}/api/v1/${this.apiKey}/template`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
    })
      .then(checkStatus)
      .then((r) => r.json());
  }

  async delete({ templateId }) {
    if (!templateId) {
      throw new Error(`The value 'templateId' can't be null`);
    }
    return await fetch(
      `${this.domain}/api/v1/${this.apiKey}/template/${templateId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.apiSecret}`,
          "Content-Type": "application/json",
        },
      }
    ).then(checkStatus);
  }
}

class Image {
  constructor({ apiKey, apiSecret, domain = defaultDomain }) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.domain = domain;
  }

  url({ templateId, variables, version = "v1" }) {
    return `/api/${version}/${
      this.apiKey
    }/template/${templateId}/render?${encodeVariables(variables)}`;
  }

  signedUrl({ templateId, variables, version = "v1" }) {
    const url = this.url({ templateId, variables, version });

    return this.domain + signWithHmac(url, this.apiSecret);
  }
}

class Screenshot {
  constructor({ apiKey, apiSecret, domain = defaultDomain }) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.domain = domain;
  }

  url({ variables, version = "v1" }) {
    return `/api/${version}/${this.apiKey}/screenshot/render?${encodeVariables(
      variables
    )}`;
  }

  signedUrl({ variables, version = "v1" }) {
    const url = this.url({ variables, version });

    return this.domain + signWithHmac(url, this.apiSecret);
  }
}

class Utils {
  constructor({ apiKey, apiSecret, domain = defaultDomain }) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.domain = domain;
  }

  async download(url) {
    return await fetch(url, {
      method: "GET",
    })
      .then(checkStatus)
      .then((r) => r.buffer());
  }
}

class GenerateBannersSDK {
  constructor({ apiKey, apiSecret, domain = defaultDomain }) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.domain = domain;

    this.template = new Template({ apiKey, apiSecret, domain });
    this.image = new Image({ apiKey, apiSecret, domain });
    this.screenshot = new Screenshot({ apiKey, apiSecret, domain });
    this.utils = new Utils({ apiKey, apiSecret, domain });
  }
}

module.exports = GenerateBannersSDK;
