import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import dayjs from 'dayjs';
import { LoadingButton } from '@mui/lab';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

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

  return (
    <Box sx={{ width: '350px', paddingLeft:'30px', ...sx }}>
      <Typography variant='h4' sx={{fontSize:'32px', textAlign:'center', fontWeight:700}}>{title}</Typography>
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
      <Typography variant={"body1"}><b>{"Reservation Timing"}</b></Typography>
      <Box sx={{m:"10px 0px"}}>
        <Typography variant={"body1"} sx={{fontSize:'18px'}}>
          <b>{ReservationMain.pickup ? dayjs(ReservationMain.pickup).format('MMMM DD, YYYY') : 'n/a'} &nbsp;-&nbsp; {ReservationMain.dropoff ? dayjs(ReservationMain.dropoff).format('MMMM DD, YYYY') : 'n/a'}</b>
        </Typography>
      </Box>
      <Alert severity="warning" icon={<ErrorOutlineOutlinedIcon fontSize='inherit'/>} style={{color:'black', border:'1px solid #F9C02F'}}>
        {`Your reservation `}
        <b style={{fontSize:'1.1em', fontWeight:'800'}}>ends</b>
        {` at `}
        <b style={{fontSize:'1.1em', fontWeight:'800'}}>8:30 am</b>
        {` on `}
        <b style={{fontSize:'1.1em', fontWeight:'800'}}>{ReservationMain.dropoff ? dayjs(ReservationMain.dropoff).format('MMMM DD, YYYY') : 'n/a'}</b>
      </Alert>
      <Box sx={{ mt:'30px', mb: '20px' }}>
        <Box sx={styles.purchase}>
          <div>{"Subtotal"}</div>
          <div>{ReservationMain.prices.subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
        </Box>
        <Box sx={styles.purchase}>
          <div>{"Tax(8.1%)"}</div>
          <div>{ReservationMain.prices.tax.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
        </Box>
        <Box sx={[styles.purchase, {borderTop:'1px solid black', marginTop:'16px', paddingTop:'16px'}]}>
          <div><b>{"Total"}</b></div>
          <div><b>{ReservationMain.prices.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</b></div>
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
            {"Review & Pay"}
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
