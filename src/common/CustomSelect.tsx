import React from 'react';
import { Typography, FormControl, Select, MenuItem, SelectChangeEvent, SelectProps, FormHelperText } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

type props = {
  label: string;
  items: Array<any>;
  containerstyle?: any;
  labelVariant?: Variant;
  helperText?: string;
}

const CustomSelect: React.FC<props & SelectProps> = ({ label, items, containerstyle, labelVariant, helperText, style, ...rest }) => {

  return (
    <FormControl sx={containerstyle}>
      <Typography variant={labelVariant || 'subtitle2'}>{label}</Typography>
      <Select
        labelId="select-placeholder-label"
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
        style={{boxShadow: '2px 2px 2px #ccc', border:'none', padding: '0px', ...style}}
        {...rest}
      >
        {items.length>0 && items.map((item: any, index) => {
          return (
            <MenuItem
              key={index}
              value={item.value}
            >
              {item.label}
            </MenuItem>
          )
        })}
      </Select>
      {helperText && <FormHelperText style={{color: '#f44336', marginLeft: '10px', fontSize: '14px'}}>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default CustomSelect;
