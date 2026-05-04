import { createSign } from 'node:crypto';
import type { Lead } from '../../lib/adminTypes';

const LEADS_COLUMNS = [
  'received_at','basin_submission_id','dedupe_key','status','status_reason','first_name','last_name','email','phone','company','title','website','message','source_page','utm_source','utm_medium','utm_campaign','raw_submission_json','email_domain','researched_company_name','researched_website','company_summary','beverage_category','lead_type','fit_score','priority','qualification_notes','buying_signals','concerns_or_risks','recommended_next_step','assigned_owner','assigned_inbox','draft_subject','draft_body','draft_rationale','source_urls_json','openai_response_id','processed_at','error_message','create_gmail_draft','gmail_draft_id'
];

type SheetSource = 'google-sheet' | 'apps-script-bridge' | 'mock';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function normalizePrivateKey(rawKey: string): string {
  let key = rawKey.trim();

  // Support pasting either the raw PEM, a JSON-escaped PEM string, a full
  // service-account JSON object, or a base64-encoded PEM into Vercel env vars.
  try {
    const parsed = JSON.parse(key) as unknown;
    if (typeof parsed === 'string') key = parsed;
    if (parsed && typeof parsed === 'object' && 'private_key' in parsed) {
      const privateKey = (parsed as { private_key?: unknown }).private_key;
      if (typeof privateKey === 'string') key = privateKey;
    }
  } catch {
    // Not JSON; keep normalizing below.
  }

  key = key.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\r\n/g, '\n');

  if (!key.includes('BEGIN PRIVATE KEY')) {
    try {
      const decoded = Buffer.from(key, 'base64').toString('utf8').trim();
      if (decoded.includes('BEGIN PRIVATE KEY')) key = decoded;
    } catch {
      // Not base64; validation below will surface a useful message.
    }
  }

  if (!key.includes('BEGIN PRIVATE KEY')) {
    throw new Error('GOOGLE_SHEETS_PRIVATE_KEY is not a valid PEM private key');
  }

  return key;
}

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64url');
}

async function getAccessToken(): Promise<string> {
  const clientEmail = requiredEnv('GOOGLE_SHEETS_CLIENT_EMAIL');
  const privateKey = normalizePrivateKey(requiredEnv('GOOGLE_SHEETS_PRIVATE_KEY'));
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  const assertion = `${unsigned}.${signer.sign(privateKey, 'base64url')}`;
  const params = new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion });
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!response.ok) throw new Error(`Google OAuth failed: ${response.status} ${await response.text()}`);
  const data = await response.json() as { access_token?: string };
  if (!data.access_token) throw new Error('Google OAuth did not return an access token');
  return data.access_token;
}

function splitList(value: string): string[] {
  if (!value) return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed.map((item) => String(item)).filter(Boolean);
  } catch {}
  return trimmed.split(/\n|;/).map((item) => item.trim()).filter(Boolean);
}

function parseJson(value: string): unknown {
  if (!value) return null;
  try { return JSON.parse(value); } catch { return value; }
}

function parseNumber(value: string): number | null {
  if (value === undefined || value === null || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function rowToLead(headers: string[], row: string[], index: number): Lead {
  const get = (name: string) => {
    const column = headers.indexOf(name);
    return column === -1 ? '' : String(row[column] || '');
  };
  const rowNumber = index + 2;
  const dedupe = get('dedupe_key');
  const basinId = get('basin_submission_id');
  const id = encodeURIComponent(dedupe || basinId || `row-${rowNumber}`);
  return {
    id,
    rowNumber,
    received_at: get('received_at'),
    basin_submission_id: basinId,
    dedupe_key: dedupe,
    status: get('status'),
    status_reason: get('status_reason'),
    first_name: get('first_name'),
    last_name: get('last_name'),
    email: get('email'),
    phone: get('phone'),
    company: get('company'),
    title: get('title'),
    website: get('website'),
    message: get('message'),
    source_page: get('source_page'),
    utm_source: get('utm_source'),
    utm_medium: get('utm_medium'),
    utm_campaign: get('utm_campaign'),
    raw_submission_json: parseJson(get('raw_submission_json')),
    email_domain: get('email_domain'),
    researched_company_name: get('researched_company_name'),
    researched_website: get('researched_website'),
    company_summary: get('company_summary'),
    beverage_category: get('beverage_category'),
    lead_type: get('lead_type'),
    fit_score: parseNumber(get('fit_score')),
    priority: get('priority'),
    qualification_notes: get('qualification_notes'),
    buying_signals: splitList(get('buying_signals')),
    concerns_or_risks: splitList(get('concerns_or_risks')),
    recommended_next_step: get('recommended_next_step'),
    assigned_owner: get('assigned_owner'),
    assigned_inbox: get('assigned_inbox'),
    draft_subject: get('draft_subject'),
    draft_body: get('draft_body'),
    draft_rationale: get('draft_rationale'),
    source_urls: splitList(get('source_urls_json')),
    openai_response_id: get('openai_response_id'),
    processed_at: get('processed_at'),
    error_message: get('error_message'),
    create_gmail_draft: get('create_gmail_draft'),
    gmail_draft_id: get('gmail_draft_id'),
  };
}

function sortLeads(leads: Lead[]): Lead[] {
  const priorityRank: Record<string, number> = { HOT: 0, WARM: 1, NEEDS_REVIEW: 2, NEW: 3, COOL: 4, DISQUALIFY: 5, ERROR: 6 };
  return [...leads].sort((a, b) => {
    const aKey = (a.priority || a.status || '').toUpperCase();
    const bKey = (b.priority || b.status || '').toUpperCase();
    const byPriority = (priorityRank[aKey] ?? 9) - (priorityRank[bKey] ?? 9);
    if (byPriority !== 0) return byPriority;
    return Date.parse(b.received_at || '0') - Date.parse(a.received_at || '0');
  });
}

async function getLeadsViaAppsScript(): Promise<{ leads: Lead[]; refreshedAt: string; source: SheetSource }> {
  const webappUrl = requiredEnv('APPS_SCRIPT_WEBAPP_URL');
  const token = requiredEnv('BASIN_WEBHOOK_TOKEN');
  const response = await fetch(webappUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'runner_snapshot', token }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Apps Script bridge failed: ${response.status} ${text}`);
  const data = JSON.parse(text) as { success?: boolean; headers?: string[]; leads?: Record<string, unknown>[]; error?: string };
  if (!data.success) throw new Error(`Apps Script bridge error: ${data.error || text}`);
  const headers = data.headers && data.headers.length ? data.headers : LEADS_COLUMNS;
  const leads = sortLeads((data.leads || []).map((record, index) => {
    const row = headers.map((header) => {
      const value = record[header];
      if (value === undefined || value === null) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value);
    });
    const sheetRow = Number(record._row_number || index + 2);
    return rowToLead(headers, row, sheetRow - 2);
  }));
  return { leads, refreshedAt: new Date().toISOString(), source: 'apps-script-bridge' };
}

function mockLeads(): Lead[] {
  return sortLeads([
    rowToLead(LEADS_COLUMNS, [
      '2026-05-04T14:05:00-05:00','mock-001','mock:001','DRAFT_READY','Processed by local Hermes runner','Jordan','Reed','jordan@northstarcoldbrew.com','312-555-0198','Northstar Cold Brew Co','Founder','https://northstarcoldbrew.com','We are preparing a canned cold brew launch and want to understand whether Re:Lid resealable aluminum can technology could work for RTD coffee and on-the-go retail.','https://relidusa.com/contact','organic','','launch','{}','northstarcoldbrew.com','Northstar Cold Brew Co','https://northstarcoldbrew.com','Regional cold brew brand preparing a canned RTD expansion for retail and convenience channels.','RTD coffee','brand','88','HOT','Strong fit: beverage brand, canned launch, packaging innovation interest, business domain.','Canned RTD launch\nAsked about resealable aluminum can technology\nRetail/on-the-go use case','Needs real volume and filler details before technical claims','Schedule a qualification call; ask can size, fill method, launch timing, estimated volume, and co-packer/filler.','Re:Lid Sales','sales@relidusa.com','Re:Lid USA follow-up for Northstar Cold Brew','Hi Jordan,\n\nThanks for reaching out to Re:Lid USA. A canned cold brew launch is exactly the kind of on-the-go beverage use case where resealable aluminum can technology may create a better consumer experience.\n\nTo point you in the right direction, could you share your target can size, fill method, launch timing, estimated volume, and whether you are filling in-house or through a co-packer?\n\nHappy to set up a short intro call once we have those details.\n\nRe:Lid USA Team','Draft asks for qualification details without promising compatibility or pricing.','["https://northstarcoldbrew.com"]','mock','2026-05-04T15:15:00-05:00','','FALSE',''
    ], 0),
    rowToLead(LEADS_COLUMNS, [
      '2026-05-04T13:10:00-05:00','mock-002','mock:002','NEEDS_REVIEW','Needs human review: no_source_urls','Taylor','Kim','taylor@evergreenfilling.com','','Evergreen Filling Partners','Packaging Innovation Manager','https://evergreenfilling.com','Our co-packing team fills canned sparkling water, functional beverages, and RTD teas. We are exploring resealable can options for brand customers.','https://relidusa.com/contact','referral','','launch','{}','evergreenfilling.com','Evergreen Filling Partners','https://evergreenfilling.com','Likely co-packer/filler with multiple beverage categories, but public details need verification.','sparkling water, functional beverage, RTD tea','co_packer','79','WARM','Relevant co-packer inquiry, but needs verification and use-case scoping.','Co-packer\nMultiple canned beverage categories\nExploring resealable can options','Public source verification incomplete','Ask about customer categories, can sizes, line compatibility, and pilot timeline.','Re:Lid Sales','sales@relidusa.com','Re:Lid USA qualification questions for Evergreen Filling','Hi Taylor,\n\nThanks for reaching out. Your co-packing role across sparkling water, functional beverages, and RTD tea sounds like a potentially strong fit for a Re:Lid conversation.\n\nCould you share the can sizes and filling methods you support, whether this is for a specific brand customer or general capability exploration, and what timeline you are targeting?\n\nWe can use that context to decide the best next step for a short intro call.\n\nRe:Lid USA Team','Conservative co-packer response with qualification questions.','[]','mock','2026-05-04T14:00:00-05:00','','FALSE',''
    ], 1),
  ]);
}

export async function getLeads(): Promise<{ leads: Lead[]; refreshedAt: string; source: SheetSource }> {
  const useMock = process.env.USE_MOCK_LEADS === 'true' || (!process.env.GOOGLE_SHEET_ID && process.env.NODE_ENV !== 'production');
  if (useMock) return { leads: mockLeads(), refreshedAt: new Date().toISOString(), source: 'mock' };
  if (process.env.APPS_SCRIPT_WEBAPP_URL && process.env.BASIN_WEBHOOK_TOKEN) return getLeadsViaAppsScript();
  const sheetId = requiredEnv('GOOGLE_SHEET_ID');
  const tab = process.env.GOOGLE_SHEETS_LEADS_TAB || 'Leads';
  const token = await getAccessToken();
  const range = encodeURIComponent(`${tab}!A:AZ`);
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Google Sheets read failed: ${response.status} ${await response.text()}`);
  const data = await response.json() as { values?: string[][] };
  const [headers = LEADS_COLUMNS, ...rows] = data.values || [];
  const leads = sortLeads(rows.map((row, index) => rowToLead(headers, row, index)));
  return { leads, refreshedAt: new Date().toISOString(), source: 'google-sheet' };
}

export async function getLeadById(id: string): Promise<{ lead: Lead | null; refreshedAt: string; source: SheetSource }> {
  const { leads, refreshedAt, source } = await getLeads();
  const decoded = decodeURIComponent(id);
  const lead = leads.find((item) => item.id === id || decodeURIComponent(item.id) === decoded || String(item.rowNumber) === decoded) || null;
  return { lead, refreshedAt, source };
}
