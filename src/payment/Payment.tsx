import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import ReservationMainDetail from './ReservationMainDetail';
import Purchase from '../common/Purchase';
import BasicLayout from '../common/BasicLayout';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import { useCustomStripe } from '../common/Providers/CustomStripeProvider/UseCustomStripe';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { getClientSecret } from '../api/Stripe';

const Payment: React.FC = () => {

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { ReservationItems, ReservationMain } = useCustomerReservation();
  const { setClientSecret, setAmount } = useCustomStripe();

  useEffect(()=>{
    if(!ReservationMain.pickup || !ReservationMain.dropoff || !ReservationItems.length || !ReservationMain.prices.total){
      navigate('/');
    }
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

    getClientSecret(payload, (jsonRes:any, status:any, error:any)=>{
      console.log(jsonRes);
      console.log(status);
      console.log(error);
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
    });
  }

  return (
    <BasicLayout>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <ReservationMainDetail sx={{flex:1, pr: '50px'}}/>
        <Purchase title='Reservation Details' sx={{borderLeft:'1px solid #999', paddingLeft:'50px'}} onComplete={onComplete} />
      </Box>
    </BasicLayout>
  );
}

export default Payment;
