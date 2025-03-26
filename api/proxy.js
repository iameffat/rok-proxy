// api/proxy.js
const fetch = require('node-fetch');

export default async function handler(req, res) {
  const { url } = req.query; // Get the URL from the query parameter

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is missing' });
  }

  try {
    // Fetch the page content from the URL
    const response = await fetch(url);
    const html = await response.text();

    // Parse HTML to extract Open Graph meta tags (og:image, og:title, etc.)
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');

    res.status(200).json({
      ogImage,
      ogTitle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
