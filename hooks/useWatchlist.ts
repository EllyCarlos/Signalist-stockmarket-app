'use client';

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import type { WatchlistStock } from "@/types";

export function useWatchlist() {
  const [stocks, setStocks] = useState<WatchlistStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchlist = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/watchlist");
      if (!response.ok) throw new Error("Failed to fetch watchlist");
      const data = (await response.json()) as { stocks: WatchlistStock[] };
      setStocks(data.stocks);
    } catch {
      setError("Could not load your watchlist");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchWatchlist();
  }, [fetchWatchlist]);

  const isWatched = useCallback(
    (symbol: string) => stocks.some((stock) => stock.symbol === symbol.toUpperCase()),
    [stocks],
  );

  const addToWatchlist = useCallback(
    async (symbol: string, companyName: string) => {
      if (isWatched(symbol)) return;

      try {
        const response = await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbol, companyName }),
        });

        if (!response.ok) throw new Error("Failed to add stock");
        const data = (await response.json()) as { stocks: WatchlistStock[] };
        setStocks(data.stocks);
        toast.success(`${symbol.toUpperCase()} added to watchlist`);
      } catch {
        toast.error("Failed to add to watchlist");
      }
    },
    [isWatched],
  );

  const removeFromWatchlist = useCallback(async (symbol: string) => {
    try {
      const response = await fetch("/api/watchlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol }),
      });

      if (!response.ok) throw new Error("Failed to remove stock");
      const data = (await response.json()) as { stocks: WatchlistStock[] };
      setStocks(data.stocks);
      toast.success(`${symbol.toUpperCase()} removed from watchlist`);
    } catch {
      toast.error("Failed to remove from watchlist");
    }
  }, []);

  const toggleWatchlist = useCallback(
    (symbol: string, companyName: string) =>
      isWatched(symbol)
        ? removeFromWatchlist(symbol)
        : addToWatchlist(symbol, companyName),
    [addToWatchlist, isWatched, removeFromWatchlist],
  );

  return {
    stocks,
    isLoading,
    error,
    isWatched,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    refetch: fetchWatchlist,
  };
}
