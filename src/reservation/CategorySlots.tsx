import React, { useEffect } from 'react';
import { useState } from 'react';
import { Box, BoxProps, Typography } from '@mui/material';
import { getProductCategoriesData } from '../api/Product';
import CategoryItem from './CategoryItem';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';
import { useStoreDetails } from '../common/Providers/StoreDetailsProvider/UseStoreDetails';

interface Props {
  title: string;
  sx?: object;
  selectedCategory: any;
  setSelectedCategory: (category:any) => void;
}

const CategorySlot: React.FC<Props & BoxProps> = ({ title, sx, selectedCategory, setSelectedCategory, ...rest }) => {

  const { matches900 } = useResponsiveValues();
  const { storeDetails } = useStoreDetails();

  const [categories, setCategories] = useState<Array<any>>([]);

  useEffect(() => {
    getProductCategoriesData((jsonRes: any, status: any) => {
      if (status == 200 && Array.isArray(jsonRes) && jsonRes.length) {
        console.log(storeDetails.brand_id);
        const filteredCategories = jsonRes.filter((item: any) => {
          console.log(item.brand_ids);
          if(!item.brand_ids) return false;
          const brandsIds = JSON.parse(item.brand_ids);
          return brandsIds.includes(storeDetails.brand_id);
        });
        setCategories(filteredCategories);
      } else {
        setCategories([]);
      }
    });
  }, []);
  

  useEffect(()=>{
    if(categories.length){
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  return (
    <Box sx={sx} {...rest}>
      <Typography sx={{fontWeight:'bold', fontSize:'24px', textAlign:'center', backgroundColor:'#F0F0F0', padding:'16px'}}>{title}</Typography>
      <Box 
        sx={{
          display:'flex', 
          flexDirection:'row', 
          alignItems:'stretch', 
          flexWrap:'wrap', 
          justifyContent:'center', 
          padding:"20px 6px 10px"}}>
        {categories && categories.map((category:any, index:number) => (
          <CategoryItem
            key={category.id}
            category={category}
            sx={{
              width: matches900?'140px':'33%',
              // maxWidth: '140px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
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
