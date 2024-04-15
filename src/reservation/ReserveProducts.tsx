import React, { useState, useEffect } from 'react';
import { Box, Link, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { getExtrasData, getHeaderData, getPriceLogicData, getProductFamiliesData, getProductLinesData } from '../api/Product';
import CustomDatePicker from '../common/CustomDatePicker';
import { useStoreDetails } from '../common/Providers/StoreDetailsProvider/UseStoreDetails';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';

import CategorySlot from './CategorySlots';
import ProductItemDetail from './ProductItemDetail';
import ProductList from './ProductList';
import { calculatePricedEquipmentData, getPriceTableByBrandAndDate } from './CalcPrice';
import LogInAs from '../common/LogInAs';
import CustomBorderInput from '../common/CustomBorderInput';

interface props {
  sx?: object;
}

const ReserveProducts: React.FC<props> = ({sx}) => {

  const { storeDetails } = useStoreDetails();
  const { ReservationItems, ReservationMain, setReservationItems, setReservationValue } = useCustomerReservation();

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [productFamilies, setProductFamilies] = useState<Array<any>>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>();

  const [extras, setExtras] = useState<Array<any>>([]);
  const [headerData, setHeaderData] = useState<Array<any>>([]);
  const [priceLogicData, setPriceLogicData] = useState<Array<any>>([]);

  useEffect(() => {
    getExtrasData((jsonRes: any) => { setExtras(jsonRes) })
    getPriceLogicData((jsonRes: any) => { setPriceLogicData(jsonRes) });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      getProductFamiliesData(selectedCategory.id, (jsonRes: any) => { setProductFamilies(jsonRes) })
    } else setProductFamilies([]);
  }, [selectedCategory]);

  useEffect(() => {
    if(ReservationMain.pickup){
      // console.log(priceLogicData);
      // console.log(storeDetails.brand_id);
      // console.log(ReservationMain.pickup);
      const priceTable = getPriceTableByBrandAndDate(priceLogicData, storeDetails.brand_id, ReservationMain.pickup);
      console.log(priceTable);
      setReservationValue('price_table_id', priceTable?.id??null);
    }
  }, [priceLogicData, storeDetails, ReservationMain.pickup])

  useEffect(() => {
    // console.log(ReservationMain.price_table_id);
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
  }, [headerData, ReservationMain.price_table_id, ReservationMain.pickup, ReservationMain.dropoff])

  const calcData = async (ReservationItems:Array<any>) =>{
    const calculatedReservedItems = await calculatePricedEquipmentData(headerData, ReservationMain.price_table_id, ReservationItems, ReservationMain.pickup, ReservationMain.dropoff);
    // console.log(calculatedReservedItems);
    setReservationItems(calculatedReservedItems);

    let prices = {
      subtotal: 0,
      tax: 0,
      total: 0,
    }
    calculatedReservedItems.map((item:any)=>{
      let subtotal = item.price || 0;
      let tax = (item.price || 0) * (storeDetails.sales_tax?storeDetails.sales_tax/100:0) ?? 0;
      let total = subtotal + tax;
      prices.subtotal += subtotal;
      prices.tax += tax;
      prices.total += total;
    });
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

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
  }

  const handleDetailDialogOpen = (product: any) => {
    setSelectedProduct(product);
    setDetailDialogOpen(true);
  }

  const handleDetailDialogOK = async (product: any) => {
    const updatedReservedProducts = [...ReservationItems, product];
    await calcData(updatedReservedProducts);
    setDetailDialogOpen(false);
  }

  return (
    <Box sx={sx}>
      <Box>
        <LogInAs/>
        <Box>
          <Typography style={{fontFamily:'Roboto', fontWeight:700, fontSize:'36px', marginTop:'50px', marginBottom:'20px'}}>{`Reservation Details`}</Typography>
          <Box sx={{ display: 'flex', paddingLeft:"20px" }}>
            <CustomDatePicker
              name="Start Date"
              sx={{ boxSizing: 'boder-box', width: '200px', pr: 5 }}
              value={dayjs(ReservationMain.pickup)}
              onChange={handlePickupChange}
              maxDate={dayjs(ReservationMain.dropoff)}
              minDate = {dayjs().set('hour', 0).set('minute', 0).set('second', 0)}
            />
            <CustomDatePicker
              name="End Date"
              sx={{ boxSizing: 'boder-box', width: '200px', pr: 5 }}
              value={dayjs(ReservationMain.dropoff)}
              onChange={handleDropoffChange}
              minDate={dayjs(ReservationMain.pickup ? dayjs(ReservationMain.pickup).set('hour', 0).set('minute', 0).set('second', 0) : dayjs().set('hour', 0).set('minute', 0).set('second', 0))}
            />
          </Box>
          <Typography sx={{margin:"30px 0"}}>
            {`Your rental starts on when delivered on `}
            <b>{dayjs(ReservationMain.pickup).format('MM/DD/YYYY')}</b>
            {` and ends at`}
            <b>{dayjs(ReservationMain.dropoff).format('MM/DD/YYYY')}</b></Typography>
          <Typography variant='h6' sx={{margin:'10px 0'}}>{`Delivery Location`}</Typography>
          <Typography>{`We have a robust database of locations on the island we deliver to. Search for a location and select the appropriate address from the dropdown. If your address is not lsited, click below to enter your address manually. Please search for your address first, as selecting from our lsit will make delivery smoother and easier.`}</Typography>
          <CustomBorderInput
            containerstyle={{ width: '60%', mt:'30px' }}
            label="Search Address"
            placeholder="Start typing to search for your address..." 
            value={""} 
            required={true}
            onChange={(event)=>{}} />
          <Box sx={{mt:'20px'}}><Link>{`Address not listed? Manually enter address.`}</Link></Box>
          <CustomBorderInput
            containerstyle={{ width: '60%', mt:'30px' }}
            label="Manual Address Entry"
            placeholder="Resort, Street Address, Apt #/Suite/Etc." 
            value={""} 
            required={true}
            onChange={(event)=>{}} />
        </Box>
        <Box>
          <Typography style={{fontFamily:'Roboto', fontWeight:700, fontSize:'36px', marginTop:'50px', marginBottom:'20px'}}>{`Select Items`}</Typography>
          <Box sx={{display:'flex'}}>
            <CategorySlot sx={{width:'300px', border:'1px solid #BCBCBC', borderRadius:'4px', alignSelf:'flex-start'}} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            <ProductList sx={{flex:1, marginLeft:'24px'}} extras={extras} lists={productFamilies} handleDetailDialogOpen={handleDetailDialogOpen} />
          </Box>
        </Box>
      </Box>
      {/* <ProductItemDetail open={detailDialogOpen} product={selectedProduct} extras={extras} handleDetailDialogOK={handleDetailDialogOK} handleDetailDialogClose={handleDetailDialogClose} /> */}
    </Box>
  );
}

export default ReserveProducts;