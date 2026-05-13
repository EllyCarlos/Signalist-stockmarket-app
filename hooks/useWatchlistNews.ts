'use client';

import { useCallback, useEffect, useState } from "react";

import type { NewsArticle, WatchlistNewsResponse } from "@/types";

export function useWatchlistNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [symbols, setSymbols] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/watchlist/news");
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = (await response.json()) as WatchlistNewsResponse;
      setArticles(data.articles);
      setSymbols(data.symbols);
      setFetchedAt(data.fetchedAt);
    } catch {
      setError("Could not load watchlist news. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchNews();
  }, [fetchNews]);

  return { articles, symbols, isLoading, error, fetchedAt, refetch: fetchNews };
}
