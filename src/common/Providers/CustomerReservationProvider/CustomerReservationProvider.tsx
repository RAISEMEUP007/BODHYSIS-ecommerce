import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import { useStoreDetails } from '../StoreDetailsProvider/UseStoreDetails';
import { getHeaderData } from '../../../api/Product';
import { calculatePricedEquipmentData, getPriceTableByBrandAndDate } from '../../../reservation/CalcPrice';

export interface ReservationMainProps {
  pickup: Date;
  dropoff: Date | null;
  prices: {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
  },
  price_table_id: number | null;
  name: string;
  special_instructions: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  state_id: number;
  postal_code: string;
  phone_number: string;
  email: string;
  password: string;
  is_accept: boolean;
  img_url: string,
  address_id: number | null,
  selectedAddress: any,
  use_manual: boolean;
  manual_address: string,
  driver_tip: number,
  discount_code: string,
  promo_code: number | null,
  discount_rate: number | null,
}

interface ContextProps {
  ReservationMain: ReservationMainProps;
  ReservationItems: Array<any>;
  setReservationMain: (ReservationMain: ReservationMainProps) => void;
  setReservationValue: (key: keyof ReservationMainProps, value: any) => void;
  getReservationValue: (key: keyof ReservationMainProps) => any | null;
  addReservationItems: (item: Array<any>) => void;
  removeReservationItem: (index: number) => void;
  initReservation: () => void;
}

const initializedMain: ReservationMainProps = {
  pickup: new Date(),
  dropoff: null,
  prices: {
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
  },
  price_table_id: null,
  name: "",
  special_instructions: "",
  address: "",
  address2: "",
  city: "",
  state: "",
  state_id: 0,
  postal_code: "",
  phone_number: "",
  email: "",
  password: "",
  is_accept: false,
  img_url: "",
  address_id: null,
  selectedAddress: null,
  use_manual: false,
  manual_address: "",
  driver_tip: 0.00,
  discount_code: "",
  promo_code: null,
  discount_rate: null,
}

export const CustomerReservationContext = createContext<ContextProps>({
  ReservationMain: initializedMain,
  ReservationItems: [],
  setReservationMain: () => {},
  setReservationValue: () => {},
  getReservationValue: () => null,
  addReservationItems: () => {},
  removeReservationItem: () => {},
  initReservation: () => {},
});

export const CustomerReservationProvider = ({ children }:{children:React.ReactNode}) => {
  const { storeDetails, discounts, priceLogicData } = useStoreDetails();

  const [ReservationMain, setReservationMain] = useState<ReservationMainProps>(initializedMain);
  const [ReservationItems, setReservationItems] = useState<Array<any>>([]);
  const [headerData, setHeaderData] = useState<Array<any>>([]);

  // const [priceLogicData, setPriceLogicData] = useState<Array<any>>([]);

  const setReservationValue = (key: keyof ReservationMainProps, value: any) => {
    setReservationMain((prev) => {
      if (prev) {
        return { ...prev, [key]: value };
      } else {
        return { ...initializedMain, [key]: value }
      }
    });
  };
  
  const getReservationValue = (key: keyof ReservationMainProps): any | null => {
    return ReservationMain ? ReservationMain[key] : null;
  };

  const addReservationItems = (items:Array<any>) => {
    const updatedItems = [...ReservationItems, ...items];
    calcAndSetData(updatedItems);
  }

  const calcAndSetData = async (ReservationItems:Array<any>) =>{
    // console.log("--------------- calcAndSetData ----------------------");
    const calculatedReservedItems = await calculatePricedEquipmentData(headerData, ReservationMain.price_table_id, ReservationItems, ReservationMain.pickup, ReservationMain.dropoff);
    // console.log(calculatedReservedItems);
    setReservationItems(calculatedReservedItems);

    let prices = {
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
    }
    
    calculatedReservedItems.map((item:any)=>{
      let subtotal = item.price || 0;
      prices.subtotal += subtotal;
    });

    if(ReservationMain.driver_tip) prices.subtotal += ReservationMain.driver_tip;

    if(ReservationMain.discount_code){

      const selectedDiscount:any = discounts.find((item:any) => {
        if (typeof item.code === 'string') {
          return item.code.toLowerCase() === ReservationMain.discount_code.toLowerCase();
        }
        return false;
      });

      if(selectedDiscount){
        prices.discount = (Math.round(prices.subtotal * selectedDiscount.amount) / 100);
      }else{
        prices.discount = 0;
      }
    }
    prices.tax = (prices.subtotal - prices.discount) * (storeDetails.sales_tax?storeDetails.sales_tax/100:0) ?? 0;
    prices.total += prices.subtotal - prices.discount + prices.tax;

    setReservationValue('prices', prices);
  }

  useEffect(() => {
    if(ReservationMain.pickup){
      const priceTable = getPriceTableByBrandAndDate(priceLogicData, storeDetails.brand_id, ReservationMain.pickup);
      console.log("----------- priceTable -----------");
      console.log(priceTable);
      setReservationValue('price_table_id', priceTable?.id??null);
    }
  }, [priceLogicData, storeDetails.brand_id, ReservationMain.pickup])

  useEffect(()=>{console.log("priceLogicData")}, [priceLogicData]);
  useEffect(()=>{console.log("storeDetails.brand_id")}, [storeDetails.brand_id]);
  useEffect(()=>{console.log("ReservationMain.pickup")}, [ReservationMain.pickup]);

  useEffect(() => {
    if(ReservationMain.price_table_id){
      getHeaderData(ReservationMain.price_table_id, (jsonRes:any, status, error) => {
        switch (status) {
          case 200:
            setHeaderData(jsonRes);
            break;
          default:
            setHeaderData([]);
            break;
        }
      });
    }else setHeaderData([]);
  }, [ReservationMain.price_table_id]);

  useEffect(()=>{
    calcAndSetData(ReservationItems);
  }, [
    headerData, 
    ReservationMain.price_table_id, 
    ReservationMain.pickup, 
    ReservationMain.dropoff, 
    ReservationMain.driver_tip, 
    ReservationMain.discount_code, 
    discounts, 
    storeDetails.sales_tax
  ]);

  // useEffect(() => {console.log('************************************************')}, []);
  // useEffect(()=>{console.log("headerData")}, [headerData])
  // useEffect(()=>{console.log("ReservationMain.price_table_id")}, [ReservationMain.price_table_id])
  // useEffect(()=>{console.log("ReservationMain.pickup")}, [ReservationMain.pickup])
  // useEffect(()=>{console.log("ReservationMain.dropoff")}, [ReservationMain.dropoff])
  // useEffect(()=>{console.log("ReservationMain.driver_tip")}, [ReservationMain.driver_tip])
  // useEffect(()=>{console.log("ReservationMain.discount_code")}, [ReservationMain.discount_code])
  // useEffect(()=>{console.log("discounts")}, [discounts])
  // useEffect(()=>{console.log("storeDetails.sales_tax")}, [storeDetails.sales_tax])
  // useEffect(()=>{console.log('length', ReservationItems.length)}, [ReservationItems.length]);

  const values: ContextProps = {
    ReservationMain,
    ReservationItems,
    setReservationMain,
    setReservationValue,
    getReservationValue,
    addReservationItems,
    removeReservationItem: (index) => {
      setReservationItems((prevItems) => {
        const newItems = [...prevItems];
        newItems.splice(index, 1);
        return newItems;
      });
    },
    initReservation: () => {
      setReservationMain(initializedMain);
      setReservationItems([]);
    },
  };

  return <CustomerReservationContext.Provider value={values}>{children}</CustomerReservationContext.Provider>;
};