import React, { useState, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import { getExtrasData, getHeaderData, getPriceLogicData, getProductFamiliesData, getProductLinesData } from '../api/Product';
import CustomCalendar from '../common/CustomCalendar';
import Purchase from '../common/Purchase';
import { useStoreDetails } from '../common/Providers/UseStoreDetails';
import BasicLayout from '../common/BasicLayout';

import CategorySlot from './CategorySlots';
import ReservationDetailsDialog from './Detail';
import Products from './Products';
import { calculatePricedEquipmentData, getPriceTableByBrandAndDate } from './CalcPrice';


const Reserve: React.FC = () => {

  const { getStoreDetails } = useStoreDetails();
  const storeDetails:any = useMemo(()=>{
    return getStoreDetails();
  }, []);

  const [pickup, setPickup] = useState<any>("");
  const [dropoff, setDropoff] = useState<any>("");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [productFamilies, setProductFamilies] = useState<Array<any>>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>();
  const [extras, setExtras] = useState<Array<any>>([]);
  const [reservedProducts, setReservedProducts] = useState<Array<any>>([]);
  const [headerData, setHeaderData] = useState<Array<any>>([]);
  const [priceLogicData, setPriceLogicData] = useState<Array<any>>([]);
  const [tableId, setTableId] = useState<number|null>(null);

  console.log(reservedProducts);

  useEffect(() => {
    getExtrasData((jsonRes: any) => { setExtras(jsonRes) })
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory) {
      getProductFamiliesData(selectedCategory.id, (jsonRes: any) => { setProductFamilies(jsonRes) })
    } else setProductFamilies([]);
  }, [selectedCategory]);

  useEffect(() => {
    getPriceLogicData((jsonRes: any) => { setPriceLogicData(jsonRes) });
  }, []);

  useEffect(() => {
    const priceTable = getPriceTableByBrandAndDate(priceLogicData, storeDetails.brand_id, pickup);
    setTableId(priceTable.id);
  }, [priceLogicData, storeDetails, pickup])

  useEffect(() => {
    if(tableId){
      getHeaderData(tableId, (jsonRes:any, status, error) => {
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
  }, [tableId]);

  useEffect(()=>{
    const calcData = async () =>{
      const calcudatedReservedItems = await calculatePricedEquipmentData(headerData, tableId, reservedProducts, pickup, dropoff);
      setReservedProducts(calcudatedReservedItems);
    }
    calcData();
  }, [headerData, tableId, reservedProducts.length, pickup, dropoff])

  const handlePickupChange = (value: any) => {
    const pickupDateTime = new Date(value);
    const dropoffDateTime = new Date(dropoff || new Date());
    if(dropoff === "")
      setPickup(pickupDateTime)
    else {
      if(pickupDateTime.getTime() <= dropoffDateTime.getTime()) {
        setPickup(pickupDateTime);
      } else {
        console.log("Warning: You can't select later datetime than dropoff!");
        setPickup(new Date())
      } 
    }
  }

  const handleDropoffChange = (value: any) => {
    const pickupDateTime = new Date(pickup || new Date());
    const dropoffDateTime = new Date(value);
    if(pickupDateTime.getTime() <= dropoffDateTime.getTime()) {
      setDropoff(dropoffDateTime)
    } else {
      console.log("Warning: You can't select earlier datetime than pickup!");
      setDropoff(new Date());
    }
  }

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
  }

  const handleDetailDialogOpen = (product: any) => {
    setSelectedProduct(product);
    setDetailDialogOpen(true);
  }

  const handleDetailDialogOK = (product: any) => {
    let updatedReservedProducts = reservedProducts;
    updatedReservedProducts.push(product);
    setReservedProducts(updatedReservedProducts);
    setDetailDialogOpen(false);
  }
  
  return (
    <BasicLayout sx={{ boxSizing:'border-box', display:'flex', flexDirection:'column', height:'100%' }}>
      <Box sx={{ flex:1, display: 'flex', justifyContent: 'space-between', pb:'30px' }}>
        <Box sx={{ flex: 1 , }}>
          <Box sx={{ display: 'flex' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <CustomCalendar
                name="Pick up"
                sx={{ boxSizing: 'boder-box', width: '300px', pt: 5, pr: 5 }}
                value={dayjs(pickup || null)}
                onChange={handlePickupChange}
                maxDateTime={dayjs(dropoff || null)}
                minDateTime = {dayjs().set('hour', 0).set('minute', 0).set('second', 0)}
              />
              <CustomCalendar
                name="Drop off"
                sx={{ boxSizing: 'boder-box', width: '300px', pt: 5, pr: 5 }}
                value={dayjs(dropoff || null)}
                onChange={handleDropoffChange}
                minDateTime={dayjs(pickup ? dayjs(pickup).set('hour', 0).set('minute', 0).set('second', 0) : dayjs().set('hour', 0).set('minute', 0).set('second', 0))}
              />
            </LocalizationProvider>
          </Box>
          <CategorySlot sx={{ mt: '50px' }} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
          <Products sx={{ mt: '70px', pr: 2 }} lists={productFamilies} handleDetailDialogOpen={handleDetailDialogOpen} />
        </Box>
        <Box sx={{ width: '400px', pr: '50px', pl: '50px', borderLeft: '1px solid #ABABAB'}}>
          <Purchase sx={{}} title="Reservation Details" reservedProducts={reservedProducts} pickup={pickup} dropoff={dropoff}/>
        </Box>
      </Box>
      <ReservationDetailsDialog open={detailDialogOpen} product={selectedProduct} extras={extras} handleDetailDialogOK={handleDetailDialogOK} handleDetailDialogClose={handleDetailDialogClose} />
    </BasicLayout>
  );
}

export default Reserve;