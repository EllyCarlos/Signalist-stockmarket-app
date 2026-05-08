'use server';

import { Watchlist } from "@/database/models/watchlist.model";
import { connectToDatabase } from "@/database/mongoose";

type BetterAuthUserDocument = {
    _id?: { toString(): string };
    id?: string;
    email?: string;
};

type WatchlistSymbolDocument = {
    symbol?: string;
};

export const getWatchlistSymbolsByEmail = async (email: string): Promise<string[]> => {
    try {
        if (!email) return [];

        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error("MongoDB connection error");

        const user = await db.collection<BetterAuthUserDocument>('users').findOne(
            { email },
            { projection: { _id: 1, id: 1, email: 1 } },
        );

        if (!user) return [];

        const userId = user.id || user._id?.toString();
        if (!userId) return [];

        const items = await Watchlist.find({ userId })
            .select({ symbol: 1, _id: 0 })
            .lean<WatchlistSymbolDocument[]>()
            .exec();

        return items
            .map((item) => item.symbol)
            .filter((symbol): symbol is string => Boolean(symbol));
    } catch (e) {
        console.error('Error fetching watchlist symbols', e);
        return [];
    }
};
