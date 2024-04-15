import React from 'react';
import { Typography, FormControl, TextField, TextFieldProps, FormHelperText } from '@mui/material';

interface CustomBorderInputProps {
  containerstyle: any;
  label: string;
}

const CustomBorderInput: React.FC<CustomBorderInputProps & TextFieldProps> = ({ containerstyle, label, ...rest }) => {

  const restInputProps:any = rest.inputProps;
  const FormHelperTextProps:any = rest.FormHelperTextProps;

  return (
    <FormControl sx={containerstyle}>
      <Typography variant='subtitle2'>{label}</Typography>
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
          }
        }}
        FormHelperTextProps={{
          style: {
            color: '#f44336',
            marginLeft: '10px',
            fontSize: '14px',
          }
        }}
      />
    </FormControl>
  )
}

export default CustomBorderInput;
