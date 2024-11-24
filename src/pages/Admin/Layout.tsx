import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    const [activePage, setActivePage] = useState('Dashboard');

    return (
        <div className="flex h-screen">
            <Sidebar setActivePage={setActivePage} />
            <div className="flex-1 flex flex-col">
                <Navbar activePage={activePage} />
                <div className="flex-1 bg-secondary">
                    <Outlet /> {/* Dynamically renders content based on the route */}
                </div>
            </div>
        </div>
    );
};

export default Layout;
