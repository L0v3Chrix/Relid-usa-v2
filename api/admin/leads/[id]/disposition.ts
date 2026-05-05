import type { IncomingMessage, ServerResponse } from 'http';
import { readJsonBody, requireAdmin, sendJson } from '../../_auth.js';
import { ALLOWED_DISPOSITIONS, updateLeadDisposition } from '../../_sheets.js';

type Body = {
  disposition?: string;
  disposition_reason?: string;
  next_follow_up_at?: string;
  next_follow_up_note?: string;
  owner_notes?: string;
  internal_conversation_notes?: string;
  pipeline_value_estimate?: string;
  pipeline_stage?: string;
  action?: string;
};

function cleanString(value: unknown, max = 5000): string {
  return String(value || '').slice(0, max);
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST' && req.method !== 'PATCH') return sendJson(res, 405, { error: 'Method not allowed' });
  const session = await requireAdmin(req, res);
  if (!session) return;

  const rawUrl = req.url || '';
  const parts = rawUrl.split('?')[0].split('/').filter(Boolean);
  const id = decodeURIComponent(parts[parts.length - 2] || '');
  if (!id) return sendJson(res, 400, { error: 'Missing lead id' });

  let body: Body;
  try {
    body = await readJsonBody<Body>(req);
  } catch {
    return sendJson(res, 400, { error: 'Invalid JSON body' });
  }

  const disposition = cleanString(body.disposition, 80).trim().toUpperCase();
  if (!ALLOWED_DISPOSITIONS.includes(disposition as typeof ALLOWED_DISPOSITIONS[number])) {
    return sendJson(res, 400, { error: 'Invalid disposition' });
  }

  try {
    const result = await updateLeadDisposition(id, {
      disposition,
      disposition_reason: cleanString(body.disposition_reason, 2000),
      next_follow_up_at: cleanString(body.next_follow_up_at, 80),
      next_follow_up_note: cleanString(body.next_follow_up_note, 2000),
      owner_notes: cleanString(body.owner_notes, 5000),
      internal_conversation_notes: cleanString(body.internal_conversation_notes, 5000),
      pipeline_value_estimate: cleanString(body.pipeline_value_estimate, 80),
      pipeline_stage: cleanString(body.pipeline_stage, 120),
      action: cleanString(body.action, 120),
      updated_by: session.username,
    });
    if (!result.lead) return sendJson(res, 404, { error: 'Lead not found' });
    return sendJson(res, 200, result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update disposition';
    if (message === 'Lead not found') return sendJson(res, 404, { error: message });
    if (message === 'Invalid disposition') return sendJson(res, 400, { error: message });
    return sendJson(res, 500, { error: message });
  }
}
