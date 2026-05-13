import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IWatchlistItem {
  symbol: string;
  companyName: string;
  addedAt: Date;
}

export interface IWatchlist extends Document {
  userId: string;
  stocks: IWatchlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const WatchlistItemSchema = new Schema<IWatchlistItem>({
  symbol: { type: String, required: true, uppercase: true, trim: true },
  companyName: { type: String, required: true, trim: true },
  addedAt: { type: Date, default: Date.now },
});

const WatchlistSchema = new Schema<IWatchlist>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    stocks: { type: [WatchlistItemSchema], default: [] },
  },
  { timestamps: true }
);

WatchlistSchema.index({ userId: 1, "stocks.symbol": 1 });

const Watchlist: Model<IWatchlist> =
  mongoose.models.Watchlist ||
  mongoose.model<IWatchlist>("Watchlist", WatchlistSchema);

export default Watchlist;
