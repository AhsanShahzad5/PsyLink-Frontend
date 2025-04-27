// src/components/patient/PaymentForm.jsx

import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '@/atoms/userAtom';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  },
  hidePostalCode: true
};

/* userId : 675d6f48d591bb83cb996ffe 
dcotid : 680b787c567dd456b3d32734
selectedDate = new Date().toISOString().split('T')[0], 
  selectedTime = '10:00 AM' 

*/
const PaymentForm = ({ 
  doctor = { 
    _id: '', 
    personalDetails: { fullName: 'Dr. John Doe' }, 
    professionalDetails: { specialisation: 'General Medicine', consultationFee: 50 } 
  }, 
  selectedDate = new Date().toISOString().split('T')[0], 
  selectedTime = '10:00 AM' 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const user = useRecoilValue(userAtom) || { 
    _id: '', 
    email: 'patient@example.com',
    personalInformation: { fullName: 'Patient Name' }
  };
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [appointmentId, setAppointmentId] = useState('');
  
  // Calculate amount from doctor's consultation fee
  const amount = doctor.professionalDetails?.consultationFee || 50; // Default to 50 if not set
  
  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      if (!doctor._id || !selectedDate || !selectedTime) {
        setError("Missing booking information. Please select date and time.");
        return;
      }
      
      try {
        const response = await fetch('http://localhost:8000/api/payments/patient/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            amount,
            // patientId: user._id,
            // doctorId: doctor._id,
            // date: selectedDate,
            // time: selectedTime
            patientId: '680b75fef37c98c26bfc2019' ,
            doctorId: '680b787c567dd456b3d32734' ,
            date: selectedDate,
            time: selectedTime
          })
        });
        

/* userId : 675d6f48d591bb83cb996ffe 
dcotid : 680b787c567dd456b3d32734
selectedDate = new Date().toISOString().split('T')[0], 
  selectedTime = '10:00 AM' 

*/

        const data = await response.json();
        
        if (data.success) {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
          setAppointmentId(data.appointmentId);
        } else {
          setError("Could not initialize payment. Please try again.");
        }
      } catch (err) {
        console.error("Error creating payment intent:", err);
        setError("Payment service unavailable. Please try again later.");
      }
    };
    
    createPaymentIntent();
  }, [doctor._id, selectedDate, selectedTime, amount, user._id]);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
        setError("Card information is missing. Please refresh and try again.");
        setProcessing(false);
        return;
    }
    
    // Confirm card payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: user.personalInformation?.fullName || user.email,
          email: user.email
        }
      }
    });
    
    if (error) {
      setError(error.message || "An unknown error occurred.");
      setProcessing(false);
      return;
    }
    
    if (paymentIntent.status === 'succeeded') {
      try {
        // Confirm payment with our backend
        const confirmResponse = await fetch('http://localhost:8000/api/payments/patient/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            paymentIntentId,
            patientId: user._id,
            doctorId: doctor._id,
            appointmentId,
            date: selectedDate,
            time: selectedTime
          })
        });
        
        const confirmData = await confirmResponse.json();
        
        if (confirmData.success) {
          // Payment successfully processed and appointment booked
          navigate('/patient/appointments', { 
            state: { 
              success: true, 
              message: 'Appointment successfully booked!',
              appointmentId: appointmentId
            } 
          });
        } else {
          setError("Payment was processed but booking failed. Please contact support.");
        }
      } catch (err) {
        console.error("Error confirming payment with backend:", err);
        setError("Payment was processed but booking couldn't be confirmed. Please contact support.");
      }
    } else {
      setError("Payment failed. Please try again.");
    }
    
    setProcessing(false);
  };
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-4 px-6">
        <h2 className="text-xl font-semibold text-white">Secure Payment</h2>
      </div>
      
      <div className="p-6">
        <div className="mb-6 bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-3 text-gray-800 border-b pb-2">Appointment Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Doctor:</span>
              <span className="font-medium">{doctor.personalDetails?.fullName || 'Dr. John Doe'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Specialization:</span>
              <span className="font-medium">{doctor.professionalDetails?.specialisation || 'General Medicine'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{selectedDate || new Date().toISOString().split('T')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{selectedTime || '10:00 AM'}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-gray-800 font-medium">Total Amount:</span>
              <span className="text-lg font-semibold text-blue-600">${amount}</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Information
            </label>
            <div className="border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors bg-white">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            <p className="mt-1 text-xs text-gray-500">Secure payment powered by Stripe</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={!stripe || processing || !clientSecret}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {processing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Pay $${amount}`
            )}
          </button>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            By proceeding with payment, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
        
        <div className="mt-6 border-t pt-4">
          <div className="bg-gray-50 rounded-md p-3 text-xs">
            <h4 className="font-medium text-gray-700 mb-2">Test Card Details (For Testing Only)</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-500">Card Number:</span>
                <p className="font-mono">4242 4242 4242 4242</p>
              </div>
              <div>
                <span className="text-gray-500">Expiry:</span>
                <p>Any future date</p>
              </div>
              <div>
                <span className="text-gray-500">CVC:</span>
                <p>Any 3 digits</p>
              </div>
              <div>
                <span className="text-gray-500">ZIP:</span>
                <p>Any 5 digits</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 mt-6">
            <img src="/api/placeholder/40/25" alt="Visa" className="h-6" />
            <img src="/api/placeholder/40/25" alt="Mastercard" className="h-6" />
            <img src="/api/placeholder/40/25" alt="Amex" className="h-6" />
            <img src="/api/placeholder/40/25" alt="Discover" className="h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;