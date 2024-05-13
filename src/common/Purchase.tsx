import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Box, Typography, Button, Alert, Link, Collapse, List } from '@mui/material';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import { LoadingButton } from '@mui/lab';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
// import { TransitionGroup } from 'react-transition-group';

import { useCustomerReservation } from './Providers/CustomerReservationProvider/UseCustomerReservation';
import { useStoreDetails } from './Providers/StoreDetailsProvider/UseStoreDetails';
import { useMenuValues } from './Providers/MenuValuesProvider/UseMenuValues';
import { useResponsiveValues } from './Providers/DimentionsProvider/UseResponsiveValues';
import CustomBorderInput from './CustomBorderInput';

interface Props {
  title: string;
  buttonTitle: string;
  isLoading?:boolean;
  isShowItems?:boolean;
  isRemovalItems?:boolean;
  isDisableDriverTip?:boolean;
  onComplete?: (event: any) => void;
}

type inputValidation = {
  driver_tip: boolean | null | 'negative',
}

const Purchase: React.FC<Props> = ({ title, buttonTitle, isLoading, isShowItems, isRemovalItems, isDisableDriverTip, onComplete }) => {

  const { ReservationItems, ReservationMain, setReservationValue, removeReservationItem } = useCustomerReservation();
  const { storeDetails } = useStoreDetails();
  const { menuValues } = useMenuValues();
  const { matches900 } = useResponsiveValues();

  const [inputValidation, setInputValidation] = useState<inputValidation>({
    driver_tip: null,
  });
  const [ expand, setExpand ] = useState<boolean>(true);
  
  const renderOrderDetails = () => (
    <Box sx={{
      backgroundColor:'#F0F0F0',
      padding:'40px',
      width: matches900? '450px':'100%',
      height: matches900? '100%':'auto',
      boxSizing: 'border-box',
    }}>
      <Typography variant='h4' sx={{fontSize:'32px', textAlign:'center', fontWeight:700}}>{title}</Typography>
      <Box sx={{display:isShowItems?'block':'none', border:'1px solid #999', backgroundColor:'#F8F8F8', marginTop:'24px', borderRadius:'4px', padding:"0, 16px"}}>
        <Box style={{display:'flex', alignItems:'center', padding:'14px', cursor:'pointer', borderBottom:'1px solid #999'}} onClick={()=>{setExpand(!expand)}}>
          <ExpandCircleDownIcon style={{color:"#999999"}}/>
          <Typography sx={{fontWeight:600, fontSize:'18px', paddingLeft:'10px'}}>{"Cart Items"}</Typography>
        </Box>
        <Collapse in={expand} timeout={400} easing={"ease-in-out"}>
          <List sx={{padding:'0px 14px'}}>
            {ReservationItems.length ?
              <>
                {ReservationItems.map((item: any, index: number) => { 
                  return (
                    <Box key={index} sx={{padding:'12px 2px', borderBottom:'1px solid #999', marginBottom:'-1px'}}>
                      <Box sx={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                        <Typography sx={{fontWeight:700, fontSize:'18px'}}>{item.display_name}</Typography>
                        <Box display={'flex'}>
                          <Typography sx={{fontWeight:700, fontSize:'16px', color:'#4599D6', marginRight:'15px', marginLeft:'4px'}}>{item.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Typography>
                          <Box 
                            style={{display:isRemovalItems?'block':'none', cursor:'pointer'}} 
                            onClick={()=>{removeReservationItem(index)}} >
                            <FontAwesomeIcon icon={faCircleXmark} style={{height:'20px', width:'20px', marginTop:'2px', color:"#4599D6"}}/>
                          </Box>
                        </Box>
                      </Box>
                      {/* <Box sx={{display:'flex', flexDirection:'row', mt:'6px', mb:'4px'}}>
                        <Typography sx={{fontWeight:600, fontSize:'16px', marginRight:'60px'}}>{`Quantity: ${item.quantity}`}</Typography>
                        <Typography sx={{fontWeight:700, fontSize:'16px', color:'#4599D6',}}>{item.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Typography>
                      </Box> */}
                      {(item.extras && item.extras.length) ?
                        <>
                          {item.extras.map((extra: any, index: number) => {
                            return (
                              <Typography key={index} sx={{fontWeight:400, ml:'20px'}}>{extra.name}</Typography>
                            )
                          })}
                        </>
                      : <Typography sx={{fontWeight:400, ml:'20px'}}>{"No extras"}</Typography>}
                    </Box>
                  )
                })}
              </>
            : <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '15px', color: '#999' }}>{"No one reserved"}</div>}
          </List>
        </Collapse>
      </Box>
      <Typography sx={{fontSize:'18px', fontWeight:500, marginTop:'40px'}}><b>{"Reservation Timing"}</b></Typography>
      <Box sx={{m:"10px 0px 16px"}}>
        <Typography sx={{fontSize:'21px', fontWeight:700}}>
          <b>{ReservationMain.pickup ? dayjs(ReservationMain.pickup).format('MMMM DD, YYYY') : 'n/a'} &nbsp;-&nbsp; {ReservationMain.dropoff ? dayjs(ReservationMain.dropoff).format('MMMM DD, YYYY') : 'n/a'}</b>
        </Typography>
      </Box>
      {/* {ReservationMain.dropoff && */}
      <Collapse in={ReservationMain.dropoff?true:false}>
        <Alert severity="warning" icon={<ErrorOutlineOutlinedIcon style={{marginTop:'4px', fontSize:'26px'}}/>} style={{color:'black', border:'1px solid #F9C02F', fontSize:'16px'}}>
          {`Your reservation `}
          <b style={{fontSize:'1.1em', fontWeight:700}}>ends</b>
          {` at `}
          <b style={{fontSize:'1.1em', fontWeight:700}}>8:00 am</b>
          {` on `}
          <b style={{fontSize:'1.1em', fontWeight:700}}>{ReservationMain.dropoff ? dayjs(ReservationMain.dropoff).format('MMMM DD, YYYY') : 'n/a'}</b>
        </Alert>
      </Collapse>
      <Box>
        <Typography sx={{fontSize:'20px', fontWeight:500, marginTop:'30px'}}><b>{"Driver Tip"}</b></Typography>
        <Box sx={{display:'flex', flexDirection:'row', alignItems:'flex-start', justifyContent:'space-between'}}>
          <Typography sx={{fontWeight:400, marginTop:'18px'}}>{"Tip"}</Typography>
          <CustomBorderInput 
            error={(inputValidation.driver_tip === false || inputValidation.driver_tip == 'negative')?true:false}
            type="number"
            defaultValue={ReservationMain.driver_tip.toFixed(2)}
            disabled={isDisableDriverTip}
            inputProps={{
              min: 0,
              type: 'number',
              step: '0.01',
              pattern: '\\d*\\.\\d{2}',
            }}
            onChange={(event)=>{
              const value = isNaN(parseFloat(event.target.value)) ? '' : parseFloat(event.target.value).toFixed(2);
              if(parseFloat(value) < 0){
                setInputValidation({driver_tip: 'negative'});
                // setReservationValue('driver_tip', 0);
              }else {
                setInputValidation({driver_tip:null});
                setReservationValue('driver_tip', parseFloat(value));
              }
            }}
            onBlur={(event)=>{
              const value = isNaN(parseFloat(event.target.value)) ? '' : parseFloat(event.target.value).toFixed(2);
              if(parseFloat(value) < 0){
                setInputValidation({driver_tip: 'negative'});
                setReservationValue('driver_tip', 0);
              }else {
                setInputValidation({driver_tip:null});
                setReservationValue('driver_tip', parseFloat(value));
              }
            }}
            helperText={
              inputValidation.driver_tip === false
                ? 'Invalid'
                : inputValidation.driver_tip === 'negative'
                ? `Should not be negative`
                : ''
            }
          />
        </Box>
        <Typography sx={{textAlign:'center', fontSize:'14px', padding:'16px 16px 10px'}}>{"100% of your tip will go to your driver for their satisfaction."}</Typography>
      </Box>
      <Box sx={{ mt:'30px', mb: '20px' }}>
        <Box sx={styles.purchase}>
          <div>{"Subtotal"}</div>
          <div>{ReservationMain.prices.subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
        </Box>
        <Box sx={styles.purchase}>
          <div>{"Discount"}</div>
          <div>{ReservationMain.prices.discount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
        </Box>
        <Box sx={styles.purchase}>
          <div>{`Tax (${(storeDetails.sales_tax ? (storeDetails.sales_tax / 100).toLocaleString(undefined, {style: 'percent'}) : 'n/a')})`}</div>
          <div>{ReservationMain.prices.tax.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
        </Box>
        <Box sx={[styles.purchase, {borderTop:'1px solid black', marginTop:'12px', paddingTop:'12px'}]}>
          <div><b>{"Total"}</b></div>
          <div><b>{ReservationMain.prices.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</b></div>
        </Box>
      </Box>
      {onComplete && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '24px' }}>
          <LoadingButton
            variant="contained"
            sx={{ padding:'12px 0', width:'100%', textTransform: 'none', fontSize:'16px' }}
            loading={isLoading}
            onClick={onComplete}
          >
            {buttonTitle}
          </LoadingButton>
        </Box>
      )}
      <Typography style={{textAlign:'center', marginTop:'20px', fontSize:'14px'}}>
        {`Having trouble checking out and need help? Contact our team at `}
        <Link>{`(843) 785-4321.`}</Link>
      </Typography>
    </Box>
  );
  
  return (
    matches900 ? (
      <Collapse
        component="div"
        in={menuValues.cartExpand} 
        timeout={400} 
        easing="ease-in-out"
        orientation="horizontal"
      >
        {renderOrderDetails()}
      </Collapse>
    ) : (
      renderOrderDetails()
    )
  );
  

}

const styles = {
  purchase: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
    fontSize:'18px',
    fontWeight: 400,
  }
}

export default Purchase;
