import React, { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import BasicLayout from '../common/BasicLayout';

const Thankyou: React.FC = () => {

  const pickup = localStorage.getItem('pickup');
  const dropoff = localStorage.getItem('dropoff');

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
