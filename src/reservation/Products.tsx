import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Grid } from '@mui/material';
import ProductDetail from './ProductDetail';

interface props {
  lists: Array<any>;
  handleDetailDialogOpen: (product: any) => void;
  sx?: object;
}

const Products: React.FC<props> = ({ sx, lists, handleDetailDialogOpen }) => {

  const [products, setProducts] = useState<any>([]);

  useEffect(() => {
    let testData = [{ id: 1, price: 45 }, { id: 2, price: 65 }]
    setProducts(testData);
  }, []);

  return (
    <Box sx={sx}>
      {lists.length ?
        <Typography sx={{ fontWeight: '900', mb:'12px' }}>There are {lists.length} products available.</Typography>
        :
        <Typography sx={{ fontWeight: '900', mb:'12px' }}>There are no products available.</Typography>
      }
      {lists && lists.map((product: any) => {
        return (
          <ProductDetail key={product.id} product={product} handleDetailDialogOpen={handleDetailDialogOpen} />
        )
      })}
    </Box>
  );
}

export default Products;
