import React, { useEffect } from 'react';
import Purchase from '../common/Purchase';
import { Box } from '@mui/material';
import { useSnackbar } from 'notistack';

import BasicLayout from '../common/BasicLayout';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';

import ReserveProducts from './ReserveProducts';
import { useNavigate } from 'react-router';

const Reservation: React.FC = () => {

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { ReservationItems, ReservationMain } = useCustomerReservation();
  const { matches600 } = useResponsiveValues();

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
    }else navigate('/review');
  }

  useEffect(()=>{
    const accessToken = localStorage.getItem('access-token');
    if(!accessToken) navigate('/');
  }, []);

  return (
    <BasicLayout>
      <Box sx={{display:'flex', flexDirection:'row',}}>
        <ReserveProducts sx={{flex:1, p:'60px 40px'}}/>
        <Purchase
          title='Order Details'
          buttonTitle="Review & Pay"
          sx={{p:'40px', backgroundColor:'#F0F0F0', minHeight:'calc(100vh - 210px)'}}
          onComplete={onComplete}
          isShowItems={true}
          isRemovalItems={true}
        />
      </Box>
    </BasicLayout>
  );
}

export default Reservation;