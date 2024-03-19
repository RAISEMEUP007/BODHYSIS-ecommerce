import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { API_URL } from './AppConstants';
import dayjs from 'dayjs';

interface props {
  title: string;
  sx: object;
  reservedProducts: any;
  pickup: any;
  dropoff: any;
}

const Purchase: React.FC<props> = ({ sx, title, reservedProducts, pickup, dropoff }) => {
  let displayPickup = dayjs(pickup).format('MMMM DD, YYYY hh:mm A');
  let displayDropoff = dayjs(dropoff).format('MMMM DD, YYYY hh:mm A');

  return (
    <Box sx={sx}>
      <Typography sx={{ fontWeight: '900', mb: '30px', textAlign: 'center' }}>{title}</Typography>
      {
        reservedProducts.length
          ?
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {
              reservedProducts.map((product: any) => {
                return (
                  <img src={API_URL + product.img_url} alt="reservedProduct" style={{ width: '150px', padding: '15px' }} />
                )
              })
            }
          </Box>
          :
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '15px', color:'#999' }}>No one reserved</div>
      }

      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: 14, }}>{displayPickup !== "Invalid Date" ? displayPickup : 'n/a'} - {displayDropoff !== "Invalid Date" ? displayDropoff : 'n/a'}</Typography>
      </Box>

      <Box sx={{ mt: "100px", mb: '20px' }}>
        <Box className="purchase">
          <p>Subtotal</p>
          <p>0.00</p>
        </Box>
        <Box className="purchase">
          <p>Tax(8.1%)</p>
          <p>0.00</p>
        </Box>
        <Box className="purchase">
          <p>Total</p>
          <p>0.00</p>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" sx={{ pr: 6, pl: 6 }} component={Link} to="/payment">
          Complete Purchase
        </Button>
      </Box>
    </Box>
  );
}

export default Purchase;
