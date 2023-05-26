import React, { useState } from 'react';

import CustomDonationInput from '../components/CustomDonationInput';
import StripeTestCards from '../components/StripeTestCards';

import getStripe from '../utils/get-stripejs';
import { fetchPostJSON } from '../utils/api-helpers';
import { formatAmountForDisplay } from '../utils/stripe-helpers';
import * as config from '../config';

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    customDonation: Math.round(
      config.MAX_AMOUNT / config.AMOUNT_STEP,
    ),
  });

  const handleInputChange = (e) =>
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Create a Checkout Session.
    const response = await fetchPostJSON('/api/checkout_sessions', {
      amount: input.customDonation,
    });

    if (response.statusCode === 500) {
      console.error(response.message);
      return;
    }

    // Redirect to Checkout.
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: response.id,
    });

    console.warn(error.message);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <button
        className="checkout-style-background"
        type="submit"
        disabled={loading}
      >
        Donate{' '}
        {formatAmountForDisplay(
          input.customDonation,
          config.CURRENCY,
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
