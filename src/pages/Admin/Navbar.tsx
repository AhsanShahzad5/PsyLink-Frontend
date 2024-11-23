import React from 'react';

interface NavbarProps {
    activePage: string;
}

const Navbar: React.FC<NavbarProps> = ({ activePage }) => {
    return (
        <div className="flex items-center justify-between bg-white shadow p-4">
            <h1 className="text-xl font-bold text-gray-800">{activePage}</h1>
            <div className="flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border rounded-md px-3 py-2"
                />
                <button className="rounded-full bg-gray-300 p-2">
                    <i className="fas fa-bell" />
                </button>
                <div className="rounded-full bg-gray-400 w-8 h-8" />
            </div>
        </div>
    );
};

export default Navbar;
