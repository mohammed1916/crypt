import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3/coins';
const CACHE_DURATION = 60; // seconds
let cache: { [id: string]: { data: any; timestamp: number } } = {};
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    if (!id) {
        return NextResponse.json({ error: 'Missing coin id' }, { status: 400 });
    }

    // Simple in-memory cache
    if (
        cache[id] &&
        Date.now() - cache[id].timestamp < CACHE_DURATION * 1000
    ) {
        return NextResponse.json(cache[id].data);
    }

    try {
        const headers: Record<string, string> = {};
        if (COINGECKO_API_KEY) {
        headers['x-cg-pro-api-key'] = COINGECKO_API_KEY;
        }
        const res = await fetch(`${COINGECKO_API}/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`, { headers });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        cache[id] = { data, timestamp: Date.now() };
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
