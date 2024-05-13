import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import CustomSelect from '../common/CustomSelect';
import { getDiscountCodes } from '../api/Product';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import { useStoreDetails } from '../common/Providers/StoreDetailsProvider/UseStoreDetails';

const DiscountCodes: React.FC = () => {

  const { ReservationMain, setReservationValue } = useCustomerReservation();
  const { storeDetails } = useStoreDetails();
  const [discounts, SetDiscounts] = useState([]);
  const [selectedDiscount, selectDiscount] = useState(null);
  
  useEffect(()=>{
    getDiscountCodes((jsonRes:any, status:any)=>{
      if(status === 200) SetDiscounts(jsonRes.map((item:any) => ({label: item.code, value: item.amount })));
      else SetDiscounts([]);
    });
  }, []);

  useEffect(()=>{
    const prices = ReservationMain.prices;
    let discountAmount = 0;
    if(selectedDiscount){
      discountAmount = (Math.round(prices.subtotal * selectedDiscount) / 100);
    }else{
      discountAmount = 0;
    }
    const taxAmount = (prices.subtotal - discountAmount) * (storeDetails.sales_tax?storeDetails.sales_tax/100:0) ?? 0;
    // console.log(prices.subtotal - discountAmount);
    // console.log(storeDetails.sales_tax);
    // console.log(taxAmount);
    const total = prices.subtotal - discountAmount + taxAmount;
    const newPrices = {
      ...prices,
      discount: discountAmount,
      tax: taxAmount,
      total: total,
    }
    setReservationValue('prices', newPrices);
  }, [selectedDiscount]);

  const renderDiscountCodes = () => (
    <Box sx={{marginBottom:'30px'}}>
      <CustomSelect
        label={"Discount codes"}
        labelVariant={'subtitle1'}
        items={[{label:'None', value:null}, ...discounts]}
        variant="outlined"
        style={{border:'1px solid #e6e6e6'}}
        onChange={(event:any)=>{
          // console.log(event.target.value);
          selectDiscount(event.target.value);
        }}
      />
    </Box>
  );

  const styles ={

  }

  return renderDiscountCodes();
}

export default DiscountCodes;
