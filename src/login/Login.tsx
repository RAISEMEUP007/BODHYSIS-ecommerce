import React, { useState } from 'react';
import { Box, Typography, } from '@mui/material';
import { useNavigate } from 'react-router';

import CustomBorderInput from '../common/CustomBorderInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faUserCircle, } from '@fortawesome/free-regular-svg-icons';

import { LoadingButton } from '@mui/lab';
import BasicLayout from '../common/BasicLayout';
import { logIn } from '../api/Auth';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';

type signUpFormValues = {
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
  home_address: string,
  address2: string,
  city: string,
  state: string,
  zipcode: string
}

type signUpFormValidation = {
  first_name: boolean | null,
  last_name: boolean | null,
  email: boolean | null,
  phone_number: boolean | null,
  home_address: boolean | null,
  address2: boolean | null,
  city: boolean | null,
  state: boolean | null,
  zipcode: boolean | null
}

type signInFormValues = {
  email: string,
  password: string,
}

type signInFormValidation = {
  email: boolean | null,
  password: boolean | null
}

const Login: React.FC = () => {

  const navigate = useNavigate();
  const { matches900 } = useResponsiveValues();

  const [signUpFormValues, setSignUpFormValues] = useState<signUpFormValues>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    home_address: "",
    address2: "",
    city: "",
    state: "",
    zipcode: ""
  });

  const [signUpFormValidation, setSignUpFormValidation] = useState<signUpFormValidation>({
    first_name: null,
    last_name: null,
    email: null,
    phone_number: null,
    home_address: null,
    address2: null,
    city: null,
    state: null,
    zipcode: null
  });

  const [signInFormValues, setSignInFormValues] = useState<signInFormValues>({
    email: "",
    password: "",
  });

  const [signInFormValidation, setSignInFormValidation] = useState<signInFormValidation>({
    email: null,
    password: null,
  });

  const updateSingUpFormValue = (key: string, value: string) => {
    setSignUpFormValues(prevState => ({
      ...prevState,
      [key]: value
    }));
    setSignUpFormValidation(prevState => ({
      ...prevState,
      [key]: null
    }));
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

  const handleSignUp = () => {
    let flag = true;
    const updatedSignUpFormValidation = { ...signUpFormValidation };
    for (const key in signUpFormValues) {
      if (!signUpFormValues[key as keyof typeof signUpFormValues]) {
        updatedSignUpFormValidation[key as keyof typeof signUpFormValues] = false;
        flag = false;
      } else {
        updatedSignUpFormValidation[key as keyof typeof signUpFormValues] = true;
      }
    }
    setSignUpFormValidation(updatedSignUpFormValidation);

    if(!flag) return;
  }

  const handleSignIn = () => {
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
    setSignInFormValidation(updatedSignInFormValidation);

    signIn();

    if(!flag) return;
  }
  
  const signIn = async () => {
    await logIn(signInFormValues, (jsonRes:any, status:any)=>{
      if(status == 200){
        console.log(jsonRes);
        // setAccessToken(jsonRes.refreshToken);
        switch (status) {
          case 200:
            // onLoggedIn(jsonRes.refreshToken);
            localStorage.setItem('access-token', jsonRes.refreshToken);
            localStorage.setItem('full-name', jsonRes.fullName);
            localStorage.setItem('customerId', jsonRes.customerId);
            navigate('/reservation');
            break;
          case 403:
            alert('Incorrect pasword');
            // setPassValidMessage(msgStr('errorComparingPassword'));
            break;
          case 404:
            alert('User not found');
            // setEmailValidMessage(msgStr('userNotFound'));
            break;
          case 500:
            alert('Server Error');
            // showAlert('error', msgStr('serverError'));
            break;
          default:
            // if (jsonRes && jsonRes.error) showAlert('error', jsonRes.error);
            // else showAlert('error', msgStr('unknownError'));
            break;
        }
      }
    });
  }

  const renderLoigin = () => (
    <BasicLayout>
      <Box sx={{display:'flex', justifyContent:'center'}}>
        <Box sx={styles.containerStyle}>
          <Box sx={styles.description}>
            <FontAwesomeIcon icon={faUserCircle} style={{width:'43px', height:'43px'}}/>
            <Typography sx={{ml:'16px', fontSize:'18px'}}>{"Reservations with us require that you create a user account first. Make sure you are logged in, or create an account to continue with your order."}</Typography>
          </Box>
          <Box sx={styles.form}>
            <Box sx={styles.signUpForm}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <CustomBorderInput
                  error={signUpFormValidation.first_name === false?true:false}
                  containerstyle={styles.signUpInput}
                  label="First Name"
                  placeholder="First Name" 
                  value={signUpFormValues.first_name} 
                  required={true}
                  helperText={signUpFormValidation.first_name === false?'Please enter the first name':''}
                  onChange={(event)=>updateSingUpFormValue('first_name', event.target.value)} />
                <CustomBorderInput
                  error={signUpFormValidation.last_name === false?true:false}
                  containerstyle={styles.signUpInput}
                  label="Last Name"
                  placeholder="Last Name" 
                  value={signUpFormValues.last_name} 
                  required={true}
                  helperText={signUpFormValidation.last_name === false?'Please enter the last name':''}
                  onChange={(event)=>updateSingUpFormValue('last_name', event.target.value)} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <CustomBorderInput
                  error={signUpFormValidation.email === false?true:false}
                  containerstyle={styles.signUpInput}
                  label="Email"
                  placeholder="star@email.com" 
                  value={signUpFormValues.email} 
                  required={true}
                  helperText={signUpFormValidation.email === false?'Please enter the email':''}
                  onChange={(event)=>updateSingUpFormValue('email', event.target.value)} />
                <CustomBorderInput
                  error={signUpFormValidation.phone_number === false?true:false}
                  containerstyle={styles.signUpInput}
                  label="Phone"
                  placeholder="Phone Number" 
                  value={signUpFormValues.phone_number} 
                  required={true}
                  helperText={signUpFormValidation.phone_number === false?'Please enter the phone number':''}
                  onChange={(event)=>updateSingUpFormValue('phone_number', event.target.value)} />
              </Box>
              <Typography style={{marginBottom:'20px', textDecoration:'underline'}}>{"Billing Address"}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <CustomBorderInput
                  error={signUpFormValidation.home_address === false?true:false}
                  containerstyle={styles.signUpInput}
                  label="Address"
                  placeholder="Address" 
                  value={signUpFormValues.home_address} 
                  required={true}
                  helperText={signUpFormValidation.home_address === false?'Please enter the home address':''}
                  onChange={(event)=>updateSingUpFormValue('home_address', event.target.value)} />
                <CustomBorderInput
                  error={signUpFormValidation.address2 === false?true:false}
                  containerstyle={styles.signUpInput}
                  label="Apt, Suite, etc."
                  placeholder="Apt, Suite, etc." 
                  value={signUpFormValues.address2} 
                  required={true}
                  helperText={signUpFormValidation.address2 === false?'Please enter the address2':''}
                  onChange={(event)=>updateSingUpFormValue('address2', event.target.value)} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <CustomBorderInput
                  error={signUpFormValidation.city === false?true:false}
                  containerstyle={styles.signUpInput2}
                  label="City"
                  placeholder="City" 
                  value={signUpFormValues.city} 
                  required={true}
                  helperText={signUpFormValidation.city === false?'Please enter the city name':''}
                  onChange={(event)=>updateSingUpFormValue('city', event.target.value)} />
                <CustomBorderInput
                  error={signUpFormValidation.state === false?true:false}
                  containerstyle={styles.signUpInput2}
                  label="State"
                  placeholder="State" 
                  value={signUpFormValues.state} 
                  required={true}
                  helperText={signUpFormValidation.state === false?'Please enter the state name':''}
                  onChange={(event)=>updateSingUpFormValue('state', event.target.value)} />
                <CustomBorderInput
                  error={signUpFormValidation.zipcode === false?true:false}
                  containerstyle={styles.signUpInput2}
                  label="Zipcode" placeholder="Zipcode" 
                  value={signUpFormValues.zipcode} 
                  required={true}
                  helperText={signUpFormValidation.zipcode === false?'Please enter the Zipcode':''}
                  onChange={(event)=>updateSingUpFormValue('zipcode', event.target.value)} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '30px' }}>
                <LoadingButton
                  variant="contained"
                  sx={{ padding:'10px 50px', fontSize:'16px', textTransform: 'none' }}
                  onClick={handleSignUp}
                >
                  {"Create Account"}
                </LoadingButton>
              </Box>
            </Box>
            <Box 
              component="form"
              sx={styles.signInForm}
            >
              <CustomBorderInput 
                error={signInFormValidation.email === false?true:false}
                containerstyle={styles.signInInput} 
                label="Email" 
                type="email" 
                placeholder="example@email.com" 
                value={signInFormValues.email} 
                required={true}
                helperText={signInFormValidation.email === false?'Please enter the email':''}
                onChange={(event)=>updateSingInFormValue('email', event.target.value)} />
              <CustomBorderInput 
                error={signInFormValidation.password === false?true:false}
                containerstyle={styles.signInInput} 
                label="Password" 
                type="password" 
                placeholder="*********" 
                value={signInFormValues.password} 
                required={true}
                helperText={signInFormValidation.password === false?'Please enter the password':''}
                onChange={(event)=>updateSingInFormValue('password', event.target.value)} />
                <LoadingButton
                  variant="contained"
                  sx={styles.logInButton}
                  onClick={handleSignIn}
                >
                  {"Log in"}
                </LoadingButton>
            </Box>
          </Box>
        </Box>
        {matches900 && (
          <Box sx={{width:'28%', maxWidth:'800px', backgroundColor:'#F0F0F0', minHeight:'calc(100vh - 130px)'}}>
            <Typography sx={{mt:6, mb:4, fontSize:'32px', textAlign:'center', fontWeight:700}}>{"Order Details"}</Typography>
            <Typography sx={{textAlign:'center', fontSize:'18px', padding:"0% 6%"}}>{"You must be logged in to to add items to your cart."}</Typography>
          </Box>)}
      </Box>
    </BasicLayout>
  );

  const styles = {
    containerStyle:{
      m: matches900 ? 5 : 2, 
      mt: matches900 ? 8 : 4, 
      flex:1, 
      backgroundColor:'#F0F0F0', 
      p: matches900 ? 4 : 3, 
      border:'1px solid #A3A3A3', 
      borderRadius:'5px', 
      width:'100%', 
      alignSelf:'flex-start'
    },
    description:{
      display:'flex', 
      flexDirection:'row', 
      alignItems: matches900?'center':'flex-start'
    },
    form: {
      display:'flex', 
      flexDirection: matches900?'row':'column-reverse', 
      mt: matches900 ? 5 : 3,
    },
    signUpForm: {
      width: matches900?'65%':'auto', 
      p: matches900?"0 4% 0 0":"20px 0 0 0", 
      m: matches900?0:'40px 0 0',  
      borderColor:'#A3A3A3', 
      borderStyle:'solid', 
      borderWidth: matches900?'0px 1px 0px 0px':'1px 0px 0px 0px'
    },
    signUpInput: { 
      width: matches900?'48%':'100%', 
      mb:'20px' 
    },
    signUpInput2: { 
      width: matches900? '31%' : '100%',
      mb:'20px' 
    },
    signInForm: {
      width: matches900?'35%':'auto', 
      pl: matches900?4:0,
    },
    signInInput: { 
      width: '100%', 
      mb: matches900?'20px' :'10px'
    },
    logInButton: { 
      float:'right',
      padding:'10px 50px', 
      fontSize:'16px', 
      textTransform: 'none',
      mt: matches900? '30px' : '10px',
    },
  }

  return renderLoigin();
}

export default Login;
