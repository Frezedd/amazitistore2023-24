import React, { useState } from 'react';

const AddressForm = ({ onSave }) => {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(address);
  };

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <div className="mb-2">
        <label htmlFor="street" className="block text-xs font-medium text-gray-700">
          Street
        </label>
        <input
          type="text"
          id="street"
          name="street"
          value={address.street}
          onChange={handleChange}
          required
          className="mt-1 p-1 border border-gray-300 rounded-md w-full text-sm"
        />
      </div>

      <div className="mb-2">
        <label htmlFor="city" className="block text-xs font-medium text-gray-700">
          City
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={address.city}
          onChange={handleChange}
          required
          className="mt-1 p-1 border border-gray-300 rounded-md w-full text-sm"
        />
      </div>

      <div className="mb-2">
        <label htmlFor="state" className="block text-xs font-medium text-gray-700">
          State
        </label>
        <input
          type="text"
          id="state"
          name="state"
          value={address.state}
          onChange={handleChange}
          required
          className="mt-1 p-1 border border-gray-300 rounded-md w-full text-sm"
        />
      </div>

      <div className="mb-2">
        <label htmlFor="postalCode" className="block text-xs font-medium text-gray-700">
          Postal Code
        </label>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          value={address.postalCode}
          onChange={handleChange}
          required
          className="mt-1 p-1 border border-gray-300 rounded-md w-full text-sm"
        />
      </div>

      <button type="submit" className="p-1 bg-blue-500 text-white rounded-md text-sm">
        Save Address
      </button>
    </form>
  );
};

export default AddressForm;
