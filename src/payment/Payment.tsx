import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { Box } from '@mui/material';
import dayjs from 'dayjs';

import { getClientSecret } from '../api/Stripe';
import { createReservation } from '../api/Product';
import { API_URL } from '../common/AppConstants';
import { useStoreDetails } from '../common/Providers/StoreDetailsProvider/UseStoreDetails';
import Purchase from '../common/Purchase';
import BasicLayout from '../common/BasicLayout';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import { useCustomStripe } from '../common/Providers/CustomStripeProvider/UseCustomStripe';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';
import { formatDateString } from '../common/Utils';

import ReservationMainDetail from './ReservationMainDetail';

const Payment: React.FC = () => {

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { storeDetails } = useStoreDetails();
  const { ReservationItems, ReservationMain, setReservationValue } = useCustomerReservation();
  const { setClientSecret, setAmount } = useCustomStripe();
  const [ isLoading, setIsLoading ] = useState(false);
  const { matches900 } = useResponsiveValues();

  useEffect(()=>{
    if(!ReservationMain.pickup || !ReservationMain.dropoff || !ReservationItems.length){
      navigate('/reservation');
    }
    if(!ReservationMain.email && localStorage.getItem('customer_email')) setReservationValue('email', localStorage.getItem('customer_email'));
    if(!ReservationMain.phone_number && localStorage.getItem('customer_phone_number')) setReservationValue('phone_number', localStorage.getItem('customer_phone_number'));
  }, []);

  const onComplete = (event: any) => {
    if(!ReservationMain.pickup || !ReservationMain.dropoff || !ReservationItems.length) {
      event.preventDefault();
      return;
    }

    setAmount(ReservationMain.prices.total);

    event.preventDefault();

    const payload:any = {
      ...ReservationMain,
      amount : Math.round(ReservationMain.prices.total * 100),
      store_name : storeDetails.store_name,
      customerId : localStorage.getItem('customerId'),
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
    }else if(!ReservationMain.address_id && !ReservationMain.manual_address) {
      enqueueSnackbar("The reservation should have a delivery address", {
        variant: 'error',
        style: { width: '350px' },
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      })
      return;
    }

    setIsLoading(true);
    if(payload.amount == 0 && ReservationMain.discount_code && ReservationMain.discount_rate){
      proceedFreeReservation();
    }else {
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
  }

  const proceedFreeReservation = async () => {
    if(!ReservationMain.pickup) return;
    
    const forSavingOnDB = {
      brand_id : storeDetails.brand_id,
      start_date : formatDateString(ReservationMain.pickup),
      end_date : ReservationMain.dropoff? formatDateString(ReservationMain.dropoff): '',
      subtotal : ReservationMain.prices.subtotal,
      tax_rate : storeDetails.sales_tax,
      tax_amount : ReservationMain.prices.tax,
      discount_amount : ReservationMain.prices.discount,
      total_price: 0,
      price_table_id: ReservationMain.price_table_id,
      stage : 2,
      address_id : ReservationMain.address_id,
      use_manual : ReservationMain.use_manual,
      manual_address : ReservationMain.manual_address,
      email : ReservationMain.email,
      phone_number : ReservationMain.phone_number,
      driver_tip: ReservationMain.driver_tip,
      customer_id : localStorage.getItem('customerId'),
      items : ReservationItems,
      discount_code: ReservationMain.discount_code,
      promo_code: ReservationMain.promo_code,
    };

    const createdReservation:any = await createReservation(forSavingOnDB);
    const newReservationData = await createdReservation.clone().json();
    if(!newReservationData) {
      enqueueSnackbar(`Reservation failed!`, {
        variant: 'error',
        style: { width: '350px' },
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      })
      return;
    }

    localStorage.setItem('_r_id', newReservationData.reservation.id.toString());
    localStorage.setItem('_r_order_number', newReservationData.reservation.order_number.toString());
    localStorage.setItem('_r_name', ReservationMain.name);
    localStorage.setItem('_r_email', ReservationMain.email);
    localStorage.setItem('_r_phone', ReservationMain.phone_number);
    localStorage.setItem('_r_pickup', dayjs(ReservationMain.pickup).format('MMMM DD, YYYY') + ' ' + storeDetails.pickup_time);
    localStorage.setItem('_r_dropoff', dayjs(ReservationMain.dropoff).format('MMMM DD, YYYY') + ' ' + storeDetails.dropoff_time);
    localStorage.setItem('_r_logo_url', encodeURI(API_URL + storeDetails.logo_url));
    localStorage.setItem('_r_store_name', storeDetails.store_name);

    navigate("/thankyou");
    setIsLoading(false);
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
