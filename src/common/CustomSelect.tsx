import React from 'react';
import { Typography, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface props{
  sx: any;
  name: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  items: Array<string>;
}

const CustomSelect: React.FC<props> = ({ sx, name, value, onChange, items }) => {
  return (
    <FormControl variant="standard" sx={sx}>
      <Typography sx={{ fontWeight: '900', fontSize: '12px' }}>{name}</Typography>
      <Select
        labelId="select-placeholder-label"
        value={value}
        inputProps={{ 'aria-label': 'select' }}
        onChange={onChange}
        displayEmpty
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
    </FormControl>
  )
}

export default CustomSelect;
