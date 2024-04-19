import React from 'react';
import { Typography, FormControl, TextField, TextFieldProps, FormHelperText } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import MuiPhoneNumber, { MuiPhoneNumberProps } from 'material-ui-phone-number';

interface CustomPhoneNumberInputProps {
  label: string;
  containerstyle?: any;
  labelVariant?: Variant;
}

const CustomPhoneNumberInput: React.FC<CustomPhoneNumberInputProps & MuiPhoneNumberProps> = ({ containerstyle, label, labelVariant, ...rest }) => {

  const { style, inputProps, FormHelperTextProps, defaultValue, helperText, ...otherRest } = rest;

  return (
    <FormControl sx={containerstyle}>
      <Typography style={{fontSize:'16px', marginBottom: '5px'}} variant={labelVariant}>{label}</Typography>
      <MuiPhoneNumber
        {...rest}
        variant='outlined'
        style={{
          boxSizing:'border-box',
          boxShadow: '2px 2px 6px #b3b3b3', 
          backgroundColor: 'white', 
          marginTop:'3px',
          borderRadius: '2px',
          padding: '14px 10px 14px 0px',
          width: '100%',
          ...style
        }}
        inputProps={{
          style: { 
            padding: '0px',
          },
          ...inputProps
        }}
        FormHelperTextProps={{
          style: {
            display:'none',
          },
        }}
      />
      <FormHelperText 
        style= {{
          color: '#f44336',
          marginLeft: '10px',
          fontSize: '14px',
        }}
        {...FormHelperTextProps}
      >
        {helperText}
      </FormHelperText>
    </FormControl>
  )
}

export default CustomPhoneNumberInput;