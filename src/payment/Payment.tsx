import React from 'react';
import { Box } from '@mui/material';
import ReservationMainDetail from './ReservationMainDetail';
import Purchase from '../common/Purchase';
import BasicLayout from '../common/BasicLayout';
import { useStoreDetails } from '../common/Providers/StoreDetailsProvider/UseStoreDetails';
import { createReservation } from '../api/Product';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import { useCustomStripe } from '../common/Providers/CustomStripeProvider/UseCustomStripe';
import { useSnackbar } from 'notistack';

const Payment: React.FC = () => {

  const { enqueueSnackbar } = useSnackbar();
  const { ReservationItems, ReservationMain } = useCustomerReservation();
  const { storeDetails } = useStoreDetails();
  const { setAmount } = useCustomStripe();

  const onComplete = (event: any) => {
    if (!ReservationMain.pickup) {
      enqueueSnackbar("Select pickup date", {
        variant: 'error',
        style: { width: '350px' },
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      })
    }else if(!ReservationMain.dropoff) {
      enqueueSnackbar("Select dropoff date", {
        variant: 'error',
        style: { width: '350px' },
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      })
    }else if(!ReservationItems.length) {
      enqueueSnackbar("Select products", {
        variant: 'error',
        style: { width: '350px' },
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      })
    }
    if(!ReservationMain.pickup || !ReservationMain.dropoff || !ReservationItems.length) {
      return;
    }

    setAmount(ReservationMain.prices.total);

    // const payload = {
    //   start_date : ReservationMain.pickup,
    //   end_date : ReservationMain.dropoff,
    //   subtotal : ReservationMain.prices.subtotal,
    //   tax_rate : storeDetails.sales_tax,
    //   tax_amount : ReservationMain.prices,
    //   total_price: ReservationMain.prices.total,
    //   price_table_id: ReservationMain.price_table_id,
    //   stage : 1,
    //   items : ReservationItems,
    // };

    // console.log('dww');

    // createReservation(payload, (jsonRes: any, status?: number | null)=>{
    //   if(status == 201){
    //     enqueueSnackbar("Great, Reserved successfully", {
    //       variant: 'success',
    //       style: { width: '350px' },
    //       autoHideDuration: 3000,
    //       anchorOrigin: { vertical: 'top', horizontal: 'right' },
    //     })
    //   }else{
    //     enqueueSnackbar("Sorry, Reserve failed", {
    //       variant: 'error',
    //       style: { width: '350px' },
    //       autoHideDuration: 3000,
    //       anchorOrigin: { vertical: 'top', horizontal: 'right' },
    //     })
    //   }
    // });
    // event.preventDefault();
  }

  return (
    <BasicLayout>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <ReservationMainDetail sx={{pr: '50px'}}/>
        <Purchase title='Reservation Details' target='/completepurchase' sx={{borderLeft:'1px solid #999', paddingLeft:'50px'}} onComplete={onComplete} />
      </Box>
    </BasicLayout>
  );
}

export default Payment;
