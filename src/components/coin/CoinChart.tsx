"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import LoadingSkeleton from "../ui/LoadingSkeleton";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const ranges = [
  { label: "24h", value: "1" },
  { label: "7d", value: "7" },
  { label: "30d", value: "30" },
  { label: "90d", value: "90" },
];

interface CoinChartProps {
  coinId: string;
}

const CoinChart: React.FC<CoinChartProps> = ({ coinId }) => {
  const [range, setRange] = useState("1");
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/coin/${coinId}/market_chart?days=${range}`)
      .then((res) => res.json())
      .then((data) => {
        setChartData(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load chart data");
        setLoading(false);
      });
  }, [coinId, range]);

  if (loading) return <LoadingSkeleton className="h-64" />;
  if (error) return <div className="text-destructive">{error}</div>;
  if (!chartData?.prices) return <div>No chart data available.</div>;

  const data = {
    labels: chartData.prices.map((p: [number, number]) => new Date(p[0]).toLocaleDateString()),
    datasets: [
      {
        label: "Price (USD)",
        data: chartData.prices.map((p: [number, number]) => p[1]),
        borderColor: "hsl(var(--primary))",
        backgroundColor: "rgba(0,0,0,0.05)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        {ranges.map((r) => (
          <button
            key={r.value}
            className={`px-3 py-1 rounded border text-sm ${range === r.value ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            onClick={() => setRange(r.value)}
          >
            {r.label}
          </button>
        ))}
      </div>
      <Line data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} height={300} />
    </div>
  );
};

export default CoinChart;
