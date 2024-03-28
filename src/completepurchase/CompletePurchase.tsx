import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';

import Purchase from '../common/Purchase';
import BasicLayout from '../common/BasicLayout';
import { useCustomStripe } from '../common/Providers/CustomStripeProvider/UseCustomStripe';
import CheckoutForm from './CheckoutForm';

const CompletePurchase: React.FC = () => {
  
  const navigate = useNavigate();
  const { amount, clientSecret, stripePromise } = useCustomStripe();

  useEffect(()=>{
    if(!amount || !clientSecret){
      navigate('/');
    }
  }, []);

  const appearanceOptions = {
    rules: {
      ".Input":{
        borderColor: "#cccccc"
      }
    },
    layout: {
      type: 'accordion',
      defaultCollapsed: true,
    }
  }

  const options = {
    clientSecret: clientSecret,
    appearance: appearanceOptions,
  };

  return (
    <BasicLayout>
      <Box sx={{ display: 'flex', flexDirection: 'row', marginTop:'50px', justifyContent:'center' }}>
        <Purchase title='Reservation Details' sx={{paddingRight:'50px'}} />
        {amount > 0 && clientSecret &&(
          <Elements stripe={stripePromise} options={options}>
            <Box sx={{ flex:1, paddingTop: '50px', padding:'50px', borderLeft:'1px solid #ccc'}}>
              <CheckoutForm/>
            </Box>
          </Elements>
        )}
      </Box>
    </BasicLayout>
  );
}

export default CompletePurchase;
