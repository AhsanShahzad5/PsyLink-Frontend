import React from 'react';
import { TbPhoneCall } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

interface OngoingAppointmentProps {
    time: string;
    patient: string;
    joinCallHandler: () => void;
}

const OngoingAppointment: React.FC<OngoingAppointmentProps> = ({
    time,
    patient,
    joinCallHandler,
}) => {
    return (
        <div className='flex flex-col sm:block '>
            <div className="text-gray-600 pb-5 text-center">There are no live sessions right now</div>
            <div className="flex justify-between items-center">
                <div className="">{time}</div>
                <div className="">{patient}</div>

                <div className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-md w-[12rem] flex gap-5 align-middle justify-center font-bold"
                 onClick={joinCallHandler}>

                    <button className='text-xl'>
                        Join Call
                    </button>
                    <TbPhoneCall className='' size={30} />
                </div>

            </div>
        </div>
    );
};

const OngoingAppointments = () => {
    
    const navigate = useNavigate();
    const joinCallHandler = () => {
        // Handle join call logic
        console.log('Joining call...');
        navigate('/doctor/video-consultation')
    };

    return (
        <div className='bg-white rounded-lg p-6 w-[89rem] h-[15rem]'>
            <h2 className="text-2xl font-bold mb-4 text-primary border-b pb-4">Ongoing Appointments</h2>
            <div className="space-y-4 cursor-pointer">
                <OngoingAppointment
                    time="01:30 -02:30"
                    patient="Muhammad Jawaad Ghafoor"
                    joinCallHandler={joinCallHandler}
                />
            </div>
        </div>
    );
};

export default OngoingAppointments;