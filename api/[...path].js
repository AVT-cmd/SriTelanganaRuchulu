import app from '../backend/dist/index.js';

export default function handler(req, res) {
  return app(req, res);
}

