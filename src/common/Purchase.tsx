import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import dayjs from 'dayjs';
import { LoadingButton } from '@mui/lab';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

import { API_URL } from './AppConstants';
import iconPlaceholder from '../img/icons-placeholder.png';
import { useCustomerReservation } from './Providers/CustomerReservationProvider/UseCustomerReservation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowDown, faCircleXmark, faClose } from '@fortawesome/free-solid-svg-icons';

interface Props {
  title: string;
  sx?: object;
  onComplete?: (event: any) => void;
  isLoading?:boolean;
}

const Purchase: React.FC<Props> = ({ title, sx, onComplete, isLoading }) => {

  const { ReservationItems, ReservationMain, removeReservationItem } = useCustomerReservation();

  return (
    <Box sx={{ width: '350px', paddingLeft:'30px', ...sx }}>
      <Typography variant='h4' sx={{fontSize:'32px', textAlign:'center', fontWeight:700}}>{title}</Typography>
      <Box sx={{border:'1px solid #999', backgroundColor:'#F8F8F8', margin:'24px 0 60px', borderRadius:'4px', padding:"0, 16px"}}>
        <Typography sx={{fontWeight:500, padding:'12px 16px', borderBottom:'1px solid #999'}}>{"Cart Items"}</Typography>
        {ReservationItems.length ?
          <>
            {ReservationItems.map((item: any, index: number) => {
              return (
                <Box sx={{padding:'12px 16px', borderBottom:'1px solid #999'}}>
                  <Box sx={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                    <Typography sx={{fontWeight:800,}}>{item.family}</Typography>
                    <Button onClick={()=>{removeReservationItem(index)}} ><FontAwesomeIcon icon={faCircleXmark} style={{height:'16px', color:"#4599D6"}}/></Button>
                  </Box>
                  <Box sx={{display:'flex', flexDirection:'row'}}>
                    <Typography sx={{fontWeight:600, fontSize:'14px', marginRight:'60px'}}>{`Quantity: ${item.quantity}`}</Typography>
                    <Typography sx={{fontWeight:700, fontSize:'14px', color:'#4599D6',}}>{`$50.00`}</Typography>
                  </Box>
                  <Typography variant='subtitle2' sx={{fontWeight:500}}>{"Wavier"}</Typography>
                  <Typography variant='subtitle2' sx={{fontWeight:500}}>{"Free Basket"}</Typography>
                </Box>
              )
            })}
          </>
        : <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '15px', color: '#999' }}>{"No one reserved"}</div>}
      </Box>
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
