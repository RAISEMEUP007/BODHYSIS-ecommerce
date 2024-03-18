import React from 'react';
import { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Input, TextField, Button, Grid, Checkbox, FormControlLabel } from '@mui/material';
import bikeIcon from "../img/bikeIcon.png";
import yellowbike from "../img/yellowbike.png"
import redbike from "../img/redbike.png"

const CustomSelect = (props: any) => {
  const { name, value, onChange, items } = props;
  return (
    <FormControl variant="standard" sx={{ mt: 2, mr: 3, minWidth: '30%', width: "70%", border: 'none' }}>
      <Typography sx={{ fontWeight: '900', fontSize: '12px' }}>{name}</Typography>
      {/* <InputLabel>Text</InputLabel> */}
      <Select
        labelId="select-placeholder-label"
        value={value}
        inputProps={{ 'aria-label': 'select' }}
        onChange={onChange}
        sx={{ ml: 1 }}
        displayEmpty
      >
        {items.map((item: any) => {
          return (
            <MenuItem
              key={item}
              value={item}
            >
              {item}
            </MenuItem>
          )
        })}

      </Select>
    </FormControl>
  )
}

const CustomInput = (props: any) => {
  const { label, placeholder, onChange, type } = props;
  return (
    <Box sx={{ mt: 2, mr: 2 }}>
      <Typography sx={{ fontWeight: '900', fontSize: "12px" }}>{label}</Typography>
      <Input placeholder={placeholder} sx={{ pl: 1, pr: 1, width: '100%' }} onChange={onChange} type={type}/>
    </Box>
  )
}

const ProductDetail = (props: any) => {
  const { price } = props
  return (
    <Box sx={{ border: '1px solid #ABABAB', mt: 2, padding: 2, display: 'flex', justifyContent: 'space-between', borderRadius: '20px' }}>
      <Grid container>
        <Grid item md={11} xs={12}>
          <Grid container >
            <Grid item md={4}>
              <img src={yellowbike} style={{ maxWidth: '100%', width: '100%' }} />
            </Grid>
            <Grid item md={8}>
              <Box className="productDetail">
                <h2>Premium Mid Crossbar</h2>
                <p>Unitex Betch Cruiser</p>
                <p>25 fit rides 53 to 52</p>
                <p>25 fit rides 53 to 52</p>
                <br />
                <p>Price includes and one basket per order. Please send additional</p>
                <p>baskets needed</p>
                <br />
                <p>Medium rider weight 250lb</p>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={1} xs={12}>
          <Box className="price">
            <p>${price}</p>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

const Payment: React.FC = () => {
  const [pickup, setPickup] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [bike, setBike] = useState("");

  const handlePickupChange = (e: any) => {
    setPickup(e.target.value as string);
  }

  const handleDurationChange = (e: any) => {
    setDuration(e.target.value);
  }

  const handleCategoryChange = (e: any) => {
    setCategory(e.target.value);
  }

  const handleBikeChange = (e: any) => {
    setBike(e.target.value);
  }


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
    <Box sx={{ padding: '30px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ width: '60%' }}>
          <img src={bikeIcon} width={50} height={75} />
          <Typography sx={{ textTransform: 'uppercase', display: 'inline-block', fontWeight: 900 }}>ISLAND CRUISERS.</Typography>
          <Box sx={{ mt: 3 }}>

            <Typography sx={{ fontWeight: '900', fontSize: "24px" }}>Reservation Details</Typography>
            <Typography>March 01, 2023 10:30 AM - March 06, 2023 05:00 PM</Typography>
            <CustomInput label="Name" placeholder="Your name" onChange={handleNameChange} />
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontWeight: '900', fontSize: '12px' }}>Special Instructions</Typography>
              <TextField placeholder="Your name" sx={{ width: '100%' }} multiline rows={6} onChange={handleSpecInstructionChange} />
            </Box>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ fontWeight: '900', fontSize: "24px" }}>Delivery Details</Typography>
            <Grid container>
              <Grid item md={6} xs={12}>
                <CustomInput label="Address" placeholder="Address" onChange={handleAddressChange} />
              </Grid>
              <Grid item md={6} xs={12}>
                <CustomInput label="Address Line2" placeholder="Suite Number" onChange={handleAddressLine2Change} />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={6} xs={12}>
                <CustomInput label="City" placeholder="City" onChange={handleCityChange} />
              </Grid>
              <Grid item md={2} xs={12}>
                <CustomSelect name="State" value={state} items={["Item1", "Item2", "Item3"]} onChange={handleStateChange} />
              </Grid>
              <Grid item md={4} xs={12}>
                <CustomInput label="Post" placeholder="Post" onChange={handlePostChange} />
              </Grid>
            </Grid>
            <CustomInput label="Phone" placeholder="Phone Number" onChange={handlePhoneChange} />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ fontWeight: '900', fontSize: "24px" }}>Account Details</Typography>
            <Grid container>
              <Grid item md={6} xs={12}>
                <CustomInput label="Email" placeholder="star@email.com" onChange={handleEmailChange} />
              </Grid>
              <Grid item md={6} xs={12}>
                <CustomInput label="Pwd" placeholder="*********" type="password" onChange={handlePwdChange} />
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mt: 3 }}>
            <FormControlLabel 
              label="I accept HHI Rentals LLC Terms and Conditions and agree to the use of my phone number and/or email address for updates about my order delivery, use and pickup."
              control={<Checkbox checked={accountCheck} onChange={handleAccountCheck}/>}
            />
           </Box>
        </Box>
        <Box sx={{ width: '25%', pr: 4, pl: 4 }}>
          <Typography sx={{ fontWeight: '900', ml: 3 }}>Summary</Typography>
          <Box sx={{ p: 2 }}>
            <img src={yellowbike} style={{ width: '50%' }} />
            <img src={redbike} style={{ width: '50%' }} />
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '10px', fontWeight: '900' }}>March 01, 2023 10:30 AM - March 06, 2023 05:00 PM</Typography>
          </Box>

          <Box>
            <Box className="summary">
              <p>Subtotal</p>
              <p>0.00</p>
            </Box>
            <Box className="summary">
              <p>Tax(8.1%)</p>
              <p>0.00</p>
            </Box>
            <Box className="summary">
              <p>Total</p>
              <p>0.00</p>
            </Box>
          </Box>
          <Box sx={{ pt: 5, pr: 3, pl: 3, textAlign: 'center' }}>
            <Button variant="contained" sx={{ pr: 6, pl: 6, fontSize: '10px' }}>
              Complete Purchase
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Payment;
