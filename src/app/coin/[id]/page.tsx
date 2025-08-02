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
import Select from "react-select";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const CHART_RANGES = [
  { label: "24h", value: "1" },
  { label: "7d", value: "7" },
  { label: "30d", value: "30" },
  { label: "90d", value: "90" },
];

export default function CoinDetailPage() {
  return (
    <ToastProvider>
      <CoinDetailPageInner />
    </ToastProvider>
  );
}

function CoinDetailPageInner() {
  const { id } = useParams<{ id: string }>();
  const showToast = useToast();
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
  const [showXAxis, setShowXAxis] = useState(true);
  const [compareSelection, setCompareSelection] = useState<any[]>([]);
  const [compareChartData, setCompareChartData] = useState<any[]>([]);
  const [compareVisible, setCompareVisible] = useState(false);
  const [compareAnim, setCompareAnim] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    console.log("Theme changed:", theme);
  }, [theme]);

  function showApiErrorToast(res: Response, showToast: (msg: string, type?: "success"|"error"|"info") => void) {
    if (!res.ok) {
      if (res.status === 429) showToast("Too Many Requests. Please wait and try again or upgrade to enterprise API Key", "error");
      else showToast(`Error: ${res.statusText || res.status}`, "error");
    }
  }

  useEffect(() => {
    setLoading(true);
    fetch(`/api/coin/${id}`)
      .then((res) => {
        showApiErrorToast(res, showToast);
        return res.json();
      })
      .then((data) => {
        setCoin(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load coin data");
        showToast("Failed to load coin data", "error");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    let didCancel = false;
    async function fetchChartData(retry = false) {
      setChartLoading(true);
      try {
        const res = await fetch(`/api/coin/${id}/market_chart?days=${range}`);
        showApiErrorToast(res, showToast);
        const data = await res.json();
        if (res.status === 400 && !retry) {
          showToast(
            "Bad Request: If you are using Pro API key, please change your root URL from api.coingecko.com to pro-api.coingecko.com. See https://docs.coingecko.com/reference/authentication",
            "error"
          );
          return;
        }
        if (!didCancel) {
          setChartData(data);
          setChartLoading(false);
        }
      } catch {
        if (!didCancel) {
          setChartData(null);
          setChartLoading(false);
          showToast("Failed to load chart data", "error");
        }
      }
    }
    fetchChartData();
    return () => { didCancel = true; };
  }, [id, range]);

  // Fetch 50 coins for multi-select options
  useEffect(() => {
    fetch("/api/coins?page=1")
      .then((res) => {
        showApiErrorToast(res, showToast);
        return res.json();
      })
      .then((data) => {
        setCompareCoins(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        showToast("Failed to load coins list", "error");
      });
  }, []);

  // Fetch chart data for selected coins, one by one with animation
  useEffect(() => {
    let cancelled = false;
    async function fetchCompareChartsSequentially() {
      if (!compareSelection.length) {
        setCompareChartData([]);
        return;
      }
      setCompareChartData([]);
      for (let i = 0; i < compareSelection.length; i++) {
        const coin = compareSelection[i];
        try {
          const res = await fetch(`/api/coin/${coin.value}/market_chart?days=${range}`);
          if (res.status === 400) {
            showToast(
              "Bad Request: If you are using Pro API key, please change your root URL from api.coingecko.com to pro-api.coingecko.com. See https://docs.coingecko.com/reference/authentication",
              "error"
            );
            continue; // Skip this coin, try next
          }
          if (res.status === 429) {
            showToast("Too Many Requests. Please wait and try again or upgrade to enterprise API Key", "error");
            continue;
          }
          if (!res.ok) {
            showToast(`Error: ${res.statusText || res.status}`, "error");
            continue;
          }
          const data = await res.json();
          if (cancelled) return;
          setCompareChartData(prev => [...prev, { id: coin.value, name: coin.label, data }]);
        } catch {
          if (cancelled) return;
          showToast(`Failed to load chart data for ${coin.label}`, "error");
        }
        // Wait 2 seconds before loading the next coin
        if (i < compareSelection.length - 1) {
          await new Promise(res => setTimeout(res, 2000));
        }
      }
    }
    fetchCompareChartsSequentially();
    return () => { cancelled = true; };
  }, [compareSelection, range]);

  useEffect(() => {
    // Set navbar heading to coin name or fallback
    const heading = coin?.name ? `${coin.name} (${coin.symbol?.toUpperCase()})` : "Coin Details";
    const el = document.getElementById("navbar-heading");
    if (el) el.textContent = heading;
    return () => {
      // Restore default heading on unmount
      if (el) el.textContent = "Cryptocurrency Prices";
    };
  }, [coin]);

  useEffect(() => {
    if (showCompare) {
      setCompareVisible(true);
      setCompareAnim('animate-fade-in');
    } else if (compareVisible) {
      setCompareAnim('animate-fade-out');
      const timeout = setTimeout(() => setCompareVisible(false), 500);
      return () => clearTimeout(timeout);
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

  // Format chart labels and data for x-axis
  function getChartLabelsAndData() {
    if (!chartData || !chartData.prices) return { labels: [], data: [] };
    if (range === "1") {
      // Show hour for 1 day
      return {
        labels: chartData.prices.map((p: [number, number]) => {
          const d = new Date(p[0]);
          return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
        }),
        data: chartData.prices.map((p: [number, number]) => p[1])
      };
    } else {
      // Show only one point per unique day (last price of each day)
      const dayMap = new Map();
      chartData.prices.forEach((p: [number, number]) => {
        const d = new Date(p[0]);
        const label = d.toLocaleDateString();
        dayMap.set(label, p[1]); // last price for the day
      });
      return {
        labels: Array.from(dayMap.keys()),
        data: Array.from(dayMap.values())
      };
    }
  }

  const { labels: chartLabels, data: chartPrices } = getChartLabelsAndData();
  const chart =
    chartLabels.length && chartPrices.length
      ? {
          labels: chartLabels,
          datasets: [
            {
              label: `${coin.name} Price (USD)`,
              data: chartPrices,
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59,130,246,0.1)",
              fill: true,
              tension: 0.3,
            },
          ],
        }
      : null;

  // Derived array for safe usage
  const compareCoinsArray = Array.isArray(compareCoins) ? compareCoins : [];

  return (
    <main className="max-w-3xl mx-auto p-4">
      <div className="mb-4">
        <Link href="/">
          <Button variant={theme === "acrylic" ? "acrylic" : "default"} size="sm">&larr; Back to List</Button>
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
          <div className="flex mb-2 justify-end items-center gap-2">
            <div className="w-64">
              <Select
                isMulti
                options={compareCoinsArray.filter(c => c.id !== id).map((c: any) => ({ value: c.id, label: c.name }))}
                value={compareSelection}
                onChange={value => setCompareSelection(Array.isArray(value) ? [...value] : [])}
                placeholder="Compare coins on chart..."
                classNamePrefix="react-select"
              />
            </div>
            <div className="flex gap-2">
              {CHART_RANGES.map((r) => (
                <Button
                  key={r.value}
                  variant={theme === "acrylic" ? "acrylic" : "default"}
                  size="sm"
                  onClick={() => setRange(r.value)}
                >
                  {r.label}
                </Button>
              ))}
            </div>
          </div>
          {chartLoading ? (
            <LoadingSkeleton className="h-64 w-full" />
          ) : chart ? (
            <>
              <Line data={{
                ...chart,
                datasets: [
                  chart.datasets[0],
                  ...compareChartData.map((c, i) => ({
                    label: c.name + " Price (USD)",
                    data: (function() {
                      // Align data points by date label
                      const baseLabels = chart.labels;
                      const dayMap = new Map();
                      if (!c.data || !Array.isArray(c.data.prices)) {
                        // Defensive: if no data, fill with nulls
                        return baseLabels.map(() => null);
                      }
                      if (range === "1") {
                        c.data.prices.forEach((p: [number, number]) => {
                          const d = new Date(p[0]);
                          const label = d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
                          dayMap.set(label, p[1]);
                        });
                      } else {
                        c.data.prices.forEach((p: [number, number]) => {
                          const d = new Date(p[0]);
                          const label = d.toLocaleDateString();
                          dayMap.set(label, p[1]);
                        });
                      }
                      return baseLabels.map((label: string) => dayMap.get(label) ?? null);
                    })(),
                    borderColor: `hsl(${(i * 60 + 120) % 360}, 70%, 50%)`,
                    backgroundColor: `rgba(${(i * 60 + 120) % 360}, 130, 246, 0.1)`,
                    fill: false,
                    tension: 0.3,
                  }))
                ]
              }} options={{
                responsive: true,
                plugins: { legend: { display: true, position: "top" } },
                scales: { x: { display: showXAxis, title: { display: showXAxis, text: range === "1" ? "Hour" : "Date" } } }
              }} />
              <div className="flex justify-end mt-2">
                <Button variant={theme === "acrylic" ? "acrylic" : "outline"} size="sm" onClick={() => setShowXAxis(x => !x)}>
                  {showXAxis ? "Hide X-Axis" : "Show X-Axis"}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-gray-500">No chart data available.</div>
          )}
        </CardContent>
      </Card>
      {/* Compare section moved below the widget */}
      <div className="mt-6 flex flex-col gap-2">
        <div>
          <span className="mr-2">Compare with other coins?</span>
          <Button variant={theme === "acrylic" ? "acrylic" : "default"} size="sm" onClick={() => setShowCompare(v => !v)}>
            {showCompare ? "Hide" : "Yes"}
          </Button>
        </div>
        {compareVisible && (
          <div className={`mb-6 transition-all duration-500 ease-in-out opacity-100 translate-y-0 ${compareAnim}`}>
            {compareLoading ? (
              <LoadingSkeleton className="h-32" />
            ) : compareError ? (
              <div className="text-destructive">{compareError}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="acrylic-card min-w-full bg-card rounded-lg shadow mb-4">
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
                    { compareCoinsArray.map((c: any) => {
                      const diff = coin.market_data?.current_price?.usd && c.current_price
                        ? ((c.current_price - coin.market_data.current_price.usd) / coin.market_data.current_price.usd) * 100
                        : null;
                      return (
                        <tr key={c.id} className="border-b cursor-pointer elevation-hover" onClick={() => window.location.href = `/coin/${c.id}` }>
                          <td className="p-2">{c.market_cap_rank}</td>
                          <td className="p-2 flex items-center gap-2">
                            <img src={c.image} alt={c.name} className="w-6 h-6" />
                            <span>{c.name}</span>
                            <span className="text-muted-foreground text-xs">{c.symbol.toUpperCase()}</span>
                          </td>
                          <td className="p-2">${c.current_price?.toLocaleString()}</td>
                          <td className={`p-2 ${diff !== null ? (diff > 0 ? "text-green-600" : "text-red-600") : ""}`}>{diff !== null ? diff.toFixed(2) + "%" : "-"}</td>
                          <td className={`p-2 ${c.price_change_percentage_24h > 0 ? "text-green-600" : "text-red-600"}`}>{c.price_change_percentage_24h?.toFixed(2)}%</td>
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
