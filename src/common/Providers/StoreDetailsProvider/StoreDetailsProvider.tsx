import React, { useState } from 'react';
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
  store_wavier: any;
  document_id: number | null;
  is_document: boolean | null;
  pickup_time: string;
  dropoff_time: string;
  cut_off_time: string;
}

interface ContextProps {
  storeDetails: StoreDetailProps;
  setStoreDetails: (storeDetails: StoreDetailProps) => void;
  getStoreDetails: () => StoreDetailProps;
  setStoreValue: (key: keyof StoreDetailProps, value: any) => void;
  getStoreValue: (key: keyof StoreDetailProps) => any | null;
  discounts: any[];
  setDiscounts: (discounts: any[]) => void;
  priceLogicData: any[];
  setPriceLogicData: (data: any[]) => void;
}

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
  store_wavier: '',
  document_id: null,
  is_document: null,
  pickup_time: '8:00 AM',
  dropoff_time: '10:00 AM',
  cut_off_time: '11:59 PM',
}

export const StoreDetailsContext = createContext<ContextProps>({
  storeDetails: initializedDetail,
  setStoreDetails: () => {},
  getStoreDetails: () => initializedDetail,
  setStoreValue: () => {},
  getStoreValue: () => null,
  discounts: [],
  setDiscounts: () => {},
  priceLogicData: [],
  setPriceLogicData: () => {},
});

export const StoreDetailsProvider = ({ children }:{children:React.ReactNode}) => {
  const [storeDetails, setStoreDetails] = useState<StoreDetailProps>(initializedDetail);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [priceLogicData, setPriceLogicData] = useState<Array<any>>([]);

  const getStoreDetails = () => {
    return storeDetails;
  };

  const setStoreValue = (key: keyof StoreDetailProps, value: string | number | null) => {
    setStoreDetails((prevDetails) => {
      if (prevDetails) {
        return { ...prevDetails, [key]: value };
      } else {
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
    discounts,
    setDiscounts,
    priceLogicData,
    setPriceLogicData,
  };

  return <StoreDetailsContext.Provider value={values}>{children}</StoreDetailsContext.Provider>;
};