import Navbar from '@/Components/Navbar';
import React from 'react'

type Props = {
    children: React.ReactNode;
    //showHero?:boolean;
}


function PatientLayout({ children }: Props) {
    return (
        <>
        <Navbar/>
            {children}
            
        </>
    )
}

export default PatientLayout;