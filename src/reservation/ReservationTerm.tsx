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
  const { ReservationMain, setReservationValue } = useCustomerReservation();
  const { matches900 } = useResponsiveValues();

  const handlePickupChange = (value: any) => {
    const pickupDateTime = new Date(value);
    pickupDateTime.setHours(0, 0, 0, 0);
    console.log(pickupDateTime);
    console.log(ReservationMain.dropoff);
    if(ReservationMain.dropoff === null)
      setReservationValue('pickup', pickupDateTime);
    else {
      if(pickupDateTime.getTime() + (24 * 60 * 60 * 1000) > ReservationMain.dropoff.getTime()) {
        const timeDifference = ReservationMain.dropoff.getTime() - pickupDateTime.getTime();
        const newDropoffDateTime = new Date(pickupDateTime.getTime() + timeDifference + (24 * 60 * 60 * 1000));
        setReservationValue('dropoff', newDropoffDateTime);
      } 
      setReservationValue('pickup', pickupDateTime);
    }
  }

  const handleDropoffChange = (value: any) => {
    const dropoffDateTime = new Date(value);
    dropoffDateTime.setHours(0, 0, 0, 0);
    setReservationValue('dropoff', dropoffDateTime)
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
          // maxDate={dayjs(ReservationMain.dropoff)}
          minDate = {dayjs().set('hour', 0).set('minute', 0).set('second', 0)}
        />
        <CustomDatePicker
          name="End Date"
          sx={{ boxSizing: 'boder-box', width: matches900?'250px':'100%', pr: '20px', mb:'20px' }}
          value={dayjs(ReservationMain.dropoff)}
          onChange={handleDropoffChange}
          minDate={dayjs(ReservationMain.pickup ? dayjs(ReservationMain.pickup).add(1, 'day').set('hour', 0).set('minute', 0).set('second', 0) : dayjs().add(1, 'day').set('hour', 0).set('minute', 0).set('second', 0))}
        />
      </Box>
      <Typography sx={{marginTop:"30px", fontSize:'18px'}}>
        {`Your rental starts on when picked up on `}
        {ReservationMain.pickup ? <b>{`${storeDetails.pickup_time} `}{dayjs(ReservationMain.pickup).format('MM/DD/YYYY')}</b> : <b>{"n/a"}</b>}
        {` and ends at `}
        {ReservationMain.dropoff ? <b>{`${storeDetails.dropoff_time} `}{dayjs(ReservationMain.dropoff).format('MM/DD/YYYY')}</b> : <b>{"n/a"}</b>}
      </Typography>
    </Box>
  );
}

export default ReservationTerm;