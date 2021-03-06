export default class Client {
  constructor({
    transport,
    baseUrl,
    authorization,
    sendCookies = false,
    middleware = [],
  }) {
    this.transport = transport
    this.baseUrl = baseUrl
    this.authorization = authorization
    this.sendCookies = sendCookies
    this.middleware = middleware
    this.user = null
  }

  async _fetchCSRFToken() {
    if (this.user && this.user._csrfToken) {
      return this.user._csrfToken
    }

    const response = await this.send(new Request(`${this.baseUrl || ''}/rest/session/token`))
    return response.text()
  }

  async send(request) {
    if (!this.transport) {
      throw new Error('No HTTP transport method provided. Pass a transport function to your Client or set GlobalClient.transport.')
    }

    const {
      url,
      body,
      cache,
      credentials,
      headers,
      integrity,
      method,
      mode,
      redirect,
      referrer,
      referrerPolicy,
    } = request;

    // node.js Request doesn't have cookies
    const credentialsCopy = this.sendCookies === true ? 'same-origin' : credentials

    // Browser Request.url is prefixed with origin when not origin not specified
    let urlCopy = url
    try {
      const urlObject = new URL(url)
      urlCopy = urlObject.pathname + urlObject.search
    } catch (err) { /* noop */ }

    // Browser Request.body is undefined
    let bodyCopy = body
    if (bodyCopy === undefined && method !== 'GET') {
      const contentType = headers.get('content-type')
      if (contentType === 'application/octet-stream') {
        bodyCopy = await request.arrayBuffer()
      } else {
        bodyCopy = await request.text()
      }
    }

    let copy = new Request(this.baseUrl + urlCopy, {
      body: bodyCopy,
      cache,
      credentials: credentialsCopy,
      headers,
      integrity,
      method,
      mode,
      redirect,
      referrer,
      referrerPolicy,
    })

    if (this.sendCookies === true && url.indexOf('/rest/session/token') === -1) {
      const xCsrfToken = await this._fetchCSRFToken()
      copy.headers.set('X-CSRF-Token', xCsrfToken)
    }

    if (typeof this.authorization === 'string') {
      copy.headers.set('Authorization', this.authorization)
    }

    for (let i = 0; i < this.middleware.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      copy = await this.middleware[i](copy)
    }

    const response = this.transport(copy)
    if (!response) {
      throw new Error(`HTTP transport returned ${response}. Expected a Response.`)
    }
    return response
  }
}
