'use client';

import { Star } from "lucide-react";

import { useWatchlist } from "@/hooks/useWatchlist";
import { cn } from "@/lib/utils";

interface WatchlistButtonProps {
  symbol: string;
  companyName: string;
  variant?: "icon" | "button";
  className?: string;
}

export function WatchlistButton({
  symbol,
  companyName,
  variant = "icon",
  className,
}: WatchlistButtonProps) {
  const { isWatched, toggleWatchlist, isLoading } = useWatchlist();
  const watched = isWatched(symbol);

  if (variant === "icon") {
    return (
      <button
        onClick={(event) => {
          event.stopPropagation();
          void toggleWatchlist(symbol, companyName);
        }}
        disabled={isLoading}
        aria-label={watched ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        className={cn(
          "p-1.5 rounded-md transition-colors duration-200",
          "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className,
        )}
      >
        <Star
          className={cn(
            "h-4 w-4 transition-colors duration-200",
            watched
              ? "fill-yellow-400 stroke-yellow-400"
              : "stroke-muted-foreground hover:stroke-yellow-400",
          )}
        />
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        void toggleWatchlist(symbol, companyName);
      }}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium",
        "border transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        watched
          ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-500 hover:bg-yellow-400/20"
          : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-yellow-400/50",
        className,
      )}
    >
      <Star
        className={cn(
          "h-3.5 w-3.5",
          watched ? "fill-yellow-400 stroke-yellow-400" : "stroke-current",
        )}
      />
      {watched ? "In Watchlist" : "Add to Watchlist"}
    </button>
  );
}
