import React from 'react';
import { Typography, FormControl, TextField, TextFieldProps, FormHelperText } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

interface CustomBorderInputProps {
  containerstyle?: any;
  label: string;
  labelVariant?: Variant;
}

const CustomBorderInput: React.FC<CustomBorderInputProps & TextFieldProps> = ({ containerstyle, label, labelVariant, ...rest }) => {

  const restInputProps:any = rest.inputProps;
  const FormHelperTextProps:any = rest.FormHelperTextProps;

  return (
    <FormControl sx={containerstyle}>
      <Typography variant={labelVariant || 'subtitle2'}>{label}</Typography>
      <TextField  
        {...rest}
        inputProps={{
          style: { 
            width: '100%',
            border: 'none',
            boxShadow: '2px 2px 2px #ccc', 
            padding: '14px 10px',
            backgroundColor: 'white', 
            borderRadius: '3px',
          },
          ...restInputProps
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
