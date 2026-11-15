import { handleCreateOrder, handleHealthRequest } from '../../server/supabase-api';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};

function toResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  if (request.method === 'GET') {
    const result = handleHealthRequest();
    return toResponse(result.status, result.body);
  }

  if (request.method !== 'POST') {
    return toResponse(405, {
      saved: false,
      error: 'Method not allowed. Use POST to submit an order.',
      code: 'METHOD_NOT_ALLOWED',
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return toResponse(400, {
      saved: false,
      error: 'Invalid JSON request body.',
      code: 'INVALID_JSON',
    });
  }

  const result = await handleCreateOrder(body);
  return toResponse(result.status, result.body);
}
