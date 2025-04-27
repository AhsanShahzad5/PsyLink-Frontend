// src/components/common/StripeWrapper.jsx

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Load Stripe with your publishable key (from environment variable)
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string);
const stripePromise = loadStripe('pk_test_51RI5EPHByCvsn6yTGUSUpefyOsgjqzIPUhPaVEVdMm8a1ClbBxKJJJvS7OWFqHX8xIZ61AYJ5evQ5goBnytyiAQR00JPny7MQx');

const StripeWrapper = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeWrapper;