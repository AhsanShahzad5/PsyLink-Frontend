import React, { useState } from 'react';
import Sidebar from './../pages/Admin/Sidebar';
import Navbar from './../pages/Admin/Navbar';

type Props = {
    children: React.ReactNode;
    //showHero?:boolean;
}

export default function AdminLayout({children}: Props) {
    const [activePage, setActivePage] = useState('Dashboard');
  return (
    <>
        <div className="flex h-auto">
            <Sidebar setActivePage={setActivePage} />
            <div className="flex-1 flex flex-col">
                <Navbar activePage={activePage} />
                <div className="flex-1 bg-secondary">
                    {children}
                </div>
            </div>
        </div>
    </>
  )
}

