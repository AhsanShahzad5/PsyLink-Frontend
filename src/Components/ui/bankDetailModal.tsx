import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Validation Schema with Yup
const validationSchema = Yup.object({
  accountHolderName: Yup.string().required('Account Holder Name is required'),
  accountNumber: Yup.string().required('Account Number is required').matches(/^\d+$/, 'Account Number must be numeric'),
  bankName: Yup.string().required('Bank Name is required'),
  branchCode: Yup.string()
    .required('Branch Code is required')
    .matches(/^\d{4}$/, 'Branch Code must be exactly 4 digits'),
  iban: Yup.string().required('IBAN is required').matches(/^[A-Z0-9]+$/, 'IBAN must be alphanumeric'),
});

export const BankDetailsModal = ({ isBankDetailsModalOpen, handleSaveBankDetails }: any) => {
  // Formik hook for form handling
  const formik = useFormik({
    initialValues: {
      accountHolderName: '',
      accountNumber: '',
      bankName: '',
      branchCode: '',
      iban: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleSaveBankDetails(values);
    },
  });

  return (
    isBankDetailsModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 md:w-[600px] lg:w-[800px] max-w-full h-auto mt-10 mb-10">
          <h3 className="text-center text-lg font-semibold">Add Bank Details</h3>
          <form onSubmit={formik.handleSubmit} className="mt-4">
            <div className="flex flex-col items-start mb-4">
              <label className="block text-lg md:text-xl font-medium text-gray-700">Account Holder Name</label>
              <input
                type="text"
                name="accountHolderName"
                onChange={formik.handleChange}
                placeholder="e.g. John Doe"
                value={formik.values.accountHolderName}
                className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
              />
              {formik.errors.accountHolderName && formik.touched.accountHolderName && (
                <p className="text-red-500 text-sm">{formik.errors.accountHolderName}</p>
              )}
            </div>

            <div className="flex flex-col items-start mb-4">
              <label className="block text-lg md:text-xl font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                onChange={formik.handleChange}
                placeholder="e.g. 1234567890"
                value={formik.values.accountNumber}
                className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
              />
              {formik.errors.accountNumber && formik.touched.accountNumber && (
                <p className="text-red-500 text-sm">{formik.errors.accountNumber}</p>
              )}
            </div>

            <div className="flex flex-col items-start mb-4">
              <label className="block text-lg md:text-xl font-medium text-gray-700">Bank Name</label>
              <input
                type="text"
                name="bankName"
                placeholder="e.g. Bank of Punjab"
                onChange={formik.handleChange}
                value={formik.values.bankName}
                className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
              />
              {formik.errors.bankName && formik.touched.bankName && (
                <p className="text-red-500 text-sm">{formik.errors.bankName}</p>
              )}
            </div>

            <div className="flex flex-col items-start mb-4">
              <label className="block text-lg md:text-xl font-medium text-gray-700">Branch Code</label>
              <input
                type="text"
                name="branchCode"
                placeholder="e.g. 0423"
                onChange={formik.handleChange}
                value={formik.values.branchCode}
                maxLength={4}
                className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
              />
              {formik.errors.branchCode && formik.touched.branchCode && (
                <p className="text-red-500 text-sm">{formik.errors.branchCode}</p>
              )}
            </div>

            <div className="flex flex-col items-start mb-4">
              <label className="block text-lg md:text-xl font-medium text-gray-700">IBAN</label>
              <input
                type="text"
                name="iban"
                placeholder="e.g. PK36SCBL0000001123456702"
                onChange={formik.handleChange}
                value={formik.values.iban}
                className="mt-1 p-3 block w-full border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-xl"
              />
              {formik.errors.iban && formik.touched.iban && (
                <p className="text-red-500 text-sm">{formik.errors.iban}</p>
              )}
            </div>

            <div className="flex justify-center mt-6">
              <button type="submit" className="bg-[#02968A] text-white py-2 px-8 rounded-2xl">
                Save Bank Details
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};
