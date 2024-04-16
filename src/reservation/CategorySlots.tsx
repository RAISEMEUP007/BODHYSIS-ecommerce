import React, { useEffect } from 'react';
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { getProductCategoriesData } from '../api/Product';
import CategoryItem from './CategoryItem';

interface props {
  sx?: object;
  selectedCategory: any;
  setSelectedCategory: (category:any) => void;
}

const CategorySlot = ({sx, selectedCategory, setSelectedCategory}:props) => {

  const [categories, setCategories] = useState<any>();

  useEffect(()=>{
    getProductCategoriesData((jsonRes:any)=>{
      setCategories(jsonRes);
    });
  }, []);

  return (
    <Box sx={sx}>
      <Typography sx={{fontWeight:'bold', fontSize:'24px', textAlign:'center', backgroundColor:'#F0F0F0', padding:'16px'}}>{'Categories'}</Typography>
      <Box sx={{display:'flex', flexDirection:'row', alignItems:'flex-end', flexWrap:'wrap', justifyContent:'space-around', padding:"20px 6px 10px"}}>
        {categories && categories.map((category:any, index:number) => (
          <CategoryItem
            key={category.id}
            category={category}
            sx={{
              width: '140px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: '4px',
              borderStyle: 'solid',
              borderRadius: '4px',
              borderColor: selectedCategory && selectedCategory.id === category.id ? '#B1DEFF' : 'transparent',
            }}
            onClick={() => setSelectedCategory(category)}
          >
          </CategoryItem>
        ))}
      </Box>
    </Box>
  )
}

export default CategorySlot;
