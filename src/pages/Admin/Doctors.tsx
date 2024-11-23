import React from 'react';

const Doctors = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg overflow-hidden">
        <h1 className="text-3xl font-semibold mb-6">Doctors</h1>
        {/* Add your doctors content here */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Doctor Name</span>
            <span>Specialization</span>
          </div>
          {/* Add more rows for doctors */}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
