import React from 'react';
import { useState } from 'react';
import { Box, Typography, TextField, Grid, Checkbox, FormControlLabel } from '@mui/material';
import bikeIcon from "../img/bikeIcon.png";
import CustomSelect from '../common/CustomSelect';
import CustomInput from '../common/CustomInput';
import Purchase from '../common/Purchase';
import BasicLayout from '../common/BasicLayout';

const Payment: React.FC = () => {
  const [name, setName] = useState("");
  const [specInstruction, setSpecInstruction] = useState("");
  const [address, setAddress] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [post, setPost] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [accountCheck, setAccountCheck] = useState(true)

  const handleNameChange = (e: any) => {
    setName(e.target.value);
  }

  const handleSpecInstructionChange = (e: any) => {
    setSpecInstruction(e.target.value);
  }

  const handleAddressChange = (e: any) => {
    setAddress(e.target.value);
  }

  const handleAddressLine2Change = (e: any) => {
    setAddressLine2(e.target.value);
  }

  const handleCityChange = (e: any) => {
    setCity(e.target.value);
  }

  const handleStateChange = (e: any) => {
    setState(e.target.value);
  }

  const handlePostChange = (e: any) => {
    setPost(e.target.value);
  }

  const handlePhoneChange = (e: any) => {
    setPhone(e.target.value);
  }

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  }

  const handlePwdChange = (e: any) => {
    setPwd(e.target.value);
  }

  const handleAccountCheck = (e: any) => {
    setAccountCheck(e.target.checked)
  }

  return (
    <BasicLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ fontWeight: '900', fontSize: "24px" }}>Reservation Details</Typography>
            <Typography>March 01, 2023 10:30 AM - March 06, 2023 05:00 PM</Typography>
            <CustomInput sx={{ mt: 2, mr: 2 }} label="Name" placeholder="Your name" value={name} onChange={handleNameChange} />
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontWeight: '900', fontSize: '12px' }}>Special Instructions</Typography>
              <TextField placeholder="Your name" sx={{ width: '100%' }} multiline rows={6} onChange={handleSpecInstructionChange} />
            </Box>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ fontWeight: '900', fontSize: "24px" }}>Delivery Details</Typography>
            <Grid container>
              <Grid item md={6} xs={12}>
                <CustomInput sx={{ mt: 2, mr: 2 }} label="Address" placeholder="Address" value={address} onChange={handleAddressChange} />
              </Grid>
              <Grid item md={6} xs={12}>
                <CustomInput sx={{ mt: 2, mr: 2 }} label="Address Line2" placeholder="Suite Number" value={addressLine2} onChange={handleAddressLine2Change} />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={6} xs={12}>
                <CustomInput sx={{ mt: 2, mr: 2 }} label="City" placeholder="City" value={city} onChange={handleCityChange} />
              </Grid>
              <Grid item md={2} xs={12}>
                <CustomSelect sx={{ mt: 2, mr: 3, minWidth: '30%', width: "70%", border: 'none' }} name="State" value={state} items={["Item1", "Item2", "Item3"]} onChange={handleStateChange} />
              </Grid>
              <Grid item md={4} xs={12}>
                <CustomInput sx={{ mt: 2, mr: 2 }} label="Post" placeholder="Post" value={post} onChange={handlePostChange} />
              </Grid>
            </Grid>
            <CustomInput sx={{ mt: 2, mr: 2 }} label="Phone" placeholder="Phone Number" value={phone} onChange={handlePhoneChange} />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ fontWeight: '900', fontSize: "24px" }}>Account Details</Typography>
            <Grid container>
              <Grid item md={6} xs={12}>
                <CustomInput sx={{ mt: 2, mr: 2 }} label="Email" placeholder="star@email.com" value={email} onChange={handleEmailChange} />
              </Grid>
              <Grid item md={6} xs={12}>
                <CustomInput sx={{ mt: 2, mr: 2 }} label="Pwd" placeholder="*********" type="password" value={pwd} onChange={handlePwdChange} />
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mt: 3 }}>
            <FormControlLabel
              label="I accept HHI Rentals LLC Terms and Conditions and agree to the use of my phone number and/or email address for updates about my order delivery, use and pickup."
              control={<Checkbox checked={accountCheck} onChange={handleAccountCheck} />}
            />
          </Box>
        </Box>
        <Box sx={{ width: '400px', pr: '50px', pl: '50px', borderLeft: '1px solid #ABABAB' }}>
          <Purchase sx={{}} title="Summary" reservedProducts={[]} pickup={new Date()} dropoff={new Date()} />
          <Box sx={{textAlign: 'center'}}>
            Stripe
          </Box>
        </Box>
      </Box>
    </BasicLayout>
  );
}

export default Payment;
