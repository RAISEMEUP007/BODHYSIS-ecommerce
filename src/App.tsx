import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { getTestToken } from './api/Auth';
import Desktop1 from './reservation/reserve';
import Desktop2 from './reservation/desktop2';
import ReservationDetails from './reservation/detail';
import { useEffect, useState } from 'react';

const App = () => {
  const [accessToken, setAccessToken] = useState(null); // Initializing access token state

  useEffect(() => {
    getTestToken((jsonRes:any)=>{
      setAccessToken(jsonRes.refreshToken);
    });
  }, []);

  if (accessToken === null) {
    return <div>Loading...</div>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <Routes>
          <Route path="/" element={<Desktop1 />} />
          <Route path="/desktop2" element={<Desktop2 />} />
          {/* <Route path="/detail" element={<ReservationDetails />} /> */}
        </Routes>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
