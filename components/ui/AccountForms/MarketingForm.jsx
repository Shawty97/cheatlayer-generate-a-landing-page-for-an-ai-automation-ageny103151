// components/ui/AccountForms/MarketingForm.jsx

'use client'; // This directive is essential for client components

import { useState } from 'react';

export default function MarketingForm() {
  const [marketingCaption, setMarketingCaption] = useState('');
  const [marketingVoice, setMarketingVoice] = useState('');
  const [marketingVideo, setMarketingVideo] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/submit-marketing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          marketingCaption,
          marketingVoice,
          marketingVideo
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unknown error');
      }

      setSuccessMessage('API request successful!');
      console.log('API Response:', result.data);

      // Clear form fields

         setMarketingCaption('');
      setMarketingVoice('');
      setMarketingVideo('');
    } catch (err) {
      setError(`Failed to submit: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-4 bg-gray-800 rounded">
      <h2 className="text-xl font-semibold text-white mb-4">Marketing Submission</h2>
     
      <div className="mb-4">
        <label htmlFor="marketingCaption" className="block text-gray-300">Marketing Caption</label>
        <input
          type="text"
          id="marketingCaption"
          value={marketingCaption}
          onChange={(e) => setMarketingCaption(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 text-black rounded"
          placeholder="Enter marketing caption"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="marketingVoice" className="block text-gray-300">Marketing Voiceover</label>
        <input
          type="text"
          id="marketingVoice"
          value={marketingVoice}
          onChange={(e) => setMarketingVoice(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 text-black rounded"
          placeholder="Enter marketing voiceover"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="marketingVideo" className="block text-gray-300">Marketing Video Prompt</label>
        <textarea
          id="marketingVideo"
          value={marketingVideo}
          onChange={(e) => setMarketingVideo(e.target.value)}
          required
          className="w-full px-3 py-2 mt-1 text-black rounded"
          placeholder="Enter marketing video prompt"
          rows={4}
        ></textarea>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
