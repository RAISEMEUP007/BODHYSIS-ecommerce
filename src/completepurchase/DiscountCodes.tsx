import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import CustomSelect from '../common/CustomSelect';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import { useStoreDetails } from '../common/Providers/StoreDetailsProvider/UseStoreDetails';
import CustomBorderInput from '../common/CustomBorderInput';

interface Props {
  isDisableDiscount?:boolean;
}

const DiscountCodes: React.FC<Props> = ({isDisableDiscount}) => {

  const { ReservationMain, setReservationValue } = useCustomerReservation();
  const { discounts } = useStoreDetails();
  const [validation, setValidation] = useState<boolean | null>(null);

  useEffect(()=>{
    if(ReservationMain.discount_code){
      const selectedDiscount:any = discounts.find((item:any) => {
        if (typeof item.code === 'string') {
          return item.code.toLowerCase() === ReservationMain.discount_code.toLowerCase();
        }
        return false;
      });

      if(selectedDiscount){
        setReservationValue('promo_code', selectedDiscount.id);
        setReservationValue('discount_rate', selectedDiscount.amount);
        setValidation(null);
      }else {
        setReservationValue('promo_code', null);
        setReservationValue('discount_rate', null);
        setValidation(false);
      }
    }else {
      setReservationValue('promo_code', null);
      setReservationValue('discount_rate', null);
      setValidation(null);
    }
  }, [ReservationMain.discount_code]);

  const renderDiscountCodes = () => (
    <Box>
      {/* <CustomSelect
        label={"Discount codes"}
        labelVariant={'subtitle1'}
        items={[{label:'None', value:null}, ...discounts]}
        variant="outlined"
        style={{border:'1px solid #e6e6e6'}}
        onChange={(event:any)=>{
          // console.log(event.target.value);
          selectDiscount(event.target.value);
        }}
      /> */}
      <CustomBorderInput
        error={(validation === false )?true:false}
        // label={"Discount codes"}
        value={ReservationMain.discount_code}
        disabled={isDisableDiscount}
        onBlur={(event=>{
          setReservationValue('discount_code', event.target.value);
        })}
        onChange={(event)=>{
          setReservationValue('discount_code', event.target.value);
        }}
        helperText={
          validation === false
            ? 'Invalid Code'
            : ''
        }
      />
    </Box>
  );

  const styles ={

  }

  return renderDiscountCodes();
}

export default DiscountCodes;
