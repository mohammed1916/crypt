import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3/coins';
const CACHE_DURATION = 60; // seconds
let cache: { [key: string]: { data: any; timestamp: number } } = {};

const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { searchParams } = new URL(req.url);
  const days = searchParams.get('days') || '1';
  // Do not set interval param; let CoinGecko choose granularity automatically
  let interval: string | undefined = undefined;
  if (!id) {
    console.error('Missing coin id');
    return NextResponse.json({ error: 'Missing coin id' }, { status: 400 });
  }
  const cacheKey = `${id}-${days}`;
  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < CACHE_DURATION * 1000
  ) {
    return NextResponse.json(cache[cacheKey].data);
  }
  try {
    let url = `${COINGECKO_API}/${id}/market_chart?vs_currency=usd&days=${days}`;
    // Do not add interval param
    console.log('Fetching CoinGecko:', url, 'for id:', id);
    const headers: Record<string, string> = {};
    if (COINGECKO_API_KEY) {
      headers['x-cg-pro-api-key'] = COINGECKO_API_KEY;
    }
    const res = await fetch(url, { headers });
    if (!res.ok) {
      let errMsg = 'Failed to fetch';
      let err = {};
      try {
        err = await res.json();
        if ((err as any)?.error) errMsg = (err as any).error;
      } catch {}
      console.error('CoinGecko error:', err, 'Status:', res.status);
      return NextResponse.json({ error: errMsg, status: res.status, url, id, details: err }, { status: res.status });
    }
    const data = await res.json();
    cache[cacheKey] = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch (e) {
    console.error('Fetch error:', e);
    return NextResponse.json({ error: 'Failed to fetch data', details: e instanceof Error ? e.message : e }, { status: 500 });
  }
}
