import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';

import Purchase from '../common/Purchase';
import BasicLayout from '../common/BasicLayout';
import { useCustomStripe } from '../common/Providers/CustomStripeProvider/UseCustomStripe';
import CheckoutForm from './CheckoutForm';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';

const CompletePurchase: React.FC = () => {
  
  const navigate = useNavigate();
  const { amount, clientSecret, stripePromise } = useCustomStripe();
  const { matches900 } = useResponsiveValues();

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
    clientSecret: clientSecret?.client_secret??'',
    appearance: appearanceOptions,
  };

  const renderCompletePurchase = () => (
    <BasicLayout>
      <Box sx={styles.container}>
        {amount > 0 && clientSecret &&(
          <Elements stripe={stripePromise} options={options}>
            <Box 
              sx={{ 
                display: 'flex',
                flex:1, 
                padding:'50px', 
                paddingTop: '50px', 
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
          isDisableDriverTip={true}
          isDisableDiscount={true}
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

  return renderCompletePurchase();
}

export default CompletePurchase;
