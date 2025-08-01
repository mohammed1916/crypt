import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3/coins/list';
const CACHE_DURATION = 60; // seconds
let cache: { data: any; timestamp: number } | null = null;

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION * 1000) {
    return NextResponse.json(cache.data);
  }
  try {
    const res = await fetch(COINGECKO_API);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    cache = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
