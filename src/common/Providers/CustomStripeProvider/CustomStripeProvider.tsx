import React, { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLIC_KEY } from '../../AppConstants';

interface ContextProps {
  amount: number;
  clientSecret: string;
  setAmount: (amount:number) => void;
  setClientSecret: (client_secret:string) => void;
}

export const CustomStripeProviderContext = createContext<ContextProps>({
  amount: 0,
  clientSecret: '',
  setAmount: () => {},
  setClientSecret: () => {},
});

export const CustomStripeProvider = ({ children }:{children:React.ReactNode}) => {

  const [amount, setAmount] = useState<number>(0);
  const [clientSecret, setClientSecret] = useState<string>('');

  const stripePromise = loadStripe(STRIPE_PUBLIC_KEY as string);

  const appearanceOptions = {
    rules: {
      ".Input":{
        borderColor: "#cccccc"
      }
    },
    layout: {
      type: 'accordion',
      defaultCollapsed: true,
    }
  }

  const options = {
    clientSecret: clientSecret,
    appearance: appearanceOptions,

  };

  const values = {
    amount: amount,
    clientSecret,
    setAmount,
    setClientSecret,
  }

  return (
    <CustomStripeProviderContext.Provider value={values}>
      {(amount > 0 && clientSecret) ? (
        <Elements stripe={stripePromise} options={options}>
          {children}
        </Elements>
      ):(children)}
    </CustomStripeProviderContext.Provider>
  );
};