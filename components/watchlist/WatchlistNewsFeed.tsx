'use client';

import { Loader2, Newspaper, RefreshCw } from "lucide-react";

import { useWatchlistNews } from "@/hooks/useWatchlistNews";

import { NewsCard } from "./NewsCard";

export function WatchlistNewsFeed() {
  const { articles, symbols, isLoading, error, fetchedAt, refetch } = useWatchlistNews();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Loading news for your watchlist...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <p className="text-sm text-destructive">{error}</p>
        <button
          onClick={() => {
            void refetch();
          }}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Try again
        </button>
      </div>
    );
  }

  if (symbols.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <Newspaper className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm font-medium">No stocks in your watchlist yet</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Add stocks to your watchlist using the star icon and your personalized
          news feed will appear here.
        </p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Newspaper className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          No recent news for {symbols.join(", ")}
        </p>
        <button
          onClick={() => {
            void refetch();
          }}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Watchlist News</h3>
          <p className="text-xs text-muted-foreground">
            {articles.length} articles for {symbols.join(", ")}
          </p>
        </div>
        <button
          onClick={() => {
            void refetch();
          }}
          title="Refresh news"
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      <div className="space-y-2">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {fetchedAt && (
        <p className="text-[11px] text-muted-foreground text-center pt-2">
          Updated {new Date(fetchedAt).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
