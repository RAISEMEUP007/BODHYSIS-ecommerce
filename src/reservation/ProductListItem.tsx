import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { API_URL } from '../common/AppConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import ExtraItem from './ExtraItem';
import CustomBorderInput from '../common/CustomBorderInput';
import CustomSelect from '../common/CustomSelect';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';

interface props {
  product: any;
  extras: Array<any>;
  sx?: object;
}

type formValue = {
  size: any,
  quantity: number | null,
}

type formValidation = {
  size: boolean | null,
  quantity: boolean | null | 'negative',
}

const ProductListItem: React.FC<props> = ({ sx, product, extras }) => {

  const { ReservationItems, setReservationItems, addReservationItem } = useCustomerReservation();
  const [imageLoadError, setImageLoadError] = useState(false);
  const [extraItems, setExtraItems] = useState<Array<any>>([]);
  const [sizes, setSizes] = useState<Array<any>>([]);
  const { matches900 } = useResponsiveValues();

  const [formValues, setFormValues] = useState<formValue>({
    size: null,
    quantity: null,
  });

  const [formValidation, setFormValidation] = useState<formValidation>({
    size: null,
    quantity: null,
  });

  useEffect(()=>{
    if(extras.length) setExtraItems(extras.map(item => ({ ...item, selected: false })));
  }, [extras])

  useEffect(()=>{
    let formValues = {
      size: null,
      quantity: 1,
    }
    if(product.lines){
      if(product.lines.length){
        var size = product.lines[0].linesSizes.split(',')[0];
        setSizes(product.lines[0].linesSizes.split(','));
        formValues.size = product.lines[0].linesSizes.split(',')[0];
      }
      setFormValues(formValues);
    }else setSizes([]);
  }, [product]);

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

  const addToCart = () => {
    let flag = true;
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
        case 'size':
          if(product.lines && product.lines.length){
            if (!formValues[key as keyof typeof formValues]) {
              updatedFormValidation[key as keyof typeof formValues] = false;
              flag = false;
            } else {
              updatedFormValidation[key as keyof typeof formValues] = true;
            }
          }
          break;
      }
    }
    setFormValidation(updatedFormValidation);
    if(flag == false) return false;

    const newItem = {
      family_id: product.id,
      family: product.family,
      display_name: product.display_name,
      quantity: 1, 
      price_group_id: product?.lines[0]?.price_group_id ?? 0, 
      extras: extraItems.filter(item => item.selected),
      special_instructions: "", 
      img_url: product?.img_url ?? '',
      size: formValues.size,
    }

    let updatedReservationItems = [...ReservationItems];
    
    if(formValues.quantity){
      for(let i=0; i<formValues.quantity; i++){
        updatedReservationItems.push(newItem);
      }
    }

    setReservationItems(updatedReservationItems);

    // addReservationItem(newItem);

    setTimeout(()=>{
      // setFormValues({size:null, quantity:null});
      let formValues = {
        size: null,
        quantity: 1,
      }
      if(product.lines){
        if(product.lines.length){
          var size = product.lines[0].linesSizes.split(',')[0];
          setSizes(product.lines[0].linesSizes.split(','));
          formValues.size = product.lines[0].linesSizes.split(',')[0];
        }
        setFormValues(formValues);
      }else setSizes([]);

      setFormValidation({size:null, quantity:null});
      setExtraItems(extras.map(item => ({ ...item, selected: false })));
    }, 100);
  }

  const renderAddToCartFC = () => (
    <Box sx={{width:matches900?'86%':'100%'}}>
      {/* {(product.lines && product.lines.length) ? 
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
      <Box sx={{display:'flex', flexDirection:matches900?'column':'row', alignItems:'flex-start', justifyContent:'space-between'}}>
        <CustomBorderInput
          error={(formValidation.quantity === false || formValidation.quantity == 'negative')?true:false}
          label="Quantity"
          containerstyle={{ marginBottom:'10px', width:matches900?'100%':'47%' }}
          type="number"
          // min={1}
          inputProps={{
            min:1
          }}
          value={formValues.quantity || ''} 
          required={true}
          helperText={
            formValidation.quantity === false
              ? 'Invalid'
              : formValidation.quantity === 'negative'
              ? `Not positive`
              : ''
          }
          onChange={(event)=>updateFormValue('quantity', event.target.value)} 
          onScroll={(e)=>{e.preventDefault(); e.stopPropagation();}}
        />
        <Button 
          variant="contained"
          sx={{
            mt:matches900?'20px':'26px',
            padding:'14px 0',
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
        {!matches900 && <Typography style={{fontSize:'24px', fontWeight:'700', font:'Roboto'}}>{product?.display_name ?? ''}</Typography>}
        <Box sx={{ display: 'flex', flexDirection: matches900?'row':'column-reverse' }}>
          <Box sx={{ flex: 1, textAlign:'left' }}>
            {matches900 && <Typography style={{fontSize:'24px', fontWeight:'700', font:'Roboto'}}>{product?.display_name ?? ''}</Typography>}
            <Typography dangerouslySetInnerHTML={{ __html: product?.summary ?? '' }} />
            <Typography dangerouslySetInnerHTML={{ __html: product?.description }} />
          </Box>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <img 
              src={API_URL + product.img_url} 
              alt={product.display_name} 
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
              {extraItems.length && extraItems.map((extra, index)=>(
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
