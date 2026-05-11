"use client";

import { useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import {Loader2, Star, TrendingUp} from "lucide-react";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { useDebounce } from "@/hooks/useDebounce";

type SearchCommandProps = {
  renderAs?: "button" | "text";
  label?: string;
  initialStocks?: StockWithWatchlistStatus[];
};

export default function SearchCommand({
  renderAs = "button",
  label = "Add stock",
  initialStocks = [],
}: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTeam] = useState("");
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  const handlesSelectStock = () => {
        setOpen(false);
        setSearchTeam("");
        setStocks(initialStocks);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleSearch = async () => {
    if(!isSearchMode) return setStocks(initialStocks);

    setLoading(true)
    try {
      const results = await searchStocks(searchTerm.trim());
      setStocks(results);
    } catch {
      setStocks([])
    } finally {
      setLoading(false)
    }
  }

  const debounceSearch= useDebounce(handleSearch, 300);

  useEffect(() => {
    debounceSearch();
  }, [searchTerm, debounceSearch]);


  return (
      <>
        {renderAs === 'text' ?(
            <span onClick={() => setOpen(true)} className="search-text">
              {label}
            </span>
        ): (
            <Button onClick={() => setOpen(true)} className="search-btn">
              {label}
            </Button>
        )
        }
    <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
      <div>
        <CommandInput
            placeholder="Search stocks..."
            value={searchTerm}
            onValueChange={setSearchTeam}
            className="search-input"
        />
        {loading && <Loader2 className="search-loader" />}
      </div>

      <CommandList className="search-list">
        {loading ? (
            <CommandEmpty className="search-list-empty">Loading stocks ...</CommandEmpty>
        ) : displayStocks?.length === 0 ?(
            <div className="search-list-indicator">
              {isSearchMode ? 'No results found' : 'No stocks available'}
            </div>
        ) : (
            <ul>
              <div className="search-count">
                {isSearchMode ? 'Search results' : 'Popular stocks' }
                {` `}({displayStocks?.length || 0})
              </div>
              {displayStocks?.map((stock) =>(
                  <li key={stock.symbol} className="search-item">
                    <Link
                        href={`/stocks/${stock.symbol}`}
                        onClick={handlesSelectStock}
                        className="search-item-link"
                    >
                      <TrendingUp className="h-4 w-4 text-gray-500"/>
                    <div className="flex-1">
                      <div className="search-item-name">
                        {stock.name}
                      </div>
                      <div>
                        {stock.symbol} | {stock.exchange} | {stock.type}

                      </div>
                    </div>
                      <Star />
                    </Link>
                  </li>
                  )
              )}
            </ul>
        )}
      </CommandList>
    </CommandDialog>
      </>
  );
}
