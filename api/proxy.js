// api/proxy.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const response = await fetch('https://withjoy.com/andrew-and-emma-aug-25/registry');
  const data = await response.text();

  res.setHeader('X-Frame-Options', '');
  res.setHeader('Content-Security-Policy', '');
  res.status(200).send(data);
}