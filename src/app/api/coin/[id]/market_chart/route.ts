import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3/coins';
const CACHE_DURATION = 60; // seconds
let cache: { [key: string]: { data: any; timestamp: number } } = {};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { searchParams } = new URL(req.url);
  const days = searchParams.get('days') || '1';
  // Only set interval if days > 1, otherwise omit it to avoid CoinGecko error
  const interval = days === '1' ? undefined : searchParams.get('interval') || 'hourly';
  if (!id) {
    return NextResponse.json({ error: 'Missing coin id' }, { status: 400 });
  }
  const cacheKey = `${id}-${days}-${interval || 'none'}`;
  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < CACHE_DURATION * 1000
  ) {
    return NextResponse.json(cache[cacheKey].data);
  }
  try {
    let url = `${COINGECKO_API}/${id}/market_chart?vs_currency=usd&days=${days}`;
    if (interval) url += `&interval=${interval}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: err.error || 'Failed to fetch' }, { status: res.status });
    }
    const data = await res.json();
    cache[cacheKey] = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
