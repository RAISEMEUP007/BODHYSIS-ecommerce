import React, { useState } from 'react';
import { createContext } from 'react';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLIC_KEY } from '../../AppConstants';
interface ContextProps {
  amount: number;
  clientSecret: string;
  stripePromise: Promise<Stripe | null>;
  setAmount: (amount:number) => void;
  setClientSecret: (client_secret:string) => void;
}

export const CustomStripeProviderContext = createContext<ContextProps>({
  amount: 0,
  clientSecret: '',
  stripePromise: Promise.resolve(null),
  setAmount: () => {},
  setClientSecret: () => {},
});

export const CustomStripeProvider = ({ children }:{children:React.ReactNode}) => {

  const [amount, setAmount] = useState<number>(0);
  const [clientSecret, setClientSecret] = useState<string>('');

  const stripePromise: Promise<Stripe | null> = loadStripe(STRIPE_PUBLIC_KEY as string);
  console.log(typeof(stripePromise));

  const values = {
    amount,
    clientSecret,
    stripePromise,
    setAmount,
    setClientSecret,
  }

  return (
    <CustomStripeProviderContext.Provider value={values}>
      {children}
    </CustomStripeProviderContext.Provider>
  );
};