
import DoctorNavbar from '@/Components/DoctorNavbar';
import React from 'react'

type Props = {
    children: React.ReactNode;
    //showHero?:boolean;
}


function DoctorLayout({ children }: Props) {
    return (
        <>
        <DoctorNavbar/>
            {children} 
        </>
    )
}

export default DoctorLayout;