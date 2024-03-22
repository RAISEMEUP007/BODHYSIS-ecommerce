import React, { useContext, useState } from 'react';
import { createContext } from 'react';

export interface StoreDetailProps {
  id : number;
  brand_id : number;
  store_name : string;
  language_id : string;
  logo_url : string;
  address_line1 : string;
  address_line2 : string;
  city : string;
  state : string;
  postal_code : string;
  latitude : number | null;
  longitude : number | null;
  phone_number : string;
  sales_tax : number | null;
}

interface ContextProps {
  storeDetails: StoreDetailProps | null;
  setStoreDetails: (storeDetails: StoreDetailProps) => void;
  getStoreDetails: () => StoreDetailProps | null;
  setStoreValue: (key: keyof StoreDetailProps, value: any) => void;
  getStoreValue: (key: keyof StoreDetailProps) => any | null;
}

export const StoreDetailsContext = createContext<ContextProps>({
  storeDetails: null,
  setStoreDetails: () => {},
  getStoreDetails: () => null,
  setStoreValue: () => {},
  getStoreValue: () => null,
});

export const StoreDetailsProvider = ({ children }:{children:React.ReactNode}) => {
  const [storeDetails, setStoreDetails] = useState<StoreDetailProps | null>(null);

  const getStoreDetails = () => {
    return storeDetails || null;
  };

  const setStoreValue = (key: keyof StoreDetailProps, value: string | number | null) => {
    setStoreDetails((prevDetails) => {
      if (prevDetails) {
        return { ...prevDetails, [key]: value };
      } else {
        const initializedDetail: StoreDetailProps = {
          id: 0,
          brand_id: 0,
          store_name: "",
          language_id: "",
          logo_url: "",
          address_line1: "",
          address_line2: "",
          city: "",
          state: "",
          postal_code: "",
          latitude: null,
          longitude: null,
          phone_number: "",
          sales_tax: null,
        }
        return { ...initializedDetail, [key]: value }
      }
    });
  };
  
  const getStoreValue = (key: keyof StoreDetailProps): any | null => {
    return storeDetails ? storeDetails[key] : null;
  };

  const values: ContextProps = {
    storeDetails,
    setStoreDetails,
    getStoreDetails,
    setStoreValue,
    getStoreValue,
  };

  return <StoreDetailsContext.Provider value={values}>{children}</StoreDetailsContext.Provider>;
};