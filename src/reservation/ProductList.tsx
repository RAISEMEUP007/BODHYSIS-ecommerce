import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Grid } from '@mui/material';
import ProductListItem from './ProductListItem';

interface props {
  lists: Array<any>;
  extras: Array<any>;
  handleDetailDialogOpen: (product: any) => void;
  sx?: object;
}

const ProductList: React.FC<props> = ({ sx, extras, lists, handleDetailDialogOpen }) => {
  return (
    <Box sx={sx}>
      {/* {lists.length ?
        <Typography sx={{ fontWeight: '900', mb:'12px' }}>There are {lists.length} products available.</Typography>
        :
        <Typography sx={{ fontWeight: '900', mb:'12px' }}>There are no products available.</Typography>
      } */}
      {lists && lists.map((product: any) => {
        return (
          <ProductListItem key={product.id} extras={extras} product={product} handleDetailDialogOpen={handleDetailDialogOpen} />
        )
      })}
    </Box>
  );
}

export default ProductList;
