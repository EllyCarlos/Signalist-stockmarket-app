'use client'

import {NAV_ITEMS} from "@/lib/constants";
import Link from "next/link";
import {usePathname} from "next/navigation";

const NavItems = () => {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path==='/') return pathname === '/';
        return pathname.startsWith(path);
    }

    return (
        /* Change flex-row to flex-col sm:flex-row */
        <ul className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 font-medium">
            {NAV_ITEMS.map(({href, label}) => (
                <li key={href} className="w-full sm:w-auto">
                    <Link href={href} className={`block py-1 sm:py-0 hover:text-yellow-500 transition-colors ${
                        isActive(href) ? 'text-gray-100' : 'text-gray-400'
                    }`}>
                        {label}
                    </Link>
                </li>
            ))}
        </ul>
    )
}
export default NavItems