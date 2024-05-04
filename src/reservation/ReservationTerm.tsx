import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { getHeaderData, getPriceLogicData } from '../api/Product';
import CustomDatePicker from '../common/CustomDatePicker';
import { useStoreDetails } from '../common/Providers/StoreDetailsProvider/UseStoreDetails';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';

import { calculatePricedEquipmentData, getPriceTableByBrandAndDate } from './CalcPrice';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';
interface props {
  sx?: object;
  contentStyle?: object;
}

const ReservationTerm: React.FC<props> = ({sx, contentStyle}) => {

  const { storeDetails } = useStoreDetails();
  const { ReservationItems, ReservationMain, setReservationItems, setReservationValue } = useCustomerReservation();
  const { matches900 } = useResponsiveValues();

  const [headerData, setHeaderData] = useState<Array<any>>([]);
  const [priceLogicData, setPriceLogicData] = useState<Array<any>>([]);

  useEffect(() => {
    getPriceLogicData((jsonRes: any) => { setPriceLogicData(jsonRes) });
  }, []);

  useEffect(() => {
    if(ReservationMain.pickup){
      const priceTable = getPriceTableByBrandAndDate(priceLogicData, storeDetails.brand_id, ReservationMain.pickup);
      // console.log("----------- priceTable -----------");
      // console.log(priceTable);
      setReservationValue('price_table_id', priceTable?.id??null);
    }
  }, [priceLogicData, storeDetails, ReservationMain.pickup])

  useEffect(() => {
    if(ReservationMain.price_table_id){
      getHeaderData(ReservationMain.price_table_id, (jsonRes:any, status, error) => {
        switch (status) {
          case 200:
            setHeaderData(jsonRes);
            break;
          default:
            setHeaderData([]);
            break;
        }
      });
    }else setHeaderData([]);
  }, [ReservationMain.price_table_id]);

  useEffect(()=>{
    calcData(ReservationItems);
  }, [headerData, ReservationMain.price_table_id, ReservationMain.pickup, ReservationMain.dropoff, ReservationItems.length, ReservationMain.driver_tip])

  const calcData = async (ReservationItems:Array<any>) =>{
    console.log("---------------- headerData -----------------");
    console.log(headerData);
    console.log("--------------- ReservationItems ----------------------");
    console.log(ReservationItems);
    const calculatedReservedItems = await calculatePricedEquipmentData(headerData, ReservationMain.price_table_id, ReservationItems, ReservationMain.pickup, ReservationMain.dropoff);
    setReservationItems(calculatedReservedItems);

    let prices = {
      subtotal: 0,
      tax: 0,
      total: 0,
    }
    
    calculatedReservedItems.map((item:any)=>{
      let subtotal = item.price || 0;
      prices.subtotal += subtotal;
    });

    if(ReservationMain.driver_tip) prices.subtotal += ReservationMain.driver_tip;
    prices.tax = prices.subtotal * (storeDetails.sales_tax?storeDetails.sales_tax/100:0) ?? 0;
    prices.total += prices.subtotal + prices.tax;

    setReservationValue('prices', prices);
  }

  const handlePickupChange = (value: any) => {
    const pickupDateTime = new Date(value);
    const dropoffDateTime = new Date(ReservationMain.dropoff || new Date());
    if(ReservationMain.dropoff === null)
      setReservationValue('pickup', pickupDateTime);
    else {
      if(pickupDateTime.getTime() <= dropoffDateTime.getTime()) {
        setReservationValue('pickup', pickupDateTime);
      } else {
        console.log("Warning: You can't select later datetime than dropoff!");
        setReservationValue('pickup', new Date())
      } 
    }
  }

  const handleDropoffChange = (value: any) => {
    const pickupDateTime = new Date(ReservationMain.pickup || new Date());
    const dropoffDateTime = new Date(value);
    if(pickupDateTime.getTime() <= dropoffDateTime.getTime()) {
      setReservationValue('dropoff', dropoffDateTime)
    } else {
      console.log("Warning: You can't select earlier datetime than pickup!");
      setReservationValue('dropoff', new Date());
    }
  }

  return (
    <Box sx={sx}>
      <Typography sx={{textDecoration:'underline', fontSize:'20px', marginBottom:'6px'}}>{`Reservation Term`}</Typography>
      <Box sx={{ display: 'flex', ...contentStyle, flexDirection: matches900?'row':'column'}}>
        <CustomDatePicker
          name="Start Date"
          sx={{ boxSizing: 'boder-box', width: matches900?'250px':'100%', pr: '20px', mb:'20px' }}
          value={dayjs(ReservationMain.pickup)}
          onChange={handlePickupChange}
          maxDate={dayjs(ReservationMain.dropoff)}
          minDate = {dayjs().set('hour', 0).set('minute', 0).set('second', 0)}
        />
        <CustomDatePicker
          name="End Date"
          sx={{ boxSizing: 'boder-box', width: matches900?'250px':'100%', pr: '20px', mb:'20px' }}
          value={dayjs(ReservationMain.dropoff)}
          onChange={handleDropoffChange}
          minDate={dayjs(ReservationMain.pickup ? dayjs(ReservationMain.pickup).set('hour', 0).set('minute', 0).set('second', 0) : dayjs().set('hour', 0).set('minute', 0).set('second', 0))}
        />
      </Box>
      <Typography sx={{marginTop:"30px", fontSize:'18px'}}>
        {`Your rental starts on when delivered on `}
        {ReservationMain.pickup ? <b>{dayjs(ReservationMain.pickup).format('MM/DD/YYYY')}</b> : <b>{"n/a"}</b>}
        {` and ends at `}
        {ReservationMain.dropoff ? <b>{`8:00AM `}{dayjs(ReservationMain.dropoff).format('MM/DD/YYYY')}</b> : <b>{"n/a"}</b>}
      </Typography>
    </Box>
  );
}

export default ReservationTerm;