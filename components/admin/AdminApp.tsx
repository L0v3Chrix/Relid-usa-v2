import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, AlertTriangle, BriefcaseBusiness, ChevronDown, Copy, ExternalLink, LogOut, Mail, MessageSquare, Phone, RefreshCw, Search, ShieldCheck, Sparkles, Target, UserRound } from 'lucide-react';
import type { Lead, LeadsResponse } from '../../lib/adminTypes';

type Notice = { type: 'success' | 'error' | 'info'; message: string } | null;

const priorityClasses: Record<string, string> = {
  HOT: 'bg-red-500/20 text-red-100 border-red-400/50',
  WARM: 'bg-orange-500/20 text-orange-100 border-orange-400/50',
  COOL: 'bg-sky-500/20 text-sky-100 border-sky-400/50',
  NEEDS_REVIEW: 'bg-purple-500/20 text-purple-100 border-purple-400/50',
  DISQUALIFY: 'bg-zinc-600/30 text-zinc-200 border-zinc-400/40',
  NEW: 'bg-brand-green/20 text-brand-green border-brand-green/40',
  PROCESSING: 'bg-yellow-500/20 text-yellow-100 border-yellow-400/40',
  DRAFT_READY: 'bg-emerald-500/20 text-emerald-100 border-emerald-400/50',
  READY_TO_REPLY: 'bg-emerald-500/20 text-emerald-100 border-emerald-400/50',
  READY_FOR_REVIEW: 'bg-emerald-500/20 text-emerald-100 border-emerald-400/50',
  REPLIED: 'bg-blue-500/20 text-blue-100 border-blue-400/50',
  WAITING_ON_PROSPECT: 'bg-cyan-500/20 text-cyan-100 border-cyan-400/50',
  CALL_SCHEDULED: 'bg-indigo-500/20 text-indigo-100 border-indigo-400/50',
  QUALIFYING: 'bg-lime-500/20 text-lime-100 border-lime-400/50',
  SAMPLE_FOLLOW_UP: 'bg-teal-500/20 text-teal-100 border-teal-400/50',
  OPPORTUNITY: 'bg-brand-green/25 text-brand-green border-brand-green/60',
  NURTURE: 'bg-amber-500/20 text-amber-100 border-amber-400/50',
  NEEDS_RESEARCH: 'bg-purple-500/20 text-purple-100 border-purple-400/50',
  NEEDS_OWNER_INPUT: 'bg-fuchsia-500/20 text-fuchsia-100 border-fuchsia-400/50',
  DISQUALIFIED: 'bg-zinc-600/30 text-zinc-200 border-zinc-400/40',
  SPAM_OR_VENDOR: 'bg-zinc-700/50 text-zinc-200 border-zinc-500/40',
  CLOSED_NO_ACTION: 'bg-zinc-700/50 text-zinc-300 border-zinc-500/40',
  ERROR: 'bg-red-950/70 text-red-100 border-red-500/50',
};

const dispositions = ['NEEDS_RESEARCH','READY_FOR_REVIEW','NEEDS_OWNER_INPUT','READY_TO_REPLY','REPLIED','WAITING_ON_PROSPECT','CALL_SCHEDULED','QUALIFYING','SAMPLE_FOLLOW_UP','OPPORTUNITY','NURTURE','DISQUALIFIED','SPAM_OR_VENDOR','CLOSED_NO_ACTION'];

const queueDefs = [
  { key: 'needs', label: 'Needs Attention', match: (l: Lead) => ['NEEDS_RESEARCH','NEEDS_OWNER_INPUT'].includes(effectiveDisposition(l)) || ['NEW','NEEDS_REVIEW','ERROR'].includes(String(l.status).toUpperCase()) },
  { key: 'ready', label: 'Ready Review / Reply', match: (l: Lead) => ['READY_FOR_REVIEW','READY_TO_REPLY'].includes(effectiveDisposition(l)) || (!l.disposition && l.status === 'DRAFT_READY') },
  { key: 'waiting', label: 'Waiting on Prospect', match: (l: Lead) => ['REPLIED','WAITING_ON_PROSPECT'].includes(effectiveDisposition(l)) },
  { key: 'active', label: 'Active Opportunities', match: (l: Lead) => ['CALL_SCHEDULED','QUALIFYING','SAMPLE_FOLLOW_UP','OPPORTUNITY'].includes(effectiveDisposition(l)) },
  { key: 'nurture', label: 'Nurture', match: (l: Lead) => effectiveDisposition(l) === 'NURTURE' },
  { key: 'closed', label: 'Closed / Disqualified', match: (l: Lead) => ['DISQUALIFIED','SPAM_OR_VENDOR','CLOSED_NO_ACTION'].includes(effectiveDisposition(l)) },
];

const quickActions = [
  { label: 'Mark reviewed', disposition: 'NEEDS_OWNER_INPUT', reason: 'Reviewed; needs owner input.' },
  { label: 'Needs more research', disposition: 'NEEDS_RESEARCH', reason: 'Needs additional research before reply.' },
  { label: 'Ready to reply', disposition: 'READY_TO_REPLY', reason: 'Draft reviewed and ready for external reply.' },
  { label: 'Mark replied', disposition: 'REPLIED', reason: 'External reply was sent outside this dashboard. No email sent here.' },
  { label: 'Waiting on prospect', disposition: 'WAITING_ON_PROSPECT', reason: 'Waiting for prospect response.' },
  { label: 'Schedule call', disposition: 'CALL_SCHEDULED', reason: 'Call scheduled or being scheduled.' },
  { label: 'Move to opportunity', disposition: 'OPPORTUNITY', reason: 'Credible commercial opportunity.' },
  { label: 'Nurture', disposition: 'NURTURE', reason: 'Not urgent; future follow-up recommended.' },
  { label: 'Disqualify', disposition: 'DISQUALIFIED', reason: 'Not a fit for active follow-up.' },
];

const priorityRank: Record<string, number> = { HOT: 0, WARM: 1, DRAFT_READY: 2, NEEDS_REVIEW: 3, NEW: 4, COOL: 5, ERROR: 6, DISQUALIFY: 7, DUPLICATE: 8 };

function cx(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(' ');
}

function formatDate(value: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function contactName(lead: Lead) {
  return [lead.first_name, lead.last_name].filter(Boolean).join(' ') || 'Unknown contact';
}

function primaryPriority(lead: Lead) {
  return lead.priority || lead.status || 'NEW';
}

function effectiveDisposition(lead: Lead) {
  if (lead.disposition) return String(lead.disposition).toUpperCase();
  const status = String(lead.status || '').toUpperCase();
  if (dispositions.includes(status)) return status;
  if (lead.status === 'DRAFT_READY') return 'READY_FOR_REVIEW';
  if (lead.status === 'NEEDS_REVIEW' || lead.status === 'ERROR') return 'NEEDS_OWNER_INPUT';
  if (lead.status === 'NEW' || lead.status === 'PROCESSING') return 'NEEDS_RESEARCH';
  return '';
}

function isOverdue(value?: string) {
  if (!value) return false;
  const time = Date.parse(value);
  return Number.isFinite(time) && time < Date.now();
}

function renderJsonSummary(value: unknown) {
  if (!value) return <span className="text-white/45">No data captured.</span>;
  if (typeof value === 'string') return <p className="whitespace-pre-wrap text-white/75">{value}</p>;
  if (Array.isArray(value)) return <InfoList items={value.map((item) => typeof item === 'string' ? item : JSON.stringify(item))} empty="No data captured." />;
  return <pre className="max-h-80 overflow-auto rounded-xl bg-black/40 p-3 text-xs text-white/70">{JSON.stringify(value, null, 2)}</pre>;
}

async function updateDispositionApi(id: string, payload: Record<string, string>) {
  return api<{ lead: Lead; refreshedAt: string; lastDataUpdatedAt: string; source: string }>(`/api/admin/leads/${id}/disposition`, { method: 'POST', body: JSON.stringify(payload) });
}

function badge(value?: string) {
  const key = (value || '—').toUpperCase();
  return <span className={cx('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wide', priorityClasses[key] || 'bg-white/10 text-white/80 border-white/20')}>{value || '—'}</span>;
}

function sourceLabel(source: string) {
  if (source === 'mock') return 'safe mock data';
  return 'live Sheet';
}

function firstFilled(...values: Array<string | undefined | null>) {
  return values.find((value) => String(value || '').trim()) || '';
}

function shortText(value: string, fallback = 'No notes yet.') {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text || fallback;
}

function nextActionFor(lead: Lead) {
  if (lead.recommended_next_step) return lead.recommended_next_step;
  if (lead.status === 'NEW') return 'Research and draft this lead before sales follow-up.';
  if (lead.error_message) return 'Review processing error before follow-up.';
  return 'Review the submission and decide the next human action.';
}

function relationshipHook(lead: Lead) {
  return firstFilled(lead.qualification_notes, lead.company_summary, lead.message, lead.status_reason);
}

function localMockResponse(): LeadsResponse {
  const now = new Date().toISOString();
  const base = {
    id: 'mock-001', rowNumber: 2, received_at: '2026-05-04T14:05:00-05:00', basin_submission_id: 'mock-001', dedupe_key: 'mock:001', status: 'DRAFT_READY', status_reason: 'Processed by local Hermes runner', first_name: 'Jordan', last_name: 'Reed', email: 'jordan@northstarcoldbrew.com', phone: '312-555-0198', company: 'Northstar Cold Brew Co', title: 'Founder', website: 'https://northstarcoldbrew.com', message: 'We are preparing a canned cold brew launch and want to understand whether Re:Lid resealable aluminum can technology could work for RTD coffee and on-the-go retail.', source_page: 'https://relidusa.com/contact', utm_source: 'organic', utm_medium: '', utm_campaign: 'launch', raw_submission_json: {}, email_domain: 'northstarcoldbrew.com', researched_company_name: 'Northstar Cold Brew Co', researched_website: 'https://northstarcoldbrew.com', company_summary: 'Regional cold brew brand preparing a canned RTD expansion for retail and convenience channels.', beverage_category: 'RTD coffee', lead_type: 'brand', fit_score: 88, priority: 'HOT', qualification_notes: 'Strong fit: beverage brand, canned launch, packaging innovation interest, business domain.', buying_signals: ['Canned RTD launch', 'Asked about resealable aluminum can technology', 'Retail/on-the-go use case'], concerns_or_risks: ['Needs real volume and filler details before technical claims'], recommended_next_step: 'Schedule a qualification call; ask can size, fill method, launch timing, estimated volume, and co-packer/filler.', assigned_owner: 'Re:Lid Sales', assigned_inbox: 'sales@relidusa.com', draft_subject: 'Re:Lid USA follow-up for Northstar Cold Brew', draft_body: 'Hi Jordan,\n\nThanks for reaching out to Re:Lid USA. A canned cold brew launch is exactly the kind of on-the-go beverage use case where resealable aluminum can technology may create a better consumer experience.\n\nTo point you in the right direction, could you share your target can size, fill method, launch timing, estimated volume, current co-packer/filler, and who will be involved in the packaging decision?\n\nIf helpful, we can set up a short intro call.\n\nRe:Lid USA Team', draft_rationale: 'Lead is relevant and the draft asks for practical qualification details without overpromising.', source_urls: ['https://northstarcoldbrew.com'], openai_response_id: '', processed_at: now, error_message: '', create_gmail_draft: 'FALSE', gmail_draft_id: ''
  } satisfies Lead;
  const second = { ...base, id: 'mock-002', rowNumber: 3, basin_submission_id: 'mock-002', dedupe_key: 'mock:002', status: 'NEEDS_REVIEW', first_name: 'Taylor', last_name: 'Kim', email: 'taylor@evergreenfilling.com', company: 'Evergreen Filling Partners', title: 'Packaging Innovation Manager', researched_company_name: 'Evergreen Filling Partners', beverage_category: 'Sparkling water / RTD tea', lead_type: 'co_packer', fit_score: 79, priority: 'WARM', draft_subject: 'Re:Lid USA qualification questions for Evergreen Filling' } satisfies Lead;
  return { leads: [base, second], refreshedAt: now, lastDataUpdatedAt: now, source: 'mock' };
}

const viteEnv = (import.meta as unknown as { env?: Record<string, string | boolean | undefined> }).env || {};
const localMockAdmin = viteEnv.DEV === true && viteEnv.VITE_ENABLE_MOCK_ADMIN === 'true';
const localMockUsername = String(viteEnv.VITE_MOCK_ADMIN_USERNAME || '');
const localMockPassword = String(viteEnv.VITE_MOCK_ADMIN_PASSWORD || '');

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, { credentials: 'include', ...options, headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed: ${response.status}`);
  return data as T;
}

function AdminShell({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-[#080A08] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-black/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="/admin/leads" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green text-brand-black"><ShieldCheck size={22} /></div>
            <div>
              <p className="font-heading text-lg font-bold tracking-wide">RE<span className="text-brand-green">→</span>LID Sales Desk</p>
              <p className="text-xs uppercase tracking-[0.25em] text-white/50">Prospect follow-up</p>
            </div>
          </a>
          <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 hover:border-brand-green hover:text-brand-green">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}

function LoginView({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState<Notice>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setNotice(null);
    try {
      if (localMockAdmin && localMockUsername && localMockPassword && username === localMockUsername && password === localMockPassword) {
        window.localStorage.setItem('relid_mock_admin', '1');
        onLoggedIn();
        return;
      }
      await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) });
      onLoggedIn();
    } catch (error) {
      setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Login failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(107,191,89,0.18),transparent_35%),#0D0D0D] px-4 py-12 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center">
        <div className="mb-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-brand-green">Private Access</p>
          <h1 className="font-heading text-4xl font-black">Re:Lid Sales Desk</h1>
          <p className="mt-4 text-white/65">Review inbound relationships, lead intelligence, and draft replies. Lead data loads only after authentication.</p>
        </div>
        <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40">
          <label className="mb-4 block"><span className="mb-2 block text-sm font-semibold text-white/70">Username</span><input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none ring-brand-green/50 focus:border-brand-green focus:ring-2" required /></label>
          <label className="mb-6 block"><span className="mb-2 block text-sm font-semibold text-white/70">Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none ring-brand-green/50 focus:border-brand-green focus:ring-2" required /></label>
          {notice && <div className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">{notice.message}</div>}
          <button disabled={loading} className="w-full rounded-xl bg-brand-green px-5 py-3 font-heading font-bold uppercase tracking-wider text-brand-black transition hover:bg-white disabled:opacity-60">{loading ? 'Checking...' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  );
}

function Filters({ query, setQuery, status, setStatus, priority, setPriority, leadType, setLeadType, options }: any) {
  const selectClass = 'rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-white outline-none focus:border-brand-green';
  return (
    <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 lg:grid-cols-[1.7fr_1fr_1fr_1fr]">
      <label className="relative">
        <Search className="absolute left-3 top-3.5 text-white/35" size={18} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search prospect, company, email, notes..." className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-10 pr-3 text-sm outline-none focus:border-brand-green" />
      </label>
      <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}><option value="">All workflow stages</option>{options.statuses.map((x: string) => <option key={x}>{x}</option>)}</select>
      <select value={priority} onChange={(e) => setPriority(e.target.value)} className={selectClass}><option value="">All priorities</option>{options.priorities.map((x: string) => <option key={x}>{x}</option>)}</select>
      <select value={leadType} onChange={(e) => setLeadType(e.target.value)} className={selectClass}><option value="">All relationship types</option>{options.leadTypes.map((x: string) => <option key={x}>{x}</option>)}</select>
    </div>
  );
}

function MetricCard({ label, value, helper, icon }: { label: string; value: number; helper: string; icon: React.ReactNode }) {
  return <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"><div className="mb-4 flex items-center justify-between text-brand-green">{icon}<span className="font-heading text-4xl font-black text-white">{value}</span></div><p className="text-sm font-bold uppercase tracking-wider text-white/55">{label}</p><p className="mt-2 text-sm text-white/45">{helper}</p></div>;
}

function LeadCard({ lead, onQuickAction }: { lead: Lead; onQuickAction: (lead: Lead, disposition: string, reason: string) => void }) {
  const score = lead.fit_score ?? '—';
  const priority = primaryPriority(lead);
  const disposition = effectiveDisposition(lead);
  const title = lead.researched_company_name || lead.company || 'Unknown company';
  const hook = shortText(relationshipHook(lead), 'Waiting on enrichment. Open the record to review the original inquiry.');
  const signals = lead.buying_signals.slice(0, 2);
  const hooks = (lead.personalization_hooks_json || []).slice(0, 2);
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-brand-green/50 hover:bg-white/[0.06]">
      <a href={`/admin/leads/${lead.id}`} className="block">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">{badge(disposition || priority)}{lead.status && badge(lead.status)}{lead.lead_type && badge(lead.lead_type)}{isOverdue(lead.next_follow_up_at) && badge('OVERDUE')}</div>
          <h2 className="font-heading text-2xl font-black text-white">{title}</h2>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60">
            <span className="inline-flex items-center gap-1.5"><UserRound size={15} className="text-brand-green" />{contactName(lead)}</span>
            <span className="inline-flex items-center gap-1.5"><Mail size={15} className="text-brand-green" />{lead.email || 'No email'}</span>
            {lead.phone && <span className="inline-flex items-center gap-1.5"><Phone size={15} className="text-brand-green" />{lead.phone}</span>}
            <span>{formatDate(lead.received_at)}</span>
          </div>
          <p className="mt-4 line-clamp-3 text-white/78">{hook}</p>
          <p className="mt-3 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-white/60"><span className="font-bold text-white/80">They asked:</span> {shortText(lead.message)}</p>
        </div>
        <div className="grid gap-3 lg:w-80">
          <div className="rounded-2xl border border-brand-green/25 bg-brand-green/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-green">Lead score</p>
            <p className="font-heading text-5xl font-black">{score}</p>
            <p className="mt-1 text-xs text-white/50">Research confidence: {lead.research_confidence ?? '—'}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-white/45">Best next action</p>
            <p className="line-clamp-4 text-sm text-white/80">{nextActionFor(lead)}</p>
            <p className={cx('mt-2 text-xs', isOverdue(lead.next_follow_up_at) ? 'text-red-200' : 'text-white/50')}>Next follow-up: {formatDate(lead.next_follow_up_at || '')}</p>
          </div>
        </div>
      </div>
      </a>
      {(signals.length > 0 || hooks.length > 0) && <div className="mt-4 flex flex-wrap gap-2">{[...signals, ...hooks].map((signal) => <span key={signal} className="rounded-full border border-brand-green/20 bg-brand-green/10 px-3 py-1 text-xs text-brand-green">{signal}</span>)}</div>}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
        {quickActions.slice(1, 8).map((action) => <button key={action.disposition} onClick={() => onQuickAction(lead, action.disposition, action.reason)} className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold text-white/70 hover:border-brand-green hover:text-brand-green">{action.label}</button>)}
      </div>
      {lead.owner_notes && <p className="mt-3 text-xs text-white/45"><span className="font-bold text-white/60">Owner notes:</span> {lead.owner_notes}</p>}
    </div>
  );
}

function LeadsList({ data, onRefresh }: { data: LeadsResponse; onRefresh: () => void }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [leadType, setLeadType] = useState('');
  const [queue, setQueue] = useState('needs');
  const [notice, setNotice] = useState<Notice>(null);
  const [busyLead, setBusyLead] = useState('');
  const leads = data.leads || [];

  async function onQuickAction(lead: Lead, disposition: string, reason: string) {
    setBusyLead(lead.id);
    setNotice(null);
    try {
      if (localMockAdmin) {
        setNotice({ type: 'success', message: `${disposition} recorded in mock mode. No email sent.` });
        return;
      }
      await updateDispositionApi(lead.id, { disposition, disposition_reason: reason, action: disposition === 'REPLIED' ? 'mark_replied_external_record_only' : 'quick_action' });
      setNotice({ type: 'success', message: `${disposition} saved. Mark replied records external action only and sends nothing.` });
      await onRefresh();
    } catch (error) {
      setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Could not update disposition' });
    } finally {
      setBusyLead('');
    }
  }

  const options = useMemo(() => ({
    statuses: [...new Set(leads.map((l) => l.status).filter(Boolean))],
    priorities: [...new Set(leads.map((l) => l.priority).filter(Boolean))],
    leadTypes: [...new Set(leads.map((l) => l.lead_type).filter(Boolean))],
  }), [leads]);

  const filtered = leads.filter((lead) => {
    const haystack = [lead.company, contactName(lead), lead.email, lead.message, lead.researched_company_name, lead.qualification_notes, lead.company_summary, lead.owner_notes, lead.narrow_research_summary, lead.wide_research_summary].join(' ').toLowerCase();
    const activeQueue = queueDefs.find((item) => item.key === queue);
    return (!activeQueue || activeQueue.match(lead)) && (!query || haystack.includes(query.toLowerCase())) && (!status || lead.status === status) && (!priority || lead.priority === priority) && (!leadType || lead.lead_type === leadType);
  }).sort((a, b) => {
    const aOverdue = isOverdue(a.next_follow_up_at) ? 0 : 1;
    const bOverdue = isOverdue(b.next_follow_up_at) ? 0 : 1;
    if (aOverdue !== bOverdue) return aOverdue - bOverdue;
    const ad = effectiveDisposition(a) === 'NEEDS_OWNER_INPUT' ? 0 : 1;
    const bd = effectiveDisposition(b) === 'NEEDS_OWNER_INPUT' ? 0 : 1;
    if (ad !== bd) return ad - bd;
    const ar = priorityRank[String(primaryPriority(a)).toUpperCase()] ?? 9;
    const br = priorityRank[String(primaryPriority(b)).toUpperCase()] ?? 9;
    if (ar !== br) return ar - br;
    return (b.fit_score ?? -1) - (a.fit_score ?? -1);
  });

  const ready = leads.filter((l) => ['READY_FOR_REVIEW','READY_TO_REPLY'].includes(effectiveDisposition(l)) || l.status === 'DRAFT_READY').length;
  const top = leads.filter((l) => ['HOT', 'WARM'].includes(String(l.priority).toUpperCase())).length;
  const needsHuman = leads.filter((l) => l.status === 'NEEDS_REVIEW' || l.status === 'ERROR' || l.priority === 'NEEDS_REVIEW').length;
  const untouched = leads.filter((l) => l.status === 'NEW' || l.status === 'PROCESSING').length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-brand-green">Prospect queue</p>
          <h1 className="font-heading text-4xl font-black md:text-5xl">Who needs a human follow-up?</h1>
          <p className="mt-3 max-w-3xl text-white/65">Relationship-first view of inbound Re:Lid interest: who they are, why they care, how strong the opportunity is, and what sales should do next.</p>
          <p className="mt-2 text-xs text-white/45">Data last updated {formatDate(data.lastDataUpdatedAt || data.refreshedAt)} · Page refreshed {formatDate(data.refreshedAt)} · Source: {sourceLabel(data.source)}</p>
        </div>
        <button onClick={onRefresh} className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-green/40 px-5 py-3 font-bold text-brand-green hover:bg-brand-green hover:text-brand-black"><RefreshCw size={18} /> Refresh prospects</button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <MetricCard label="Ready to reply" value={ready} helper="Draft exists; human can review/copy/reply externally." icon={<MessageSquare size={24} />} />
        <MetricCard label="Hot / warm" value={top} helper="Best conversations to prioritize first." icon={<Target size={24} />} />
        <MetricCard label="Needs judgment" value={needsHuman} helper="Research gaps, media, risk, or errors." icon={<AlertTriangle size={24} />} />
        <MetricCard label="Awaiting enrichment" value={untouched} helper="New or currently being processed." icon={<Sparkles size={24} />} />
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {queueDefs.map((item) => {
          const count = leads.filter(item.match).length;
          return <button key={item.key} onClick={() => setQueue(item.key)} className={cx('rounded-2xl border p-4 text-left transition', queue === item.key ? 'border-brand-green bg-brand-green/10 text-brand-green' : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25')}><span className="block text-xs font-bold uppercase tracking-wider">{item.label}</span><span className="font-heading text-3xl font-black">{count}</span></button>;
        })}
      </div>
      {notice && <div className={cx('mb-4 rounded-xl border px-4 py-3 text-sm', notice.type === 'error' ? 'border-red-400/40 bg-red-500/10 text-red-100' : 'border-brand-green/30 bg-brand-green/10 text-brand-green')}>{notice.message}</div>}
      <div className="mb-4 rounded-2xl border border-yellow-400/30 bg-yellow-500/10 p-4 text-sm text-yellow-100"><strong>Safety:</strong> “Mark replied” only records an external human action in the Sheet. This dashboard sends no email and creates no Gmail draft.</div>

      <Filters query={query} setQuery={setQuery} status={status} setStatus={setStatus} priority={priority} setPriority={setPriority} leadType={leadType} setLeadType={setLeadType} options={options} />

      <div className="mt-6 grid gap-4 opacity-100">
        {filtered.length === 0 ? <div className="rounded-3xl border border-white/10 p-10 text-center text-white/55">No prospects match the current filters.</div> : filtered.map((lead) => <div key={lead.id} className={busyLead === lead.id ? 'opacity-60' : ''}><LeadCard lead={lead} onQuickAction={onQuickAction} /></div>)}
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="mb-1 text-xs font-bold uppercase tracking-wider text-white/40">{label}</p><div className="text-white/85">{children || '—'}</div></div>;
}

function CopyButton({ text, label, onCopied }: { text: string; label: string; onCopied: (label: string) => void }) {
  async function copy() {
    const value = text || '';
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(value);
      else throw new Error('clipboard unavailable');
      onCopied(label);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      onCopied(label);
    }
  }
  return <button onClick={copy} className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-4 py-3 text-sm font-bold text-brand-black hover:bg-white"><Copy size={16} /> {label}</button>;
}

function InfoList({ items, empty, tone = 'green' }: { items: string[]; empty: string; tone?: 'green' | 'red' }) {
  const color = tone === 'green' ? 'text-brand-green' : 'text-red-200';
  return <ul className="space-y-2 text-white/75">{items.length ? items.map((item) => <li key={item} className="flex gap-2"><span className={color}>•</span><span>{item}</span></li>) : <li className="text-white/45">{empty}</li>}</ul>;
}

function DispositionPanel({ lead, onUpdated }: { lead: Lead; onUpdated: (lead: Lead, refreshedAt: string, lastDataUpdatedAt: string, source: string) => void }) {
  const [disposition, setDisposition] = useState(effectiveDisposition(lead) || 'NEEDS_RESEARCH');
  const [reason, setReason] = useState(lead.disposition_reason || '');
  const [nextAt, setNextAt] = useState(lead.next_follow_up_at || '');
  const [nextNote, setNextNote] = useState(lead.next_follow_up_note || '');
  const [ownerNotes, setOwnerNotes] = useState(lead.owner_notes || '');
  const [internalNotes, setInternalNotes] = useState(lead.internal_conversation_notes || '');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  async function save(action = 'detail_update', overrideDisposition = disposition, overrideReason = reason) {
    setSaving(true);
    setNotice(null);
    try {
      if (localMockAdmin) {
        setNotice({ type: 'success', message: 'Saved in mock mode. No email sent.' });
        return;
      }
      const result = await updateDispositionApi(lead.id, { disposition: overrideDisposition, disposition_reason: overrideReason, next_follow_up_at: nextAt, next_follow_up_note: nextNote, owner_notes: ownerNotes, internal_conversation_notes: internalNotes, action });
      onUpdated(result.lead, result.refreshedAt, result.lastDataUpdatedAt, result.source);
      setNotice({ type: 'success', message: `${overrideDisposition} saved. No email sent and no Gmail draft created.` });
    } catch (error) {
      setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Could not save disposition' });
    } finally {
      setSaving(false);
    }
  }

  return <section className="mb-8 rounded-3xl border border-brand-green/25 bg-white/[0.04] p-5">
    <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-green">Pipeline control</p><h2 className="font-heading text-2xl font-black">Disposition, notes, next follow-up</h2></div>{badge(disposition)}</div>
    <div className="mb-4 rounded-2xl border border-yellow-400/30 bg-yellow-500/10 p-4 text-sm text-yellow-100"><strong>Important:</strong> Mark replied records that a human replied outside this app. It does not send email and does not create a Gmail draft.</div>
    {notice && <div className={cx('mb-4 rounded-xl border px-4 py-3 text-sm', notice.type === 'error' ? 'border-red-400/40 bg-red-500/10 text-red-100' : 'border-brand-green/30 bg-brand-green/10 text-brand-green')}>{notice.message}</div>}
    <div className="grid gap-4 lg:grid-cols-3">
      <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">Disposition</span><select value={disposition} onChange={(e) => setDisposition(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white">{dispositions.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">Next follow-up</span><input value={nextAt} onChange={(e) => setNextAt(e.target.value)} placeholder="YYYY-MM-DD or timestamp" className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white" /></label>
      <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">Reason</span><input value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white" /></label>
      <label className="lg:col-span-1"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">Owner notes</span><textarea value={ownerNotes} onChange={(e) => setOwnerNotes(e.target.value)} rows={4} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white" /></label>
      <label className="lg:col-span-1"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">Next follow-up note</span><textarea value={nextNote} onChange={(e) => setNextNote(e.target.value)} rows={4} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white" /></label>
      <label className="lg:col-span-1"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">Internal conversation notes</span><textarea value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} rows={4} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white" /></label>
    </div>
    <div className="mt-4 flex flex-wrap gap-2"><button disabled={saving} onClick={() => save()} className="rounded-xl bg-brand-green px-5 py-3 font-bold text-brand-black hover:bg-white disabled:opacity-60">{saving ? 'Saving...' : 'Save pipeline state'}</button>{quickActions.map((action) => <button key={action.disposition} disabled={saving} onClick={() => { setDisposition(action.disposition); setReason(action.reason); save(action.disposition === 'REPLIED' ? 'mark_replied_external_record_only' : 'detail_quick_action', action.disposition, action.reason); }} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white/70 hover:border-brand-green hover:text-brand-green disabled:opacity-60">{action.label}</button>)}</div>
    <div className="mt-4 grid gap-3 text-xs text-white/50 md:grid-cols-3"><span>Updated: {formatDate(lead.disposition_updated_at || '')}</span><span>By: {lead.disposition_updated_by || '—'}</span><span>Last human action: {formatDate(lead.last_human_action_at || '')}</span></div>
  </section>;
}

function LeadDetail({ lead, refreshedAt, lastDataUpdatedAt, source, onLeadUpdated }: { lead: Lead; refreshedAt: string; lastDataUpdatedAt: string; source: string; onLeadUpdated: (lead: Lead, refreshedAt: string, lastDataUpdatedAt: string, source: string) => void }) {
  const [copied, setCopied] = useState('');
  const fullEmail = `Subject: ${lead.draft_subject}\n\n${lead.draft_body}`;
  const score = lead.fit_score ?? '—';
  function onCopied(label: string) {
    setCopied(`${label} copied`);
    window.setTimeout(() => setCopied(''), 8000);
  }
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <a href="/admin/leads" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-brand-green hover:text-white"><ArrowLeft size={16} /> Back to prospect queue</a>
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-4 flex flex-wrap gap-2">{badge(primaryPriority(lead))}{badge(lead.status)}{lead.lead_type && badge(lead.lead_type)}</div>
          <h1 className="font-heading text-4xl font-black md:text-5xl">{lead.researched_company_name || lead.company || 'Unknown company'}</h1>
          <p className="mt-3 max-w-3xl text-xl text-white/75">{shortText(lead.company_summary || lead.qualification_notes || lead.message, 'No enrichment summary yet.')}</p>
          <p className="mt-3 text-xs text-white/40">Data last updated {formatDate(lastDataUpdatedAt || refreshedAt)} · Page refreshed {formatDate(refreshedAt)} · Source: {sourceLabel(source)}</p>
        </div>
        <div className="rounded-3xl border border-brand-green/30 bg-brand-green/10 p-5">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-green">Opportunity score</p>
          <p className="font-heading text-6xl font-black">{score}</p>
          <p className="mt-2 text-white/70">{nextActionFor(lead)}</p>
        </div>
      </div>

      <DispositionPanel lead={lead} onUpdated={onLeadUpdated} />

      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_440px]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="mb-5 flex items-center gap-2 font-heading text-2xl font-black"><BriefcaseBusiness className="text-brand-green" /> Prospect Briefing</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Contact"><div>{contactName(lead)}{lead.title && <p className="text-sm text-white/50">{lead.title}</p>}</div></Field>
            <Field label="Company"><div>{lead.company || '—'}{lead.researched_website && <p><a className="text-sm text-brand-green" href={lead.researched_website} target="_blank" rel="noreferrer">{lead.researched_website}</a></p>}</div></Field>
            <Field label="Email"><a className="text-brand-green" href={`mailto:${lead.email}`}>{lead.email || '—'}</a></Field>
            <Field label="Phone">{lead.phone || '—'}</Field>
            <Field label="Relationship type">{[lead.lead_type, lead.beverage_category].filter(Boolean).join(' · ') || '—'}</Field>
            <Field label="Received">{formatDate(lead.received_at)}</Field>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/45">Original ask</p>
            <p className="whitespace-pre-wrap text-white/80">{lead.message || '—'}</p>
          </div>
        </section>

        <section className="rounded-3xl border border-brand-green/30 bg-white/[0.05] p-5 shadow-2xl shadow-brand-green/5">
          <div className="mb-4">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-green">Draft response</p>
            <h2 className="font-heading text-2xl font-black">Review, personalize, copy</h2>
            <p className="mt-2 text-sm text-white/50">No email is sent. No Gmail draft is created.</p>
          </div>
          <div className="mb-4 flex flex-wrap gap-2"><CopyButton text={lead.draft_subject} label="Copy subject" onCopied={onCopied} /><CopyButton text={lead.draft_body} label="Copy body" onCopied={onCopied} /><CopyButton text={fullEmail} label="Copy full email" onCopied={onCopied} /></div>
          {copied && <div className="mb-4 rounded-xl border border-brand-green/30 bg-brand-green/10 px-4 py-3 text-sm text-brand-green">{copied}</div>}
          <label className="mb-4 block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">Subject</span><input readOnly value={lead.draft_subject || ''} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white" /></label>
          <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">Body</span><textarea readOnly value={lead.draft_body || ''} rows={13} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white" /></label>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"><h2 className="mb-5 font-heading text-2xl font-black">Why this matters</h2><Field label="Qualification notes"><p className="whitespace-pre-wrap">{lead.qualification_notes || 'No qualification notes yet.'}</p></Field><Field label="Draft rationale"><p className="mt-4 whitespace-pre-wrap">{lead.draft_rationale || '—'}</p></Field></section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"><h2 className="mb-5 font-heading text-2xl font-black">Buying signals</h2><InfoList items={lead.buying_signals} empty="No buying signals captured yet." /></section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"><h2 className="mb-5 font-heading text-2xl font-black">Risks / open questions</h2><InfoList items={[...lead.concerns_or_risks, ...(lead.research_gaps_json || []), ...(lead.human_review_flags_json || [])]} empty="No risks captured yet." tone="red" /></section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-brand-green/20 bg-white/[0.04] p-5"><h2 className="mb-5 flex items-center gap-2 font-heading text-2xl font-black"><Target className="text-brand-green" /> Conversation Strategy</h2><div className="grid gap-5"><Field label="NEPQ angle"><p className="whitespace-pre-wrap">{lead.nepq_angle || 'No NEPQ strategy captured yet.'}</p></Field><Field label="Response strategy"><p className="whitespace-pre-wrap">{lead.response_strategy || '—'}</p></Field><Field label="Tone notes"><p className="whitespace-pre-wrap">{lead.nepq_tone_notes || '—'}</p></Field><Field label="Discovery questions"><InfoList items={lead.nepq_discovery_questions_json || []} empty="No discovery questions captured yet." /></Field><Field label="Follow-up question stack"><InfoList items={lead.follow_up_question_stack_json || []} empty="No follow-up question stack captured yet." /></Field></div></section>
        <section className="rounded-3xl border border-brand-green/20 bg-white/[0.04] p-5"><h2 className="mb-5 flex items-center gap-2 font-heading text-2xl font-black"><Sparkles className="text-brand-green" /> Research Briefing</h2><div className="grid gap-5"><Field label="Depth / status / confidence">{[lead.research_depth, lead.research_status, lead.research_confidence ?? ''].filter(Boolean).join(' · ') || '—'}</Field><Field label="Narrow research"><p className="whitespace-pre-wrap">{lead.narrow_research_summary || 'No narrow research summary captured yet.'}</p></Field><Field label="Wide research"><p className="whitespace-pre-wrap">{lead.wide_research_summary || 'No wide research summary captured yet.'}</p></Field><Field label="Decision-maker hypothesis"><p className="whitespace-pre-wrap">{lead.decision_maker_hypothesis || '—'}</p></Field><Field label="Use-case hypothesis"><p className="whitespace-pre-wrap">{lead.use_case_hypothesis || '—'}</p></Field><Field label="Personalization hooks"><InfoList items={lead.personalization_hooks_json || []} empty="No hooks captured yet." /></Field></div></section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5"><h2 className="mb-5 font-heading text-xl font-black">Company facts</h2>{renderJsonSummary(lead.company_facts_json)}</section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5"><h2 className="mb-5 font-heading text-xl font-black">Products + distribution</h2><div className="grid gap-4"><Field label="Product portfolio">{renderJsonSummary(lead.product_portfolio_json)}</Field><Field label="Distribution channels">{renderJsonSummary(lead.distribution_channels_json)}</Field><Field label="Retailer presence">{renderJsonSummary(lead.retailer_presence_json)}</Field></div></section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5"><h2 className="mb-5 font-heading text-xl font-black">Manufacturing + market context</h2><div className="grid gap-4"><Field label="Manufacturing / co-packer signals">{renderJsonSummary(lead.manufacturing_or_copacker_signals_json)}</Field><Field label="Recent news">{renderJsonSummary(lead.recent_news_json)}</Field><Field label="Competitive context"><p className="whitespace-pre-wrap">{lead.competitive_context || '—'}</p></Field></div></section>
      </div>

      <details className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <summary className="flex cursor-pointer list-none items-center justify-between text-brand-green"><span className="font-heading text-xl font-black">Technical + source details</span><ChevronDown /></summary>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <section><h3 className="mb-3 font-bold text-white/70">Source URLs</h3><ul className="space-y-2">{lead.source_urls.length ? lead.source_urls.map((url) => <li key={url}><a className="inline-flex items-center gap-2 text-brand-green" href={url} target="_blank" rel="noreferrer">{url}<ExternalLink size={14}/></a></li>) : <li className="text-white/50">No source URLs supplied.</li>}</ul></section>
          <section><h3 className="mb-3 font-bold text-white/70">Source evidence</h3>{renderJsonSummary(lead.source_evidence_json || lead.research_evidence_json)}</section>
          <section className="grid gap-4 sm:grid-cols-2"><Field label="Basin ID">{lead.basin_submission_id}</Field><Field label="Sheet row">{lead.rowNumber}</Field><Field label="Dedupe key">{lead.dedupe_key}</Field><Field label="Processed at">{formatDate(lead.processed_at)}</Field><Field label="Assigned owner">{lead.assigned_owner}</Field><Field label="Assigned inbox">{lead.assigned_inbox}</Field><Field label="UTM source">{lead.utm_source}</Field><Field label="UTM campaign">{lead.utm_campaign}</Field><Field label="Pipeline stage">{lead.pipeline_stage}</Field><Field label="Last contacted">{formatDate(lead.last_contacted_at || '')}</Field></section>
          <section className="lg:col-span-2"><h3 className="mb-3 font-bold text-white/70">Raw submission JSON</h3><pre className="max-h-80 overflow-auto rounded-xl bg-black/60 p-4 text-xs text-white/65">{JSON.stringify(lead.raw_submission_json, null, 2)}</pre></section>
          {lead.error_message && <section className="lg:col-span-2 rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-red-100"><h3 className="font-bold">Processing error</h3><p className="mt-2 whitespace-pre-wrap">{lead.error_message}</p></section>}
        </div>
      </details>
    </main>
  );
}

function AdminRoutes() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const pathname = window.location.pathname;
  const isLogin = pathname === '/admin/login';
  const detailId = pathname.startsWith('/admin/leads/') ? pathname.split('/').pop() || '' : '';

  async function checkAuth() {
    if (localMockAdmin && window.localStorage.getItem('relid_mock_admin') === '1') { setAuthed(true); return; }
    try { await api('/api/admin/me'); setAuthed(true); }
    catch { setAuthed(false); if (!isLogin) history.replaceState(null, '', '/admin/login'); }
  }

  async function loadLeads() {
    setNotice(null);
    try { setData(localMockAdmin ? localMockResponse() : await api<LeadsResponse>('/api/admin/leads')); }
    catch (error) { setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Could not load leads' }); }
  }

  async function loadLead(id: string) {
    setNotice(null);
    try {
      if (localMockAdmin) {
        const mock = localMockResponse();
        const found = mock.leads.find((item) => item.id === id) || mock.leads[0];
        setLead(found); setData({ leads: [found], refreshedAt: mock.refreshedAt, lastDataUpdatedAt: mock.lastDataUpdatedAt, source: mock.source });
        return;
      }
      const result = await api<{ lead: Lead; refreshedAt: string; lastDataUpdatedAt: string; source: string }>(`/api/admin/leads/${id}`); setLead(result.lead); setData({ leads: [result.lead], refreshedAt: result.refreshedAt, lastDataUpdatedAt: result.lastDataUpdatedAt, source: result.source as any }); }
    catch (error) { setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Could not load lead' }); }
  }

  async function logout() {
    window.localStorage.removeItem('relid_mock_admin');
    if (!localMockAdmin) await api('/api/admin/logout', { method: 'POST' }).catch(() => null);
    setAuthed(false); history.replaceState(null, '', '/admin/login'); window.dispatchEvent(new PopStateEvent('popstate'));
  }

  useEffect(() => { checkAuth(); }, []);
  useEffect(() => {
    if (!authed) return;
    if (detailId) loadLead(detailId); else loadLeads();
  }, [authed, detailId]);

  if (isLogin || authed === false) return <LoginView onLoggedIn={() => { setAuthed(true); history.replaceState(null, '', '/admin/leads'); window.dispatchEvent(new PopStateEvent('popstate')); }} />;
  if (authed === null) return <div className="min-h-screen bg-brand-black p-10 text-white">Checking admin session...</div>;

  return <AdminShell onLogout={logout}>{notice && <div className="mx-auto mt-6 max-w-7xl rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-red-100">{notice.message}</div>}{detailId ? (lead && data ? <LeadDetail lead={lead} refreshedAt={data.refreshedAt} lastDataUpdatedAt={data.lastDataUpdatedAt} source={data.source} onLeadUpdated={(updatedLead, refreshedAt, lastDataUpdatedAt, source) => { setLead(updatedLead); setData({ leads: [updatedLead], refreshedAt, lastDataUpdatedAt, source: source as any }); }} /> : <div className="p-10">Loading prospect...</div>) : (data ? <LeadsList data={data} onRefresh={loadLeads} /> : <div className="p-10">Loading prospects...</div>)}</AdminShell>;
}

export default function AdminApp() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const handler = () => setTick((x) => x + 1);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);
  return <AdminRoutes />;
}
