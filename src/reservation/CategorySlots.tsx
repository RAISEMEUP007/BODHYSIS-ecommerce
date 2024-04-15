import React, { useEffect } from 'react';
import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { getProductCategoriesData } from '../api/Product';
import { API_URL } from '../common/AppConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';

interface props {
  sx?: object;
  selectedCategory: any;
  setSelectedCategory: (category:any) => void;
}

const CategorySlot = ({sx, selectedCategory, setSelectedCategory}:props) => {

  const [categories, setCategories] = useState<any>();
  const [imageError, setImgError] = useState<Array<boolean>>([]);

  const handleImageError = (index:number, isError:boolean) => {
    const updatedImageError = [...imageError];
    updatedImageError[index] = isError;
    setImgError(updatedImageError);  
  };

  // console.log(imageError);
  useEffect(()=>{
    getProductCategoriesData((jsonRes:any)=>{
      setCategories(jsonRes);
      setImgError(jsonRes.map(() => false));
    });
  }, []);

  return (
    <Box sx={sx}>
      <Typography sx={{fontWeight:'bold', fontSize:'22px', textAlign:'center', backgroundColor:'#F0F0F0', padding:'16px'}}>{'Categories'}</Typography>
      <Box sx={{display:'flex', flexDirection:'row', alignItems:'flex-end', flexWrap:'wrap', justifyContent:'space-around', padding:"20px 6px 10px"}}>
        {categories && categories.map((category:any, index:number) => (
          <Button
           key={category.id}
           sx={{
             width: '140px',
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

            <img 
              src={API_URL + category.img_url} 
              alt={category.category}
              style={{ width: '100px', display:imageError[index]?'none':'block'}}
              onError={()=>{console.log(index); handleImageError(index, true)}}
              onLoad={()=>handleImageError(index, false)}
            />
            {imageError[index] && <FontAwesomeIcon icon={faImage} style={{width:'100px', height:'100px', color:"#333"}}/>}
            <Typography style={{color:'#000', fontWeight:'bold', marginTop:'16px'}}>{category.category}</Typography>
          </Button>
        ))}
      </Box>
    </Box>
  )
}

export default CategorySlot;
