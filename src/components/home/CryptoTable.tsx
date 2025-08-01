import React from "react";
import { Star } from "lucide-react";

interface CryptoTableProps {
  coins: any[];
  page: number;
  setPage: (page: number) => void;
}

const PAGE_SIZE = 50;

const CryptoTable: React.FC<CryptoTableProps> = ({ coins, page, setPage }) => {
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
          {coins.map((coin) => (
            <tr key={coin.id} className="border-b hover:bg-muted">
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
              <td className="p-2">
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
          disabled={coins.length < PAGE_SIZE}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CryptoTable;
