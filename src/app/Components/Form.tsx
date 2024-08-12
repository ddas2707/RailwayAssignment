"use client";
import React, { useState } from 'react';
import Modal from './Modal';

const Form: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    age: '',
    department: '',
    designation: '',
    placeOfWork: '',
    otp: '', // Add OTP field
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendOtp = async () => {
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: formData.phone }),
    });

    if (response.ok) {
      setOtpSent(true);
      setModalMessage('OTP has been sent to your phone.');
      setIsModalOpen(true);
    } else {
      setModalMessage('Error sending OTP.');
      setIsModalOpen(true);
    }
  };


const verifyOtp = async () => {
  try {
      const response = await fetch('/api/verify-otp', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: formData.phone, code: formData.otp }), // Send 'code' instead of 'otp'
      });

      if (response.ok) {
          const result = await response.json();
          console.log(result.status);
          if (result.status === 'approved') {
              setOtpVerified(true);
              setModalMessage('OTP verified successfully!');
          } else {
              setModalMessage('Invalid OTP. Please try again ,ok.');
          }
      } else {
          const error = await response.json();
          setModalMessage(`Error verifying OTP2: ${error.message || 'Unknown error'}`);
      }
  } catch (error:any) {
      setModalMessage(`Error verifying OTP1: ${error.message || 'Unknown error'}`);
  } finally {
      setIsModalOpen(true);
  }
};



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otpVerified) {
      setModalMessage('Please verify your OTP before submitting.');
      setIsModalOpen(true);
      return;
    }

    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setModalMessage('Your data has been submitted successfully!');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'user_details.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      setModalMessage('Error submitting your data.');
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">User Form</h2>
        
        <div className="flex flex-col">
          <label htmlFor="name" className="text-gray-600">Name</label>
          <input
            id="name"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 mt-1"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-gray-600">Email</label>
          <input
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 mt-1"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="phone" className="text-gray-600">Phone Number</label>
          <input
            id="phone"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 mt-1 text-black"
          />
          <button
            type="button"
            onClick={sendOtp}
            disabled={otpSent}
            className={`mt-2 py-2 px-4 rounded-lg text-white ${otpSent ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} transition`}
          >
            Send OTP
          </button>
        </div>

        {otpSent && (
          <div className="flex flex-col">
            <label htmlFor="otp" className="text-gray-600">Enter OTP</label>
            <input
              id="otp"
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg p-2 mt-1 text-black"
            />
            <button
              type="button"
              onClick={verifyOtp}
              className="mt-2 py-2 px-4 rounded-lg bg-green-500 text-black hover:bg-green-600 transition"
            >
              Verify OTP
            </button>
          </div>
        )}

        <div className="flex flex-col">
          <label htmlFor="address" className="text-gray-600">Address</label>
          <input
            id="address"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 mt-1"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="age" className="text-gray-600">Age</label>
          <input
            id="age"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 mt-1"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="department" className="text-gray-600">Department</label>
          <input
            id="department"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 mt-1"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="designation" className="text-gray-600">Designation</label>
          <input
            id="designation"
            name="designation"
            placeholder="Designation"
            value={formData.designation}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 mt-1"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="placeOfWork" className="text-gray-600">Place of Work</label>
          <input
            id="placeOfWork"
            name="placeOfWork"
            placeholder="Place of Work"
            value={formData.placeOfWork}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 mt-1"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
      <Modal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />
    </div>
  );
};

export default Form;




//   const verifyOtp = async () => {
//     try {
//         const response = await fetch('/api/verify-otp', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ phone: formData.phone, otp: formData.otp }), // Ensure OTP is sent correctly
//         });

//         if (response.ok) {
//             const result = await response.json(); // Retrieve response content
//             if (result.status === 'approved') { // Check response content for success status
//                 setOtpVerified(true);
//                 setModalMessage('OTP verified successfully!');
//             } else {
//                 setModalMessage('Invalid OTP. Please try again.');
//             }
//         } else {
//             const error = await response.json();
//             setModalMessage(`Error verifying OTP: ${error.message || 'Unknown error'}`);
//         }
//     } catch (error:any) {
//         setModalMessage(`Error verifying OTP: ${error.message || 'Unknown error'}`);
//     } finally {
//         setIsModalOpen(true);
//     }
// };