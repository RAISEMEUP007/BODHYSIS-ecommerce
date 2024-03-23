import React from 'react';
import { useState } from 'react';
import { Box, Typography, TextField, Grid, Checkbox, FormControlLabel } from '@mui/material';

import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import CustomSelect from '../common/CustomSelect';
import CustomInput from '../common/CustomInput';
import dayjs from 'dayjs';

interface props {
  sx?: object;
}

const ReservationMainDetail: React.FC<props> = ({ sx }) => {
  const { ReservationMain, setReservationValue } = useCustomerReservation();
  console.log(ReservationMain);
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

  return (
    <Box sx={{ ...sx }}>
      <Box sx={{ mt: 3 }}>
        <Typography sx={{ fontWeight: '900', fontSize: "24px" }}>Reservation Details</Typography>
        <Typography>
          {ReservationMain.pickup ? dayjs(ReservationMain.pickup).format('MMMM DD, YYYY hh:mm A') : 'n/a'} - {ReservationMain.dropoff ? dayjs(ReservationMain.dropoff).format('MMMM DD, YYYY hh:mm A') : 'n/a'}
        </Typography>
        <CustomInput sx={{ mt: 2, mr: 2 }} label="Name" placeholder="Your name" value={name} onChange={handleNameChange} />
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontWeight: '900', fontSize: '12px' }}>Special Instructions</Typography>
          <TextField value={special_instructions} placeholder="Your name" sx={{ width: '100%' }} multiline rows={6} onChange={handleSpecInstructionChange} />
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography sx={{ fontWeight: '900', fontSize: "24px" }}>Delivery Details</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <CustomInput sx={{ minWidth: '45%', mt: 2 }} label="Address" placeholder="Address" value={address} onChange={handleAddressChange} />
          <CustomInput sx={{ minWidth: '45%', mt: 2 }} label="Address Line2" placeholder="Suite Number" value={address2} onChange={handleAddressLine2Change} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Box sx={{minWidth: '45%'}}>
            <CustomInput sx={{ mt: 2 }} label="City" placeholder="City" value={city} onChange={handleCityChange} />
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent:'space-between', minWidth:'45%'}}>
            <CustomInput sx={{ mt: 2, minWidth: '20%' }} label="State" placeholder="State" value={state} onChange={handleStateChange} />
            <CustomInput sx={{ mt: 2, minWidth: '25%' }} label="Post" placeholder="Post" value={postal_code} onChange={handlePostChange} />
          </Box>
        </Box>
        <Box>
          <CustomInput sx={{ mt: 2, mr: 2, width: '100%' }} label="Phone" placeholder="Phone Number" value={phone_number} onChange={handlePhoneChange} />
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography sx={{ fontWeight: '900', fontSize: "24px" }}>Account Details</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <CustomInput sx={{ mt: 2, minWidth: '45%' }} label="Email" placeholder="star@email.com" value={email} onChange={handleEmailChange} />
          <CustomInput sx={{ mt: 2, minWidth: '45%' }} label="Pwd" placeholder="*********" type="password" value={password} onChange={handlePwdChange} />
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <FormControlLabel
          label="I accept HHI Rentals LLC Terms and Conditions and agree to the use of my phone number and/or email address for updates about my order delivery, use and pickup."
          control={<Checkbox checked={is_accept} onChange={handleAccountCheck} />}
        />
      </Box>
    </Box>

  );
}

export default ReservationMainDetail;
