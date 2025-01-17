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
