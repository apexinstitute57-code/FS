import type { IncomingMessage, ServerResponse } from 'http';
import { handleHealthRequest } from '../server/supabase-api';

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  const result = handleHealthRequest();
  res.statusCode = result.status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(result.body));
}
