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
      <Box sx={{display:'flex', flexDirection:'row', alignItems:'center', fontWeight: '800' }}>
        <Typography sx={{fontWeight:'bold'}}>{'Categories'}</Typography>
        <Typography sx={{ml:'40px', fontSize:14, color:'#e6ac00'}}>{selectedCategory === undefined ? 'Please select a category' : ''}</Typography>
      </Box>
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
             borderWidth: '1px',
             borderStyle: 'solid',
             borderColor: selectedCategory && selectedCategory.id === category.id ? 'black' : 'transparent',
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
