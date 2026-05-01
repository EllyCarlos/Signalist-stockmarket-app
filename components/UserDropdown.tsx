'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import NavItems from "@/components/NavItems";

const UserDropdown = () => {
    const router = useRouter();

    const handleSignOut = async () => {
        router.push("/sign_in");
    }

    const user = { name: 'John', email: 'contact@gmail.com' };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 cursor-pointer focus:outline-none">
                    <div className="rounded-full overflow-hidden h-8 w-8 flex-shrink-0">
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9t2EgISBKHGwrNUbTj2o4nsbm3WrW-pf_0K-9IeRt4q_r0JsyePvV8YA&s"
                                style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                            />
                            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                                {user.name[0]}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                        <span className='text-base font-medium text-gray-400'>
                            {user.name}
                        </span>
                    </div>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="text-gray-400 w-56 p-0 py-1">
                <DropdownMenuLabel>
                    <div className="flex items-center gap-3 px-2 py-2 overflow-hidden">
                        <div className="rounded-full overflow-hidden h-8 w-8 flex-shrink-0" style={{ width: 32, height: 32 }}>
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9t2EgISBKHGwrNUbTj2o4nsbm3WrW-pf_0K-9IeRt4q_r0JsyePvV8YA&s"
                                    style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                                />
                                <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                                    {user.name[0]}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#CCDADC', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.name}
                            </span>
                            <span style={{ fontSize: 12, color: '#9095A1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-gray-600" />

                {/* Mobile Navigation View: Hidden on screens larger than 'sm' */}
                <div className="sm:hidden block w-full">
                    {/*
                      We use [&>ul]:flex-col and [&>div]:flex-col to force whatever wrapper
                      is inside NavItems to display as a vertical column.
                    */}
                    <div className="sm:hidden flex flex-col px-2 py-2 gap-3 [&_ul]:flex-col [&_ul]:gap-3 [&_div]:flex-col [&_div]:gap-3 [&_a]:text-sm [&_a]:font-medium  :text-gray-200">
                        <NavItems />
                    </div>
                    <DropdownMenuSeparator className="bg-gray-600 mt-1" />
                </div>

                {/* Logout Button (At the bottom) */}
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer px-4 py-2"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown;