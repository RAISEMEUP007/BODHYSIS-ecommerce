import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import BasicLayout from '../common/BasicLayout';
import { useNavigate } from 'react-router';
import { sendReservationConfirmationEmail } from '../api/Stripe';
import { useStoreDetails } from '../common/Providers/StoreDetailsProvider/UseStoreDetails';

const Temp: React.FC = () => {
  const { storeDetails } = useStoreDetails();
  console.log(storeDetails);

  useEffect(()=>{
    const sendMail = setTimeout(()=>{
      const mailParams = { 
        name:"name", 
        email:"anttolion@gmail.com",
        phone_number: "+17038798118",
        // store_logo_path: "https://api.bodhisys.io/uploads/img_1711075052760_Bikes%20To%20Go%20Logo.jpg",
        store_logo_path: encodeURI("https://api.bodhisys.io" + storeDetails.logo_url),
        store_name: "store_name",
        start_time: "pickup",
        end_time: "dropoff",
      }
      console.log(mailParams);
      // sendReservationConfirmationEmail(mailParams);
    }, 100);
    
    return () =>{
      clearTimeout(sendMail);
    }
  }, [storeDetails])

  return (
    <BasicLayout>
      <Box sx={{ p:'50px'}}>
        <Typography variant="h5">{"Temp"}</Typography>
      </Box>
    </BasicLayout>
  );
}

export default Temp;
