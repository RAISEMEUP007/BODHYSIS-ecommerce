import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { API_URL } from '../common/AppConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import ExtraItem from './ExtraItem';
import CustomBorderInput from '../common/CustomBorderInput';
import CustomSelect from '../common/CustomSelect';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';

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

  const { addReservationItem } = useCustomerReservation();
  const [imageLoadError, setImageLoadError] = useState(false);
  const [extraItems, setExtraItems] = useState<Array<any>>([]);

  const [formValues, setFormValues] = useState<formValue>({
    size: null,
    quantity: null,
  });

  const [formValidation, setFormValidation] = useState<formValidation>({
    size: null,
    quantity: null,
  });

  useEffect(()=>{
    setExtraItems(extras.map(item => ({ ...item, selected: false })));
  }, [extras])

  const setSelected = (index:number, selected:boolean) => {
    const updatedExtras = [...extraItems];
    updatedExtras[index] = { ...updatedExtras[index], selected };
    setExtraItems(updatedExtras);
  };

  const updateFormValue = (key: string, value: any) => {
    // if(key == 'quantity'){
    //   if (value.includes('e') || parseFloat(value) < 0) return;
    // }
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
    console.log('dd');
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
        default:
          if (!formValues[key as keyof typeof formValues]) {
            updatedFormValidation[key as keyof typeof formValues] = false;
            flag = false;
          } else {
            updatedFormValidation[key as keyof typeof formValues] = true;
          }
          break;
      }
    }
    setFormValidation(updatedFormValidation);
    if(flag == false) return false;

    const newItem = {
      family_id: product.id,
      quantity: formValues.quantity, 
      price_group_id: product?.lines[0]?.price_group_id ?? 0, 
      extras: extraItems.filter(item => item.selected),
      special_instructions: "", 
      img_url: product?.img_url ?? ''
    }
    addReservationItem(newItem);

    setTimeout(()=>{
      setFormValues({size:null, quantity:null});
      setFormValidation({size:null, quantity:null});
      setExtraItems(extras.map(item => ({ ...item, selected: false })));
    }, 100);
  }

  return (
    <Box
      sx={{marginBottom:'10px', ...sx}}
    >
      <Box sx={{ border: '1px solid #ABABAB', padding: '30px', borderRadius: '10px', boxSizing:'border-box', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <img 
            src={API_URL + product.img_url} 
            alt={product.display_name} 
            style={{ width: '200px', display:imageLoadError?'none':'block' }}
            onError={() =>{setImageLoadError(true)}}
            onLoad={()=>{setImageLoadError(false)}}
          />
          {imageLoadError && <FontAwesomeIcon icon={faImage} style={{height:'130px', paddingRight:'60px', paddingLeft:'10px', color:"#333"}}/>}
          <Box sx={{ flex: 1, ml: '20px', textAlign:'left' }}>
            <Typography style={{fontSize:'24px', fontWeight:'700', font:'Roboto'}}>{product?.display_name ?? ''}</Typography>
            <Typography>{product?.summary ?? ''}</Typography>
            <Typography>{product?.description ?? ''}</Typography>
              {/* <h2 style={{ marginTop: 0, marginBottom: '20px' }}>{product?.display_name ?? ''}</h2> */}
              {/* <div>{product?.summary ?? ''}</div> */}
              {/* <div>{product?.size ?? ''}</div> */}
              {/* <div>25 fit rides 53 to 52</div> */}
              {/* <div>{product?.description ?? ''}</div> */}
              {/* <div>baskets needed</div>
              <div style={{ marginTop: '20px' }}>Medium rider weight 250lb</div> */}
          </Box>
          <Box sx={{display:"flex", flexDirection:'column', width:'130px'}}>
            <CustomSelect
              error={formValidation.size === false?true:false}
              label={"Size"}
              value={formValues.size || ''} 
              items={[1,2,3]}
              containerstyle={{ marginBottom:'10px' }}
              variant={"outlined"}
              helperText={formValidation.size === false?'Not selected':''}
              onChange={(event:any)=>updateFormValue('size', event.target.value)} />
            <CustomBorderInput
              error={(formValidation.quantity === false || formValidation.quantity == 'negative')?true:false}
              label="Quantity"
              type="number"
              // min={1}
              value={formValues.quantity || ''} 
              required={true}
              helperText={
                formValidation.quantity === false
                  ? 'Invalid'
                  : formValidation.quantity === 'negative'
                  ? `Invalid`
                  : ''
              }
              onChange={(event)=>updateFormValue('quantity', event.target.value)} />
            <Button 
              variant="contained"
              sx={{
                mt:'16px',
                padding:'14px 0'
              }}
              onClick={()=>{addToCart()}}
            >{"Add to Cart"}</Button>
          </Box>
        </Box>
        <Box style={{position:'relative', paddingBottom:'92px', paddingTop:'12px', marginTop:'20px', borderTop:'1px solid #bababa'}}>
          <Typography style={{textAlign:'left', fontWeight:'700'}}>{"Extras"}</Typography>
          <Box style={{width:'100%', position:'absolute', overflow:'auto'}}>
            <Box style={{whiteSpace:'nowrap', textAlign:'left', padding:"12px 0 6px"}}>
              {extraItems.map((extra, index)=>(
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
      </Box>
    </Box>
  )
}

export default ProductListItem;
