export type LeadStatus =
  | 'NEW'
  | 'PROCESSING'
  | 'DRAFT_READY'
  | 'NEEDS_REVIEW'
  | 'ERROR'
  | 'DUPLICATE'
  | 'GMAIL_DRAFT_CREATED'
  | string;

export type LeadPriority = 'HOT' | 'WARM' | 'COOL' | 'DISQUALIFY' | 'NEEDS_REVIEW' | string;

export type LeadDisposition =
  | 'NEEDS_RESEARCH'
  | 'NEEDS_OWNER_INPUT'
  | 'READY_FOR_REVIEW'
  | 'READY_TO_REPLY'
  | 'REPLIED'
  | 'WAITING_ON_PROSPECT'
  | 'CALL_SCHEDULED'
  | 'QUALIFYING'
  | 'SAMPLE_FOLLOW_UP'
  | 'OPPORTUNITY'
  | 'NURTURE'
  | 'DISQUALIFIED'
  | 'SPAM_OR_VENDOR'
  | 'CLOSED_NO_ACTION'
  | string;

export interface Lead {
  id: string;
  rowNumber: number;
  received_at: string;
  basin_submission_id: string;
  dedupe_key: string;
  status: LeadStatus;
  status_reason: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  website: string;
  message: string;
  source_page: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  raw_submission_json: unknown;
  email_domain: string;
  researched_company_name: string;
  researched_website: string;
  company_summary: string;
  beverage_category: string;
  lead_type: string;
  fit_score: number | null;
  priority: LeadPriority;
  qualification_notes: string;
  buying_signals: string[];
  concerns_or_risks: string[];
  recommended_next_step: string;
  assigned_owner: string;
  assigned_inbox: string;
  draft_subject: string;
  draft_body: string;
  draft_rationale: string;
  source_urls: string[];
  openai_response_id: string;
  processed_at: string;
  error_message: string;
  create_gmail_draft: string;
  gmail_draft_id: string;

  research_depth?: string;
  research_status?: string;
  narrow_research_summary?: string;
  wide_research_summary?: string;
  company_facts_json?: unknown;
  product_portfolio_json?: unknown;
  distribution_channels_json?: unknown;
  retailer_presence_json?: unknown;
  manufacturing_or_copacker_signals_json?: unknown;
  recent_news_json?: unknown;
  leadership_contacts_json?: unknown;
  decision_maker_hypothesis?: string;
  use_case_hypothesis?: string;
  personalization_hooks_json?: string[];
  competitive_context?: string;
  research_confidence?: number | null;
  research_gaps_json?: string[];
  nepq_angle?: string;
  nepq_discovery_questions_json?: string[];
  nepq_tone_notes?: string;
  response_strategy?: string;
  follow_up_question_stack_json?: string[];
  human_review_flags_json?: string[];
  source_evidence_json?: unknown;
  research_evidence_json?: unknown;

  disposition?: LeadDisposition;
  disposition_reason?: string;
  disposition_updated_at?: string;
  disposition_updated_by?: string;
  last_human_action_at?: string;
  next_follow_up_at?: string;
  next_follow_up_note?: string;
  owner_notes?: string;
  internal_conversation_notes?: string;
  last_contacted_at?: string;
  replied_at?: string;
  call_scheduled_at?: string;
  pipeline_value_estimate?: string;
  pipeline_stage?: string;
}

export interface LeadsResponse {
  leads: Lead[];
  refreshedAt: string;
  source: 'google-sheet' | 'apps-script-bridge' | 'mock';
}
