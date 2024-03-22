import React, { useMemo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { API_URL } from './AppConstants';
import dayjs from 'dayjs';
import { useStoreDetails } from './Providers/UseStoreDetails';
import iconPlaceholder from '../img/icons-placeholder.png';

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

  const { getStoreDetails } = useStoreDetails();
  const storeDetails:any = useMemo(()=>{
    return getStoreDetails();
  }, []);

  const prices = useMemo<any>(()=>{
    let prices = {
      subtotal: 0,
      tax: 0,
      total: 0,
    }
    reservedProducts.map((item:any)=>{
      let subtotal = item.price || 0;
      let tax = (item.price || 0) * (storeDetails.sales_tax/100 || 0) ?? 0;
      let total = subtotal - tax;
      prices.subtotal += subtotal;
      prices.tax += tax;
      prices.total += total;
    });
    return prices
  }, [reservedProducts]);

  return (
    <Box sx={sx}>
      <Typography sx={{ fontWeight: '900', mb: '30px', textAlign: 'center' }}>{title}</Typography>
      {
        reservedProducts.length
          ?
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            {
              reservedProducts.map((product: any, index:number) => {
                return (
                  <img key={index} src={product && product.img_url ? `${API_URL}${product.img_url}` : iconPlaceholder} alt="reservedProduct" style={{ width: '150px', padding: '15px', marginBottom:'20px', boxShadow:'2px 2px 4px #999' }} />
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
        <Box sx={styles.purchase}>
          <div>Subtotal</div>
          <div>{prices.subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
        </Box>
        <Box sx={styles.purchase}>
          <div>Tax(8.1%)</div>
          <div>{prices.tax.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
        </Box>
        <Box sx={styles.purchase}>
          <div>Total</div>
          <div>{prices.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt:'40px' }}>
        <Button variant="contained" sx={{ pr: 6, pl: 6 }} component={Link} to="/payment">
          Complete Purchase
        </Button>
      </Box>
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
