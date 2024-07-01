import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';
import { Box, Link, } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';

import { newPasword } from '../api/Auth';
import CustomBorderInput from '../common/CustomBorderInput';
import BasicLayout from '../common/BasicLayout';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';

type signInFormValues = {
  password: string,
  confirm_password: string,
}

type signInFormValidation = {
  password: boolean | null,
  confirm_password: boolean | null | 'notmatch',
}

const ChangePass: React.FC = () => {

  const {recover_id} = useParams();

  const navigate = useNavigate();
  
  const { matches900 } = useResponsiveValues();
  const { enqueueSnackbar } = useSnackbar();

  const [signInFormValues, setSignInFormValues] = useState<signInFormValues>({
    password: "",
    confirm_password: "",
  });

  const [signInFormValidation, setSignInFormValidation] = useState<signInFormValidation>({
    password: null,
    confirm_password: null,
  });

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

    if (!signInFormValues.confirm_password) {
      updatedSignInFormValidation.confirm_password = false;
      flag = false;
    } else if(signInFormValues.password !== signInFormValues.confirm_password) {
      updatedSignInFormValidation.confirm_password = 'notmatch';
      flag = false;
    } else {
      updatedSignInFormValidation.confirm_password = true;
    }

    setSignInFormValidation(updatedSignInFormValidation);
    
    if(!flag) return;
    
    newPassword();
  }
  
  const newPassword = async () => {
    const currentURL = window.location.href;
    const host = new URL(currentURL).origin;
    if(!recover_id) return;
    const payload = {
      recover_id,
      password: signInFormValues.password,
    };
    console.log('ddd');
    await newPasword(payload, (jsonRes:any, status:any)=>{
      switch (status) {
        case 200:
          enqueueSnackbar("Password Reset Successfully", {
            variant: 'success',
            style: { width: '300px' },
            autoHideDuration: 3000,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          })
          localStorage.removeItem('access-token');
          navigate('/login');
          break;
        case 400:
          enqueueSnackbar("This link is expired", {
            variant: 'error',
            style: { width: '300px' },
            autoHideDuration: 3000,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          })
          localStorage.removeItem('access-token');
          navigate('/login');
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
        <Box sx={{display:'flex', flexDirection:'column'}}>
          <CustomBorderInput 
            error={(signInFormValidation.password === null || signInFormValidation.password === true)?false:true}
            containerstyle={styles.signInInput} 
            label="New Password" 
            type="password" 
            placeholder="*********" 
            value={signInFormValues.password} 
            required={true}
            helperText={signInFormValidation.password === false?'Please enter the password':''}
            onChange={(event)=>updateSingInFormValue('password', event.target.value)} />
          <CustomBorderInput 
            error={(signInFormValidation.confirm_password === null || signInFormValidation.confirm_password === true)?false:true}
            containerstyle={styles.signInInput} 
            label="Confirm Password" 
            type="Password" 
            placeholder="*********" 
            value={signInFormValues.confirm_password} 
            required={true}
            helperText={signInFormValidation.confirm_password === false?'Please enter the confirm password':signInFormValidation.confirm_password === 'notmatch'? 'Password does not match' : ''}
            onChange={(event)=>updateSingInFormValue('confirm_password', event.target.value)} 
            onKeyUp={(event) => {
              if (event.key === 'Enter') {
                Confirm();
              }
            }}
          />
          <Link href="/login" >{"Go to login"}</Link>
        </Box>
        <Box>
          <LoadingButton
            variant="contained"
            sx={styles.logInButton}
            onClick={Confirm}
          >
            {"Reset"}
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
    mb: '20px',
  },
  logInButton: { 
    padding:'10px 50px', 
    fontSize:'16px', 
    textTransform: 'none',
    mt: matches900? '30px' : '10px',
  },
})

export default ChangePass;
