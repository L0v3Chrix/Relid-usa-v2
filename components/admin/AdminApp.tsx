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
  ERROR: 'bg-red-950/70 text-red-100 border-red-500/50',
};

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
  return { leads: [base, second], refreshedAt: now, source: 'mock' };
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

function LeadCard({ lead }: { lead: Lead }) {
  const score = lead.fit_score ?? '—';
  const priority = primaryPriority(lead);
  const title = lead.researched_company_name || lead.company || 'Unknown company';
  const hook = shortText(relationshipHook(lead), 'Waiting on enrichment. Open the record to review the original inquiry.');
  const signals = lead.buying_signals.slice(0, 2);
  return (
    <a href={`/admin/leads/${lead.id}`} className="block rounded-3xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-brand-green/50 hover:bg-white/[0.06]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">{badge(priority)}{lead.status !== priority && badge(lead.status)}{lead.lead_type && badge(lead.lead_type)}</div>
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
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-white/45">Best next action</p>
            <p className="line-clamp-4 text-sm text-white/80">{nextActionFor(lead)}</p>
          </div>
        </div>
      </div>
      {signals.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{signals.map((signal) => <span key={signal} className="rounded-full border border-brand-green/20 bg-brand-green/10 px-3 py-1 text-xs text-brand-green">{signal}</span>)}</div>}
    </a>
  );
}

function LeadsList({ data, onRefresh }: { data: LeadsResponse; onRefresh: () => void }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [leadType, setLeadType] = useState('');
  const leads = data.leads || [];

  const options = useMemo(() => ({
    statuses: [...new Set(leads.map((l) => l.status).filter(Boolean))],
    priorities: [...new Set(leads.map((l) => l.priority).filter(Boolean))],
    leadTypes: [...new Set(leads.map((l) => l.lead_type).filter(Boolean))],
  }), [leads]);

  const filtered = leads.filter((lead) => {
    const haystack = [lead.company, contactName(lead), lead.email, lead.message, lead.researched_company_name, lead.qualification_notes, lead.company_summary].join(' ').toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (!status || lead.status === status) && (!priority || lead.priority === priority) && (!leadType || lead.lead_type === leadType);
  }).sort((a, b) => {
    const ar = priorityRank[String(primaryPriority(a)).toUpperCase()] ?? 9;
    const br = priorityRank[String(primaryPriority(b)).toUpperCase()] ?? 9;
    if (ar !== br) return ar - br;
    return (b.fit_score ?? -1) - (a.fit_score ?? -1);
  });

  const ready = leads.filter((l) => l.status === 'DRAFT_READY').length;
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
          <p className="mt-2 text-xs text-white/45">Refreshed {formatDate(data.refreshedAt)} · Source: {sourceLabel(data.source)}</p>
        </div>
        <button onClick={onRefresh} className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-green/40 px-5 py-3 font-bold text-brand-green hover:bg-brand-green hover:text-brand-black"><RefreshCw size={18} /> Refresh prospects</button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <MetricCard label="Ready to send" value={ready} helper="Draft reply exists; human can review/copy." icon={<MessageSquare size={24} />} />
        <MetricCard label="Hot / warm" value={top} helper="Best conversations to prioritize first." icon={<Target size={24} />} />
        <MetricCard label="Needs judgment" value={needsHuman} helper="Research gaps, media, risk, or errors." icon={<AlertTriangle size={24} />} />
        <MetricCard label="Awaiting enrichment" value={untouched} helper="New or currently being processed." icon={<Sparkles size={24} />} />
      </div>

      <Filters query={query} setQuery={setQuery} status={status} setStatus={setStatus} priority={priority} setPriority={setPriority} leadType={leadType} setLeadType={setLeadType} options={options} />

      <div className="mt-6 grid gap-4">
        {filtered.length === 0 ? <div className="rounded-3xl border border-white/10 p-10 text-center text-white/55">No prospects match the current filters.</div> : filtered.map((lead) => <div key={lead.id}><LeadCard lead={lead} /></div>)}
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

function LeadDetail({ lead, refreshedAt, source }: { lead: Lead; refreshedAt: string; source: string }) {
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
          <p className="mt-3 text-xs text-white/40">Refreshed {formatDate(refreshedAt)} · Source: {sourceLabel(source)}</p>
        </div>
        <div className="rounded-3xl border border-brand-green/30 bg-brand-green/10 p-5">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-green">Opportunity score</p>
          <p className="font-heading text-6xl font-black">{score}</p>
          <p className="mt-2 text-white/70">{nextActionFor(lead)}</p>
        </div>
      </div>

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
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"><h2 className="mb-5 font-heading text-2xl font-black">Risks / open questions</h2><InfoList items={lead.concerns_or_risks} empty="No risks captured yet." tone="red" /></section>
      </div>

      <details className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <summary className="flex cursor-pointer list-none items-center justify-between text-brand-green"><span className="font-heading text-xl font-black">Technical + source details</span><ChevronDown /></summary>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <section><h3 className="mb-3 font-bold text-white/70">Source URLs</h3><ul className="space-y-2">{lead.source_urls.length ? lead.source_urls.map((url) => <li key={url}><a className="inline-flex items-center gap-2 text-brand-green" href={url} target="_blank" rel="noreferrer">{url}<ExternalLink size={14}/></a></li>) : <li className="text-white/50">No source URLs supplied.</li>}</ul></section>
          <section className="grid gap-4 sm:grid-cols-2"><Field label="Basin ID">{lead.basin_submission_id}</Field><Field label="Sheet row">{lead.rowNumber}</Field><Field label="Dedupe key">{lead.dedupe_key}</Field><Field label="Processed at">{formatDate(lead.processed_at)}</Field><Field label="Assigned owner">{lead.assigned_owner}</Field><Field label="Assigned inbox">{lead.assigned_inbox}</Field><Field label="UTM source">{lead.utm_source}</Field><Field label="UTM campaign">{lead.utm_campaign}</Field></section>
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
        setLead(found); setData({ leads: [found], refreshedAt: mock.refreshedAt, source: mock.source });
        return;
      }
      const result = await api<{ lead: Lead; refreshedAt: string; source: string }>(`/api/admin/leads/${id}`); setLead(result.lead); setData({ leads: [result.lead], refreshedAt: result.refreshedAt, source: result.source as any }); }
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

  return <AdminShell onLogout={logout}>{notice && <div className="mx-auto mt-6 max-w-7xl rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-red-100">{notice.message}</div>}{detailId ? (lead && data ? <LeadDetail lead={lead} refreshedAt={data.refreshedAt} source={data.source} /> : <div className="p-10">Loading prospect...</div>) : (data ? <LeadsList data={data} onRefresh={loadLeads} /> : <div className="p-10">Loading prospects...</div>)}</AdminShell>;
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
