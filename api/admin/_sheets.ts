import { createSign } from 'node:crypto';
import type { Lead } from '../../lib/adminTypes';

const LEADS_COLUMNS = [
  'received_at','basin_submission_id','dedupe_key','status','status_reason','first_name','last_name','email','phone','company','title','website','message','source_page','utm_source','utm_medium','utm_campaign','raw_submission_json','email_domain','researched_company_name','researched_website','company_summary','beverage_category','lead_type','fit_score','priority','qualification_notes','buying_signals','concerns_or_risks','recommended_next_step','assigned_owner','assigned_inbox','draft_subject','draft_body','draft_rationale','source_urls_json','openai_response_id','processed_at','error_message','create_gmail_draft','gmail_draft_id','research_depth','research_status','narrow_research_summary','wide_research_summary','company_facts_json','product_portfolio_json','distribution_channels_json','retailer_presence_json','manufacturing_or_copacker_signals_json','recent_news_json','leadership_contacts_json','decision_maker_hypothesis','use_case_hypothesis','personalization_hooks_json','competitive_context','research_confidence','research_gaps_json','nepq_angle','nepq_discovery_questions_json','nepq_tone_notes','response_strategy','follow_up_question_stack_json','human_review_flags_json','source_evidence_json','research_evidence_json','disposition','disposition_reason','disposition_updated_at','disposition_updated_by','last_human_action_at','next_follow_up_at','next_follow_up_note','owner_notes','internal_conversation_notes','last_contacted_at','replied_at','call_scheduled_at','pipeline_value_estimate','pipeline_stage'
];

export const ALLOWED_DISPOSITIONS = [
  'NEEDS_RESEARCH','READY_FOR_REVIEW','NEEDS_OWNER_INPUT','READY_TO_REPLY','REPLIED','WAITING_ON_PROSPECT','CALL_SCHEDULED','QUALIFYING','SAMPLE_FOLLOW_UP','OPPORTUNITY','NURTURE','DISQUALIFIED','SPAM_OR_VENDOR','CLOSED_NO_ACTION'
] as const;

const PIPELINE_UPDATE_FIELDS = [
  'status','status_reason','disposition','disposition_reason','disposition_updated_at','disposition_updated_by','last_human_action_at','next_follow_up_at','next_follow_up_note','owner_notes','internal_conversation_notes','last_contacted_at','replied_at','call_scheduled_at','pipeline_value_estimate','pipeline_stage'
] as const;

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

function parseJsonList(value: string): string[] {
  if (!value) return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => typeof item === 'string' ? item : JSON.stringify(item)).filter(Boolean);
    }
  } catch {}
  return splitList(trimmed);
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
    research_depth: get('research_depth'),
    research_status: get('research_status'),
    narrow_research_summary: get('narrow_research_summary'),
    wide_research_summary: get('wide_research_summary'),
    company_facts_json: parseJson(get('company_facts_json')),
    product_portfolio_json: parseJson(get('product_portfolio_json')),
    distribution_channels_json: parseJson(get('distribution_channels_json')),
    retailer_presence_json: parseJson(get('retailer_presence_json')),
    manufacturing_or_copacker_signals_json: parseJson(get('manufacturing_or_copacker_signals_json')),
    recent_news_json: parseJson(get('recent_news_json')),
    leadership_contacts_json: parseJson(get('leadership_contacts_json')),
    decision_maker_hypothesis: get('decision_maker_hypothesis'),
    use_case_hypothesis: get('use_case_hypothesis'),
    personalization_hooks_json: parseJsonList(get('personalization_hooks_json')),
    competitive_context: get('competitive_context'),
    research_confidence: parseNumber(get('research_confidence')),
    research_gaps_json: parseJsonList(get('research_gaps_json')),
    nepq_angle: get('nepq_angle'),
    nepq_discovery_questions_json: parseJsonList(get('nepq_discovery_questions_json')),
    nepq_tone_notes: get('nepq_tone_notes'),
    response_strategy: get('response_strategy'),
    follow_up_question_stack_json: parseJsonList(get('follow_up_question_stack_json')),
    human_review_flags_json: parseJsonList(get('human_review_flags_json')),
    source_evidence_json: parseJson(get('source_evidence_json')),
    research_evidence_json: parseJson(get('research_evidence_json')),
    disposition: get('disposition'),
    disposition_reason: get('disposition_reason'),
    disposition_updated_at: get('disposition_updated_at'),
    disposition_updated_by: get('disposition_updated_by'),
    last_human_action_at: get('last_human_action_at'),
    next_follow_up_at: get('next_follow_up_at'),
    next_follow_up_note: get('next_follow_up_note'),
    owner_notes: get('owner_notes'),
    internal_conversation_notes: get('internal_conversation_notes'),
    last_contacted_at: get('last_contacted_at'),
    replied_at: get('replied_at'),
    call_scheduled_at: get('call_scheduled_at'),
    pipeline_value_estimate: get('pipeline_value_estimate'),
    pipeline_stage: get('pipeline_stage'),
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
  const token = requiredEnv('BASIN_WEBHOOK_TOKEN').trim();
  const response = await fetch(webappUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'runner_dashboard_leads', token }),
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
  const range = encodeURIComponent(`${tab}!A:CV`);
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

type DispositionUpdateInput = {
  disposition: string;
  disposition_reason?: string;
  next_follow_up_at?: string;
  next_follow_up_note?: string;
  owner_notes?: string;
  internal_conversation_notes?: string;
  pipeline_value_estimate?: string;
  pipeline_stage?: string;
  action?: string;
  updated_by: string;
};

function cleanPipelineUpdate(input: DispositionUpdateInput): Record<string, string> {
  const now = new Date().toISOString();
  const updates: Record<string, string> = {
    status: input.disposition,
    status_reason: input.disposition_reason || input.next_follow_up_note || `Pipeline disposition: ${input.disposition}`,
    disposition: input.disposition,
    disposition_reason: input.disposition_reason || '',
    next_follow_up_at: input.next_follow_up_at || '',
    next_follow_up_note: input.next_follow_up_note || '',
    owner_notes: input.owner_notes || '',
    internal_conversation_notes: input.internal_conversation_notes || '',
    pipeline_value_estimate: input.pipeline_value_estimate || '',
    pipeline_stage: input.pipeline_stage || input.disposition,
    disposition_updated_at: now,
    disposition_updated_by: input.updated_by,
    last_human_action_at: now,
  };
  if (input.disposition === 'REPLIED') {
    updates.replied_at = now;
    updates.last_contacted_at = now;
  }
  if (input.disposition === 'WAITING_ON_PROSPECT') updates.last_contacted_at = now;
  if (input.disposition === 'CALL_SCHEDULED') updates.call_scheduled_at = input.next_follow_up_at || now;

  return Object.fromEntries(Object.entries(updates).filter(([key]) => (PIPELINE_UPDATE_FIELDS as readonly string[]).includes(key)));
}

async function postAppsScriptBridge(body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const webappUrl = requiredEnv('APPS_SCRIPT_WEBAPP_URL');
  const token = requiredEnv('BASIN_WEBHOOK_TOKEN').trim();
  const response = await fetch(webappUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, token }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Apps Script bridge failed: ${response.status} ${text}`);
  const data = JSON.parse(text) as Record<string, unknown>;
  if (data.success !== true) throw new Error(`Apps Script bridge error: ${String(data.error || text)}`);
  return data;
}

export async function updateLeadDisposition(id: string, input: DispositionUpdateInput): Promise<{ lead: Lead | null; refreshedAt: string; source: SheetSource }> {
  if (!ALLOWED_DISPOSITIONS.includes(input.disposition as typeof ALLOWED_DISPOSITIONS[number])) {
    throw new Error('Invalid disposition');
  }
  const current = await getLeadById(id);
  if (!current.lead) throw new Error('Lead not found');
  if (!process.env.APPS_SCRIPT_WEBAPP_URL || !process.env.BASIN_WEBHOOK_TOKEN) {
    throw new Error('Disposition updates require APPS_SCRIPT_WEBAPP_URL and BASIN_WEBHOOK_TOKEN');
  }

  const updates = cleanPipelineUpdate(input);
  await postAppsScriptBridge({
    action: 'runner_update_row',
    row_number: current.lead.rowNumber,
    lead_id: id,
    dedupe_key: current.lead.dedupe_key,
    basin_submission_id: current.lead.basin_submission_id,
    updates,
    audit: {
      action: input.action || 'update_disposition',
      updated_by: input.updated_by,
      disposition: input.disposition,
      note: input.disposition_reason || input.next_follow_up_note || '',
    },
  });
  return getLeadById(id);
}
