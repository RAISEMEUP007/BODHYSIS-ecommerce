import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useStoreDetails } from './Providers/StoreDetailsProvider/UseStoreDetails';
import { API_URL } from './AppConstants';
import { faCarTunnel, faCartShopping} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUserCircle, faImage, faChessBishop, } from '@fortawesome/free-regular-svg-icons';

interface Props {
  children: React.ReactNode;
  sx?: object;
  containerStyle?: object;
}

const BasicLayout: React.FC<Props> = ({ children, sx, containerStyle }) => {
  const { storeDetails }:{storeDetails:any} = useStoreDetails();
  const [imageLoadError, setImageLoadError] = useState(false);

  return (
    <Box sx={{boxSizing:'border-box', ...sx}}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems:'center', marginBottom:'4px', justifyContent:'space-between', backgroundColor:'#F0F0F0', borderBottom:'1px solid #b3b3b3', boxShadow:'0px 3px 4px #ccc', padding:'20px 3%'}}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
          <img
            src={API_URL + storeDetails?.logo_url}
            alt={storeDetails?.store_name}
            height={75}
            style={{display:imageLoadError?'none':'block'}}
            onError={() =>{setImageLoadError(true)}}
            onLoad={()=>{setImageLoadError(false)}}
          />
          {imageLoadError && <FontAwesomeIcon icon={faImage} style={{height:'75px', color:"#333"}}/>}
          <p style={{ textTransform: 'uppercase', fontWeight: 'bold', margin: '0px 0px 5px 10px', }}>{storeDetails?.store_name}</p>
        </Box>
        <Box>
          <FontAwesomeIcon icon={faUserCircle} size='2x' style={{marginRight:'20px'}}/>
          <FontAwesomeIcon icon={faCartShopping} size='2x'/>
        </Box>
      </Box>
      <Box sx={containerStyle}>
        {children}
      </Box>
    </Box>
  );
}

export default BasicLayout;