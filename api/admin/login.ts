import type { IncomingMessage, ServerResponse } from 'http';
import { createSessionCookie, readJsonBody, sendJson, validateCredentials } from './_auth.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
  try {
    const body = await readJsonBody<{ username?: string; password?: string }>(req);
    const username = String(body.username || '');
    const password = String(body.password || '');
    if (!validateCredentials(username, password)) return sendJson(res, 401, { error: 'Invalid username or password' });
    res.setHeader('Set-Cookie', await createSessionCookie(username));
    return sendJson(res, 200, { ok: true, username });
  } catch (error) {
    return sendJson(res, 500, { error: error instanceof Error ? error.message : 'Login failed' });
  }
}
