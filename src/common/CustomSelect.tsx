import React from 'react';
import { Typography, FormControl, Select, MenuItem, SelectChangeEvent, SelectProps, FormHelperText } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

type props = {
  containerstyle?: any;
  label: string;
  labelVariant?: Variant;
  value?: any;
  items: Array<any>;
  helperText?: string;
}

const CustomSelect: React.FC<props & SelectProps> = ({ label, containerstyle, labelVariant, value, items, helperText, ...rest }) => {
  return (
    <FormControl sx={containerstyle}>
      <Typography variant={labelVariant || 'subtitle2'}>{label}</Typography>
      <Select
        labelId="select-placeholder-label"
        value={value}
        inputProps={{ 
          'aria-label': 'select',
          style: { 
            border: 'none',
            boxShadow: '2px 2px 2px #ccc', 
            padding: '14px 10px',
            backgroundColor: 'white', 
            borderRadius: '3px',
          }
        }}
        style={{boxShadow: '2px 2px 2px #ccc', border:'none', padding: '0px',}}
        {...rest}
      >
        {items.map((item: any) => {
          return (
            <MenuItem
              key={item}
              value={item}
            >
              {item}
            </MenuItem>
          )
        })}
      </Select>
      {helperText && <FormHelperText style={{color: '#f44336', marginLeft: '10px', fontSize: '14px'}}>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default CustomSelect;
