// app/account/page.jsx

'use client'; // Ensure this directive is present to enable client-side interactivity

import { useState } from 'react';
import CustomerPortalForm from '@/components/ui/AccountForms/CustomerPortalForm';
import EmailForm from '@/components/ui/AccountForms/EmailForm';
import NameForm from '@/components/ui/AccountForms/NameForm';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  getProducts,
  getUserDetails,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';

export default async function AccountPage() {
  const supabase = createClient();
  const [user, userDetails, subscription, products] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
    getSubscription(supabase),
    getProducts(supabase),
  ]);

  if (!user) {
    redirect('/signin');
    return null; // Ensure the component doesn't attempt to render further
  }

  const isSubscriber = subscription && subscription.status === 'active'; // Adjust based on your subscription status field

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-3xl font-bold text-white">Account Details</h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Manage your account and subscription details below.
          </p>
        </div>
      </div>
      <div className="p-4">
        <CustomerPortalForm subscription={subscription} />
        <NameForm userName={userDetails?.full_name ?? ''} />
        <EmailForm userEmail={user.email} />

        {isSubscriber && (
          <MarketingForm />
        )}
      </div>
    </section>
  );
}

// MarketingForm Component
function MarketingForm() {
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

    const payload = {
      start: "desktop",
      goal: "open tiktok",
      key: "6730c5eb53e8221750e366bc", // ⚠️ API Key is exposed here
      json_output: [
        {
          type: "cheat_file",
          file: "repurpose_tiktok_agent.cheat",
          browser_mode: "false",
          caption: marketingCaption,
          voiceover: marketingVoice,
          prompt: marketingVideo
        }
      ]
    };

    try {
      const response = await fetch('http://34.133.178.153/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setSuccessMessage('API request successful!');
      console.log('API Response:', data);

      // Optionally clear form fields
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
