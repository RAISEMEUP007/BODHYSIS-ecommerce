import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { API_URL } from '../common/AppConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';

import { getExtrasDataByDisplayName } from '../api/Product';
import CustomBorderInput from '../common/CustomBorderInput';
import { useSnackbar } from 'notistack';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';
import { useStoreDetails } from '../common/Providers/StoreDetailsProvider/UseStoreDetails';

import ExtraItem from './ExtraItem';
import { calculatePricedEquipmentData } from './CalcPrice';

interface props {
  product: any;
  sx?: object;
}
type formValidation = boolean | null | 'negative' | 'quantity';

const ProductListItem: React.FC<props> = ({ sx, product }) => {

  const { enqueueSnackbar } = useSnackbar();
  const { storeDetails } = useStoreDetails();
  const { ReservationItems, addReservationItems, ReservationMain } = useCustomerReservation();

  const [Product, SetProduct] = useState(product);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [extraItems, setExtraItems] = useState<Array<any>>([]);
  const { matches900 } = useResponsiveValues();

  const [quantity, setQuantity] = useState<number>(1);
  const [validation, setValidtaion] = useState<formValidation>(null);

  useEffect(()=>{
    const payload = {
      display_name: Product.display_name,
      brand_id: storeDetails.brand_id,
    }
    getExtrasDataByDisplayName(payload, (jsonRes, status)=>{
      if(status == 200 && Array.isArray(jsonRes)){
        setExtraItems(jsonRes.map(item=>({ ...item, selected: item?.is_default_selected?true:false })));
      }else setExtraItems([]);
    })
  }, [Product.display_name])

  useEffect(()=>{
    const calc = async ()=>{
      let lines = [];
      if(Product?.lines[0]?.price_group_id){
        lines = Product.lines.map((item:any) => ({ ...item, quantity: 1 }));
      }else{
        lines = [{
          price_group_id: Product.priceGroupIds.split(',')[0],
          quantity: 1,
        }]
      }
      const calculatedLines = await calculatePricedEquipmentData(ReservationMain.headerData, ReservationMain.price_table_id, ReservationMain.priceTableData, lines, ReservationMain.pickup, ReservationMain.dropoff);
      SetProduct({ ...Product, lines: calculatedLines });
    }

    const timeout = setTimeout(()=>{calc()}, 100);
    return ()=>{clearTimeout(timeout)}
  }, [product, 
    ReservationMain.headerData,
    ReservationMain.price_table_id,
    ReservationMain.priceTableData,
    ReservationMain.pickup, 
    ReservationMain.dropoff
  ]);

  const setSelected = (index:number, selected:boolean) => {
    const updatedExtras = [...extraItems];
    updatedExtras[index] = { ...updatedExtras[index], selected };
    setExtraItems(updatedExtras);
  };

  const verifyQuantity = async () => {
    if(quantity > 0) {
      if(ReservationMain.availableSheet){
        const pre_quantity = ReservationItems.filter(item => item.display_name === product.display_name).length;
        if(ReservationMain.availableSheet[product.display_name] < (quantity + pre_quantity)){
          setValidtaion('quantity');
          return false;
        }else{
          setValidtaion(null);
          return true;
        }
      }else{
        setValidtaion(null);
      }
    }else{
      setValidtaion('negative');
    }
    return false;
  };

  useEffect(()=>{
    verifyQuantity();
  }, [quantity, ReservationItems.length, ReservationMain.availableSheet])

  const addToCart = () => {
    const result = verifyQuantity();
    if(!result){
      enqueueSnackbar("This product is out of stock.", {
        variant: 'error',
        style: { width: '350px' },
        autoHideDuration: 3000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      })
      return false;
    }
    
    const newItem = {
      family_id: Product.id,
      family: Product.family,
      display_name: Product.display_name,
      quantity: 1, 
      price_group_id: Product?.lines[0]?.price_group_id ?? 0, 
      extras: extraItems.filter(item => item.selected),
      img_url: Product?.img_url ?? '',
    }

    let newItems = [];
    
    if(quantity>0){
      for(let i=0; i<quantity; i++){
        newItems.push(newItem);
      }
    }

    addReservationItems(newItems);
  }

  const renderAddToCartFC = () => (
    <Box sx={{width:matches900?'86%':'100%'}}>
      <Box sx={{display:'flex', flexDirection:matches900?'column':'row', alignItems:'flex-start', justifyContent:'space-between'}}>
        <CustomBorderInput
          error={(validation === false || validation == 'negative')?true:false}
          label="Quantity"
          containerstyle={{ marginBottom:'2px', width:matches900?'100%':'47%' }}
          type="number"
          // min={1}
          inputProps={{
            min:1
          }}
          value={quantity}
          required={true}
          helperText={
            validation === false
              ? 'Invalid'
              : validation === 'negative'
              ? `Not positive`
              : validation === 'quantity'
              ? `Out of Stock`
              : ''
          }
          onChange={(event) => setQuantity(parseInt(event.target.value))}
          onScroll={(e)=>{e.preventDefault(); e.stopPropagation();}}
        />
        {/* <CustomNumberInput min={1}/> */}
        <Button 
          variant="contained"
          disabled={validation === 'quantity' || ReservationMain.dropoff === null}
          sx={{
            // mt:matches900?'20px':'26px',
            alignSelf:'flex-end',
            marginTop:'20px',
            padding:'15px 0',
            textTransform: 'none',
            width:matches900?'100%':'47%',
          }}
          onClick={()=>{addToCart()}}
        >{"Add to Cart"}</Button>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{marginBottom:'10px', ...sx}}
    >
      <Box sx={{ border: '1px solid #ABABAB', padding: matches900?'34px 30px 30px':'16px', borderRadius: '10px', boxSizing:'border-box', width: '100%' }}>
        {!matches900 && 
          <Box display={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
            <Typography style={{fontSize:'24px', fontWeight:'700', font:'Roboto'}}>{Product?.display_name ?? ''}</Typography>
            <Typography style={{fontSize:'24px', fontWeight:'700', color:'#4599D6', font:'Roboto'}}>{Product?.lines[0]?.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) ?? ''}</Typography>
          </Box>}
        <Box sx={{ display: 'flex', flexDirection: matches900?'row':'column-reverse' }}>
          <Box sx={{ flex: 1, textAlign:'left' }}>
            {matches900 && <Typography style={{fontSize:'24px', fontWeight:'700', font:'Roboto'}}>{Product?.display_name ?? ''}</Typography>}
            <Typography dangerouslySetInnerHTML={{ __html: Product?.summary ?? '' }} />
            <Typography dangerouslySetInnerHTML={{ __html: Product?.description }} />
          </Box>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            {matches900 && <Typography style={{fontSize:'24px', fontWeight:'700', alignSelf:'flex-end', color:'#4599D6', font:'Roboto', marginRight:'16px', marginBottom:'10px'}}>{Product?.lines[0]?.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) ?? ''}</Typography>}
            <img 
              src={API_URL + Product.img_url} 
              alt={Product.display_name} 
              style={{ height: '150px', width: 'auto', display:imageLoadError?'none':'block', marginBottom:'16px' }}
              onError={() =>{setImageLoadError(true)}}
              onLoad={()=>{setImageLoadError(false)}}
            />
            {imageLoadError && <FontAwesomeIcon icon={faImage} style={{height:'130px', color:"#333", marginBottom:'16px'}}/>}
            {matches900 && renderAddToCartFC()}
          </Box>
        </Box>
        <Box style={{position:'relative', paddingBottom:'92px', paddingTop:'12px', marginTop:'20px', borderTop:'1px solid #bababa'}}>
          <Typography style={{textAlign:'left', fontWeight:'700'}}>{"Extras"}</Typography>
          <Box style={{width:'100%', position:'absolute', overflow:'auto'}}>
            <Box style={{whiteSpace:'nowrap', textAlign:'left', padding:"12px 0 6px"}}>
              {extraItems.length > 0 && extraItems.map((extra, index)=>(
                <ExtraItem
                  key={index}
                  sx={{display:'inline-block', marginRight:'16px', minWidth:'240px'}}
                  extra={extra}
                  selected={extra.selected}
                  onClick={()=>{setSelected(index, !extra.selected)}}
                />
              ))}
            </Box>
          </Box>
        </Box>
        {!matches900 && (<Box sx={{mt:'24px', pt:'16px', borderTop:'1px solid #ccc'}}>{renderAddToCartFC()}</Box>)}
      </Box>
    </Box>
  )
}

export default ProductListItem;
