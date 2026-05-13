import { ExternalLink } from "lucide-react";

import type { NewsArticle } from "@/types";

interface NewsCardProps {
  article: NewsArticle;
}

function formatTimeAgo(unixTimestamp: number): string {
  const diff = Date.now() - unixTimestamp * 1000;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-3 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors duration-200"
    >
      {article.image && (
        <div className="shrink-0 w-20 h-16 rounded-md overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image}
            alt=""
            className="w-full h-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          {article.symbols.map((symbol) => (
            <span
              key={symbol}
              className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-primary/10 text-primary"
            >
              {symbol}
            </span>
          ))}
          <span className="text-[11px] text-muted-foreground">
            {article.source} · {formatTimeAgo(article.datetime)}
          </span>
        </div>

        <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {article.headline}
        </p>

        {article.summary && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {article.summary}
          </p>
        )}
      </div>

      <ExternalLink className="shrink-0 h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 mt-1 transition-opacity duration-200" />
    </a>
  );
}
