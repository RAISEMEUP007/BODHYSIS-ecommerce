import React from 'react';
import { Typography, FormControl, TextField, TextFieldProps, FormHelperText } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

interface CustomBorderInputProps {
  label: string;
  containerstyle?: any;
  labelVariant?: Variant;
}

const CustomBorderInput: React.FC<CustomBorderInputProps & TextFieldProps> = ({ containerstyle, label, labelVariant, ...rest }) => {

  const { inputProps, FormHelperTextProps, defaultValue, error, ...otherRest } = rest;

  return (
    <FormControl sx={containerstyle}>
      <Typography style={{fontSize:'16px', marginBottom: '5px'}} variant={labelVariant}>{label}</Typography>
      <TextField  
        {...rest}
        inputProps={{
          style: { 
            width: '100%',
            border: error ? '1px solid #f7776e' : '1px solid transparent',
            boxShadow: '2px 2px 6px #b3b3b3', 
            padding: '14px 10px',
            backgroundColor: 'white',
            marginTop:'3px',
            borderRadius: '2px',
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
