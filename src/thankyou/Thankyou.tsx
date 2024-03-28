import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import BasicLayout from '../common/BasicLayout';
import { useNavigate } from 'react-router';
import { sendReservationConfirmationEmail } from '../api/Stripe';

const Thankyou: React.FC = () => {

  const navigate = useNavigate();

  const name = localStorage.getItem('_r_name');
  const email = localStorage.getItem('_r_email');
  const pickup = localStorage.getItem('_r_pickup');
  const dropoff = localStorage.getItem('_r_dropoff');

  useEffect(()=>{
    if(!pickup || !dropoff){
      navigate('/');
    }

    const sendMail = setTimeout(()=>{
      const mailParams = { name, email }
      sendReservationConfirmationEmail(mailParams);
    }, 100);
    
    return () =>{
      clearTimeout(sendMail);
    }
  }, [])
  
  setTimeout(()=>{
    localStorage.removeItem('_r_name');
    localStorage.removeItem('_r_email');
    localStorage.removeItem('_r_pickup');
    localStorage.removeItem('_r_dropoff');
  }, 1000);

  return (
    <BasicLayout>
      <Box sx={{ mt:'50px'}}>
        <Typography variant="h5">{"Thank you for your reservation"}</Typography>
        <Box sx={{ mt:'30px', mb:'30px'}}>
          <Typography >{"Your reservation has been confirmed for"}</Typography>
          <Typography variant="subtitle2">
            {`${pickup} - ${dropoff}`}
          </Typography>
        </Box>
        <Typography>{"You will receive an email and text message with informatio on your sheduled delivery and lock information."}</Typography>
      </Box>
    </BasicLayout>
  );
}

export default Thankyou;
