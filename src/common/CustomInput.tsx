import React from 'react';
import { Box, Typography, Input } from '@mui/material';

interface props{
  sx: any;
  label: string;
  placeholder: string;
  value: string | number | null;
  type?: string;
  min?: number | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<props> = ({ sx, label, placeholder, value, type = "text", min, onChange }) => {
  return (
    <Box sx={sx}>
      <Typography sx={{ fontWeight: '900', fontSize: "12px" }}>{label}</Typography>
      <Input sx={{ pl: 1, pr: 1, width: '100%' }} placeholder={placeholder} value={value} type={type} inputProps={{min: min}} onChange={onChange}/>
    </Box>
  )
}

export default CustomInput;
