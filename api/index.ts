import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/server.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  app(req, res);
}
