import React from 'react';
import { useParams } from 'react-router';
import { Box, Link, Typography, } from '@mui/material';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faUserCircle, } from '@fortawesome/free-regular-svg-icons';

import BasicLayout from '../common/BasicLayout';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';

const EmailSent: React.FC = () => {

  const { matches900 } = useResponsiveValues();
  const { str } = useParams();

  const styles = pageStyles(matches900);
  const renderLoigin = () => (
    <BasicLayout>
      <Box sx={styles.containerStyle}>
        <Box sx={styles.description}>
          <FontAwesomeIcon icon={faUserCircle} style={{width:'43px', height:'43px'}}/>
          <Typography sx={{ml:'16px', fontSize:'18px'}}>{str}</Typography>
        </Box>
        <Box sx={{mt:'10px'}}><Link href="/login" >{"Go to login"}</Link></Box>
      </Box>
    </BasicLayout>
  );

  return renderLoigin();
}

const pageStyles = (matches900:boolean) => ({
  containerStyle:{
    m: matches900 ? 5 : 2, 
    mt: matches900 ? 8 : 4, 
    backgroundColor:'#F0F0F0', 
    p: matches900 ? 4 : 3, 
    border:'1px solid #A3A3A3', 
    borderRadius:'5px', 
  },
  description:{
    display:'flex', 
    flexDirection:'row', 
    alignItems: matches900?'center':'flex-start'
  },
  signInInput: { 
    width: '400px', 
    mt: '40px',
  },
  logInButton: { 
    padding:'10px 50px', 
    fontSize:'16px', 
    textTransform: 'none',
    mt: matches900? '30px' : '10px',
  },
})

export default EmailSent;
