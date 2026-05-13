import { WatchlistNewsFeed } from "@/components/watchlist/WatchlistNewsFeed";
import { WatchlistStockList } from "@/components/watchlist/WatchlistStockList";

export const metadata = {
  title: "Watchlist | Signalist",
  description: "Your personal stock watchlist and news feed",
};

export default function WatchlistPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Watchlist</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your tracked stocks and their latest news
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        <aside>
          <WatchlistStockList />
        </aside>

        <section>
          <WatchlistNewsFeed />
        </section>
      </div>
    </main>
  );
}
