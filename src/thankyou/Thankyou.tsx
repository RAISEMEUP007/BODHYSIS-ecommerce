import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import BasicLayout from '../common/BasicLayout';
import { useNavigate } from 'react-router';
import { addLastPaymentMethosToCustomer, sendReservationConfirmationEmail } from '../api/Stripe';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';

const Thankyou: React.FC = () => {

  const navigate = useNavigate();
  const { initReservation } = useCustomerReservation();

  const name = localStorage.getItem('full-name');
  const id = localStorage.getItem('_r_id');
  const order_number = localStorage.getItem('_r_order_number');
  const email = localStorage.getItem('_r_email');
  const phone_number = localStorage.getItem('_r_phone');
  const pickup = localStorage.getItem('_r_pickup');
  const dropoff = localStorage.getItem('_r_dropoff');
  const store_logo_path = localStorage.getItem('_r_logo_url');
  const store_name = localStorage.getItem('_r_store_name');

  useEffect(()=>{
    initReservation();

    if(!pickup || !dropoff){
      navigate('/reservation');
    }

    const sendMail = setTimeout(()=>{
      const mailParams = { 
        id,
        name, 
        email,
        phone_number: phone_number,
        // store_logo_path: "https://api.bodhisys.io/uploads/img_1711075052760_Bikes To Go Logo.jpg",
        store_logo_path: store_logo_path,
        store_name: store_name,
        start_time: pickup,
        end_time: dropoff,
      }
      sendReservationConfirmationEmail(mailParams);
    }, 100);
    
    return () =>{
      clearTimeout(sendMail);
    }
  }, [])
  
  setTimeout(()=>{
    localStorage.removeItem('_r_id');
    localStorage.removeItem('_r_order_number');
    localStorage.removeItem('_r_name');
    localStorage.removeItem('_r_email');
    localStorage.removeItem('_r_pickup');
    localStorage.removeItem('_r_dropoff');
    localStorage.removeItem('_r_logo_url');
    localStorage.removeItem('_r_store_name');
  }, 5000);

  useEffect(()=>{
    const accessToken = localStorage.getItem('access-token');
    if(!accessToken) navigate('/');
  }, []);

  return (
    <BasicLayout>
      <Box sx={{ p:'50px'}}>
        <Typography variant="h5">{"Thank you for your reservation"}</Typography>
        <Box sx={{ mt:'30px', mb:'30px'}}>
          <Typography >{`Your reservation(${order_number}) has been confirmed for`}</Typography>
          <Typography variant="subtitle2">
            {`${pickup} - ${dropoff} `}
          </Typography>
        </Box>
        <Typography>{"You will receive an email and text message with information on your sheduled delivery and lock information."}</Typography>
      </Box>
    </BasicLayout>
  );
}

export default Thankyou;
