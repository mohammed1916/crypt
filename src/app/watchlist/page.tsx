"use client";
import React, { useEffect, useState } from "react";
import WatchlistTable from "@/components/watchlist/WatchlistTable";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

const getWatchlist = () => {
  try {
    return JSON.parse(localStorage.getItem("watchlist") || "[]");
  } catch {
    return [];
  }
};

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const wl = getWatchlist();
    setWatchlist(wl);
    if (wl.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/coins?ids=${wl.join(",")}`)
      .then((res) => res.json())
      .then((data) => {
        setCoins(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    // Poll for live updates every 30s
    const interval = setInterval(() => {
      fetch(`/api/coins?ids=${wl.join(",")}`)
        .then((res) => res.json())
        .then(setCoins);
    }, 30000);
    return () => clearInterval(interval);
  }, [isMounted]);

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Watchlist</h1>
      {loading ? (
        <LoadingSkeleton className="h-32" />
      ) : watchlist.length === 0 ? (
        <div className="text-muted-foreground">Your watchlist is empty.</div>
      ) : (
        <WatchlistTable coins={coins} />
      )}
    </main>
  );
}
