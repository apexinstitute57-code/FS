import {
  handleDeleteCatalog,
  handleGetCatalog,
  handleUpsertCatalog,
} from '../../server/supabase-api';

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
    const result = await handleGetCatalog();
    return toResponse(result.status, result.body);
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

  if (
    request.method === 'POST' ||
    request.method === 'PUT' ||
    request.method === 'PATCH'
  ) {
    const result = await handleUpsertCatalog(body);
    return toResponse(result.status, result.body);
  }

  if (request.method === 'DELETE') {
    const result = await handleDeleteCatalog(body);
    return toResponse(result.status, result.body);
  }

  return toResponse(405, {
    saved: false,
    error: 'Method not allowed.',
    code: 'METHOD_NOT_ALLOWED',
  });
}
