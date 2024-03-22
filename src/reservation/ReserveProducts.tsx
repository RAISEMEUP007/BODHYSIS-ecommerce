import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import dayjs from 'dayjs';

import { getExtrasData, getHeaderData, getPriceLogicData, getProductFamiliesData, getProductLinesData } from '../api/Product';
import CustomCalendar from '../common/CustomCalendar';
import { useStoreDetails } from '../common/Providers/StoreDetailsProvider/UseStoreDetails';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';

import CategorySlot from './CategorySlots';
import ProductItemDetail from './ProductItemDetail';
import ProductList from './ProductList';
import { calculatePricedEquipmentData, getPriceTableByBrandAndDate } from './CalcPrice';

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
      const priceTable = getPriceTableByBrandAndDate(priceLogicData, storeDetails.brand_id, ReservationMain.pickup);
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
  }, [headerData, ReservationMain.price_table_id, ReservationMain.pickup, ReservationMain.dropoff])

  const calcData = async (ReservationItems:Array<any>) =>{
    const calculatedReservedItems = await calculatePricedEquipmentData(headerData, ReservationMain.price_table_id, ReservationItems, ReservationMain.pickup, ReservationMain.dropoff);
    setReservationItems(calculatedReservedItems);

    let prices = {
      subtotal: 0,
      tax: 0,
      total: 0,
    }
    calculatedReservedItems.map((item:any)=>{
      let subtotal = item.price || 0;
      let tax = (item.price || 0) * (storeDetails.sales_tax?storeDetails.sales_tax/100:0) ?? 0;
      let total = subtotal - tax;
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
        <Box sx={{ display: 'flex' }}>
          <CustomCalendar
            name="Pick up"
            sx={{ boxSizing: 'boder-box', width: '300px', pt: 5, pr: 5 }}
            value={dayjs(ReservationMain.pickup)}
            onChange={handlePickupChange}
            maxDateTime={dayjs(ReservationMain.dropoff)}
            minDateTime = {dayjs().set('hour', 0).set('minute', 0).set('second', 0)}
          />
          <CustomCalendar
            name="Drop off"
            sx={{ boxSizing: 'boder-box', width: '300px', pt: 5, pr: 5 }}
            value={dayjs(ReservationMain.dropoff)}
            onChange={handleDropoffChange}
            minDateTime={dayjs(ReservationMain.pickup ? dayjs(ReservationMain.pickup).set('hour', 0).set('minute', 0).set('second', 0) : dayjs().set('hour', 0).set('minute', 0).set('second', 0))}
          />
        </Box>
        <CategorySlot sx={{ mt: '50px' }} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <ProductList sx={{ mt: '70px', pr: 2 }} lists={productFamilies} handleDetailDialogOpen={handleDetailDialogOpen} />
      </Box>
      <ProductItemDetail open={detailDialogOpen} product={selectedProduct} extras={extras} handleDetailDialogOK={handleDetailDialogOK} handleDetailDialogClose={handleDetailDialogClose} />
    </Box>
  );
}

export default ReserveProducts;