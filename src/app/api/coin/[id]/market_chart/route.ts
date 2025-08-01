import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3/coins';
const CACHE_DURATION = 60; // seconds
let cache: { [key: string]: { data: any; timestamp: number } } = {};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { searchParams } = new URL(req.url);
  const days = searchParams.get('days') || '1';
  const interval = searchParams.get('interval') || 'hourly';
  if (!id) {
    return NextResponse.json({ error: 'Missing coin id' }, { status: 400 });
  }
  const cacheKey = `${id}-${days}-${interval}`;
  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < CACHE_DURATION * 1000
  ) {
    return NextResponse.json(cache[cacheKey].data);
  }
  try {
    const res = await fetch(`${COINGECKO_API}/${id}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    cache[cacheKey] = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
