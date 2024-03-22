import React from 'react';
import { Box, Button } from '@mui/material';
import { API_URL } from '../common/AppConstants';
import iconPlaceholder from '../img/icons-placeholder.png';

interface props {
  product: any;
  handleDetailDialogOpen: (product: any) => void;
  sx?: object;
}

const ProductDetail: React.FC<props> = ({ sx, product, handleDetailDialogOpen }) => {
  // const { line, family: { display_name, img_url }, size, description } = product;

  return (
    <Button
      disableRipple
      onClick={() => {
        handleDetailDialogOpen(product);
      }}
      sx={{color: 'black', width: '100%', ...sx}}
    >
      <Box sx={{ border: '1px solid #ABABAB', padding: '30px', display: 'flex', justifyContent: 'space-between', borderRadius: '10px', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Box sx={{ width: '240px', mt: '10px' }}>
            <img src={product && product.img_url? API_URL + product.img_url : iconPlaceholder} alt={product.display_name} style={{ maxWidth: '100%', width: '100%' }} />
          </Box>
          <Box sx={{ flex: 1, ml: '30px' }}>
            <Box>
              <h2 style={{ marginTop: 0, marginBottom: '20px' }}>{product?.display_name ?? ''}</h2>
              <div>{product?.summary ?? ''}</div>
              {/* <div>{product?.size ?? ''}</div> */}
              {/* <div>25 fit rides 53 to 52</div> */}
              <div>{product?.description ?? ''}</div>
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
