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
    <FormControl variant="standard" sx={sx}>
      <Typography sx={{ fontWeight: '900' }}>{name}</Typography>
      <DatePicker
        sx={{ mt: '12px', pt: '8px' }}
        value={value}
        onChange={onChange}
        defaultValue={dayjs(Date.now())}
        minDate={minDate}
        maxDate={maxDate}
        // referenceDate={dayjs()}
        slotProps={{ textField: { variant: 'standard', } }}
      />
    </FormControl>
  )
}

export default CustomDatePicker;
