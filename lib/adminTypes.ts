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
}

export interface LeadsResponse {
  leads: Lead[];
  refreshedAt: string;
  source: 'google-sheet' | 'mock';
}
