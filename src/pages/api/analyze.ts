import type { APIRoute } from 'astro';
import { analyzeData } from '../../lib/openai';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const analysis = await analyzeData(data.csvData);
    
    return new Response(JSON.stringify({ analysis }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};