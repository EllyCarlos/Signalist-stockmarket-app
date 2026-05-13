import { NextRequest, NextResponse } from "next/server";

import Watchlist from "@/database/models/Watchlist";
import { connectToDatabase } from "@/database/mongoose";
import { getAuth } from "@/lib/better-auth/auth";
import type { WatchlistStock } from "@/types";

type WatchlistRequestBody = {
  symbol?: string;
  companyName?: string;
};

const normalizeStocks = (stocks: Array<{ symbol: string; companyName: string; addedAt: Date }>): WatchlistStock[] =>
  stocks.map((stock) => ({
    symbol: stock.symbol,
    companyName: stock.companyName,
    addedAt: stock.addedAt.toISOString(),
  }));

export async function GET(req: NextRequest) {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const watchlist = await Watchlist.findOne({ userId: session.user.id }).lean();

  return NextResponse.json({ stocks: normalizeStocks(watchlist?.stocks ?? []) });
}

export async function POST(req: NextRequest) {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { symbol, companyName } = (await req.json()) as WatchlistRequestBody;
  if (!symbol || !companyName) {
    return NextResponse.json(
      { error: "symbol and companyName are required" },
      { status: 400 },
    );
  }

  await connectToDatabase();

  const normalizedSymbol = symbol.toUpperCase().trim();

  let watchlist = await Watchlist.findOne({ userId: session.user.id });

  if (!watchlist) {
    watchlist = await Watchlist.create({
      userId: session.user.id,
      stocks: [{ symbol: normalizedSymbol, companyName: companyName.trim(), addedAt: new Date() }],
    });
  } else if (!watchlist.stocks.some((stock) => stock.symbol === normalizedSymbol)) {
    watchlist.stocks.push({
      symbol: normalizedSymbol,
      companyName: companyName.trim(),
      addedAt: new Date(),
    });
    await watchlist.save();
  }

  return NextResponse.json({ stocks: normalizeStocks(watchlist.stocks) }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { symbol } = (await req.json()) as WatchlistRequestBody;
  if (!symbol) {
    return NextResponse.json({ error: "symbol is required" }, { status: 400 });
  }

  await connectToDatabase();

  const watchlist = await Watchlist.findOneAndUpdate(
    { userId: session.user.id },
    { $pull: { stocks: { symbol: symbol.toUpperCase().trim() } } },
    { new: true },
  );

  return NextResponse.json({ stocks: normalizeStocks(watchlist?.stocks ?? []) });
}
