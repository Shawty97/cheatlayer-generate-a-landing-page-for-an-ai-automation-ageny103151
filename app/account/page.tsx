// app/account/page.jsx

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Pricing from '@/components/ui/Pricing/Pricing';

import {
  getProducts,
  getUserDetails,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';
import CustomerPortalForm from '@/components/ui/AccountForms/CustomerPortalForm';
import EmailForm from '@/components/ui/AccountForms/EmailForm';
import NameForm from '@/components/ui/AccountForms/NameForm';
import MarketingForm from '@/components/ui/AccountForms/MarketingForm'; // Import the MarketingForm


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
  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-3xl font-bold text-white">Account Details</h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Manage your account and subscription details below. {subscription}
          </p>
        </div>
      </div>
      <div className="p-4">
       
         <Pricing
      user={user}
      products={products ?? []}
      subscription={subscription}
      />
        <CustomerPortalForm subscription={subscription} />
        <NameForm userName={userDetails?.full_name ?? ''} />
        <EmailForm userEmail={user.email} />

      
          <MarketingForm />
      
      </div>
    </section>
  );
}
