import React, { useMemo } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

interface CryptoTableProps {
  coins: any[];
  page: number;
  setPage: (page: number) => void;
  search?: string;
  filters?: {
    percent?: string;
    volume?: string;
    rank?: string;
  };
}

const PAGE_SIZE = 50;

const CryptoTable: React.FC<CryptoTableProps> = ({ coins, page, setPage, search = "", filters = {} }) => {
  const watchlist = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("watchlist") || "[]") : [];
  const toggleWatchlist = (id: string) => {
    let wl = JSON.parse(localStorage.getItem("watchlist") || "[]");
    if (wl.includes(id)) {
      wl = wl.filter((coinId: string) => coinId !== id);
    } else {
      wl.push(id);
    }
    localStorage.setItem("watchlist", JSON.stringify(wl));
    window.location.reload();
  };

  // Client-side search and filters
  const filteredCoins = useMemo(() => {
    let filtered = coins;
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (c) => c.name.toLowerCase().includes(s) || c.symbol.toLowerCase().includes(s)
      );
    }
    if (filters.rank) {
      filtered = filtered.filter((c) => c.market_cap_rank && c.market_cap_rank <= Number(filters.rank));
    }
    if (filters.percent) {
      filtered = filtered.filter((c) => Math.abs(c.price_change_percentage_24h) >= Number(filters.percent));
    }
    if (filters.volume) {
      filtered = filtered.filter((c) => c.total_volume && c.total_volume >= Number(filters.volume));
    }
    return filtered;
  }, [coins, search, filters]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-card rounded-lg shadow">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">Coin</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">24h %</th>
            <th className="p-2 text-left">Market Cap</th>
            <th className="p-2 text-left">24h Volume</th>
            <th className="p-2 text-left">Watch</th>
          </tr>
        </thead>
        <tbody>
          {filteredCoins.map((coin) => (
            <tr
              key={coin.id}
              className="border-b hover:bg-muted cursor-pointer"
              onClick={() => window.location.href = `/coin/${coin.id}`}
            >
              <td className="p-2">{coin.market_cap_rank}</td>
              <td className="p-2 flex items-center gap-2">
                <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                <span>{coin.name}</span>
                <span className="text-muted-foreground text-xs">{coin.symbol.toUpperCase()}</span>
              </td>
              <td className="p-2">${coin.current_price?.toLocaleString()}</td>
              <td className={`p-2 ${coin.price_change_percentage_24h > 0 ? "text-green-600" : "text-red-600"}`}>
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </td>
              <td className="p-2">${coin.market_cap?.toLocaleString()}</td>
              <td className="p-2">${coin.total_volume?.toLocaleString()}</td>
              <td className="p-2" onClick={e => e.stopPropagation()}>
                <button
                  aria-label="Toggle watchlist"
                  onClick={() => toggleWatchlist(coin.id)}
                >
                  <Star className={`w-5 h-5 ${watchlist.includes(coin.id) ? "fill-yellow-400 text-yellow-400" : ""}`} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          className="btn btn-sm"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          className="btn btn-sm"
          onClick={() => setPage(page + 1)}
          disabled={filteredCoins.length < PAGE_SIZE}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CryptoTable;
