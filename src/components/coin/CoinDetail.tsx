import React from "react";

interface CoinDetailProps {
  coin: any;
}

const CoinDetail: React.FC<CoinDetailProps> = ({ coin }) => {
  if (!coin) return null;
  return (
    <section className="bg-card rounded-lg shadow p-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <img src={coin.image?.large || coin.image?.thumb} alt={coin.name} className="w-12 h-12" />
        <div>
          <h1 className="text-2xl font-bold">{coin.name} <span className="text-muted-foreground text-lg">({coin.symbol?.toUpperCase()})</span></h1>
          <p className="text-sm text-muted-foreground">Rank #{coin.market_cap_rank}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <div>
          <div className="text-xs text-muted-foreground">Price</div>
          <div className="font-semibold text-lg">${coin.market_data?.current_price?.usd?.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Market Cap</div>
          <div className="font-semibold text-lg">${coin.market_data?.market_cap?.usd?.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">24h Volume</div>
          <div className="font-semibold text-lg">${coin.market_data?.total_volume?.usd?.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Circulating Supply</div>
          <div className="font-semibold text-lg">{coin.market_data?.circulating_supply?.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">All-Time High</div>
          <div className="font-semibold text-lg">${coin.market_data?.ath?.usd?.toLocaleString()}</div>
        </div>
      </div>
    </section>
  );
};

export default CoinDetail;
