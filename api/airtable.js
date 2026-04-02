export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const token   = process.env.AIRTABLE_TOKEN;
  const baseId  = process.env.AIRTABLE_BASE_ID  || 'appa5Xa5ldwYNEZXk';
  const tableId = process.env.AIRTABLE_TABLE_ID || 'tbl6SW9Od1s56kxem';

  if (!token) {
    return new Response(JSON.stringify({ error: 'AIRTABLE_TOKEN not set in Vercel environment variables' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body   = await req.json();
    const fields = body.fields || {};

    const resp = await fetch(
      `https://api.airtable.com/v0/${baseId}/${tableId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ fields })
      }
    );

    const data = await resp.json();
    return new Response(JSON.stringify(data), {
      status: resp.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}
