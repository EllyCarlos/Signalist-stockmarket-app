import { NextRequest, NextResponse } from "next/server";

import Watchlist from "@/database/models/Watchlist";
import { connectToDatabase } from "@/database/mongoose";
import { getAuth } from "@/lib/better-auth/auth";
import type { NewsArticle, WatchlistNewsResponse } from "@/types";

const FINNHUB_BASE = "https://finnhub.io/api/v1";

type FinnhubNewsArticle = {
  id?: number;
  headline?: string;
  summary?: string;
  source?: string;
  url?: string;
  datetime?: number;
  image?: string;
};

type TaggedFinnhubNewsArticle = FinnhubNewsArticle & {
  symbols: string[];
};

function getDateRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 7);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  return { from: formatDate(from), to: formatDate(to) };
}

const isValidNewsArticle = (article: FinnhubNewsArticle) =>
  Boolean(article.url && article.headline && article.summary && article.datetime);

export async function GET(req: NextRequest) {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const watchlist = await Watchlist.findOne({ userId: session.user.id }).lean();

  if (!watchlist || watchlist.stocks.length === 0) {
    const emptyResponse: WatchlistNewsResponse = {
      articles: [],
      symbols: [],
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(emptyResponse);
  }

  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "News API not configured" }, { status: 503 });
  }

  const { from, to } = getDateRange();
  const symbols = watchlist.stocks.map((stock) => stock.symbol);

  const results = await Promise.allSettled(
    symbols.map(async (symbol) => {
      const url = `${FINNHUB_BASE}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${apiKey}`;
      const response = await fetch(url, { next: { revalidate: 900 } });

      if (!response.ok) {
        return [] as TaggedFinnhubNewsArticle[];
      }

      const data = (await response.json()) as FinnhubNewsArticle[];

      return (data ?? [])
        .filter(isValidNewsArticle)
        .slice(0, 5)
        .map((article) => ({
          ...article,
          symbols: [symbol],
        }));
    }),
  );

  const allArticles = results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );

  const seen = new Set<string>();
  const deduped = allArticles.filter((article) => {
    if (!article.url || seen.has(article.url)) return false;
    seen.add(article.url);
    return true;
  });

  const articles: NewsArticle[] = deduped
    .sort((a, b) => (b.datetime ?? 0) - (a.datetime ?? 0))
    .map((article) => ({
      id: String(article.id ?? article.url),
      headline: article.headline ?? "",
      summary: article.summary ?? "",
      source: article.source ?? "",
      url: article.url ?? "",
      datetime: article.datetime ?? 0,
      image: article.image ?? null,
      symbols: article.symbols,
      sentiment: null,
    }));

  const response: WatchlistNewsResponse = {
    articles,
    symbols,
    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
