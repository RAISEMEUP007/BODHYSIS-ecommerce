import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { API_URL } from '../common/AppConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';

import { getExtrasDataByDisplayName, getHeaderData, verifyQuantityByDisplayName } from '../api/Product';
import CustomBorderInput from '../common/CustomBorderInput';
import { useSnackbar } from 'notistack';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';
import { useStoreDetails } from '../common/Providers/StoreDetailsProvider/UseStoreDetails';

import ExtraItem from './ExtraItem';
import { calculatePricedEquipmentData } from './CalcPrice';
import { formatDateString } from '../common/Utils';

interface props {
  product: any;
  extras?: Array<any>;
  sx?: object;
}

type formValue = {
  size: any,
  quantity: number,
}

type formValidation = {
  size: boolean | null,
  quantity: boolean | null | 'negative' | 'quantity',
}

const ProductListItem: React.FC<props> = ({ sx, product }) => {

  const { enqueueSnackbar } = useSnackbar();
  const { storeDetails } = useStoreDetails();
  const { ReservationItems, addReservationItems, ReservationMain } = useCustomerReservation();

  const [Product, SetProduct] = useState(product);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [extraItems, setExtraItems] = useState<Array<any>>([]);
  // const [sizes, setSizes] = useState<Array<any>>([]);
  const { matches900 } = useResponsiveValues();

  const [TimeOutVal, setTimeOutVal] = useState<any>(null);

  const [quantities, setQuantities] = useState({
    remainingQuantity: null,
  });

  const [formValues, setFormValues] = useState<formValue>({
    size: null,
    quantity: 1,
  });

  const [formValidation, setFormValidation] = useState<formValidation>({
    size: null,
    quantity: null,
  });

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
    let formValues = {
      size: null,
      quantity: 1,
    }
    if(Product.lines){
      if(Product.lines.length){
        var size = Product.lines[0].linesSizes.split(',')[0];
        // setSizes(Product.lines[0].linesSizes.split(','));
        formValues.size = Product.lines[0].linesSizes.split(',')[0];
      }
      setFormValues(formValues);
    }else {
      // setSizes([]);
    }
  }, [Product]);

  // console.log(ReservationMain);
  useEffect(()=>{
    const calc = async ()=>{
      // console.log(ReservationMain);
      if(Product?.lines[0]?.price_group_id){
        const lines = Product.lines.map((item:any) => ({ ...item, quantity: 1 }));
        const calculatedLines = await calculatePricedEquipmentData(ReservationMain.headerData, ReservationMain.price_table_id, ReservationMain.priceTableData, lines, ReservationMain.pickup, ReservationMain.dropoff);
        // console.log(calculatedLines);
        SetProduct({ ...Product, lines: calculatedLines });
      }
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

  const updateFormValue = (key: string, value: any) => {
    setFormValues(prevState => ({
      ...prevState,
      [key]: value
    }));
    setFormValidation(prevState => ({
      ...prevState,
      [key]: null
    }));
  }

  const updateQuantity = async (value:any) => {
    if(ReservationMain.pickup && ReservationMain.dropoff){
      if(TimeOutVal){
        clearTimeout(TimeOutVal);
        setTimeOutVal(null);
      }
  
      const timeout = setTimeout(async () => {
        const result = await verifyQuantity(value);
        if(result) updateFormValue('quantity', parseInt(value));
        setTimeOutVal(null);
      }, 200);

      setTimeOutVal(timeout);
    }else{
      updateFormValue('quantity', parseInt(value));
      clearTimeout(TimeOutVal);
      setTimeOutVal(null);
    }
  }

  const verifyQuantity = async (value:any) => {
    if(!isNaN(parseInt(value)) && parseInt(value) && value > 0 && ReservationMain.pickup && ReservationMain.dropoff) {
      // setQuantities({
      //   remainingQuantity: null
      // });
      const payload = {
        start_date: formatDateString(ReservationMain.pickup),
        end_date: formatDateString(ReservationMain.dropoff),
        display_name: product.display_name,
        category_id: product.category_id,
        quantity: parseInt(value),
        pre_quantity: ReservationItems.filter(item => item.display_name === product.display_name).length,
      }
      const respose:any = await verifyQuantityByDisplayName(payload);
      // console.log("respose.status", respose.status);
      const data = await respose.json();
      if(respose.status == 200){
        setQuantities(data.quantities);
        return true;
      }else if(respose.status == 400){
        setQuantities(data.quantities);
        setFormValidation(prevState => ({
          ...prevState,
          quantity: 'quantity'
        }));
      }else {
        setQuantities({
          remainingQuantity: null
        });
        enqueueSnackbar("Server Error", {
          variant: 'error',
          style: { width: '300px' },
          autoHideDuration: 3000,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        })
      }
      return false;
    }
    return false;
  };

  useEffect(()=>{
    verifyQuantity(formValues.quantity)
  }, [ReservationItems.length, ReservationMain.dropoff, ReservationMain.pickup])

  const addToCart = () => {
    let flag = true;
    // console.log(formValues);
    const updatedFormValidation = { ...formValidation };
    for (const key in formValues) {
      switch(key){
        case 'quantity':
          if(!formValues.quantity){
            updatedFormValidation.quantity = false;
            flag = false;
          }
          else if (formValues.quantity < 1){
            updatedFormValidation.quantity = 'negative';
            flag = false;
          }else updatedFormValidation.quantity = true;
          break;
        // case 'size':
        //   if(Product.lines && Product.lines.length){
        //     if (!formValues[key as keyof typeof formValues]) {
        //       updatedFormValidation[key as keyof typeof formValues] = false;
        //       flag = false;
        //     } else {
        //       updatedFormValidation[key as keyof typeof formValues] = true;
        //     }
        //   }
        //   break;
      }
    }

    setFormValidation(updatedFormValidation);
    if(flag == false) return false;

    const quantityVerify = verifyQuantity(formValues.quantity);
    if(!quantityVerify){
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
      size: formValues.size,
    }

    let newItems = [];
    
    if(formValues.quantity){
      for(let i=0; i<formValues.quantity; i++){
        newItems.push(newItem);
      }
    }

    addReservationItems(newItems);

    setTimeout(()=>{
      // setFormValues({size:null, quantity:null});
      // let formValues = {
      //   size: null,
      //   quantity: 1,
      // }
      // if(Product.lines){
      //   if(Product.lines.length){
      //     var size = Product.lines[0].linesSizes.split(',')[0];
      //     setSizes(Product.lines[0].linesSizes.split(','));
      //     formValues.size = Product.lines[0].linesSizes.split(',')[0];
      //   }
      //   setFormValues(formValues);
      // }else setSizes([]);

      // setFormValidation({size:null, quantity:null});
      // setExtraItems(extraItems.map(item => ({ ...item, selected: false })));
      verifyQuantity(formValues.quantity);
    }, 100);
  }

  const renderAddToCartFC = () => (
    <Box sx={{width:matches900?'86%':'100%'}}>
      {/* {(Product.lines && Product.lines.length) ? 
        <CustomSelect
          error={formValidation.size === false?true:false}
          label={"Size"}
          value={formValues.size || ''} 
          items={sizes}
          containerstyle={{ marginBottom:'10px', width:matches900?'100%':'47%' }}
          variant={"outlined"}
          helperText={formValidation.size === false?'Not selected':''}
          onChange={(event:any)=>updateFormValue('size', event.target.value)} />
        : <></>
      } */}
      {/* <p>{`Max Available:  ${quantities?.remainingQuantity??''}`}</p> */}
      <Box sx={{display:'flex', flexDirection:matches900?'column':'row', alignItems:'flex-start', justifyContent:'space-between'}}>
        <CustomBorderInput
          error={(formValidation.quantity === false || formValidation.quantity == 'negative')?true:false}
          label="Quantity"
          containerstyle={{ marginBottom:'2px', width:matches900?'100%':'47%' }}
          type="number"
          // min={1}
          inputProps={{
            min:1
          }}
          // value={formValues.quantity} 
          defaultValue={formValues.quantity}
          required={true}
          helperText={
            formValidation.quantity === false
              ? 'Invalid'
              : formValidation.quantity === 'negative'
              ? `Not positive`
              : formValidation.quantity === 'quantity'
              ? `Out of Stock`
              : ''
          }
          onChange={(event)=>updateQuantity(event.target.value)} 
          onScroll={(e)=>{e.preventDefault(); e.stopPropagation();}}
        />
        {/* <CustomNumberInput min={1}/> */}
        <Button 
          variant="contained"
          disabled={formValidation.quantity === 'quantity' || ReservationMain.dropoff === null}
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
