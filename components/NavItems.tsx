'use client'

import { Star } from "lucide-react";
import {NAV_ITEMS} from "@/lib/constants";
import Link from "next/link";
import {usePathname} from "next/navigation";
import SearchCommand from "@/components/SearchCommand";

const NavItems = ({initialStocks}: { initialStocks: StockWithWatchlistStatus[]}) => {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path==='/') return pathname === '/';
        return pathname.startsWith(path);
    }

    return (
        /* Change flex-row to flex-col sm:flex-row */
        <ul className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 font-medium">
            {NAV_ITEMS.map(({href, label}) => {

            if(label === 'Search') return (
                <li key="search-trigger">
                    <SearchCommand
                        renderAs="text"
                        label="Search"
                        initialStocks={initialStocks}
                    />
                </li>
            )

            if (label === 'Watchlist') {
                return <li key={href} className="w-full sm:w-auto">
                    <Link href={href} className={`inline-flex items-center gap-2 py-1 sm:py-0 hover:text-yellow-500 transition-colors ${
                        isActive(href) ? 'text-gray-100' : 'text-gray-400'
                    }`}>
                        <Star className="h-4 w-4" />
                        Watchlist
                    </Link>
                </li>
            }

                return <li key={href} className="w-full sm:w-auto">
                    <Link href={href} className={`block py-1 sm:py-0 hover:text-yellow-500 transition-colors ${
                        isActive(href) ? 'text-gray-100' : 'text-gray-400'
                    }`}>
                        {label}
                    </Link>
                </li>
})}
        </ul>
    )
}
export default NavItems
