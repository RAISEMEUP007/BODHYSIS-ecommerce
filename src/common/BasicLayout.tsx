import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import bikeIcon from "../img/bikeIcon.png";

interface Props {
  children: React.ReactNode;
  sx?: object;
}

const BasicLayout: React.FC<Props> = ({ children, sx }) => {
  return (
    <Box sx={{ padding: '30px 50px', ...sx}}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
        <img src={bikeIcon} alt="iconImage" width={50} height={75} />
        <p style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{'ISLAND CRUISERS'}</p>
      </Box>
      {children}
    </Box>
  );
}

export default BasicLayout;
