import React, { useState, useEffect } from 'react';
import BasicLayout from '../common/BasicLayout';
import ReserveProducts from './ReserveProducts';
import Purchase from '../common/Purchase';
import { Box } from '@mui/material';

const Reservation: React.FC = () => {
  return (
    <BasicLayout>
      <Box sx={{display:'flex', flexDirection:'row'}}>
        <ReserveProducts sx={{flex:1}}/>
        <Purchase title='Reservation Details' sx={{borderLeft:'1px solid #999', paddingLeft:'50px'}}/>
      </Box>
    </BasicLayout>
  );
}

export default Reservation;