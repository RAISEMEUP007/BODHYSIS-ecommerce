import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Reservation from './reservation/Reservation';
import Payment from './payment/Payment';

import { useEffect, useState } from 'react';
import Providers from './common/Providers/Provider';
import { useStoreDetails } from './common/Providers/StoreDetailsProvider/UseStoreDetails';
import { getStoreDetailDB } from './api/Store';
import CompletePurchase from './completepurchase/CompletePurchase';
import Thankyou from './thankyou/Thankyou';
import Login from './login/Login';
import UserNotFound from './error/UserNotFound';
import PageNotFound from './error/PageNotFound';

const InitializeApp = ({ children } : {children:any}) => {

  const { getStoreDetails, setStoreDetails } = useStoreDetails();

  useEffect(() => {
    const fetchData = async () => {
      const currentURL = window.location.href;
      const host = new URL(currentURL).host;
      console.log(host);
      await getStoreDetailDB({store_url:host}, (jsonRes:any, status)=>{
        if(status == 200){
          setStoreDetails(jsonRes);
          document.title = jsonRes.store_name;
        }
      });
    };

    fetchData();
  }, []);

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
            <Route path="/" element={<Login />} />
            <Route path="/usernotfound" element={<UserNotFound />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/review" element={<Payment />} />
            <Route path="/completepurchase" element={<CompletePurchase />} />
            <Route path="/thankyou" element={<Thankyou/>} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </InitializeApp>
    </Providers>
  );
}

export default App;
