import React from 'react';
import { Box, Typography, TextField, Grid, Checkbox, FormControlLabel } from '@mui/material';

import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import CustomBorderInput from '../common/CustomBorderInput';
import CustomInput from '../common/CustomInput';

import ReservationTerm from '../reservation/ReservationTerm';
import DeliveryLocation from '../reservation/DeliveryLocation';

interface props {
  sx?: object;
}

const ReservationMainDetail: React.FC<props> = ({ sx }) => {
  const { ReservationMain, setReservationValue } = useCustomerReservation();

  const {
    name,
    special_instructions,
    address,
    address2,
    city,
    state,
    postal_code,
    phone_number,
    email,
    password,
    is_accept
  } = ReservationMain;

  const handleNameChange = (e: any) => {
    setReservationValue('name', e.target.value);
  }

  const handleSpecInstructionChange = (e: any) => {
    setReservationValue('special_instructions', e.target.value);
  }

  const handleAddressChange = (e: any) => {
    setReservationValue('address', e.target.value)
  }

  const handleAddressLine2Change = (e: any) => {
    setReservationValue('address2', e.target.value);
  }

  const handleCityChange = (e: any) => {
    setReservationValue('city', e.target.value)
  }

  const handleStateChange = (e: any) => {
    setReservationValue('state', e.target.value)
  }

  const handlePostChange = (e: any) => {
    setReservationValue('postal_code', e.target.value)
  }

  const handlePhoneChange = (e: any) => {
    setReservationValue('phone_number', e.target.value)
  }

  const handleEmailChange = (e: any) => {
    setReservationValue('email', e.target.value)
  }

  const handlePwdChange = (e: any) => {
    setReservationValue('password', e.target.value)
  }

  const handleAccountCheck = (e: any) => {
    setReservationValue('is_accept', e.target.checked)
  }

  const fullName = localStorage.getItem('full-name');
  return (
    <Box sx={{ ...sx }}>
      <Box sx={{ mt: 3 }}>
        <Typography style={{fontWeight:700, fontSize:'36px', marginTop:'3 0px', marginBottom:'14px'}}>{`Accoount Details`}</Typography>
        <Typography>
          {`You are currently logged in as `}
          <b>{fullName}</b>
          {`. Please confirm that your email and phone number are correct. This is the information we will use to communicate with you about your order.`}
        </Typography>
        <Box>
          <CustomBorderInput
            containerstyle={{ width: '300px', mt:'20px', mr:'40px' }} 
            label="Email" 
            type="email" 
            placeholder="example@email.com" 
            value={ReservationMain.email} 
            onChange={(event)=>setReservationValue('email', event.target.value)} 
          />
          <CustomBorderInput
            containerstyle={{ width: '300px', mt:'20px' }}
            label="Phone"
            placeholder="Phone Number" 
            value={ReservationMain.phone_number} 
            onChange={(event)=>setReservationValue('phone_number', event.target.value)} 
          />
        </Box>
        <Typography style={{fontWeight:700, fontSize:'36px', marginTop:'50px', marginBottom:'20px'}}>{`Reservation Details`}</Typography>
        <ReservationTerm/>
        <CustomBorderInput
          containerstyle={{ width:'80%', mt:'20px' }}
          label = {'Special Instructions'}
          value={special_instructions} 
          placeholder="Special Instructions" 
          multiline
          rows={6}
          sx={{marginLeft:'-14px', marginTop:'-16px'}}
          onChange={(e: any) => {
            setReservationValue('special_instructions', e.target.value);
          }} 
        />
        <DeliveryLocation
          isShowAddress={true}
          isShowSearchBox={false}
        />
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <FormControlLabel
          label="I accept the HHI Rentals LLC Terms and Conditions and agree to the use of my phone number and/or email address for updates about my order delivery, use, and pickup. *"
          control={<Checkbox checked={is_accept} onChange={handleAccountCheck} />}
        />
      </Box>
    </Box>
  );
}

export default ReservationMainDetail;
