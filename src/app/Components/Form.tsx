// app/Components/Form.tsx
'use client';

import React, { useState } from 'react';
import Modal from './Modal';

const Form: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    age: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setModalMessage('Your data has been submitted successfully!');
    } else {
      setModalMessage('Error submitting your data.');
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="text-black">
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <input name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
        <button className='bg-white' type="submit">Submit</button>
      </form>
      <Modal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />
    </div>
  );
};

export default Form;
