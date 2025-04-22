import { Search } from 'lucide-react'
import React, { useState } from 'react'

export const SearchBar = () => {
    const [searchText, setSearchText] = useState('')

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            console.log(searchText)
        }
    }

    return (
        <div className="relative mb-8">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Search for Series"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-[50rem] py-4 pl-12 pr-4 rounded-full bg-[#e8f4f4] text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
        </div>
    )
}
