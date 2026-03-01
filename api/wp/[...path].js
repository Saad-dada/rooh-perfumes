/* Vercel Serverless proxy for WordPress `/wp-json/*` endpoints
   Forwards requests to the upstream WP host defined in `VITE_WC_BASE_URL`.
   Keeps the browser same-origin so CORS errors are avoided. */

const TARGET = (process.env.VITE_WC_BASE_URL || '').replace(/\/\/+$/, '')

export default async function handler(req, res) {
  if (!TARGET) {
    res.statusCode = 500
    res.end('Missing VITE_WC_BASE_URL')
    return
  }

  // `req.query.path` is an array for catch-all routes
  const segments = req.query.path || []
  const tail = Array.isArray(segments) ? segments.join('/') : segments
  const upstream = `${TARGET}/wp-json/${tail}`

  try {
    // Collect request body if present
    let body = null
    if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      body = Buffer.concat(chunks)
    }

    const headers = { ...req.headers }
    // Remove host to avoid upstream canonical redirects
    delete headers.host

    const resp = await fetch(upstream, {
      method: req.method,
      headers,
      body: body ?? undefined,
      redirect: 'manual',
    })

    // Forward status
    res.statusCode = resp.status

    // Copy headers (but omit hop-by-hop headers)
    resp.headers.forEach((value, key) => {
      if (['transfer-encoding', 'content-encoding', 'connection'].includes(key)) return
      res.setHeader(key, value)
    })

    const buffer = await resp.arrayBuffer()
    res.end(Buffer.from(buffer))
  } catch (err) {
    console.error('[api/wp] proxy error', err)
    res.statusCode = 502
    res.end('Bad gateway')
  }
}
