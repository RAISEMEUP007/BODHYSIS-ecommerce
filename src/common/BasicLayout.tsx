import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useStoreDetails } from './Providers/UseStoreDetails';
import { API_URL } from './AppConstants';

interface Props {
  children: React.ReactNode;
  sx?: object;
}

const BasicLayout: React.FC<Props> = ({ children, sx }) => {
  const { storeDetails }:{storeDetails:any} = useStoreDetails();
  
  return (
    <Box sx={{ padding: '30px 50px', ...sx}}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
        <img src={API_URL + storeDetails?.logo_url} alt="iconImage" height={75} />
        <p style={{ textTransform: 'uppercase', fontWeight: 'bold', marginLeft:'10px' }}>{storeDetails?.store_name}</p>
      </Box>
      {children}
    </Box>
  );
}

export default BasicLayout;
