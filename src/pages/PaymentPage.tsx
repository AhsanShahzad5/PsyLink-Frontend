import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StripeWrapper from '../context/StripeProvider';
import PaymentForm from '../Components/patient/PaymentComponent';
import BackButton from '@/Components/patient/backButton';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from navigation state
  // const { selectedDoctor, selectedDate, selectedTime } = location.state || {};
  const { doctor: selectedDoctor, selectedDate, selectedTime } = location.state || {};
  // Redirect if no data
  useEffect(() => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      navigate('/patient/bookings', { 
        state: { 
          error: true, 
          message: 'Missing appointment information. Please select a doctor, date and time.' 
        }
      });
    }
  }, [selectedDoctor, selectedDate, selectedTime, navigate]);

  // If no data, show loading while redirection happens
  if (!selectedDoctor || !selectedDate || !selectedTime) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="book-appointment-container max-w-6xl mx-auto p-4 py-8">
      {/* <h1 className="text-2xl font-bold mb-6 text-gray-800">Complete Your Booking</h1>
      
      <div className="mb-8 grid md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2 text-gray-700">Selected Doctor</h2>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 overflow-hidden">
              <img 
                src={selectedDoctor.personalDetails.profilePicture || "/api/placeholder/40/40"} 
                alt={selectedDoctor.personalDetails.fullName}
                className="w-full h-full object-cover" 
              />
            </div>
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

      {/* Payment section with stripe wrapper */}
      <div className="mt-16">
        <BackButton/>
        {/* <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Information</h2> */}
        
        <StripeWrapper>
          <PaymentForm
            // doctor={selectedDoctor}
            // selectedDate={selectedDate}
            // selectedTime={selectedTime}
          />
        </StripeWrapper>
      </div>
    </div>
  );
};

export default PaymentPage;