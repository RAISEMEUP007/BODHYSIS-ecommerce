import React from 'react';
import { Box } from '@mui/material';
import ProductListItem from './ProductListItem';

interface props {
  lists: Array<any>;
  extras: Array<any>;
  sx?: object;
}

const ProductList: React.FC<props> = ({ sx, extras, lists }) => {
  return (
    <Box sx={sx}>
      {/* {lists.length ?
        <Typography sx={{ fontWeight: '900', mb:'12px' }}>There are {lists.length} products available.</Typography>
        :
        <Typography sx={{ fontWeight: '900', mb:'12px' }}>There are no products available.</Typography>
      } */}
      {lists && lists.length && lists.map((product: any) => {
        return (
          <ProductListItem key={product.id} extras={extras} product={product} />
        )
      })}
    </Box>
  );
}

export default ProductList;
