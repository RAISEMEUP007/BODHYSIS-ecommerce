import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, List, Link } from '@mui/material';
import { useNavigate } from 'react-router';

import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import CustomBorderInput from '../common/CustomBorderInput';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';

import ReservationTerm from '../reservation/ReservationTerm';
import DeliveryLocation from '../reservation/DeliveryLocation';
import CustomPhoneNumberInput from '../common/CustomPhoneNumberInput';

interface props {
  sx?: object;
}

const ReservationMainDetail: React.FC<props> = ({ sx }) => {

  const navigate = useNavigate();
  const { ReservationItems, ReservationMain, setReservationValue } = useCustomerReservation();
  const { matches900 } = useResponsiveValues();

  const handleAccountCheck = (e: any) => {
    setReservationValue('is_accept', e.target.checked)
  }

  const fullName = localStorage.getItem('full-name');

  return (
    <Box sx={{ ...sx }}>
      <Typography style={{fontWeight:700, fontSize:'36px', marginTop:'10px', marginBottom:'14px'}}>{`Account Details`}</Typography>
      <Typography>
        {`You are currently logged in as `}
        <b>{fullName}</b>
        {`. Please confirm that your email and phone number are correct. This is the information we will use to communicate with you about your order.`}
      </Typography>
      <Box>
        <CustomBorderInput
          containerstyle={{ width: matches900?'300px':'100%', mt:'20px', mr:matches900?'40px':'0px' }} 
          label="Email" 
          type="email" 
          placeholder="example@email.com" 
          value={ReservationMain.email} 
          onChange={(event)=>setReservationValue('email', event.target.value)} 
        />
        {/* <CustomBorderInput
          containerstyle={{ width: matches900?'300px':'100%', mt:'20px' }}
          label="Phone"
          placeholder="Phone Number" 
          value={ReservationMain.phone_number} 
          inputProps={{ maxLength: 12 }}
          onChange={(event)=>setReservationValue('phone_number', event.target.value)} 
        /> */}
        <CustomPhoneNumberInput
          label={"Phone Number"}
          containerstyle={{ width: matches900?'300px':'100%', mt:'20px' }}
          countryCodeEditable={false}
          defaultCountry={'us'}
          onlyCountries={['us']}
          value={ReservationMain.phone_number} 
          onChange={(value) => { setReservationValue('phone_number', value) }}
        />
      </Box>
      <Typography style={{fontWeight:700, fontSize:'36px', marginTop:'50px', marginBottom:'20px'}}>{`Reservation Details`}</Typography>
      <ReservationTerm
        contentStyle={{paddingLeft: matches900?'0px':'0px'}}
      />
      <CustomBorderInput
        containerstyle={{ width: matches900?'80%':'100%', mt:'20px' }}
        label = {'Special Instructions'}
        value={ReservationMain.special_instructions} 
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
        contentStyle={{paddingLeft:matches900?'0px':'0px'}}
      />
      <Typography style={{fontWeight:700, fontSize:'36px', marginTop:'50px', marginBottom:'20px'}}>{`Order Items`}</Typography>
      <List sx={{padding:'0px 14px', width:'80%', backgroundColor:'#F8F8F8', borderRadius:'4px', border:'1px solid #999'}}>
        {ReservationItems.length ?
          <>
            {ReservationItems.map((item: any, index: number) => { 
              return (
                <Box key={index} sx={{padding:'12px 2px', borderBottom:'1px solid #999', marginBottom:'-1px'}}>
                  <Box sx={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap'}}>
                    <Typography sx={{fontWeight:700, fontSize:'20px'}}>{item.display_name}</Typography>
                    <Box sx={{display:'flex'}}>
                      <Typography style={{fontWeight:600, fontSize:'16px',}}>{`Subtotal:`}</Typography>
                      <Typography style={{fontWeight:800, fontSize:'16px', color:'#4599D6', marginLeft:'20px'}}>{item.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Typography>
                    </Box>
                  </Box>
                  {(item.extras && item.extras.length) ?
                    <>
                      {item.extras.map((extra: any, index: number) => {
                        return (
                          <Typography key={index} sx={{fontWeight:400, ml:'20px'}}>{extra.name}</Typography>
                        )
                      })}
                    </>
                  : <Typography sx={{fontWeight:400, ml:'20px'}}>{"No extras"}</Typography>}
                </Box>
              )
            })}
          </>
        : <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '15px', color: '#999' }}>{"No one reserved"}</div>}
      </List>
      <FormControlLabel
        sx={{alignItems:'flex-start', ml:'0px', mt: '30px' }}
        label={(
          <span>
            {'I accept the HHI Rentals LLC '}
            <Link href="/termsandconditions" target="_blank">{`Terms and agree`}</Link>
            {'  to the use of my phone number and/or email address for updates about my order delivery, use, and pickup.*'}
          </span>
        )}
        control={<Checkbox checked={ReservationMain.is_accept} sx={{padding:'0px', mr:'10px'}} onChange={handleAccountCheck} />}
      />
    </Box>
  );
}

export default ReservationMainDetail;
