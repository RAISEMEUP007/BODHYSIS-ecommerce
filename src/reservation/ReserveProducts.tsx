import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { getExtrasData, getProductFamiliesData } from '../api/Product';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';
import LogInAs from '../common/LogInAs';

import CategorySlot from './CategorySlots';
import ProductList from './ProductList';
import ReservationTerm from './ReservationTerm';
import DeliveryLocation from './DeliveryLocation';
import { useStoreDetails } from '../common/Providers/StoreDetailsProvider/UseStoreDetails';

interface props {
  sx?: object;
  addressError?: boolean
}

const ReserveProducts: React.FC<props> = ({sx, addressError}) => {

  const { storeDetails } = useStoreDetails();
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
      getProductFamiliesData(selectedCategory.id, (jsonRes: any, status: any) => { 
        if (status === 200 && Array.isArray(jsonRes) && jsonRes.length) {
          const filteredCategories = jsonRes.filter((item: any) => {
            if(!item.brand_ids) return false;
            const brandsIds = JSON.parse(item.brand_ids);
            return brandsIds.includes(storeDetails.brand_id);
          });
          setProductFamilies(filteredCategories);
        } else {
          setProductFamilies([]);
        }
      })
    } else setProductFamilies([]);
  }, [selectedCategory]);

  const scrollUpBeforeCategory = () => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.scrollTo({
        top: 1150,
        behavior: 'smooth'
      });
    }
  };

  const ReservationTermEl = useMemo(()=>(<ReservationTerm/>), [])

  const DeliveryLocationEl = useMemo(()=>(<DeliveryLocation
    isDescription={true}
    isShowSearchBox={true}
    sx={{marginTop:'20px'}}
    contentStyle={styles(matches900).contentPadding}
    emptyError={addressError}
  />), [addressError])

  const CategorySlotEl = useMemo(()=>(<CategorySlot 
    title={matches900?'Categories':'Pick a Cateogry'}
    sx={styles(matches900).CategorySlot} 
    selectedCategory={selectedCategory} 
    setSelectedCategory={setSelectedCategory} />), [matches900, selectedCategory])

  const ProductListEl = useMemo(()=>(<ProductList 
    sx={styles(matches900).ProductList}
    lists={productFamilies} />), [matches900, productFamilies])

  const renderReserveProducts = () => (
    <Box sx={sx}>
      <Box>
        <LogInAs/>
        <Box>
          <Typography style={{fontWeight:700, fontSize:'36px', marginTop:'50px', marginBottom:'20px'}}>{`Reservation Details`}</Typography>
          {ReservationTermEl}
          {DeliveryLocationEl}
        </Box>
        <Box>
          <Typography style={{fontWeight:700, fontSize:'36px', marginTop:'50px', marginBottom:'20px'}}>{`Select Items`}</Typography>
          <Box sx={styles(matches900).selectItemsBox}>
            {CategorySlotEl}
            {ProductListEl}
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

  return renderReserveProducts();
}

const styles = (matches900:boolean) => ({
  contentPadding:{
    paddingLeft: '0px'
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
})

export default ReserveProducts;