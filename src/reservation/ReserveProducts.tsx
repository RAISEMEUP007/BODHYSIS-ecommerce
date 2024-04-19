import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { getExtrasData, getProductFamiliesData } from '../api/Product';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';
import LogInAs from '../common/LogInAs';

import CategorySlot from './CategorySlots';
import ProductList from './ProductList';
import ReservationTerm from './ReservationTerm';
import DeliveryLocation from './DeliveryLocation';

interface props {
  sx?: object;
}

const ReserveProducts: React.FC<props> = ({sx}) => {

  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [productFamilies, setProductFamilies] = useState<Array<any>>([]);
  const { matches900 } = useResponsiveValues();

  const [extras, setExtras] = useState<Array<any>>([]);

  useEffect(() => {
    getExtrasData((jsonRes: any, status:any) => { 
      if(status == 200) setExtras(jsonRes) 
      else setExtras([]);
    })
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      getProductFamiliesData(selectedCategory.id, (jsonRes: any) => { setProductFamilies(jsonRes) })
    } else setProductFamilies([]);
  }, [selectedCategory]);

  const scrollUpBeforeCategory = () => {
    window.scrollTo({ top: 1150, behavior: 'smooth' });
  };

  const renderReserveProducts = () => (
    <Box sx={sx}>
      <Box>
        <LogInAs/>
        <Box>
          <Typography style={{fontWeight:700, fontSize:'36px', marginTop:'50px', marginBottom:'20px'}}>{`Reservation Details`}</Typography>
          <ReservationTerm
            contentStyle={styles.contentPadding}
          />
          <DeliveryLocation
            isDescription={true}
            isShowSearchBox={true}
            contentStyle={styles.contentPadding}
          />
        </Box>
        <Box>
          <Typography style={{fontWeight:700, fontSize:'36px', marginTop:'50px', marginBottom:'20px'}}>{`Select Items`}</Typography>
          <Box sx={styles.selectItemsBox}>
            <CategorySlot 
              title={matches900?'Categories':'Pick a Cateogry'}
              sx={styles.CategorySlot} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} />
            <ProductList 
              sx={styles.ProductList} 
              extras={extras} 
              lists={productFamilies} />
            {!matches900 && 
              <Button 
                variant='contained' 
                sx={{
                  backgroundColor:'#DC3390',
                  mt:'12px',
                  padding:'12px 40px',
                  textTransform: 'none',
                  alignSelf:'center',
                }} 
                onClick={scrollUpBeforeCategory} 
              >
                {`Back to Categories`}
                <KeyboardArrowUpIcon />
              </Button>}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const styles = {
    contentPadding:{
      paddingLeft: matches900?"16px":'0px'
    },
    CategorySlot:{
      width: matches900?'300px':'100%', 
      border:'1px solid #BCBCBC', 
      borderRadius:'4px', 
      alignSelf:'flex-start',
      marginBottom:'20px',
    },
    ProductList:{
      flex:1,
      marginLeft: matches900?'24px':'0px'
    },
    selectItemsBox: {
      display:'flex', 
      flexDirection: matches900?'row':'column'
    }
  }

  return renderReserveProducts();
}

export default ReserveProducts;