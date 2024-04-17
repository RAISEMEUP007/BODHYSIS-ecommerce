import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

import { getExtrasData, getProductFamiliesData } from '../api/Product';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import LogInAs from '../common/LogInAs';

import CategorySlot from './CategorySlots';
import ProductList from './ProductList';
import { searchAddress } from '../api/Store';
import ReservationTerm from './ReservationTerm';
import DeliveryLocation from './DeliveryLocation';

interface props {
  sx?: object;
}

const ReserveProducts: React.FC<props> = ({sx}) => {

  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [productFamilies, setProductFamilies] = useState<Array<any>>([]);

  const [extras, setExtras] = useState<Array<any>>([]);

  useEffect(() => {
    getExtrasData((jsonRes: any) => { setExtras(jsonRes) })
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      getProductFamiliesData(selectedCategory.id, (jsonRes: any) => { setProductFamilies(jsonRes) })
    } else setProductFamilies([]);
  }, [selectedCategory]);

  return (
    <Box sx={sx}>
      <Box>
        <LogInAs/>
        <Box>
          <Typography style={{fontWeight:700, fontSize:'36px', marginTop:'50px', marginBottom:'20px'}}>{`Reservation Details`}</Typography>
          <ReservationTerm/>
          <DeliveryLocation
            isDescription={true}
            isShowSearchBox={true}
          />
        </Box>
        <Box>
          <Typography style={{fontWeight:700, fontSize:'36px', marginTop:'50px', marginBottom:'20px'}}>{`Select Items`}</Typography>
          <Box sx={{display:'flex'}}>
            <CategorySlot sx={{width:'300px', border:'1px solid #BCBCBC', borderRadius:'4px', alignSelf:'flex-start'}} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            <ProductList sx={{flex:1, marginLeft:'24px'}} extras={extras} lists={productFamilies} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ReserveProducts;