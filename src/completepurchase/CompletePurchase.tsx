import React from 'react';
import { Box, Button } from '@mui/material';
import Purchase from '../common/Purchase';
import BasicLayout from '../common/BasicLayout';
import { useStoreDetails } from '../common/Providers/StoreDetailsProvider/UseStoreDetails';
import { createReservation } from '../api/Product';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import { useSnackbar } from 'notistack';
import { useCustomStripe } from '../common/Providers/CustomStripeProvider/UseCustomStripe';
import {useStripe, useElements, PaymentElement, CardElement} from '@stripe/react-stripe-js';

const CompletePurchase: React.FC = () => {

  const { enqueueSnackbar } = useSnackbar();
  const { ReservationItems, ReservationMain } = useCustomerReservation();
  const { storeDetails } = useStoreDetails();
  const { amount, clientSecret } = useCustomStripe();

  return (
    <BasicLayout>
      <Box sx={{ display: 'flex', flexDirection: 'row', marginTop:'50px', justifyContent:'center' }}>
        <Purchase title='Reservation Details' target='/completepurchase' sx={{paddingRight:'50px'}} />
        {clientSecret &&(
          <Box sx={{ flex:1, paddingTop: '50px', padding:'50px', borderLeft:'1px solid #ccc'}}>
            <PaymentElement/>
            <Button variant="contained" sx={{ mt: '20px', float:'right'}}>{'Purchase'}</Button>
          </Box>
        )}
      </Box>
    </BasicLayout>
  );
}

export default CompletePurchase;
