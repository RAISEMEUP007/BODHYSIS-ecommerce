import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { Box } from '@mui/material';

import { getClientSecret } from '../api/Stripe';
import Purchase from '../common/Purchase';
import BasicLayout from '../common/BasicLayout';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import { useCustomStripe } from '../common/Providers/CustomStripeProvider/UseCustomStripe';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';

import ReservationMainDetail from './ReservationMainDetail';

const Payment: React.FC = () => {

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { ReservationItems, ReservationMain, setReservationValue } = useCustomerReservation();
  const { setClientSecret, setAmount } = useCustomStripe();
  const [ isLoading, setIsLoading ] = useState(false);
  const { matches900 } = useResponsiveValues();

  useEffect(()=>{
    if(!ReservationMain.pickup || !ReservationMain.dropoff || !ReservationItems.length || !ReservationMain.prices.total){
      navigate('/reservation');
    }
    if(!ReservationMain.email && localStorage.getItem('customer_email')) setReservationValue('email', localStorage.getItem('customer_email'));
    if(!ReservationMain.phone_number && localStorage.getItem('customer_phone_number')) setReservationValue('phone_number', localStorage.getItem('customer_phone_number'));
  }, []);

  const onComplete = (event: any) => {
    if(!ReservationMain.pickup || !ReservationMain.dropoff || !ReservationItems.length || !ReservationMain.prices.total) {
      event.preventDefault();
      return;
    }

    setAmount(ReservationMain.prices.total);

    event.preventDefault();

    const payload:any = {
      ...ReservationMain,
      amount : Math.round(ReservationMain.prices.total * 100),
    }

    if (!ReservationMain.email) {
      enqueueSnackbar("Please provide email", {
        variant: 'error',
        style: { width: '350px' },
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      })
      return;
    }else if(!ReservationMain.phone_number) {
      enqueueSnackbar("Please provide phone number", {
        variant: 'error',
        style: { width: '350px' },
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      })
      return;
    }else if(!ReservationMain.is_accept) {
      enqueueSnackbar("Please accept the terms and policy", {
        variant: 'error',
        style: { width: '350px' },
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      })
      return;
    }

    setIsLoading(true);
    getClientSecret(payload, (jsonRes:any, status:any, error:any)=>{
      if(status == 200){
        setClientSecret(jsonRes.client_secret);
        navigate("/completepurchase");
      }else{
        const errorMessage = jsonRes?.raw?.message??"Error occured on the server.";
        enqueueSnackbar(errorMessage, {
          variant: 'error',
          style: { width: '350px' },
          autoHideDuration: 3000,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        })
      }
      setIsLoading(false);
    });
  }

  useEffect(()=>{
    const accessToken = localStorage.getItem('access-token');
    if(!accessToken) navigate('/');
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  const renderReview = () => (
    <BasicLayout>
      <Box sx={styles.container}>
        <ReservationMainDetail sx={styles.ReservationMainDetail}/>
        <Purchase 
          title='Order Summary'
          buttonTitle="Complete Purchase"
          onComplete={onComplete}
          isLoading={isLoading}
        />
      </Box>
    </BasicLayout>
  );

  const styles ={
    container: {
      display:'flex', 
      flexDirection: matches900? 'row': 'column',
    },
    ReservationMainDetail: {
      flex:1, 
      p:matches900?'60px 40px':'30px 24px',
      overflow: 'auto',
    },
  }

  return renderReview();
}

export default Payment;
