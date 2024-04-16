import React, { useContext, useState } from 'react';
import { createContext } from 'react';

export interface MenuValueProps {
  cartExpand : boolean;
}

interface ContextProps {
  menuValues: MenuValueProps;
  setMenuValues: (menuValues: MenuValueProps) => void;
  getMenuValues: () => MenuValueProps;
  setMenuValue: (key: keyof MenuValueProps, value: any) => void;
  getMenuValue: (key: keyof MenuValueProps) => any | null;
}

const initializedDetail: MenuValueProps = {
  cartExpand: true,
}

export const MenuValuesContext = createContext<ContextProps>({
  menuValues: initializedDetail,
  setMenuValues: () => {},
  getMenuValues: () => initializedDetail,
  setMenuValue: () => {},
  getMenuValue: () => null,
});

export const MenuValuesProvider = ({ children }:{children:React.ReactNode}) => {
  const [menuValues, setMenuValues] = useState<MenuValueProps>(initializedDetail);

  const getMenuValues = () => {
    return menuValues;
  };

  const setMenuValue = (key: keyof MenuValueProps, value: any) => {
    setMenuValues((prevDetails) => {
      if (prevDetails) {
        return { ...prevDetails, [key]: value };
      } else {
        return { ...initializedDetail, [key]: value }
      }
    });
  };
  
  const getMenuValue = (key: keyof MenuValueProps): any | null => {
    return menuValues ? menuValues[key] : null;
  };

  const values: ContextProps = {
    menuValues,
    setMenuValues,
    getMenuValues,
    setMenuValue,
    getMenuValue,
  };

  return <MenuValuesContext.Provider value={values}>{children}</MenuValuesContext.Provider>;
};