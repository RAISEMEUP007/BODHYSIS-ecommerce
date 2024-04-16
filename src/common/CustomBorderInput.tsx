import React from 'react';
import { Typography, FormControl, TextField, TextFieldProps, FormHelperText } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

interface CustomBorderInputProps {
  containerstyle?: any;
  label: string;
  labelVariant?: Variant;
}

const CustomBorderInput: React.FC<CustomBorderInputProps & TextFieldProps> = ({ containerstyle, label, labelVariant, ...rest }) => {

  const { inputProps, FormHelperTextProps, defaultValue, ...otherRest } = rest;

  return (
    <FormControl sx={containerstyle}>
      <Typography variant={labelVariant || 'subtitle1'}>{label}</Typography>
      <TextField  
        {...rest}
        inputProps={{
          style: { 
            width: '100%',
            border: 'none',
            boxShadow: '2px 3px 4px #ccc', 
            padding: '14px 10px',
            backgroundColor: 'white', 
            borderRadius: '3px',
          },
          ...inputProps
        }}
        FormHelperTextProps={{
          style: {
            color: '#f44336',
            marginLeft: '10px',
            fontSize: '14px',
          },
          ...FormHelperTextProps
        }}
      />
    </FormControl>
  )
}

export default CustomBorderInput;
