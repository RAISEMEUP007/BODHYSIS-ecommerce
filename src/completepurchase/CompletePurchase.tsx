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

  useEffect(()=>{
    const accessToken = localStorage.getItem('access-token');
    if(!accessToken) navigate('/');
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

  console.log(amount);
  console.log(clientSecret);
  return (
    <BasicLayout>
      <Box sx={{ display: 'flex', flexDirection: 'row', }}>
        {amount > 0 && clientSecret &&(
          <Elements stripe={stripePromise} options={options}>
            <Box 
              sx={{ 
                display: 'flex',
                flex:1, 
                padding:'50px', 
                paddingTop: '100px', 
                borderLeft:'1px solid #ccc',
                // alignItems:'center',
                justifyContent:'center',
              }}>
              <Box sx={{width:'100%', maxWidth:'900px'}}>
                <CheckoutForm/>
              </Box>
            </Box>
          </Elements>
        )}
        <Purchase 
          title='Reservation Details' 
          buttonTitle="Complete Purchase"
        />
      </Box>
    </BasicLayout>
  );
}

export default CompletePurchase;
