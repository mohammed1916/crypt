"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import Link from "next/link";
import CryptoTable from "@/components/home/CryptoTable";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const CHART_RANGES = [
  { label: "24h", value: "1" },
  { label: "7d", value: "7" },
  { label: "30d", value: "30" },
  { label: "90d", value: "90" },
];

export default function CoinDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [range, setRange] = useState("7");
  const [chartData, setChartData] = useState<any>(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [showCompare, setShowCompare] = useState(false);
  const [compareCoins, setCompareCoins] = useState<any[]>([]);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/coin/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCoin(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load coin data");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    setChartLoading(true);
    fetch(`/api/coin/${id}/market_chart?days=${range}`)
      .then((res) => res.json())
      .then((data) => {
        setChartData(data);
        setChartLoading(false);
      })
      .catch(() => {
        setChartData(null);
        setChartLoading(false);
      });
  }, [id, range]);

  // Fetch 50 coins for comparison if needed
  useEffect(() => {
    if (showCompare) {
      setCompareLoading(true);
      setCompareError("");
      fetch("/api/coins?page=1")
        .then((res) => res.json())
        .then((data) => {
          setCompareCoins(data);
          setCompareLoading(false);
        })
        .catch(() => {
          setCompareError("Failed to load comparison data");
          setCompareLoading(false);
        });
    }
  }, [showCompare]);

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto p-4">
        <LoadingSkeleton className="h-12 w-1/2 mb-4" />
        <LoadingSkeleton className="h-8 w-1/3 mb-2" />
        <LoadingSkeleton className="h-64 w-full" />
      </main>
    );
  }

  if (error || !coin) {
    return (
      <main className="max-w-3xl mx-auto p-4">
        <div className="text-red-500">{error || "Coin not found."}</div>
      </main>
    );
  }

  const chart =
    chartData && chartData.prices
      ? {
          labels: chartData.prices.map((p: [number, number]) =>
            new Date(p[0]).toLocaleDateString()
          ),
          datasets: [
            {
              label: `${coin.name} Price (USD)`,
              data: chartData.prices.map((p: [number, number]) => p[1]),
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59,130,246,0.1)",
              fill: true,
              tension: 0.3,
            },
          ],
        }
      : null;

  return (
    <main className="max-w-3xl mx-auto p-4">
      <div className="mb-4">
        <Link href="/">
          <Button variant="outline" size="sm">&larr; Back to List</Button>
        </Link>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <img src={coin.image?.large || coin.image?.thumb} alt={coin.name} className="w-12 h-12" />
          <div>
            <CardTitle className="text-2xl">{coin.name} ({coin.symbol?.toUpperCase()})</CardTitle>
            <div className="text-gray-500 text-sm">Rank #{coin.market_cap_rank}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div>
              <div className="text-gray-500 text-xs">Price</div>
              <div className="font-semibold text-lg">${coin.market_data?.current_price?.usd?.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Market Cap</div>
              <div className="font-semibold">${coin.market_data?.market_cap?.usd?.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">24h Volume</div>
              <div className="font-semibold">${coin.market_data?.total_volume?.usd?.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Circulating Supply</div>
              <div className="font-semibold">{coin.market_data?.circulating_supply?.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">24h Change</div>
              <div className={`font-semibold ${coin.market_data?.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"}`}>
                {coin.market_data?.price_change_percentage_24h?.toFixed(2)}%
              </div>
            </div>
          </div>
          <div>
            <div className="flex gap-2 mb-2">
              {CHART_RANGES.map((r) => (
                <Button
                  key={r.value}
                  variant={range === r.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRange(r.value)}
                >
                  {r.label}
                </Button>
              ))}
            </div>
            {chartLoading ? (
              <LoadingSkeleton className="h-64 w-full" />
            ) : chart ? (
              <Line data={chart} options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { x: { display: false } }
              }} />
            ) : (
              <div className="text-gray-500">No chart data available.</div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Compare section moved below the widget */}
      <div className="mt-6 flex flex-col gap-2">
        <div>
          <span className="mr-2">Compare with other coins?</span>
          <Button variant={showCompare ? "default" : "outline"} size="sm" onClick={() => setShowCompare(v => !v)}>
            {showCompare ? "Hide" : "Yes"}
          </Button>
        </div>
        {showCompare && (
          <div className="mb-6">
            {compareLoading ? (
              <LoadingSkeleton className="h-32" />
            ) : compareError ? (
              <div className="text-destructive">{compareError}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-card rounded-lg shadow mb-4">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">#</th>
                      <th className="p-2 text-left">Coin</th>
                      <th className="p-2 text-left">Price</th>
                      <th className="p-2 text-left">vs {coin.symbol?.toUpperCase()} (%)</th>
                      <th className="p-2 text-left">24h %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareCoins.map((c: any) => {
                      const diff = coin.market_data?.current_price?.usd && c.current_price
                        ? ((c.current_price - coin.market_data.current_price.usd) / coin.market_data.current_price.usd) * 100
                        : null;
                      return (
                        <tr key={c.id} className="border-b hover:bg-muted cursor-pointer" onClick={() => window.location.href = `/coin/${c.id}` }>
                          <td className="p-2">{c.market_cap_rank}</td>
                          <td className="p-2 flex items-center gap-2">
                            <img src={c.image} alt={c.name} className="w-6 h-6" />
                            <span>{c.name}</span>
                            <span className="text-muted-foreground text-xs">{c.symbol.toUpperCase()}</span>
                          </td>
                          <td className="p-2">${c.current_price?.toLocaleString()}</td>
                          <td className={`p-2 ${diff !== null ? (diff > 0 ? "text-green-600" : "text-red-600") : ""}`}>
                            {diff !== null ? diff.toFixed(2) + "%" : "-"}
                          </td>
                          <td className={`p-2 ${c.price_change_percentage_24h > 0 ? "text-green-600" : "text-red-600"}`}>
                            {c.price_change_percentage_24h?.toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
