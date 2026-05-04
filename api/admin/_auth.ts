import type { IncomingMessage, ServerResponse } from 'http';

const COOKIE_NAME = 'relid_admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 8;

function env(name: string): string {
  return process.env[name] || '';
}

function requireSecret(): string {
  const secret = env('ADMIN_AUTH_SECRET');
  if (!secret) throw new Error('ADMIN_AUTH_SECRET is not configured');
  return secret;
}

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64url');
}

async function sign(value: string, secret: string): Promise<string> {
  const { createHmac } = await import('node:crypto');
  return createHmac('sha256', secret).update(value).digest('base64url');
}

async function safeEqual(a: string, b: string): Promise<boolean> {
  if (a.length !== b.length) return false;
  try {
    const { timingSafeEqual } = await import('node:crypto');
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

export function parseCookies(req: IncomingMessage): Record<string, string> {
  const header = req.headers.cookie || '';
  return Object.fromEntries(header.split(';').map((part) => {
    const [key, ...rest] = part.trim().split('=');
    return [key, decodeURIComponent(rest.join('='))];
  }).filter(([key]) => Boolean(key)));
}

function cookieSecurityAttrs(): string {
  const secure = process.env.VERCEL_ENV === 'production';
  return `HttpOnly; ${secure ? 'Secure; ' : ''}SameSite=Lax; Path=/`;
}

export async function createSessionCookie(username: string): Promise<string> {
  const secret = requireSecret();
  const payload = base64url(JSON.stringify({ username, exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS }));
  const signature = await sign(payload, secret);
  return `${COOKIE_NAME}=${payload}.${signature}; ${cookieSecurityAttrs()}; Max-Age=${MAX_AGE_SECONDS}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; ${cookieSecurityAttrs()}; Max-Age=0`;
}

export async function getSession(req: IncomingMessage): Promise<{ username: string } | null> {
  const token = parseCookies(req)[COOKIE_NAME];
  if (!token || !token.includes('.')) return null;
  const [payload, signature] = token.split('.', 2);
  let expected = '';
  try {
    expected = await sign(payload, requireSecret());
  } catch {
    return null;
  }
  if (!(await safeEqual(signature, expected))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { username?: string; exp?: number };
    if (!session.username || !session.exp || session.exp < Math.floor(Date.now() / 1000)) return null;
    return { username: session.username };
  } catch {
    return null;
  }
}

export async function requireAdmin(req: IncomingMessage, res: ServerResponse): Promise<{ username: string } | null> {
  try {
    const session = await getSession(req);
    if (session) return session;
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : 'Auth configuration error' });
    return null;
  }
  sendJson(res, 401, { error: 'Unauthorized' });
  return null;
}

export function validateCredentials(username: string, password: string): boolean {
  const expectedUser = env('ADMIN_USERNAME');
  const expectedPass = env('ADMIN_PASSWORD');
  if (!expectedUser || !expectedPass) throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD are required');
  return username === expectedUser && password === expectedPass;
}

export function sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

export async function readJsonBody<T = any>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  if (!chunks.length) return {} as T;
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
