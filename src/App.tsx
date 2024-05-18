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
import Temp from './thankyou/Temp';
import TermsAndconditions from './payment/TermsAndConditions';
import { getDiscountCodes, getPriceLogicData } from './api/Product';

const InitializeApp = ({ children } : {children:any}) => {

  const { storeDetails, setStoreDetails, setDiscounts, setPriceLogicData } = useStoreDetails();

  const [ loadingFailed, setLoadingFailed ] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const currentURL = window.location.href;
      const host = new URL(currentURL).host;
      await getStoreDetailDB({store_url:host}, (jsonRes:any, status)=>{
        if(status == 200){
          setStoreDetails(jsonRes);
          document.title = jsonRes.store_name;
        }else setLoadingFailed(true);
      });
      await getDiscountCodes((jsonRes:any, status)=>{
        if(status == 200){
          setDiscounts(jsonRes);
        }else{
          setDiscounts([]);
          setLoadingFailed(true);
        } 
      })
      await getPriceLogicData((jsonRes: any, status) => { 
        if(status == 200){
          setPriceLogicData(jsonRes) ;
        }else {
          setDiscounts([]);
          setLoadingFailed(true);
        } 
      });
    };

    fetchData();
  }, []);

  if (!storeDetails.brand_id) return <div>{"Loading Store Details..."}</div>;

  if(loadingFailed) return <div>{"Error occured while loading the store datail..."}</div>;

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
            <Route path="/test" element={<Temp/>} />
            <Route path="/termsandconditions" element={<TermsAndconditions/>} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </InitializeApp>
    </Providers>
  );
}

export default App;
