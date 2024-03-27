import React, { createContext, useContext } from 'react';
import { SnackbarProvider, useSnackbar, SnackbarKey } from 'notistack';

interface ContextProps {
  snackbarWithStyle(content: React.ReactNode, variant: 'default' | 'error' | 'success' | 'warning' | 'info'): void;
}

const SnackbarContext = createContext<ContextProps | undefined>(undefined);

export const useCustomSnackbar = (): ContextProps => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useCustomSnackbar must be used within a CustomSnackbarProvider');
  }
  return context;
};

export const CustomSnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  const snackbarWithStyle = (content: React.ReactNode, variant: 'default' | 'error' | 'success' | 'warning' | 'info'): void => {
    // console.log("snackbarWithStyle content and variant", content, variant)
    enqueueSnackbar(content, {variant: variant});
    // enqueueSnackbar(content, {
    //   variant: variant,
    //   style: { width: '350px' },
    //   autoHideDuration: 3000,
    //   anchorOrigin: { vertical: 'top', horizontal: 'right' },
    // });
  };

  return (
    <SnackbarProvider maxSnack={5}>
      <SnackbarContext.Provider value={{ snackbarWithStyle }}>
        {children}
      </SnackbarContext.Provider>
    </SnackbarProvider>
  );
};

export default CustomSnackbarProvider;