import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Grid } from '@mui/material';
import ProductDetail from './ProductDetail';

interface props {
  sx: object;
  productlines: any;
  handleDetailDialogOpen: (product: any) => void;
}

const Products: React.FC<props> = ({ sx, productlines, handleDetailDialogOpen }) => {

  const [products, setProducts] = useState<any>([]);

  useEffect(() => {
    let testData = [{ id: 1, price: 45 }, { id: 2, price: 65 }]
    setProducts(testData);
  }, []);

  return (
    <Box sx={sx}>
      {productlines.length ?
        <Typography sx={{ fontWeight: '900' }}>There are {productlines.length} products available.</Typography>
        :
        <Typography sx={{ fontWeight: '900' }}>There are no products available.</Typography>
      }
      {productlines && productlines.map((product: any) => {
        return (
          <ProductDetail key={product.id} sx={{ mt: '20px', border: '1px solid #ABABAB', padding: '30px', display: 'flex', justifyContent: 'space-between', borderRadius: '10px', width: '100%' }} product={product} handleDetailDialogOpen={handleDetailDialogOpen} />
        )
      })}
    </Box>
  );
}

export default Products;
