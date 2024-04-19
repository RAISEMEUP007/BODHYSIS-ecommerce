import React, { useContext, useState } from 'react';
import { createContext } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

interface ContextProps {
  matches600 : boolean;
  matches900 : boolean;
}

export const ResponsiveValuesContext = createContext<ContextProps>({
  matches600: true,
  matches900: true,
});

export const ResponsiveValuesProvider = ({ children }:{children:React.ReactNode}) => {

  const values: ContextProps = {
    matches600 : useMediaQuery('(min-width:900px)'),
    matches900 : useMediaQuery('(min-width:900px)')
  };

  return <ResponsiveValuesContext.Provider value={values}>{children}</ResponsiveValuesContext.Provider>;
};