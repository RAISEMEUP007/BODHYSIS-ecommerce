import React from 'react';
import { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import bikeIcon from "../img/bikeIcon.png";
import yellowbike from "../img/yellowbike.png"
import redbike from "../img/redbike.png"
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import CategorySlot from './CategorySlots';
import ReservationDetailsDialog from './detail';


const CustomSelect = (props: any) => {
  const { name, value, onChange, items, sx } = props;
  return (
    <FormControl variant="standard" sx={sx}>
      <Typography sx={{ fontWeight: '900' }}>{name}</Typography>
      <Select
        labelId="select-placeholder-label"
        value={value}
        inputProps={{ 'aria-label': 'select' }}
        onChange={onChange}
        sx={{ mt: '12px', p: '4px' }}
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

const CustomCalendar = (props: any) => {
  const { name, value, onChange, items, sx } = props;
  return (
    <FormControl variant="standard" sx={sx}>
      <Typography sx={{ fontWeight: '900' }}>{name}</Typography>
      <DateTimePicker
        value={value}
        onChange={onChange}
        sx={{ mt: '12px', pt: '8px' }}
        referenceDate={dayjs()}
        slotProps={{ textField: { variant: 'standard', } }}
      />
    </FormControl>
  )
}

const ProductDetail = (props: any) => {
  const { price, handleDetailDialogOpen } = props
  return (
    <Button
      disableRipple
      onClick={handleDetailDialogOpen}
      sx={{ mt: '20px', color: 'black', width: '100%', textAlign:'left' }}
    >
      <Box sx={{ border: '1px solid #ABABAB', padding: '30px', display: 'flex', justifyContent: 'space-between', borderRadius: '10px', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Box sx={{ width: '30%', maxWidth: '300px', mt: '10px' }}>
            <img src={yellowbike} style={{ maxWidth: '100%', width: '100%' }} />
          </Box>
          <Box sx={{ flex: 1, ml: '30px' }}>
            <Box sx={{}}>
              <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Premium Mid Crossbar</h2>
              <div>Unitex Betch Cruiser</div>
              <div>25 fit rides 53 to 52</div>
              <div>25 fit rides 53 to 52</div>
              <div style={{ marginTop: '20px' }}>Price includes and one basket per order. Please send additional</div>
              <div>baskets needed</div>
              <div style={{ marginTop: '20px' }}>Medium rider weight 250lb</div>
            </Box>
          </Box>
        </Box>
      </Box>
    </Button>
  )
}

const Reserve: React.FC = () => {
  const [pickup, setPickup] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [bike, setBike] = useState("");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();

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

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
  }

  const handleDetailDialogOpen = () => {
    setDetailDialogOpen(true);
  }

  const handleDetailDialogOK = () => {
    setDetailDialogOpen(false);
  }

  return (
    <Box sx={{ padding: '30px 50px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
        <img src={bikeIcon} width={50} height={75} />
        <p style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>ISLAND CRUISERS.</p>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex' }}>
            <CustomCalendar
              name="Pick up"
              sx={{ boxSizing: 'boder-box', width: '30%', pt: 5, pr: 5 }}
            />
            <CustomSelect
              name="Duration"
              value={duration}
              onChange={handleDurationChange}
              items={["Item1", "Item2", "Item3"]}
              sx={{ boxSizing: 'boder-box', width: '30%', pt: 5, pr: 5 }}
            />
            <CustomCalendar
              name="Drop off"
              sx={{ boxSizing: 'boder-box', width: '30%', pt: 5, pr: 5 }}
            />
          </Box>
          <CategorySlot sx={{ mt: '50px' }} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}  />
          <Box sx={{ mt: '70px', pr: 2 }}>
            <Typography sx={{ fontWeight: '900' }}>There are 2 products available.</Typography>
            <ProductDetail price={45} handleDetailDialogOpen={handleDetailDialogOpen} />
            <ProductDetail price={55} handleDetailDialogOpen={handleDetailDialogOpen} />
          </Box>
        </Box>
        <Box sx={{ width: '400px', pr: '50px', pl: '50px', borderLeft: '1px solid #ABABAB' }}>
          <Typography sx={{ fontWeight: '900', mb: '30px', textAlign: 'center' }}>Reservation Details</Typography>
          <Box>
            <img src={yellowbike} style={{ width: '50%' }} />
            <img src={redbike} style={{ width: '50%' }} />
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: 14, }}>March 01, 2023 10:30 AM - March 06, 2023 05:00 PM</Typography>
          </Box>

          <Box sx={{ mt: "100px", mb: '20px' }}>
            <Box className="reservationDetail">
              <p>Subtotal</p>
              <p>0.00</p>
            </Box>
            <Box className="reservationDetail">
              <p>Tax(8.1%)</p>
              <p>0.00</p>
            </Box>
            <Box className="reservationDetail">
              <p>Total</p>
              <p>0.00</p>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" sx={{ pr: 6, pl: 6 }} component={Link} to="/payment">
              Complete Purchase
            </Button>
          </Box>
        </Box>
      </Box>
      <ReservationDetailsDialog open={detailDialogOpen} handleDetailDialogOK={handleDetailDialogOK} handleDetailDialogClose={handleDetailDialogClose} />
    </Box>
  );
}

export default Reserve;
