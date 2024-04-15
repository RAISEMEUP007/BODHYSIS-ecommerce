import React from 'react';
import { Box, Typography, Input, Link } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';

interface props{
  sx?: any;
}

const LogInAs: React.FC<props> = ({ sx }) => {

  const fullName = localStorage.getItem('full-name');

  return (
    <Box sx={sx}>
      <Box sx={{display:'flex', alignItems:'center', backgroundColor:'#EFFDEC', border:'1px solid #69B956', padding:'10px 20px'}}>
        <FontAwesomeIcon icon={faUserCircle} style={{marginRight:'20px', height:'2.5em'}}/>
        <Box>
          <Typography style={{ font:"Roboto", fontWeight: '400'}}>
            {`You are currently logged in as `}<span style={{ font:"Roboto", fontWeight: '800', }}>{fullName}</span>{`. Your order will use your attached contact and billing information.`}
          </Typography>
          <Typography style={{ font:"Roboto", fontWeight: '400'}}>
            {/* {`You are currently logged in as `}<span style={{ font:"Roboto", fontWeight: '800', }}>{fullName}</span>{`. Your order will use your attached contact and billing information.`} */}
            <Link>{`Edit account details`}</Link>
            <Link style={{marginLeft:'20px'}}>{`Not `}<span style={{ font:"Roboto", fontWeight: '800', }}>{fullName}</span>{`? Log out now`}</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default LogInAs;
