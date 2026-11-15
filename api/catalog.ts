import type { IncomingMessage, ServerResponse } from 'http';
import {
  handleDeleteCatalog,
  handleGetCatalog,
  handleUpsertCatalog,
} from '../server/supabase-api';

type VercelLikeRequest = IncomingMessage & {
  body?: unknown;
  query?: Record<string, string | string[]>;
};

async function parseJsonBody(req: VercelLikeRequest): Promise<unknown> {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      return req.body ? JSON.parse(req.body) : {};
    }
    return req.body;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  return raw ? JSON.parse(raw) : {};
}

function sendJson(res: ServerResponse, status: number, body: Record<string, unknown>) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

export default async function handler(req: VercelLikeRequest, res: ServerResponse) {
  try {
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    if (req.method === 'GET') {
      const result = await handleGetCatalog();
      sendJson(res, result.status, result.body);
      return;
    }

    let body: unknown;
    try {
      body = await parseJsonBody(req);
    } catch {
      sendJson(res, 400, {
        saved: false,
        error: 'Invalid JSON request body.',
        code: 'INVALID_JSON',
      });
      return;
    }

    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      const result = await handleUpsertCatalog(body);
      sendJson(res, result.status, result.body);
      return;
    }

    if (req.method === 'DELETE') {
      const result = await handleDeleteCatalog(body);
      sendJson(res, result.status, result.body);
      return;
    }

    sendJson(res, 405, {
      saved: false,
      error: 'Method not allowed.',
      code: 'METHOD_NOT_ALLOWED',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error';
    sendJson(res, 500, {
      saved: false,
      error: `Catalog request failed: ${message}`,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}
