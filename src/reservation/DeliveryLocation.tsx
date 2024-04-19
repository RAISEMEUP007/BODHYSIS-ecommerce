import React, { useState, useEffect } from 'react';
import { Autocomplete, Box, Collapse, Link, TextField, Typography } from '@mui/material';

import { useCustomerReservation } from '../common/Providers/CustomerReservationProvider/UseCustomerReservation';
import { searchAddress } from '../api/Store';
import CustomBorderInput from '../common/CustomBorderInput';
import { useResponsiveValues } from '../common/Providers/DimentionsProvider/UseResponsiveValues';

interface props {
  sx?: object;
  isDescription?: boolean;
  isShowAddress?: boolean;
  isShowSearchBox?: boolean;
  contentStyle?: object;
}

const DeliveryLocation: React.FC<props> = ({sx, isDescription, isShowAddress, isShowSearchBox, contentStyle}) => {
  const { ReservationMain, setReservationValue } = useCustomerReservation();
  const { matches900 } = useResponsiveValues();

  const [expandSearchBox, setExpandSearchBox] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const [searchedAddresses, setSearchedAddresses] = useState<Array<any>>([]);

  useEffect(()=>{
    if(isShowSearchBox) setExpandSearchBox(true);
    else setExpandSearchBox(false);
  }, [isShowSearchBox]);

  useEffect(() => {
    if (searchKey) {
      searchAddress(searchKey, (jsonRes:any, status) => {
        if (status === 200 && Array.isArray(jsonRes)) {
          setSearchedAddresses(
            jsonRes.map((address) => ({
              ...address,
              label: `${address.street || ''} ${address.number || ''} ${address.plantation || ''} ${address.property_name || ''}`
            }))
          );
        } else {
          setSearchedAddresses([]);
        }
      });
    } else {
      setSearchedAddresses([]);
    }
  }, [searchKey]);

  return (
    <Box sx={sx}>
      <Typography sx={{margin:'20px 0', textDecoration:'underline', fontSize:'20px'}}>{`Delivery Location`}</Typography>
      <Box sx={contentStyle}>
        {isDescription && <Typography>{`We have a robust database of locations on the island we deliver to. Search for a location and select the appropriate address from the dropdown. If your address is not lsited, click below to enter your address manually. Please search for your address first, as selecting from our lsit will make delivery smoother and easier.`}</Typography>}
        {isShowAddress && 
          <Typography style={{marginTop:'20px', fontWeight:700, fontSize:'20px'}}>
            {ReservationMain.use_manual ? 
              (ReservationMain.manual_address || ' ')
              :  `${ReservationMain.selectedAddress?.street || ''} ${ReservationMain.selectedAddress?.number || ''} ${ReservationMain.selectedAddress?.plantation || ''} ${ReservationMain.selectedAddress?.property_name || ''}`
            }
          </Typography>
        }
        {/* <CustomBorderInput
          containerstyle={{ width: '60%', mt:'30px' }}
          label="Search Address"
          placeholder="Start typing to search for your address..." 
          value={searchKey} 
          required={true}
          onChange={(event)=>{setSearchKey(event.target.value)}} /> */}
        {isShowSearchBox == false && (
          <Box 
            sx={{mt:'10px', fontSize:'18px', }}
          >
            <Link 
              onClick={()=>{setExpandSearchBox(!expandSearchBox)}}
              sx={{cursor:'pointer'}}
            >
              {`Change delivery address. `}
            </Link>
          </Box>
        )}

        <Collapse in={expandSearchBox}>
          <Typography style={{marginTop:'10px', fontSize:'15px'}}>{"Search Address"}</Typography>
          <Autocomplete
            freeSolo
            sx={{ 
              width: matches900?'60%':'100%', 
              boxShadow: '2px 2px 6px #b3b3b3', 
            }}
            disableClearable
            options={searchedAddresses}
            value={ReservationMain.selectedAddress}
            onChange={(event, value)=>{
              setReservationValue('selectedAddress', value);
              setReservationValue('address_id', value.id);
            }}
            // inputValue={searchKey}
            onInputChange={(event, value)=>{setSearchKey(value)}}
            filterOptions={(x) => {
              return x;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />
          <Box 
            sx={{mt:'10px', fontSize:'18px', }}
          >
            <Link 
              onClick={()=>{setReservationValue('use_manual', !ReservationMain.use_manual)}}
              sx={{cursor:'pointer'}}
            >
              {`Address not listed? Manually enter address.`}
            </Link>
          </Box>
        </Collapse>
        <Collapse in={expandSearchBox && ReservationMain.use_manual}>
          <CustomBorderInput
            containerstyle={{ width: matches900?'60%':'100%', mt:'20px' }}
            label="Manual Address Entry"
            placeholder="Resort, Street Address, Apt #/Suite/Etc." 
            value={ReservationMain.manual_address} 
            required={true}
            onChange={(event)=>{setReservationValue('manual_address', event.target.value)}} />
        </Collapse>
      </Box>
    </Box>
  );
}

export default DeliveryLocation;