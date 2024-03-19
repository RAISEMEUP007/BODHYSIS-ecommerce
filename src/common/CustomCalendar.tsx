import React from 'react';
import { Typography, FormControl } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

interface props {
  sx: any;
  name: string;
  value: any;
  onChange: (newValue: any) => void;
  minDateTime?:any;
  maxDateTime?:any;
}

// const CustomCalendar: React.FC<props> = ({ sx, name, value, onChange }) => {
const CustomCalendar: React.FC<props> = ({ sx, name, value, onChange, minDateTime, maxDateTime }) => {

  return (
    <FormControl variant="standard" sx={sx}>
      <Typography sx={{ fontWeight: '900' }}>{name}</Typography>
      <DateTimePicker
        sx={{ mt: '12px', pt: '8px' }}
        value={value}
        onChange={onChange}
        defaultValue={dayjs(Date.now())}
        minDateTime={minDateTime}
        maxDateTime={maxDateTime}
        // referenceDate={dayjs()}
        slotProps={{ textField: { variant: 'standard', } }}
      />
    </FormControl>
  )
}

export default CustomCalendar;
