import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export const SearchBar = () => {
    const [searchText, setSearchText] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    
    // Extract the role from the current path
    const role = location.pathname.split("/")[1] // Gets 'doctor' from the URL
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && searchText.trim()) {
            console.log("Searching for:", searchText)
            // Navigate to the search results page within the correct role context
            navigate(`/${role}/psync/search?seriesTitle=${encodeURIComponent(searchText)}`)
        }
    }
    
    return (
        <div className="relative mb-4 sm:mb-6 md:mb-8 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Search for Series"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-4 rounded-full bg-[#e8f4f4] text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
        </div>
    )
}