import type { IncomingMessage, ServerResponse } from 'http';
import { getSession, sendJson } from './_auth.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const session = await getSession(req);
    if (!session) return sendJson(res, 401, { error: 'Unauthorized' });
    return sendJson(res, 200, { ok: true, username: session.username });
  } catch (error) {
    return sendJson(res, 500, { error: error instanceof Error ? error.message : 'Auth configuration error' });
  }
}
