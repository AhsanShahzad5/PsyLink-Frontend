import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PreviousRecordType } from '../../Components/doctor/HomePageUpcomingAppointments';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface LocationState {
  patientId: string;
  patientName: string;
  records: PreviousRecordType[];
}

const PreviousRecords: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const [previousRecords, setPreviousRecords] = useState<PreviousRecordType[]>([]);
  const [expandedRecords, setExpandedRecords] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (state && state.records) {
      setPreviousRecords(state.records);
    } else {
      setErrorMessage('Failed to load patient records.');
    }
    setIsLoading(false);
  }, [state]);

  const toggleRecordExpansion = (appointmentId: string) => {
    setExpandedRecords(prev => ({
      ...prev,
      [appointmentId]: !prev[appointmentId]
    }));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Return the original string if parsing fails
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="container mt-24 mx-auto p-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container mt-24 mx-auto p-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
          <p>{errorMessage}</p>
          <button
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (previousRecords.length === 0) {
    return (
      <div className="container mt-24 mx-auto p-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Patient Records: {state?.patientName || 'Unknown'}</h1>
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Back
            </button>
          </div>
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">No previous records found for this patient.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-24 mx-auto p-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
        <button
            onClick={handleGoBack}
            className="px-4 mr-5 py-2 bg-primary text-white rounded hover:bg-primaryHover transition"
          >
            Back
          </button>

          <h1 className="text-2xl font-bold">Patient Records: {state?.patientName || 'Unknown'}</h1>

        </div>

        <div className="space-y-4">
          {previousRecords.map((record) => (
            <div key={record.appointmentId} className="border rounded-lg overflow-hidden">
              {/* Header - always visible */}
              <div 
                className={`flex justify-between items-center p-4 cursor-pointer ${
                  expandedRecords[record.appointmentId] ? 'bg-blue-50' : 'bg-gray-50'
                }`}
                onClick={() => toggleRecordExpansion(record.appointmentId)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium mr-3">{formatDate(record.date)}</span>
                    <span className="text-gray-600">{record.time}</span>
                  </div>
                  <div className="mt-1">
                    <span className={`px-2 py-1 text-xs rounded ${
                      record.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {record.status}
                    </span>
                    {record.rating && (
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        Rating: {record.rating}/5
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  {expandedRecords[record.appointmentId] ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Content - visible when expanded */}
              {expandedRecords[record.appointmentId] && (
                <div className="p-4 border-t">
                  {/* Review section */}
                  {record.review && (
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-700 mb-2">Patient Review</h3>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600 italic">&ldquo;{record.review}&rdquo;</p>
                      </div>
                    </div>
                  )}

                  {/* Prescription section */}
                  {record.prescription ? (
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Prescription</h3>
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-sm text-gray-500 mb-2">
                          Prescribed on: {formatDate(record.prescription.date)}
                        </p>
                        <table className="w-full text-sm">
                          <thead className="bg-blue-100">
                            <tr>
                              <th className="text-left p-2 rounded-tl">Medicine</th>
                              <th className="text-left p-2 rounded-tr">Instructions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-blue-100">
                            {record.prescription.medications.map((med, idx) => (
                              <tr key={idx}>
                                <td className="p-2">{med.medicine}</td>
                                <td className="p-2">{med.instructions}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">No prescription was provided for this appointment.</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviousRecords;