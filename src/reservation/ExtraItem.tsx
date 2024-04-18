import React, { useState } from 'react';

import { Box, Typography, Checkbox } from '@mui/material';

import { API_URL } from '../common/AppConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';

interface ExtraItemDetailProps {
  extra: any;
  selected: boolean;
  onClick?: () => void;
  sx?: any;
}

const ExtraItem: React.FC<ExtraItemDetailProps> = ({ sx, extra, selected, onClick }) => {
  const [imageLoadError, setImageLoadError] = useState(false);

  return (
    <Box style={sx}>
      <Box 
        style={{ 
          display:'flex', 
          flexDirection:'row', 
          alignItems:'center', 
          padding:'12px', 
          border:'1px solid #999', 
          borderRadius:'4px', 
          backgroundColor:'#F8F8F8',
          cursor: 'pointer',
        }} 
        onClick={onClick}>
        <img 
          style={{width:'auto', height:'50px', display:imageLoadError?'none':'block'}}
          src={API_URL + (extra?.img_url || '')} 
          alt="extra_img" 
          onError={() =>{setImageLoadError(true)}}
          onLoad={()=>{setImageLoadError(false)}}
        />
        {imageLoadError && <FontAwesomeIcon icon={faImage} style={{width:'40px', height:'40px', color:"#333"}}/>}
        <Box style={{flex:1, marginLeft:'12px'}}>
          <Typography style={{paddingRight:'6px', marginBottom:'3px'}}>{extra.name}</Typography>
          <Box style={{display:'flex', alignItems:'center', justifyContent:'flex-end'}}>
            <b style={{color:'#4599D6', paddingRight:'10px'}}>{extra.fixed_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} </b>
            <Checkbox style={{padding:0, paddingTop:'1px', color:'#4599D6'}} checked={selected} onChange={onClick} />
          </Box>
        </Box>
      </Box>
    </Box>
 );
};

export default ExtraItem;
