import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

import { getExtrasData, getProductLinesData } from '../api/Product';
import CategorySlot from './CategorySlots';
import ReservationDetailsDialog from './Detail';
import Purchase from '../common/Purchase';
import Products from './Products';
import CustomCalendar from '../common/CustomCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import BasicLayout from '../common/BasicLayout';


const Reserve: React.FC = () => {
  const [pickup, setPickup] = useState<any>("");
  const [dropoff, setDropoff] = useState<any>("");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [productlines, setProductlines] = useState<Array<any>>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>();
  const [extras, setExtras] = useState<Array<any>>([]);
  const [reservedProducts, setReservedProducts] = useState<any>([]);

  useEffect(() => {
    getExtrasData((jsonRes: any) => { setExtras(jsonRes) })
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory) {
      getProductLinesData(selectedCategory.id, (jsonRes: any) => { setProductlines(jsonRes) })
    } else setProductlines([]);
  }, [selectedCategory]);

  const handlePickupChange = (value: any) => {
    const pickupDateTime = new Date(value);
    const dropoffDateTime = new Date(dropoff || new Date());
    if(pickupDateTime.getTime() <= dropoffDateTime.getTime()) {
      setPickup(pickupDateTime);
    } else {
      console.log("Warning: You can't select later datetime than dropoff!");
      setPickup(new Date())
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
    // updatedReservedProducts = reservedProducts.filter((item: any) => item.line_id !== product.line_id);
    updatedReservedProducts.push(product);
    setReservedProducts(updatedReservedProducts);
    setDetailDialogOpen(false);
  }

  return (
    <BasicLayout sx={{ boxSizing:'border-box', display:'flex', flexDirection:'column', height:'100%' }}>
      <Box sx={{ flex:1, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 , }}>
          <Box sx={{ display: 'flex' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <CustomCalendar
                name="Pick up"
                sx={{ boxSizing: 'boder-box', width: '300px', pt: 5, pr: 5 }}
                value={dayjs(pickup || null)}
                onChange={handlePickupChange}
                maxDateTime = {dayjs(dropoff || new Date())}
              />
              <CustomCalendar
                name="Drop off"
                sx={{ boxSizing: 'boder-box', width: '300px', pt: 5, pr: 5 }}
                value={dayjs(dropoff || null)}
                onChange={handleDropoffChange}
                minDateTime={dayjs(pickup || new Date())}
              />
            </LocalizationProvider>
          </Box>
          <CategorySlot sx={{ mt: '50px' }} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
          <Products sx={{ mt: '70px', pr: 2 }} productlines={productlines} handleDetailDialogOpen={handleDetailDialogOpen} />
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
