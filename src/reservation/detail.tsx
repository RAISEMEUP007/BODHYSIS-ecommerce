import React from 'react';
import { useState } from 'react';

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import { Box, Typography, Fade, IconButton, Button, Grid, TextField } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import bikeIcon from "../img/bikeIcon.png";
import yellowbike from "../img/yellowbike.png"
import redbike from "../img/redbike.png"

interface ReservationDetailDialogProps {
  open: boolean
  handleDetailDialogOK: Function,
  handleDetailDialogClose: Function,
}

const ReservationDetailsDialog: React.FC<ReservationDetailDialogProps> = ({ open, handleDetailDialogOK, handleDetailDialogClose }) => {
  const [checked, setChecked] = useState(true);

  const handleExpandClick = () => {
    setChecked((prev) => !prev);
  };
  return (
    <Dialog
      open={open}
      maxWidth="lg"
      PaperProps={{ style: { width: 1000, padding: 5 } }}
    >
      <DialogTitle>
        Premium Mid Crossbar
      </DialogTitle>
      <DialogContent>
        <Box sx={{ height: '500px', overflowY: 'auto' }}>
          <Box sx={{ pt: 5, pb: 3, borderBottom: '2px solid #ABABAB' }}>
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
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
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Box sx={{ mt: 3, textAlign: 'center', pr: 2 }}>
                    <Typography sx={{ fontWeight: '700' }}>Quantity</Typography>
                    <Typography>3</Typography>
                  </Box>
                  <Box>
                    <Box className="price">
                      <p>$45</p>
                    </Box>
                    <IconButton onClick={handleExpandClick}>
                      {checked ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>
                </Box>
              </Box>
              {/* <Box sx={{flex: 1}}>
                $45
              </Box> */}
            </Box>
            {/* <Grid container>
              <Grid item md={3} xs={12}>
                <Box sx={{ pr: 2, pl: 2 }}>

                  <img src={yellowbike} style={{ maxWidth: '100%', width: '100%' }} />
                </Box>
              </Grid>
              <Grid item md={7} xs={12}>
                <Box className="productDetail">
                  <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Premium Mid Crossbar</h2>
                  <div>Unitex Betch Cruiser</div>
                  <div>25 fit rides 53 to 52</div>
                  <div>25 fit rides 53 to 52</div>
                  <div style={{ marginTop: '20px' }}>Price includes and one basket per order. Please send additional</div>
                  <div>baskets needed</div>
                  <div style={{ marginTop: '20px' }}>Medium rider weight 250lb</div>
                </Box>
              </Grid>
              <Grid item md={1} xs={12}>
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: '700' }}>Quantity</Typography>
                  <Typography>3</Typography>
                </Box>
              </Grid>
              <Grid item md={1} xs={12}>
                <Box className="price">
                  <p>$45</p>
                </Box>
                <IconButton onClick={handleExpandClick}>
                  {checked ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Grid>
            </Grid> */}
          </Box>
          {
            checked &&
            <Box sx={{ width: '100%' }}>
              <Fade in={checked}>
                <Box>
                  <Typography sx={{ mt: 3, fontWeight: '700' }}>Extras</Typography>
                  <Box sx={{ mt: 3 }}>
                    <img src={redbike} style={{ width: '150px' }} />
                    <img src={redbike} style={{ width: '150px' }} />
                  </Box>
                  <Typography sx={{ mt: 3 }}>Special Instructions</Typography>
                  <TextField
                    id="outlined-multiline-flexible"
                    multiline
                    rows={4}
                    sx={{ width: '100%' }}
                  />

                </Box>
              </Fade>
            </Box>
          }
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button variant="contained" sx={{ pr: 5, pl: 5, ml: 3 }} onClick={() => { handleDetailDialogOK() }}>
            Reserve
          </Button>
          <Button variant="text" sx={{ pr: 5, pl: 5, ml: 3 }} onClick={() => { handleDetailDialogClose() }}>
            Cancel
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default ReservationDetailsDialog;
