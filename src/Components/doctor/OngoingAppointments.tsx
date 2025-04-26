// import userAtom from '@/atoms/userAtom';
// import React, { useEffect, useState } from 'react';
// import { TbPhoneCall } from "react-icons/tb";
// import { useNavigate } from 'react-router-dom';
// import { useRecoilValue } from 'recoil';

// interface Appointment {
//   appointmentId: string;
//   date: string;        // e.g. "2025-04-26" or "15th October,2024"
//   time: string;        // e.g. "9:00am - 10:00am"
//   patient: string;
// }

// const parseAppointmentWindow = (dateStr: string, timeStr: string): { start: Date; end: Date } | null => {
//   try {
//     // parse date
//     let year: number, month: number, day: number;
//     if (dateStr.includes('-')) {
//       [year, month, day] = dateStr.split('-').map(n => parseInt(n, 10));
//     } else {
//       // "15th October,2024"
//       const parts = dateStr.split(/[,\s]+/).filter(Boolean);
//       day = parseInt(parts[0].replace(/\D/g,''),10);
//       month = new Date(Date.parse(parts[1] + " 1, 2000")).getMonth()+1;
//       year = parseInt(parts[2],10);
//     }

//     // parse times
//     const [startRaw, endRaw] = timeStr.split(' - ');
//     const parseTime = (raw: string) => {
//       const m = raw.match(/(\d+):?(\d*)\s*(am|pm)/i);
//       if (!m) throw new Error("bad time");
//       let h = parseInt(m[1],10);
//       const min = m[2] ? parseInt(m[2],10) : 0;
//       const isPM = m[3].toLowerCase()==='pm';
//       if (isPM && h<12) h+=12;
//       if (!isPM && h===12) h=0;
//       return { h, min };
//     };

//     const { h: sh, min: smin } = parseTime(startRaw.trim());
//     const { h: eh, min: emin } = parseTime(endRaw.trim());

//     const start = new Date(year, month-1, day, sh, smin);
//     const end   = new Date(year, month-1, day, eh, emin);
//     return { start, end };
//   } catch {
//     return null;
//   }
// };

// const OngoingAppointmentRow: React.FC<Appointment & { join: () => void }> = ({ time, patient, join }) => (
//   <div className="flex justify-between items-center p-4 border-b last:border-b-0">
//     <span className="w-1/3">{time}</span>
//     <span className="w-1/3">{patient}</span>
//     <button
//       onClick={join}
//       className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-md flex items-center gap-2 font-bold"
//     >
//       <TbPhoneCall size={20}/>
//       Join Call
//     </button>
//   </div>
// );

// const OngoingAppointments: React.FC = () => {
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const user = useRecoilValue(userAtom);
//   const navigate = useNavigate();

//   useEffect(() => {
//     (async () => {
//       try {
//         const userId = user._id;
        
//         if (!userId) {
//           throw new Error('User ID not found');
//         }

//         console.log("Fetching appointments for user:", userId);
        
//         const res = await fetch(`/api/doctor/appointments/upcoming?doctorId=${userId}`);
//         console.log("Response status:", res.status);
//         const body = await res.json();

//         console.log("This is body.data from onGoingAppointment Component:", body.data);

//         if (res.ok && Array.isArray(body.data)) {
//           setAppointments(body.data);
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const now = new Date();
//   const live = appointments.filter(a => {
//     const win = parseAppointmentWindow(a.date, a.time);
//     return win ? win.start <= now && now <= win.end : false;
//   });

//   const joinCallHandler = () => {
//     navigate('/doctor/video-consultation');
//   };

//   return (
//     <div className='bg-white rounded-lg p-6 w-[89rem] h-[15rem]'>
//       <h2 className="text-2xl font-bold mb-4 text-primary border-b pb-4">Ongoing Appointments</h2>

//       {loading ? (
//         <p>Loading…</p>
//       ) : live.length > 0 ? (
//         <div className="space-y-4 cursor-pointer">
//           {live.map(appt => (
//             <OngoingAppointmentRow
//               key={appt.appointmentId}
//               {...appt}
//               join={joinCallHandler}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className='text-center text-gray-600 py-10'>
//           There are no live sessions right now
//         </div>
//       )}
//     </div>
//   );
// };

// export default OngoingAppointments;


// This is code to check the Join Call and VideoCall Feature

import userAtom from '@/atoms/userAtom';
import React, { useEffect, useState } from 'react';
import { TbPhoneCall } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface Appointment {
  appointmentId: string;
  date: string;
  time: string;
  patient: string;
}

const OngoingAppointment: React.FC<{
  appointment: Appointment;
  joinCallHandler: (id: string) => void;
}> = ({ appointment, joinCallHandler }) => {
  return (
    <div className='flex flex-col sm:block'>
      <div className="text-gray-600 pb-5 text-center">
        {/* only show when no live sessions */}
      </div>
      <div className="flex justify-between items-center p-4 border-b last:border-b-0">
      <div className="w-1/3 text-center sm:text-left">{appointment.date}</div>
        <div className="w-1/3 text-center sm:text-left">{appointment.time}</div>
        <div className="w-1/3 text-center sm:text-left">{appointment.patient}</div>
        <div
          className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-md w-[12rem] flex gap-5 items-center justify-center font-bold cursor-pointer"
          onClick={() => joinCallHandler(appointment.appointmentId)}
        >
          <button className='text-xl'>Join Call</button>
          <TbPhoneCall size={30} />
        </div>
      </div>
    </div>
  );
};

const OngoingAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const userId = user._id;
        if (!userId) throw new Error('User ID not found');

        //abbad code
        // const res = await fetch(`/api/doctor/appointments/upcoming?doctorId=${userId}`, {
        
        //ahsan
        const res = await fetch(`http://localhost:8000/api/doctor/appointments/upcoming?doctorId=${userId}`, {
          credentials: 'include'
        });
        const body = await res.json();
        if (res.ok && Array.isArray(body.data)) {
          setAppointments(body.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user._id]);

  const joinCallHandler = (appointmentId: string) => {
    navigate(`/doctor/video-preview?appointmentId=${appointmentId}`);
  };

  return (
    <div className='bg-white rounded-lg p-6 w-[89rem] h-[15rem] overflow-y-auto'>
      <h2 className="text-2xl font-bold mb-4 text-primary border-b pb-4">Ongoing Appointments</h2>

      {loading ? (
        <p>Loading…</p>
      ) : appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map(appt => (
            <OngoingAppointment
              key={appt.appointmentId}
              appointment={appt}
              joinCallHandler={joinCallHandler}
            />
          ))}
        </div>
      ) : (
        <div className='text-gray-600 pb-5 text-center'>
          There are no live sessions right now
        </div>
      )}
    </div>
  );
};

export default OngoingAppointments;

