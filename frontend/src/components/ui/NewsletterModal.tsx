import React, { useState } from 'react';
import { NewsletterService } from '../../services/newsletter';

export const NewsletterModal = ({ totalShops }: { totalShops: number }) => {
  const [subject, setSubject] = useState('');
  const price = NewsletterService.calculateQuote(totalShops);

  const handleSend = async () => {
    // Logic to call the service
    alert(`Sending to ${totalShops} shops. Total cost: ${price} MAD`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-xl font-bold">Send Partner Newsletter</h2>
      <p className="text-gray-600">Reaching {totalShops} shops across Morocco.</p>

      <div className="mt-4">
        <label className="block text-sm">Campaign Subject</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g., Special Offer for Wholesalers"
        />
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <p className="font-semibold text-blue-800">Quote: {price} MAD</p>
      </div>

      <button
        onClick={handleSend}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded font-bold"
      >
        Finalize & Send
      </button>
    </div>
  );
};
