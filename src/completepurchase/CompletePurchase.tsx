import React, { useEffect } from 'react';
import { Box, Button } from '@mui/material';
import Purchase from '../common/Purchase';
import BasicLayout from '../common/BasicLayout';
import { useCustomStripe } from '../common/Providers/CustomStripeProvider/UseCustomStripe';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from './CheckoutForm';

const CompletePurchase: React.FC = () => {
  
  const navigate = useNavigate();
  const { amount, clientSecret } = useCustomStripe();

  useEffect(()=>{
    if(!amount || !clientSecret){
      navigate('/');
    }
  }, []);

  return (
    <BasicLayout>
      <Box sx={{ display: 'flex', flexDirection: 'row', marginTop:'50px', justifyContent:'center' }}>
        <Purchase title='Reservation Details' sx={{paddingRight:'50px'}} />
        {amount > 0 && clientSecret &&(
          <Box sx={{ flex:1, paddingTop: '50px', padding:'50px', borderLeft:'1px solid #ccc'}}>
            <CheckoutForm/>
          </Box>
        )}
      </Box>
    </BasicLayout>
  );
}

export default CompletePurchase;
