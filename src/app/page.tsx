"use client";
import React, { useEffect, useState } from "react";
import CryptoTable from "@/components/home/CryptoTable";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import FormInput from "@/components/ui/FormInput";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { useTheme } from "@/context/ThemeContext";

export default function HomePage() {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    percent: "",
    volume: "",
    rank: "",
  });
  const [watchEnabled, setWatchEnabled] = useState(true);
  const showToast = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({
      page: page.toString(),
    });
    console.log("Fetching page:", page); // Debug: log current page
    fetch(`/api/coins?${params.toString()}`)
      .then((res) => {
        if (res.status === 500) {
          showToast("Connection to Internet Lost", "error");
        }
        return res.json();
      })
      .then((data) => {
        setCoins(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  return (
    <main className="max-w-6xl mx-auto p-4">
      <div className="mb-4 acrylic-card shadow-sm p-4 flex flex-col md:flex-row gap-4 md:items-center border border-border">
        <div className="relative w-full md:w-64">
          <MagnifyingGlassIcon className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <FormInput
            type="text"
            placeholder="Search by name or symbol..."
            className="p-[8px] rounded-lg pl-10 w-full md:w-64 focus:ring-2 focus:ring-primary focus:border-primary transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <FormInput
          type="number"
          placeholder="Min 24h %"
          className="p-[8px] rounded-lg w-full md:w-32 focus:ring-2 focus:ring-primary focus:border-primary transition"
          value={filters.percent}
          onChange={(e) => setFilters(f => ({ ...f, percent: e.target.value }))}
        />
        <FormInput
          type="number"
          placeholder="Min 24h Volume"
          className="p-[8px] rounded-lg w-full md:w-48 focus:ring-2 focus:ring-primary focus:border-primary transition"
          value={filters.volume}
          onChange={(e) => setFilters(f => ({ ...f, volume: e.target.value }))}
        />
        <FormInput
          type="number"
          placeholder="Max Rank"
          className="p-[8px] rounded-lg w-full md:w-32 focus:ring-2 focus:ring-primary focus:border-primary transition"
          value={filters.rank}
          onChange={(e) => setFilters(f => ({ ...f, rank: e.target.value }))}
        />
        <div className="flex items-center gap-2 ml-auto">
          <Switch theme={theme} checked={watchEnabled} onCheckedChange={setWatchEnabled} id="watch-toggle" />
          <label htmlFor="watch-toggle" className="text-sm text-muted-foreground select-none cursor-pointer">Watch View</label>
        </div>
      </div>
      {loading ? (
        <LoadingSkeleton className="h-32" />
      ) : error ? (
        <div className="text-destructive">{error}</div>
      ) : coins.length === 0 ? (
        <div className="text-muted-foreground">No coins found.</div>
      ) : (
        <CryptoTable coins={Array.isArray(coins) ? coins : []} page={page} setPage={setPage} search={debouncedSearch} filters={filters} watchEnabled={watchEnabled} />
      )}
    </main>
  );
}
