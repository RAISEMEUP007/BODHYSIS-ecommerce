import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { getTestToken } from './api/Auth';
import Reservation from './reservation/Reserve';
import Payment from './payment/Payment';

import ReservationDetails from './reservation/Detail';
import { useEffect, useState } from 'react';

const App = () => {
  const [accessToken, setAccessToken] = useState(null); // Initializing access token state

  useEffect(() => {
    getTestToken((jsonRes:any)=>{
      setAccessToken(jsonRes.refreshToken);
      localStorage.setItem('access-token', jsonRes.refreshToken);
    });
  }, []);

  if (accessToken === null) {
    return <div>Loading...</div>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <Routes>
          <Route path="/" element={<Reservation />} />
          <Route path="/payment" element={<Payment />} />
          {/* <Route path="/detail" element={<ReservationDetails />} /> */}
        </Routes>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
