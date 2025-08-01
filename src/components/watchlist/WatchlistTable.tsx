import React from "react";
import { Star } from "lucide-react";

interface WatchlistTableProps {
  coins: any[];
}

const WatchlistTable: React.FC<WatchlistTableProps> = ({ coins }) => {
  if (!coins || coins.length === 0) return null;
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
            <th className="p-2 text-left">Remove</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, i) => (
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
                  aria-label="Remove from watchlist"
                  onClick={() => {
                    const wl = JSON.parse(localStorage.getItem("watchlist") || "[]");
                    const updated = wl.filter((id: string) => id !== coin.id);
                    localStorage.setItem("watchlist", JSON.stringify(updated));
                    window.location.reload();
                  }}
                >
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WatchlistTable;
