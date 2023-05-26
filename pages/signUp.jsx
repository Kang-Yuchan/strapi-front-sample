import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SubscriptionForm from '../components/SubscriptionForm';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

export default function SignUp() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [router, session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <SubscriptionForm />
    </Elements>
  );
}
