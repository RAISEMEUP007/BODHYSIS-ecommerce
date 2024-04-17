import React from 'react';
import { Typography, FormControl } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

interface props {
  sx: any;
  name: string;
  value: any;
  onChange: (newValue: any) => void;
  minDate?:object;
  maxDate?:object;
}

const CustomDatePicker: React.FC<props> = ({ sx, name, value, onChange, minDate, maxDate }) => {

  return (
    <FormControl sx={sx}>
      <Typography style={{fontSize:'15px'}}>{name}</Typography>
      <DatePicker
        sx={{ 
          mt: '2px', 
          borderRadius: '3px',
          boxShadow: '2px 2px 6px #b3b3b3', 
        }}
        value={value}
        onChange={onChange}
        defaultValue={dayjs(Date.now())}
        minDate={minDate}
        maxDate={maxDate}
        slotProps={{ 
          textField: { 
            // variant: 'standard',
          },
        }}
      />
    </FormControl>
  )
}

export default CustomDatePicker;
