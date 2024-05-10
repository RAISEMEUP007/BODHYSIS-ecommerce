import React, { useEffect, useState } from 'react';
import { createContext } from 'react';

export interface ReservationMainProps {
  pickup: Date;
  dropoff: Date;
  prices: {
    subtotal: number;
    tax: number;
    total: number;
  },
  price_table_id: number | null;
  headerData: Array<any>;
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
  address_id: number | null,
  selectedAddress: any,
  use_manual: boolean;
  manual_address: string,
  driver_tip: number,
}

interface ContextProps {
  ReservationMain: ReservationMainProps;
  ReservationItems: Array<any>;
  setReservationMain: (ReservationMain: ReservationMainProps) => void;
  setReservationValue: (key: keyof ReservationMainProps, value: any) => void;
  getReservationValue: (key: keyof ReservationMainProps) => any | null;
  setReservationItems: (ReservationItems: Array<any>) => void;
  addReservationItem: (item: any) => void;
  removeReservationItem: (index: number) => void;
  initReservation: () => void;
}

const initializedMain: ReservationMainProps = {
  pickup: new Date(),
  dropoff: new Date(new Date().getTime() + 86400000),
  prices: {
    subtotal: 0,
    tax: 0,
    total: 0,
  },
  price_table_id: null,
  headerData: [],
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
  address_id: null,
  selectedAddress: null,
  use_manual: false,
  manual_address: "",
  driver_tip: 0.00,
}

export const CustomerReservationContext = createContext<ContextProps>({
  ReservationMain: initializedMain,
  ReservationItems: [],
  setReservationMain: () => {},
  setReservationValue: () => {},
  getReservationValue: () => null,
  setReservationItems: () => {},
  addReservationItem: () => {},
  removeReservationItem: () => {},
  initReservation: () => {},
});

export const CustomerReservationProvider = ({ children }:{children:React.ReactNode}) => {
  const [ReservationMain, setReservationMain] = useState<ReservationMainProps>(initializedMain);
  const [ReservationItems, setReservationItems] = useState<Array<any>>([]);

  const setReservationValue = (key: keyof ReservationMainProps, value: any) => {
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

  // useEffect(() => {
  //   setReservationMain((prev) => {
  //     const today = new Date();
  //     const defaultPickup = prev.pickup === null ? today : prev.pickup;
  //     return {
  //       ...prev,
  //       pickup: defaultPickup,
  //       dropoff: prev.dropoff === null ? new Date(today.getTime() + 86400000) : prev.dropoff, // 86400000 milliseconds = 1 day
  //     };
  //   });
  // }, []);

  const values: ContextProps = {
    ReservationMain,
    ReservationItems,
    setReservationMain,
    setReservationValue,
    getReservationValue,
    setReservationItems,
    addReservationItem: (item) => {
      setReservationItems((prevItems) => [...prevItems, item]);
    },
    removeReservationItem: (index) => {
      setReservationItems((prevItems) => {
        const newItems = [...prevItems];
        newItems.splice(index, 1);
        return newItems;
      });
    },
    initReservation: () => {
      setReservationMain(initializedMain);
      setReservationItems([]);
    },
  };

  return <CustomerReservationContext.Provider value={values}>{children}</CustomerReservationContext.Provider>;
};