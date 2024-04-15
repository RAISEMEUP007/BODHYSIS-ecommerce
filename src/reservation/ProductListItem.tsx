import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { API_URL } from '../common/AppConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import ExtraItem from './ExtraItem';

interface props {
  product: any;
  extras: Array<any>;
  handleDetailDialogOpen: (product: any) => void;
  sx?: object;
}

const ProductListItem: React.FC<props> = ({ sx, product, extras, handleDetailDialogOpen }) => {
  const [imageLoadError, setImageLoadError] = useState(false);

  console.log(product);
  return (
    <Box
      // disableRipple
      // onClick={() => {
      //   handleDetailDialogOpen(product);
      // }}
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
        </Box>
        <Box style={{position:'relative', paddingBottom:'90px', paddingTop:'12px', marginTop:'20px', borderTop:'1px solid #bababa'}}>
          <Typography style={{textAlign:'left', fontWeight:'700'}}>{"Extras"}</Typography>
          <Box style={{width:'100%', position:'absolute', overflow:'auto'}}>
            <Box style={{whiteSpace:'nowrap', textAlign:'left', padding:"12px 0 6px"}}>
              {extras.map((extra)=>(
                <ExtraItem
                  sx={{display:'inline-block', marginRight:'16px', minWidth:'240px'}}
                  extra={extra}
                  selected={false}
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
