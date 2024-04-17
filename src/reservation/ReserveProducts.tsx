import React, { useState, useEffect } from 'react';
import { Autocomplete, Box, Collapse, Link, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { getExtrasData, getHeaderData, getPriceLogicData, getProductFamiliesData } from '../api/Product';
import CustomDatePicker from '../common/CustomDatePicker';
import { useStoreDetails } from '../common/Providers/StoreDetailsProvider/UseStoreDetails';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import LogInAs from '../common/LogInAs';
import CustomBorderInput from '../common/CustomBorderInput';

import { calculatePricedEquipmentData, getPriceTableByBrandAndDate } from './CalcPrice';
import CategorySlot from './CategorySlots';
import ProductList from './ProductList';
import { searchAddress } from '../api/Store';

interface props {
  sx?: object;
}

const ReserveProducts: React.FC<props> = ({sx}) => {

  const { storeDetails } = useStoreDetails();
  const { ReservationItems, ReservationMain, setReservationItems, setReservationValue } = useCustomerReservation();

  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [productFamilies, setProductFamilies] = useState<Array<any>>([]);

  const [extras, setExtras] = useState<Array<any>>([]);
  const [headerData, setHeaderData] = useState<Array<any>>([]);
  const [priceLogicData, setPriceLogicData] = useState<Array<any>>([]);

  // const [address, setAddress] = useState<any>();
  const [searchKey, setSearchKey] = useState<string>("");
  const [searchedAddresses, setSearchedAddresses] = useState<Array<any>>([]);

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
      const priceTable = getPriceTableByBrandAndDate(priceLogicData, storeDetails.brand_id, ReservationMain.pickup);
      console.log("----------- priceTable -----------");
      console.log(priceTable);
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
  }, [headerData, ReservationMain.price_table_id, ReservationMain.pickup, ReservationMain.dropoff, ReservationItems.length])

  useEffect(() => {
    if (searchKey) {
      searchAddress(searchKey, (jsonRes:any, status) => {
        if (status === 200 && Array.isArray(jsonRes)) {
          setSearchedAddresses(
            jsonRes.map((address) => ({
              ...address,
              label: `${address.street || ''} ${address.number || ''} ${address.plantation || ''} ${address.property_name || ''}`
            }))
          );
        } else {
          setSearchedAddresses([]);
        }
      });
    } else {
      setSearchedAddresses([]);
    }
  }, [searchKey]);
  

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
console.log(searchKey);
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
          <Typography sx={{margin:"30px 0", fontSize:'18px'}}>
            {`Your rental starts on when delivered on `}
            {ReservationMain.pickup ? <b>{dayjs(ReservationMain.pickup).format('MM/DD/YYYY')}</b> : <b>{"n/a"}</b>}
            {` and ends at `}
            {ReservationMain.dropoff ? <b>{`8:00AM `}{dayjs(ReservationMain.dropoff).format('MM/DD/YYYY')}</b> : <b>{"n/a"}</b>}
          </Typography>
          <Typography sx={{margin:'10px 0', textDecoration:'underline', fontSize:'20px'}}>{`Delivery Location`}</Typography>
          <Typography>{`We have a robust database of locations on the island we deliver to. Search for a location and select the appropriate address from the dropdown. If your address is not lsited, click below to enter your address manually. Please search for your address first, as selecting from our lsit will make delivery smoother and easier.`}</Typography>
          {/* <Collapse in={(ReservationMain.address_id && !ReservationMain.use_manual)?true:false}>
            <Typography style={{marginTop:'20px', fontWeight:700, fontSize:'20px'}}>
              {ReservationMain.selectedAddress && `${ReservationMain.selectedAddress.street || ''} ${ReservationMain.selectedAddress.number || ''} ${ReservationMain.selectedAddress.plantation || ''} ${ReservationMain.selectedAddress.property_name || ''}`}
            </Typography>
          </Collapse> */}
          {/* <CustomBorderInput
            containerstyle={{ width: '60%', mt:'30px' }}
            label="Search Address"
            placeholder="Start typing to search for your address..." 
            value={searchKey} 
            required={true}
            onChange={(event)=>{setSearchKey(event.target.value)}} /> */}
          <Typography style={{marginTop:'10px'}} variant={'subtitle1'}>{"Search Address"}</Typography>
          <Autocomplete
            freeSolo
            sx={{ width: '60%', mt:'6px' }}
            disableClearable
            options={searchedAddresses}
            value={ReservationMain.selectedAddress}
            onChange={(event, value)=>{
              setReservationValue('selectedAddress', value);
              setReservationValue('address_id', value.id);
            }}
            // inputValue={searchKey}
            onInputChange={(event, value)=>{setSearchKey(value)}}
            filterOptions={(x) => {
              return x;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />
          
          <Box 
            sx={{mt:'20px', fontSize:'18px', }}
          >
            <Link 
              onClick={()=>{setReservationValue('use_manual', !ReservationMain.use_manual)}}
              sx={{cursor:'pointer'}}
            >
              {`Address not listed? Manually enter address.`}
            </Link>
          </Box>
          <Collapse in={ReservationMain.use_manual}>
            <CustomBorderInput
              containerstyle={{ width: '60%', mt:'20px' }}
              label="Manual Address Entry"
              placeholder="Resort, Street Address, Apt #/Suite/Etc." 
              value={ReservationMain.manual_address} 
              required={true}
              onChange={(event)=>{setReservationValue('manual_address', event.target.value)}} />
          </Collapse>
        </Box>
        <Box>
          <Typography style={{fontFamily:'Roboto', fontWeight:700, fontSize:'36px', marginTop:'50px', marginBottom:'20px'}}>{`Select Items`}</Typography>
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