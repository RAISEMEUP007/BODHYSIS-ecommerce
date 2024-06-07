import React, { useMemo, useState } from 'react';
import { createContext } from 'react';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLIC_KEY } from '../../AppConstants';
import { STRIPE_PUBLIC_KEY_STAND } from '../../AppConstants';
import { useStoreDetails } from '../StoreDetailsProvider/UseStoreDetails';

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

  const { storeDetails } = useStoreDetails();

  const [amount, setAmount] = useState<number>(0);
  const [clientSecret, setClientSecret] = useState<string>('');

  const stripePromise = useMemo(() => {
    if (storeDetails.store_name && storeDetails.store_name.toLocaleLowerCase().includes('stand')) {
      console.log('using bike stand key');
      return loadStripe(STRIPE_PUBLIC_KEY_STAND as string);
    } else {
      console.log('using default key');
      return loadStripe(STRIPE_PUBLIC_KEY as string);
    }
  }, [storeDetails.store_name]);

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