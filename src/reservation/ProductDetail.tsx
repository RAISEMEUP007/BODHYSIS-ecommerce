import React from 'react';
import { Box, Button } from '@mui/material';
import yellowbike from "../img/yellowbike.png"
import { API_URL } from '../common/AppConstants';

interface props {
  sx: object;
  product: any;
  handleDetailDialogOpen: (product: any) => void;
}

const ProductDetail: React.FC<props> = ({ sx, product, handleDetailDialogOpen }) => {
  // const { line, family: { display_name, img_url }, size, description } = product;

  return (
    <Button
      disableRipple
      onClick={() => {
        handleDetailDialogOpen(product);
      }}
      sx={{ color: 'black', width: '100%', textAlign: 'left' }}
    >
      <Box sx={sx}>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Box sx={{ width: '30%', maxWidth: '300px', mt: '10px' }}>
            <img src={API_URL + product?.family?.img_url??''} alt="product_image" style={{ maxWidth: '100%', width: '100%' }} />
          </Box>
          <Box sx={{ flex: 1, ml: '30px' }}>
            <Box sx={{}}>
              <h2 style={{ marginTop: 0, marginBottom: '20px' }}>{product?.line ?? ''}</h2>
              <div>{product?.family?.display_name ?? ''}</div>
              <div>{product?.size ?? ''}</div>
              {/* <div>25 fit rides 53 to 52</div> */}
              <div style={{ marginTop: '20px' }}>{product?.description ?? ''}</div>
              {/* <div>baskets needed</div>
              <div style={{ marginTop: '20px' }}>Medium rider weight 250lb</div> */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Button>
  )
}

export default ProductDetail;
