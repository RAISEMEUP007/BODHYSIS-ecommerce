import React, { useState, useEffect } from 'react';
import Purchase from '../common/Purchase';
import { Box } from '@mui/material';

import BasicLayout from '../common/BasicLayout';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import { useSnackbar } from 'notistack';

import ReserveProducts from './ReserveProducts';
import { useNavigate } from 'react-router';

const Reservation: React.FC = () => {

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { ReservationItems, ReservationMain } = useCustomerReservation();

  const onComplete = (event: any) => {
    if (!ReservationMain.pickup) {
      enqueueSnackbar("Select pickup date", {
        variant: 'error',
        style: { width: '350px' },
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      })
    }else if(!ReservationMain.dropoff) {
      enqueueSnackbar("Select dropoff date", {
        variant: 'error',
        style: { width: '350px' },
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      })
    }else if(!ReservationItems.length) {
      enqueueSnackbar("Select products", {
        variant: 'error',
        style: { width: '350px' },
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      })
    }else if(!ReservationMain.prices.total) {
      enqueueSnackbar("The reservation should have a price value", {
        variant: 'error',
        style: { width: '350px' },
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      })
    }else navigate('/payment');
  }

  return (
    <BasicLayout>
      <Box sx={{display:'flex', flexDirection:'row'}}>
        <ReserveProducts sx={{flex:1}}/>
        <Purchase title='Reservation Details' sx={{borderLeft:'1px solid #999', paddingLeft:'50px'}} onComplete={onComplete}/>
      </Box>
    </BasicLayout>
  );
}

export default Reservation;