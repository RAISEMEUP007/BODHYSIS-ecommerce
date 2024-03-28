import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import dayjs from 'dayjs';
import { LoadingButton } from '@mui/lab';

import { API_URL } from './AppConstants';
import iconPlaceholder from '../img/icons-placeholder.png';
import { useCustomerReservation } from './Providers/CustomerReservationProvider/UseCustomerReservation';

interface Props {
  title: string;
  sx?: object;
  onComplete?: (event: any) => void;
  isLoading?:boolean;
}

const Purchase: React.FC<Props> = ({ title, sx, onComplete, isLoading }) => {

  const { ReservationItems, ReservationMain } = useCustomerReservation();

  console.log(ReservationMain.prices);

  return (
    <Box sx={{ width: '500px', ...sx }}>
      <Typography sx={{ fontWeight: '900', mb: '30px', textAlign: 'center' }}>{title}</Typography>
      {ReservationItems.length ?
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {ReservationItems.map((item: any, index: number) => {
            return (
              <img
                key={index}
                src={item && item.img_url ? `${API_URL}${item.img_url}` : iconPlaceholder}
                alt={item.img_url}
                style={{ width: '43%', padding: '2%', marginLeft: '', marginBottom: '6%', boxShadow: '2px 2px 4px #999' }} />
            )
          })}
        </Box>
        : <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '15px', color: '#999' }}>{"No one reserved"}</div>}
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: 14, }}>
          {ReservationMain.pickup ? dayjs(ReservationMain.pickup).format('MMMM DD, YYYY') : 'n/a'} - {ReservationMain.dropoff ? dayjs(ReservationMain.dropoff).format('MMMM DD, YYYY') : 'n/a'}
        </Typography>
      </Box>
      <Box sx={{ mt: "80px", mb: '20px' }}>
        <Box sx={styles.purchase}>
          <div>{"Subtotal"}</div>
          <div>{ReservationMain.prices.subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
        </Box>
        <Box sx={styles.purchase}>
          <div>{"Tax(8.1%)"}</div>
          <div>{ReservationMain.prices.tax.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
        </Box>
        <Box sx={styles.purchase}>
          <div>{"Total"}</div>
          <div>{ReservationMain.prices.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
        </Box>
      </Box>
      {onComplete && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '40px' }}>
          <LoadingButton
            variant="contained"
            sx={{ pr: 6, pl: 6 }}
            loading={isLoading}
            onClick={onComplete}
          >
            {"Complete Purchase"}
          </LoadingButton>
        </Box>
      )}
    </Box>
  );
}

const styles = {
  purchase: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  }
}

export default Purchase;
