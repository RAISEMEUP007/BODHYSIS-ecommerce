import React, { useContext, useState } from 'react';
import { createContext } from 'react';

export interface CustomerInfoProps {
  cartExpand : boolean;
}

interface ContextProps {
  customerInfos: CustomerInfoProps;
  setCustomerInfos: (customerInfos: CustomerInfoProps) => void;
  getCustomerInfos: () => CustomerInfoProps;
  setCustomerInfo: (key: keyof CustomerInfoProps, value: any) => void;
  getCustomerInfo: (key: keyof CustomerInfoProps) => any | null;
}

const initializedDetail: CustomerInfoProps = {
  cartExpand: true,
}

export const CustomerInfosContext = createContext<ContextProps>({
  customerInfos: initializedDetail,
  setCustomerInfos: () => {},
  getCustomerInfos: () => initializedDetail,
  setCustomerInfo: () => {},
  getCustomerInfo: () => null,
});

export const CustomerInfosProvider = ({ children }:{children:React.ReactNode}) => {
  const [customerInfos, setCustomerInfos] = useState<CustomerInfoProps>(initializedDetail);

  const getCustomerInfos = () => {
    return customerInfos;
  };

  const setCustomerInfo = (key: keyof CustomerInfoProps, value: any) => {
    setCustomerInfos((prevDetails) => {
      if (prevDetails) {
        return { ...prevDetails, [key]: value };
      } else {
        return { ...initializedDetail, [key]: value }
      }
    });
  };
  
  const getCustomerInfo = (key: keyof CustomerInfoProps): any | null => {
    return customerInfos ? customerInfos[key] : null;
  };

  const values: ContextProps = {
    customerInfos,
    setCustomerInfos,
    getCustomerInfos,
    setCustomerInfo,
    getCustomerInfo,
  };

  return <CustomerInfosContext.Provider value={values}>{children}</CustomerInfosContext.Provider>;
};