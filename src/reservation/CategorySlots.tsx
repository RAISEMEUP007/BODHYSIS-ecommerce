import React, { useEffect } from 'react';
import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { getProductCategoriesData } from '../api/Product';
import { API_URL } from '../common/AppConstants';

interface props {
  sx?: object;
  selectedCategory: any;
  setSelectedCategory: (category:any) => void;
}

const CategorySlot = ({sx, selectedCategory, setSelectedCategory}:props) => {

  const [categories, setCategories] = useState<any>();

  useEffect(()=>{
    getProductCategoriesData((jsonRes)=>{
      setCategories(jsonRes);
    });
  }, []);

  return (
    <Box sx={sx}>
      <Typography sx={{ fontWeight: '900' }}>{'Categories'}</Typography>
      <Box sx={{display:'flex', flexDirection:'row', alignItems:'flex-start', flexWrap:'wrap'}}>
        {categories && categories.map((category:any) => (
          <Button
           key={category.id}
           sx={{
             width: 150,
             height: 140,
             margin: 1,
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center',
             border: selectedCategory && selectedCategory.id === category.id ? '1px solid black' : 'none',
           }}
           onClick={() => setSelectedCategory(category)}
         >
            <img src={API_URL + category.img_url} alt={category.category} style={{ width: '100px', }} />
            <Typography variant="body2" sx={{ position: 'absolute', bottom: 0 }}>{category.category}</Typography>
          </Button>
        ))}
      </Box>
    </Box>
  )
}

export default CategorySlot;
