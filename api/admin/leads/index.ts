import type { IncomingMessage, ServerResponse } from 'http';
import { requireAdmin, sendJson } from '../_auth.js';
import { getLeads } from '../_sheets.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
  if (!(await requireAdmin(req, res))) return;
  try {
    return sendJson(res, 200, await getLeads());
  } catch (error) {
    return sendJson(res, 500, { error: error instanceof Error ? error.message : 'Could not load leads' });
  }
}
