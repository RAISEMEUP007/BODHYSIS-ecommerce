import React, { useEffect } from 'react';
import { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Grid } from '@mui/material';
import redbike from "../img/redbike.png"
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { getProductCategoriesData } from '../api/Product';
import { API_URL } from '../common/AppConstants';

interface props {
  sx?: object;
}

const CategorySlot = ({sx}:props) => {

  const [categories, setCategories] = useState<any>();

  console.log(categories);
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
          sx={{ width: 150, height: 140, margin: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
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
