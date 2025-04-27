import { useState } from 'react';
import StripeWrapper from '../context/StripeProvider';
import PaymentForm from '../Components/patient/PaymentComponent';

const BookAppointment = () => {
  // Dummy doctor data for testing
  const [selectedDoctor, setSelectedDoctor] = useState<any>({
    _id: '680b787c567dd456b3d32734',
    personalDetails: {
      fullName: 'Dr. Jane Smith',
      profilePicture: '/api/placeholder/150/150'
    },
    professionalDetails: {
      specialisation: 'Cardiologist',
      consultationFee: 75,
      experience: '10 years',
      qualifications: 'MD, MBBS'
    }
  });

  // Dummy date (formatted as YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<any>('2025-05-15');
  
  // Dummy time slot
  const [selectedTime, setSelectedTime] = useState<any>('2:30 PM');

  // Mock function to change doctor selection


  return (
    <div className="book-appointment-container max-w-6xl mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-6 text-gray-800">Book an Appointment</h1> */}
      
      {/* For testing purposes, we're displaying a simplified selection UI */}
      {/* <div className="mb-8 grid md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2 text-gray-700">Selected Doctor</h2>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
            <div>
              <p className="font-medium">{selectedDoctor.personalDetails.fullName}</p>
              <p className="text-sm text-gray-600">{selectedDoctor.professionalDetails.specialisation}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2 text-gray-700">Selected Date</h2>
          <p>{selectedDate}</p>
          <p className="text-sm text-gray-500">
            {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2 text-gray-700">Selected Time</h2>
          <p>{selectedTime}</p>
        </div>
      </div> */}

      {/* Toggle buttons for testing */}
      {/* <div className="mb-8 flex flex-wrap gap-4">
        <button 
          onClick={() => setSelectedDoctor(prev => prev ? null : {
            _id: '680b787c567dd456b3d32734',
            personalDetails: {
              fullName: 'Dr. Jane Smith'
            },
            professionalDetails: {
              specialisation: 'Cardiologist',
              consultationFee: 75
            }
          })}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          {selectedDoctor ? 'Clear Doctor' : 'Set Doctor'}
        </button>
        
        <button 
          onClick={() => setSelectedDate(prev => prev ? null : '2025-05-15')}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          {selectedDate ? 'Clear Date' : 'Set Date'}
        </button>
        
        <button 
          onClick={() => setSelectedTime(prev => prev ? null : '2:30 PM')}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          {selectedTime ? 'Clear Time' : 'Set Time'}
        </button>
      </div> */}

      {/* Payment section with stripe wrapper */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Complete Your Booking</h2>
        
        {selectedDoctor && selectedDate && selectedTime ? (
          <StripeWrapper>
            <PaymentForm
              doctor={selectedDoctor}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          </StripeWrapper>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please select a doctor, date, and time to proceed with payment.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;