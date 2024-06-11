import React from 'react';
import { Box } from '@mui/material';
import ProductListItem from './ProductListItem';

interface props {
  lists: Array<any>;
  sx?: object;
}

const ProductList: React.FC<props> = ({ sx, lists }) => {

  return (
    <Box sx={sx}>
      {lists && lists.length > 0 && lists.map((product: any) => {
        return (
          <ProductListItem key={product.id} product={product} />
        )
      })}
    </Box>
  );
}

export default ProductList;
