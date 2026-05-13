'use client';

import { Loader2, Star, X } from "lucide-react";

import { useWatchlist } from "@/hooks/useWatchlist";

export function WatchlistStockList() {
  const { stocks, isLoading, removeFromWatchlist } = useWatchlist();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <Star className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No stocks watched yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h2 className="text-sm font-semibold">
          Watched Stocks ({stocks.length})
        </h2>
      </div>
      <ul className="divide-y divide-border">
        {stocks.map((stock) => (
          <li
            key={stock.symbol}
            className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
          >
            <div>
              <p className="text-sm font-medium">{stock.symbol}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {stock.companyName}
              </p>
            </div>
            <button
              onClick={() => {
                void removeFromWatchlist(stock.symbol);
              }}
              aria-label={`Remove ${stock.symbol} from watchlist`}
              className="p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
