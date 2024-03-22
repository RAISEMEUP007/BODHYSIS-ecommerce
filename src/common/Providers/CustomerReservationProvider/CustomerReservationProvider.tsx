import React, { useContext, useState } from 'react';
import { createContext } from 'react';

export interface ReservationMainProps {
  pickup: Date | null;
  dropoff: Date | null;
  prices: {
    subtotal: number;
    tax: number;
    total: number;
  },
  price_table_id: number | null;
  name: string;
  special_instructions: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  state_id: number;
  postal_code: string;
  phone_number: string;
  email: string;
  password: string;
  is_accept: boolean;
  img_url: string,
}

interface ContextProps {
  ReservationMain: ReservationMainProps;
  ReservationItems: Array<any>;
  setReservationMain: (ReservationMain: ReservationMainProps) => void;
  setReservationValue: (key: keyof ReservationMainProps, value: any) => void;
  getReservationValue: (key: keyof ReservationMainProps) => any | null;
  setReservationItems: (ReservationItems: Array<any>) => void;
}

const initializedMain: ReservationMainProps = {
  pickup: null,
  dropoff: null,
  prices: {
    subtotal: 0,
    tax: 0,
    total: 0,
  },
  price_table_id: null,
  name: "",
  special_instructions: "",
  address: "",
  address2: "",
  city: "",
  state: "",
  state_id: 0,
  postal_code: "",
  phone_number: "",
  email: "",
  password: "",
  is_accept: false,
  img_url: "",
}

export const CustomerReservationContext = createContext<ContextProps>({
  ReservationMain: initializedMain,
  ReservationItems: [],
  setReservationMain: () => {},
  setReservationValue: () => {},
  getReservationValue: () => null,
  setReservationItems: () => {},
});

export const CrustomerReservationProvider = ({ children }:{children:React.ReactNode}) => {
  const [ReservationMain, setReservationMain] = useState<ReservationMainProps>(initializedMain);
  const [ReservationItems, setReservationItems] = useState<Array<any>>([]);

  const setReservationValue = (key: keyof ReservationMainProps, value: string | number | null) => {
    setReservationMain((prev) => {
      if (prev) {
        return { ...prev, [key]: value };
      } else {
        return { ...initializedMain, [key]: value }
      }
    });
  };
  
  const getReservationValue = (key: keyof ReservationMainProps): any | null => {
    return ReservationMain ? ReservationMain[key] : null;
  };

  const values: ContextProps = {
    ReservationMain,
    ReservationItems,
    setReservationMain,
    setReservationValue,
    getReservationValue,
    setReservationItems,
  };

  return <CustomerReservationContext.Provider value={values}>{children}</CustomerReservationContext.Provider>;
};