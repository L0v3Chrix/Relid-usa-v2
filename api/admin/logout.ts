import type { IncomingMessage, ServerResponse } from 'http';
import { clearSessionCookie, sendJson } from './_auth.js';

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Set-Cookie', clearSessionCookie());
  return sendJson(res, 200, { ok: true });
}
