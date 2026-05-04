import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Copy, ExternalLink, LogOut, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import type { Lead, LeadsResponse } from '../../lib/adminTypes';

type View = 'login' | 'list' | 'detail';

type Notice = { type: 'success' | 'error' | 'info'; message: string } | null;

const statusClasses: Record<string, string> = {
  HOT: 'bg-red-500/20 text-red-200 border-red-400/40',
  WARM: 'bg-orange-500/20 text-orange-100 border-orange-400/40',
  COOL: 'bg-blue-500/20 text-blue-100 border-blue-400/40',
  NEEDS_REVIEW: 'bg-purple-500/20 text-purple-100 border-purple-400/40',
  DISQUALIFY: 'bg-zinc-500/20 text-zinc-200 border-zinc-400/40',
  ERROR: 'bg-red-950/70 text-red-100 border-red-500/50',
  NEW: 'bg-brand-green/20 text-brand-green border-brand-green/40',
  PROCESSING: 'bg-yellow-500/20 text-yellow-100 border-yellow-400/40',
  DRAFT_READY: 'bg-emerald-500/20 text-emerald-100 border-emerald-400/40',
  DUPLICATE: 'bg-zinc-700/50 text-zinc-300 border-zinc-500/40',
};

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

function badge(value?: string) {
  const key = (value || '—').toUpperCase();
  return <span className={cx('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wide', statusClasses[key] || 'bg-white/10 text-white/80 border-white/20')}>{value || '—'}</span>;
}


function localMockResponse(): LeadsResponse {
  const now = new Date().toISOString();
  const base = {
    id: 'mock-001', rowNumber: 2, received_at: '2026-05-04T14:05:00-05:00', basin_submission_id: 'mock-001', dedupe_key: 'mock:001', status: 'DRAFT_READY', status_reason: 'Processed by local Hermes runner', first_name: 'Jordan', last_name: 'Reed', email: 'jordan@northstarcoldbrew.com', phone: '312-555-0198', company: 'Northstar Cold Brew Co', title: 'Founder', website: 'https://northstarcoldbrew.com', message: 'We are preparing a canned cold brew launch and want to understand whether Re:Lid resealable aluminum can technology could work for RTD coffee and on-the-go retail.', source_page: 'https://relidusa.com/contact', utm_source: 'organic', utm_medium: '', utm_campaign: 'launch', raw_submission_json: {}, email_domain: 'northstarcoldbrew.com', researched_company_name: 'Northstar Cold Brew Co', researched_website: 'https://northstarcoldbrew.com', company_summary: 'Regional cold brew brand preparing a canned RTD expansion for retail and convenience channels.', beverage_category: 'RTD coffee', lead_type: 'brand', fit_score: 88, priority: 'HOT', qualification_notes: 'Strong fit: beverage brand, canned launch, packaging innovation interest, business domain.', buying_signals: ['Canned RTD launch', 'Asked about resealable aluminum can technology', 'Retail/on-the-go use case'], concerns_or_risks: ['Needs real volume and filler details before technical claims'], recommended_next_step: 'Schedule a qualification call; ask can size, fill method, launch timing, estimated volume, and co-packer/filler.', assigned_owner: 'Re:Lid Sales', assigned_inbox: 'sales@relidusa.com', draft_subject: 'Re:Lid USA follow-up for Northstar Cold Brew', draft_body: 'Hi Jordan,\n\nThanks for reaching out to Re:Lid USA. A canned cold brew launch is exactly the kind of on-the-go beverage use case where resealable aluminum can technology may create a better consumer experience.\n\nTo point you in the right direction, could you share your target can size, fill method, launch timing, estimated volume, and whether you are filling in-house or through a co-packer?\n\nHappy to set up a short intro call once we have those details.\n\nRe:Lid USA Team', draft_rationale: 'Draft asks for qualification details without promising compatibility or pricing.', source_urls: ['https://northstarcoldbrew.com'], openai_response_id: 'mock', processed_at: '2026-05-04T15:15:00-05:00', error_message: '', create_gmail_draft: 'FALSE', gmail_draft_id: ''
  } satisfies Lead;
  const second = { ...base, id: 'mock-002', rowNumber: 3, basin_submission_id: 'mock-002', dedupe_key: 'mock:002', status: 'NEEDS_REVIEW', first_name: 'Taylor', last_name: 'Kim', email: 'taylor@evergreenfilling.com', company: 'Evergreen Filling Partners', title: 'Packaging Innovation Manager', website: 'https://evergreenfilling.com', researched_company_name: 'Evergreen Filling Partners', beverage_category: 'Sparkling water / RTD tea', lead_type: 'co_packer', fit_score: 79, priority: 'WARM', draft_subject: 'Re:Lid USA qualification questions for Evergreen Filling' } satisfies Lead;
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
              <p className="font-heading text-lg font-bold tracking-wide">RE<span className="text-brand-green">→</span>LID Lead Command</p>
              <p className="text-xs uppercase tracking-[0.25em] text-white/50">Private admin</p>
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
          <h1 className="font-heading text-4xl font-black">Re:Lid Lead Command Center</h1>
          <p className="mt-4 text-white/65">Server-validated login. Lead data is loaded from the Google Sheet only after authentication.</p>
        </div>
        <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40">
          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-semibold text-white/70">Username</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none ring-brand-green/50 focus:border-brand-green focus:ring-2" required />
          </label>
          <label className="mb-6 block">
            <span className="mb-2 block text-sm font-semibold text-white/70">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none ring-brand-green/50 focus:border-brand-green focus:ring-2" required />
          </label>
          {notice && <div className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">{notice.message}</div>}
          <button disabled={loading} className="w-full rounded-xl bg-brand-green px-5 py-3 font-heading font-bold uppercase tracking-wider text-brand-black transition hover:bg-white disabled:opacity-60">
            {loading ? 'Checking...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Filters({ query, setQuery, status, setStatus, priority, setPriority, leadType, setLeadType, owner, setOwner, inbox, setInbox, options }: any) {
  const selectClass = 'rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-white outline-none focus:border-brand-green';
  return (
    <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:grid-cols-6">
      <label className="relative md:col-span-2">
        <Search className="absolute left-3 top-3.5 text-white/35" size={18} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search company, name, email, message..." className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-10 pr-3 text-sm outline-none focus:border-brand-green" />
      </label>
      <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}><option value="">All statuses</option>{options.statuses.map((x: string) => <option key={x}>{x}</option>)}</select>
      <select value={priority} onChange={(e) => setPriority(e.target.value)} className={selectClass}><option value="">All priorities</option>{options.priorities.map((x: string) => <option key={x}>{x}</option>)}</select>
      <select value={leadType} onChange={(e) => setLeadType(e.target.value)} className={selectClass}><option value="">All lead types</option>{options.leadTypes.map((x: string) => <option key={x}>{x}</option>)}</select>
      <select value={owner || inbox} onChange={(e) => { setOwner(''); setInbox(e.target.value); }} className={selectClass}><option value="">All inboxes</option>{options.inboxes.map((x: string) => <option key={x}>{x}</option>)}</select>
    </div>
  );
}

function LeadsList({ data, onRefresh }: { data: LeadsResponse; onRefresh: () => void }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [leadType, setLeadType] = useState('');
  const [owner, setOwner] = useState('');
  const [inbox, setInbox] = useState('');
  const leads = data.leads || [];

  const options = useMemo(() => ({
    statuses: [...new Set(leads.map((l) => l.status).filter(Boolean))],
    priorities: [...new Set(leads.map((l) => l.priority).filter(Boolean))],
    leadTypes: [...new Set(leads.map((l) => l.lead_type).filter(Boolean))],
    inboxes: [...new Set(leads.map((l) => l.assigned_inbox).filter(Boolean))],
  }), [leads]);

  const filtered = leads.filter((lead) => {
    const haystack = [lead.company, contactName(lead), lead.email, lead.message, lead.researched_company_name].join(' ').toLowerCase();
    return (!query || haystack.includes(query.toLowerCase()))
      && (!status || lead.status === status)
      && (!priority || lead.priority === priority)
      && (!leadType || lead.lead_type === leadType)
      && (!owner || lead.assigned_owner === owner)
      && (!inbox || lead.assigned_inbox === inbox);
  });

  const hot = leads.filter((l) => String(l.priority).toUpperCase() === 'HOT').length;
  const ready = leads.filter((l) => l.status === 'DRAFT_READY').length;
  const review = leads.filter((l) => l.status === 'NEEDS_REVIEW' || l.priority === 'NEEDS_REVIEW').length;
  const newRows = leads.filter((l) => l.status === 'NEW').length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-brand-green">Sales queue</p>
          <h1 className="font-heading text-4xl font-black md:text-5xl">Inbound Lead Dashboard</h1>
          <p className="mt-3 max-w-3xl text-white/65">Google Sheet source of truth, read server-side at page load/API refresh. No email is sent and no Gmail draft is created.</p>
          <p className="mt-2 text-xs text-white/45">Refreshed {formatDate(data.refreshedAt)} · Source: {data.source === 'mock' ? 'safe mock data' : 'Google Sheet'}</p>
        </div>
        <button onClick={onRefresh} className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-green/40 px-5 py-3 font-bold text-brand-green hover:bg-brand-green hover:text-brand-black"><RefreshCw size={18} /> Refresh data</button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {[['HOT', hot], ['Draft ready', ready], ['Needs review', review], ['New', newRows]].map(([label, count]) => (
          <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-bold uppercase tracking-wider text-white/45">{label}</p>
            <p className="mt-2 font-heading text-4xl font-black">{count}</p>
          </div>
        ))}
      </div>

      <Filters query={query} setQuery={setQuery} status={status} setStatus={setStatus} priority={priority} setPriority={setPriority} leadType={leadType} setLeadType={setLeadType} owner={owner} setOwner={setOwner} inbox={inbox} setInbox={setInbox} options={options} />

      <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
        <div className="hidden grid-cols-[1fr_120px_100px_1.1fr_1.1fr_1fr_1fr] gap-4 border-b border-white/10 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/45 lg:grid">
          <span>Lead</span><span>Status</span><span>Score</span><span>Contact</span><span>Category</span><span>Assigned</span><span>Received</span>
        </div>
        {filtered.length === 0 ? <div className="p-10 text-center text-white/55">No leads match the current filters.</div> : filtered.map((lead) => (
          <a key={lead.id} href={`/admin/leads/${lead.id}`} className="grid gap-3 border-b border-white/10 px-5 py-5 transition hover:bg-white/[0.06] lg:grid-cols-[1fr_120px_100px_1.1fr_1.1fr_1fr_1fr] lg:items-center">
            <div>
              <p className="font-heading text-lg font-bold text-white">{lead.researched_company_name || lead.company || 'Unknown company'}</p>
              <p className="mt-1 line-clamp-2 text-sm text-white/55">{lead.message || lead.company_summary || 'No message supplied'}</p>
            </div>
            <div className="flex flex-wrap gap-2">{badge(lead.priority || lead.status)}{badge(lead.status)}</div>
            <div className="text-lg font-black text-brand-green">{lead.fit_score ?? '—'}</div>
            <div className="text-sm"><p className="font-semibold">{contactName(lead)}</p><p className="text-white/50">{lead.email || '—'}</p></div>
            <div className="text-sm"><p>{lead.lead_type || '—'}</p><p className="text-white/50">{lead.beverage_category || '—'}</p></div>
            <div className="text-sm"><p>{lead.assigned_owner || '—'}</p><p className="text-white/50">{lead.assigned_inbox || '—'}</p></div>
            <div className="text-sm text-white/55">{formatDate(lead.received_at)}{lead.processed_at && <p className="mt-1">Processed {formatDate(lead.processed_at)}</p>}</div>
          </a>
        ))}
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
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', 'true');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
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

function LeadDetail({ lead, refreshedAt, source }: { lead: Lead; refreshedAt: string; source: string }) {
  const [copied, setCopied] = useState('');
  const fullEmail = `Subject: ${lead.draft_subject}\n\n${lead.draft_body}`;
  function onCopied(label: string) {
    setCopied(`${label} copied`);
    window.setTimeout(() => setCopied(''), 8000);
  }
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <a href="/admin/leads" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-brand-green hover:text-white"><ArrowLeft size={16} /> Back to leads</a>
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_420px]">
        <div>
          <div className="mb-4 flex flex-wrap gap-2">{badge(lead.priority || lead.status)}{badge(lead.status)}</div>
          <h1 className="font-heading text-4xl font-black md:text-5xl">{lead.researched_company_name || lead.company || 'Unknown company'}</h1>
          <p className="mt-3 max-w-3xl text-white/65">{lead.company_summary || lead.message || 'No summary available yet.'}</p>
          <p className="mt-3 text-xs text-white/40">Refreshed {formatDate(refreshedAt)} · Source: {source}</p>
        </div>
        <div className="rounded-3xl border border-brand-green/30 bg-brand-green/10 p-5">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-green">Fit score</p>
          <p className="font-heading text-6xl font-black">{lead.fit_score ?? '—'}</p>
          <p className="mt-2 text-white/65">{lead.recommended_next_step || 'No next step supplied.'}</p>
        </div>
      </div>

      <section className="mb-8 rounded-3xl border border-brand-green/30 bg-white/[0.05] p-5 shadow-2xl shadow-brand-green/5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-green">Draft response copy box</p>
            <h2 className="font-heading text-2xl font-black">Human review required before sending</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={lead.draft_subject} label="Copy subject" onCopied={onCopied} />
            <CopyButton text={lead.draft_body} label="Copy body" onCopied={onCopied} />
            <CopyButton text={fullEmail} label="Copy full email" onCopied={onCopied} />
          </div>
        </div>
        {copied && <div className="mb-4 rounded-xl border border-brand-green/30 bg-brand-green/10 px-4 py-3 text-sm text-brand-green">{copied}</div>}
        <label className="mb-4 block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">Subject</span><input readOnly value={lead.draft_subject || ''} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white" /></label>
        <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">Body</span><textarea readOnly value={lead.draft_body || ''} rows={12} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white" /></label>
        <p className="mt-3 text-sm text-white/50">This panel only copies text. It does not send email and does not create Gmail drafts.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"><h2 className="mb-5 font-heading text-2xl font-black">Contact</h2><div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">{contactName(lead)}</Field><Field label="Title">{lead.title}</Field><Field label="Company">{lead.company}</Field><Field label="Email"><a className="text-brand-green" href={`mailto:${lead.email}`}>{lead.email}</a></Field><Field label="Phone">{lead.phone}</Field><Field label="Website">{lead.website ? <a className="inline-flex items-center gap-1 text-brand-green" href={lead.website} target="_blank" rel="noreferrer">{lead.website}<ExternalLink size={14}/></a> : '—'}</Field><Field label="Received">{formatDate(lead.received_at)}</Field><Field label="Source page">{lead.source_page}</Field>
        </div></section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"><h2 className="mb-5 font-heading text-2xl font-black">Lead Intelligence</h2><div className="grid gap-4">
          <Field label="Researched company">{lead.researched_company_name}</Field><Field label="Researched website">{lead.researched_website ? <a className="text-brand-green" href={lead.researched_website} target="_blank" rel="noreferrer">{lead.researched_website}</a> : '—'}</Field><Field label="Category / type">{[lead.beverage_category, lead.lead_type].filter(Boolean).join(' · ')}</Field><Field label="Qualification notes">{lead.qualification_notes}</Field><Field label="Recommended next step">{lead.recommended_next_step}</Field>
        </div></section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"><h2 className="mb-5 font-heading text-2xl font-black">Signals & Risks</h2><div className="grid gap-5 sm:grid-cols-2"><div><h3 className="mb-3 font-bold text-brand-green">Buying signals</h3><ul className="space-y-2 text-white/75">{lead.buying_signals.length ? lead.buying_signals.map((item) => <li key={item}>• {item}</li>) : <li>—</li>}</ul></div><div><h3 className="mb-3 font-bold text-red-200">Concerns or risks</h3><ul className="space-y-2 text-white/75">{lead.concerns_or_risks.length ? lead.concerns_or_risks.map((item) => <li key={item}>• {item}</li>) : <li>—</li>}</ul></div></div></section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"><h2 className="mb-5 font-heading text-2xl font-black">Original Submission</h2><Field label="Message"><p className="whitespace-pre-wrap">{lead.message}</p></Field><div className="mt-4 grid gap-4 sm:grid-cols-3"><Field label="UTM source">{lead.utm_source}</Field><Field label="UTM medium">{lead.utm_medium}</Field><Field label="UTM campaign">{lead.utm_campaign}</Field></div><details className="mt-5"><summary className="cursor-pointer text-brand-green">Raw submission</summary><pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-black/60 p-4 text-xs text-white/65">{JSON.stringify(lead.raw_submission_json, null, 2)}</pre></details></section>
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 lg:col-span-2"><h2 className="mb-5 font-heading text-2xl font-black">Source URLs & Rationale</h2><div className="grid gap-5 lg:grid-cols-2"><div><h3 className="mb-3 font-bold text-white/70">Sources</h3><ul className="space-y-2">{lead.source_urls.length ? lead.source_urls.map((url) => <li key={url}><a className="inline-flex items-center gap-2 text-brand-green" href={url} target="_blank" rel="noreferrer">{url}<ExternalLink size={14}/></a></li>) : <li className="text-white/50">No source URLs supplied.</li>}</ul></div><Field label="Draft rationale"><p className="whitespace-pre-wrap">{lead.draft_rationale}</p></Field></div></section>
      </div>
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

  return <AdminShell onLogout={logout}>{notice && <div className="mx-auto mt-6 max-w-7xl rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-red-100">{notice.message}</div>}{detailId ? (lead && data ? <LeadDetail lead={lead} refreshedAt={data.refreshedAt} source={data.source} /> : <div className="p-10">Loading lead...</div>) : (data ? <LeadsList data={data} onRefresh={loadLeads} /> : <div className="p-10">Loading leads...</div>)}</AdminShell>;
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
