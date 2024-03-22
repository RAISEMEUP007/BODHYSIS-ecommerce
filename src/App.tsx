import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { getTestToken } from './api/Auth';
import Reservation from './reservation/Reservation';
import Payment from './payment/Payment';

import { useEffect, useState } from 'react';
import Providers from './common/Providers/Provider';
import { useStoreDetails } from './common/Providers/StoreDetailsProvider/UseStoreDetails';
import { getStoreDetailDB } from './api/Store';

const InitializeApp = ({ children } : {children:any}) => {
  const [accessToken, setAccessToken] = useState(null);

  const { getStoreDetails, setStoreDetails } = useStoreDetails();

  useEffect(() => {
    const fetchData = async () => {
      await getTestToken((jsonRes:any, status)=>{
        if(status == 200){
          setAccessToken(jsonRes.refreshToken);
          localStorage.setItem('access-token', jsonRes.refreshToken);
        }
      });
  
      const currentURL = window.location.href;
      const host = new URL(currentURL).host;
      console.log(host);
      await getStoreDetailDB({store_url:host}, (jsonRes:any, status)=>{
        if(status == 200) setStoreDetails(jsonRes);
      });
    };

    fetchData();
  }, []);

  if (accessToken === null) {
    return <div>Invalid token...</div>;
  }

  if (getStoreDetails() === null) {
    return <div>Not registered store...</div>;
  }

  return children;
};

const App = () => {
  return (
    <Providers>
      <InitializeApp>
        <Router>
          <Routes>
            <Route path="/" element={<Reservation />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </Router>
      </InitializeApp>
    </Providers>
  );
}

export default App;
