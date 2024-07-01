import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Box, Link, Typography, } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faUserCircle, } from '@fortawesome/free-regular-svg-icons';

import { resetpass } from '../api/Auth';
import CustomBorderInput from '../common/CustomBorderInput';
import BasicLayout from '../common/BasicLayout';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';

type signInFormValues = {
  email: string,
}

type signInFormValidation = {
  email: boolean | null | 'format',
}

const ResetPass: React.FC = () => {

  const navigate = useNavigate();
  
  const { matches900 } = useResponsiveValues();
  const { enqueueSnackbar } = useSnackbar();

  const [signInFormValues, setSignInFormValues] = useState<signInFormValues>({
    email: "",
  });

  const [signInFormValidation, setSignInFormValidation] = useState<signInFormValidation>({
    email: null,
  });

  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const updateSingInFormValue = (key: string, value: string) => {
    setSignInFormValues(prevState => ({
      ...prevState,
      [key]: value
    }));
    setSignInFormValidation(prevState => ({
      ...prevState,
      [key]: null
    }));
  }

  const Confirm = () => {
    let flag = true;
    const updatedSignInFormValidation = { ...signInFormValidation };
    for (const key in signInFormValues) {
      if (!signInFormValues[key as keyof typeof signInFormValues]) {
        updatedSignInFormValidation[key as keyof typeof signInFormValues] = false;
        flag = false;
      } else {
        updatedSignInFormValidation[key as keyof typeof signInFormValues] = true;
      }
    }
    if(!isEmailValid(signInFormValues.email)){
      updatedSignInFormValidation.email = 'format';
      flag = false;
    }
    setSignInFormValidation(updatedSignInFormValidation);
    
    if(!flag) return;
    
    reset();
  }
  
  const reset = async () => {
    const currentURL = window.location.href;
    const host = new URL(currentURL).origin;
    const payload = {
      email:signInFormValues.email,
      clientHost: host,
    };
    await resetpass(payload, (jsonRes:any, status:any)=>{
      switch (status) {
        case 200:
          navigate('/emailsent/'+jsonRes.message);
          break;
        case 500:
          enqueueSnackbar("Server Error", {
            variant: 'error',
            style: { width: '300px' },
            autoHideDuration: 3000,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          })
          break;
        default:
          if (jsonRes && jsonRes.error){
            enqueueSnackbar(jsonRes.error, {
              variant: 'error',
              style: { width: '300px' },
              autoHideDuration: 3000,
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
            })
          }
          else{
            enqueueSnackbar("unKnown Error", {
              variant: 'error',
              style: { width: '300px' },
              autoHideDuration: 3000,
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
            })
          }
          break;
      }
    });
  }

  const styles = pageStyles(matches900);
  const renderLoigin = () => (
    <BasicLayout>
      <Box sx={styles.containerStyle}>
        <Box sx={styles.description}>
          <FontAwesomeIcon icon={faUserCircle} style={{width:'43px', height:'43px'}}/>
          <Typography sx={{ml:'16px', fontSize:'18px'}}>{"We will send you a password reset link to your email."}</Typography>
          </Box>
            <CustomBorderInput 
              error={(signInFormValidation.email === null || signInFormValidation.email === true)?false:true}
              label="Email Address" 
              containerstyle={styles.signInInput} 
              type="email" 
              placeholder="example@email.com" 
              value={signInFormValues.email} 
              required={true}
              helperText={signInFormValidation.email === false?'Please enter the email': signInFormValidation.email === 'format'? 'Not valid email format':''}
              onChange={(event)=>updateSingInFormValue('email', event.target.value)} 
              onKeyUp={(event) => {
                if (event.key === 'Enter') {
                  Confirm();
                }
              }}/>
          <Box>
          <Box sx={{mt:'10px'}}><Link href="/login" >{"Go to login"}</Link></Box>
          <LoadingButton
            variant="contained"
            sx={styles.logInButton}
            onClick={Confirm}
          >
            {"Confirm"}
          </LoadingButton>
        </Box>
      </Box>
    </BasicLayout>
  );

  return renderLoigin();
}

const pageStyles = (matches900:boolean) => ({
  containerStyle:{
    m: matches900 ? 5 : 2, 
    mt: matches900 ? 8 : 4, 
    backgroundColor:'#F0F0F0', 
    p: matches900 ? 4 : 3, 
    border:'1px solid #A3A3A3', 
    borderRadius:'5px', 
  },
  description:{
    display:'flex', 
    flexDirection:'row', 
    alignItems: matches900?'center':'flex-start'
  },
  signInInput: { 
    width: '400px', 
    mt: '40px',
  },
  logInButton: { 
    padding:'10px 50px', 
    fontSize:'16px', 
    textTransform: 'none',
    mt: matches900? '30px' : '10px',
  },
})

export default ResetPass;
