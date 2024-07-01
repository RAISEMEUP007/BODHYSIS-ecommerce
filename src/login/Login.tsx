import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Box, Link, Typography, } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faUserCircle, } from '@fortawesome/free-regular-svg-icons';

import { adminTry, logIn, register, testTokenVaild } from '../api/Auth';
import CustomBorderInput from '../common/CustomBorderInput';
import BasicLayout from '../common/BasicLayout';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';
import CustomPhoneNumberInput from '../common/CustomPhoneNumberInput';
import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';

type signUpFormValues = {
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
  password: string,
  confirm_password: string,
  home_address: string,
  address2: string,
  city: string,
  state: string,
  zipcode: string
}

type signUpFormValidation = {
  first_name: boolean | null,
  last_name: boolean | null,
  email: boolean | null | 'format',
  phone_number: boolean | null,
  password: boolean | null,
  confirm_password: boolean | null | 'notmatch',
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

  const location = useLocation();
  const navigate = useNavigate();
  
  const { matches900 } = useResponsiveValues();
  const { enqueueSnackbar } = useSnackbar();
  const { initReservation } = useCustomerReservation();

  const [signUpFormValues, setSignUpFormValues] = useState<signUpFormValues>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
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
    password: null,
    confirm_password: null,
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

  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

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
      switch(key){

        /* --- BOH-295 --- */
        case 'home_address':
        case 'address2':
        case 'city':
        case 'state':
        case 'zipcode':
          break;
        /* --- BOH-295 --- */

        case 'address2':
          updatedSignUpFormValidation.address2 = null;
          break;
        case 'email':
          if (!signUpFormValues.email) {
            updatedSignUpFormValidation.email = false;
            flag = false;
          } else if(!isEmailValid(signUpFormValues.email)){
            updatedSignUpFormValidation.email = 'format';
            flag = false;
          } else {
            updatedSignUpFormValidation.email = true;
          }
          break;
        case 'confirm_password':
          if (!signUpFormValues.confirm_password) {
            updatedSignUpFormValidation.confirm_password = false;
            flag = false;
          } else if(signUpFormValues.password !== signUpFormValues.confirm_password) {
            updatedSignUpFormValidation.confirm_password = 'notmatch';
            flag = false;
          } else {
            updatedSignUpFormValidation.confirm_password = true;
          }
          break;
        default:
          if (!signUpFormValues[key as keyof typeof signUpFormValues]) {
            updatedSignUpFormValidation[key as keyof typeof signUpFormValues] = false;
            flag = false;
          } else {
            updatedSignUpFormValidation[key as keyof typeof signUpFormValues] = true;
          }
          break;
      }
    }
    setSignUpFormValidation(updatedSignUpFormValidation);

    if(!flag) return;

    signUp();
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
    
    if(!flag) return;
    
    signIn();
  }
  
  const signIn = async () => {
    await logIn(signInFormValues, (jsonRes:any, status:any)=>{
      switch (status) {
        case 200:
          localStorage.setItem('access-token', jsonRes.refreshToken);
          localStorage.setItem('full-name', jsonRes.fullName);
          localStorage.setItem('customerId', jsonRes.customerId);
          localStorage.setItem('customer_email', jsonRes.email);
          localStorage.setItem('customer_phone_number', jsonRes.phone_number);
          initReservation();
          navigate('/reservation');
          break;
        case 403:
          enqueueSnackbar("Incorrect pasword", {
            variant: 'error',
            style: { width: '300px' },
            autoHideDuration: 3000,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          })
          break;
        case 404:
          navigate('/usernotfound');
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

  const signUp = async () => {
    // console.log('ddd');
    await register(signUpFormValues, (jsonRes:any, status:any)=>{
      switch (status) {
        case 200:
          localStorage.setItem('access-token', jsonRes.refreshToken);
          localStorage.setItem('full-name', jsonRes.fullName);
          localStorage.setItem('customerId', jsonRes.customerId);
          localStorage.setItem('customer_email', jsonRes.email);
          localStorage.setItem('customer_phone_number', jsonRes.phone_number);
          initReservation();
          navigate('/reservation');
          break;
        case 409:
          enqueueSnackbar("Email already exists", {
            variant: 'error',
            style: { width: '300px' },
            autoHideDuration: 3000,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          })
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

  useEffect(()=>{
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const mode = queryParams.get('mode');
    const t = queryParams.get('t');

    if(id && mode && t){
      localStorage.setItem('access-token', t);
      localStorage.removeItem('full-name');
      localStorage.removeItem('customerId');
      localStorage.removeItem('customer_email');
      localStorage.removeItem('customer_phone_number');
      const payload:any = {
        customer_id:id,
        mode,
        t,
      }
      adminTry(payload, (jsonRes:any, status:any)=>{
        // console.log(jsonRes); return;
        switch (status) {
          case 200:
            localStorage.setItem('access-token', jsonRes.refreshToken);
            localStorage.setItem('full-name', jsonRes.fullName);
            localStorage.setItem('customerId', jsonRes.customerId);
            localStorage.setItem('customer_email', jsonRes.email);
            localStorage.setItem('customer_phone_number', jsonRes.phone_number);
            initReservation();
            navigate('/reservation');
            break;
          case 403:
            enqueueSnackbar("Incorrect pasword", {
              variant: 'error',
              style: { width: '300px' },
              autoHideDuration: 3000,
              anchorOrigin: { vertical: 'top', horizontal: 'right' },
            })
            break;
          case 404:
            // navigate('/usernotfound');
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
    }else {
      const accessToken = localStorage.getItem('access-token');
      if(accessToken){
        testTokenVaild((jsonRes:any, status:any)=>{
          if(status == 200) navigate('/reservation');
        });
      }
    }
  }, [])

  const styles = pageStyles(matches900);
  
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
                  error={(signUpFormValidation.email === null || signUpFormValidation.email === true)?false:true}
                  label="Email Address"
                  containerstyle={styles.signUpInput}
                  placeholder="star@email.com"
                  type='email'
                  value={signUpFormValues.email} 
                  required={true}
                  helperText={signUpFormValidation.email === false?'Please enter the email':signUpFormValidation.email === 'format'? 'Not valid email format':''}
                  onChange={(event)=>updateSingUpFormValue('email', event.target.value)} />
                {/* <CustomBorderInput
                  error={signUpFormValidation.phone_number === false?true:false}
                  containerstyle={styles.signUpInput}
                  label="Phone"
                  placeholder="Phone Number" 
                  value={signUpFormValues.phone_number} 
                  inputProps={{ maxLength: 12 }}
                  required={true}
                  helperText={signUpFormValidation.phone_number === false?'Please enter the phone number':''}
                  onChange={(event)=>updateSingUpFormValue('phone_number', event.target.value)} /> */}
                {/* <Box sx={styles.signUpInput}>
                  <Typography style={{fontSize:'16px', marginBottom: '5px'}}>{'phone number'}</Typography>
                  <MuiPhoneNumber
                    variant='outlined'
                    countryCodeEditable={false}
                    defaultCountry={'us'}
                    onlyCountries={['us']}
                    value={signUpFormValues.phone_number} 
                    onChange={(value) => { updateSingUpFormValue('phone_number', value as string) }}
                    style={{
                      boxSizing:'border-box',
                      boxShadow: '2px 2px 6px #b3b3b3', 
                      backgroundColor: 'white', 
                      marginTop:'3px',
                      borderRadius: '2px',
                      padding: '14px 10px',
                      width: '100%', 
                    }}
                    inputProps={{
                      style: { 
                        padding: '0px',
                      },
                    }}
                  />
                </Box> */}
                <CustomPhoneNumberInput
                  label={"Phone Number"}
                  containerstyle={styles.signUpInput}
                  countryCodeEditable={false}
                  defaultCountry={'us'}
                  onlyCountries={['us']}
                  value={signUpFormValues.phone_number} 
                  error={signUpFormValidation.phone_number === false?true:false}
                  helperText={signUpFormValidation.phone_number === false?'Please enter the phone number':''}
                  onChange={(value) => { updateSingUpFormValue('phone_number', value as string) }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <CustomBorderInput 
                  error={(signUpFormValidation.password === null || signUpFormValidation.password === true)?false:true}
                  containerstyle={styles.signUpInput} 
                  label="Password" 
                  type="password" 
                  placeholder="*********" 
                  value={signUpFormValues.password} 
                  required={true}
                  helperText={signUpFormValidation.password === false?'Please enter the password':''}
                  onChange={(event)=>updateSingUpFormValue('password', event.target.value)} />
                <CustomBorderInput 
                  error={(signUpFormValidation.confirm_password === null || signUpFormValidation.confirm_password === true)?false:true}
                  containerstyle={styles.signUpInput} 
                  label="Confirm Password" 
                  type="Password" 
                  placeholder="*********" 
                  value={signUpFormValues.confirm_password} 
                  required={true}
                  helperText={signUpFormValidation.confirm_password === false?'Please enter the confirm password':signUpFormValidation.confirm_password === 'notmatch'? 'Password does not match' : ''}
                  onChange={(event)=>updateSingUpFormValue('confirm_password', event.target.value)} 
                  onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                      handleSignUp();
                    }
                  }}
                />
              </Box>
              <Typography 
                style={{
                  display:'none', /* BOH-295 */
                  marginTop: '20px', 
                  marginBottom:'20px', 
                  fontStyle: 'bold', 
                  fontWeight: 600, 
                  textDecoration:'unline'
                }}>{"Billing Address"}</Typography>
              <Box 
                sx={{ 
                  // display: 'flex', 
                  display:'none', /* BOH-295 */
                  justifyContent: 'space-between', 
                  flexWrap: 'wrap' 
                }}>
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
                  // error={signUpFormValidation.address2 === false?true:false}
                  containerstyle={styles.signUpInput}
                  label="Apt, Suite, etc."
                  placeholder="Apt, Suite, etc." 
                  value={signUpFormValues.address2} 
                  required={true}
                  // helperText={signUpFormValidation.address2 === false?'Please enter the address2':''}
                  onChange={(event)=>updateSingUpFormValue('address2', event.target.value)} />
              </Box>
              <Box 
                sx={{ 
                  // display: 'flex', 
                  display:'none', /* BOH-295 */
                  flexDirection: 'row', 
                  flexWrap: 'wrap', 
                  justifyContent: 'space-between' 
                }}>
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
                label="Email Address" 
                containerstyle={styles.signInInput} 
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
                onChange={(event)=>updateSingInFormValue('password', event.target.value)} 
                onKeyUp={(event) => {
                  if (event.key === 'Enter') {
                    handleSignIn();
                  }
                }}
              />
              <Link href="/resetpass" >{"forgot password?"}</Link>
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

  return renderLoigin();
}

const pageStyles = (matches900:boolean) => ({
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
})

export default Login;
