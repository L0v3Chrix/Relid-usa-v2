import type { IncomingMessage, ServerResponse } from 'http';
import { requireAdmin, sendJson } from '../_auth.js';
import { getLeadById } from '../_sheets.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
  if (!(await requireAdmin(req, res))) return;
  const rawUrl = req.url || '';
  const id = decodeURIComponent(rawUrl.split('/').pop()?.split('?')[0] || '');
  try {
    const result = await getLeadById(id);
    if (!result.lead) return sendJson(res, 404, { error: 'Lead not found' });
    return sendJson(res, 200, result);
  } catch (error) {
    return sendJson(res, 500, { error: error instanceof Error ? error.message : 'Could not load lead' });
  }
}
