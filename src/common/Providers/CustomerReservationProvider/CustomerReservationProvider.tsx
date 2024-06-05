import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import { useStoreDetails } from '../StoreDetailsProvider/UseStoreDetails';
import { getHeaderData, getTableData } from '../../../api/Product';
import { calculatePricedEquipmentData, getPriceTableByBrandAndDate } from '../../../reservation/CalcPrice';

export interface ReservationMainProps {
  pickup: Date | null;
  dropoff: Date | null;
  prices: {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
  },
  price_table_id: number | null;
  name: string;
  note: string;
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
  headerData: Array<any>,
  priceTableData: Array<any>,
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
  pickup: null,
  dropoff: null,
  prices: {
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
  },
  price_table_id: null,
  name: "",
  note: "",
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
  headerData: [],
  priceTableData: [],
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
    const calculatedReservedItems = await calculatePricedEquipmentData(ReservationMain.headerData, ReservationMain.price_table_id, ReservationMain.priceTableData, ReservationItems, ReservationMain.pickup, ReservationMain.dropoff);

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
    prices.tax = (prices.subtotal - prices.discount + ReservationMain.driver_tip) * (storeDetails.sales_tax?storeDetails.sales_tax/100:0) ?? 0;
    prices.total = prices.subtotal - prices.discount + ReservationMain.driver_tip + prices.tax;

    setReservationValue('prices', prices);
  }

  useEffect(() => {
    if(ReservationMain.pickup){
      const priceTable = getPriceTableByBrandAndDate(priceLogicData, storeDetails.brand_id, ReservationMain.pickup);
      setReservationValue('price_table_id', priceTable?.id??null);
    }
  }, [priceLogicData, storeDetails.brand_id, ReservationMain.pickup])

  useEffect(() => {
    if(ReservationMain.price_table_id){
      getHeaderData(ReservationMain.price_table_id, (jsonRes:any, status, error) => {
        switch (status) {
          case 200:
            setReservationValue('headerData', jsonRes);
            break;
          default:
            setReservationValue('headerData', []);
            break;
        }
      });
      getTableData(ReservationMain.price_table_id, (jsonRes:any, status, error) => {
        switch (status) {
          case 200:
            setReservationValue('priceTableData', jsonRes);
            break;
          default:
            setReservationValue('priceTableData', []);
            break;
        }
      });
    }else {
      setReservationValue('priceTableData', []);
    }
  }, [ReservationMain.price_table_id]);

  useEffect(()=>{
    calcAndSetData(ReservationItems);
  }, [
    ReservationMain.headerData, 
    ReservationMain.price_table_id, 
    ReservationMain.priceTableData, 
    ReservationMain.pickup, 
    ReservationMain.dropoff, 
    ReservationMain.driver_tip, 
    ReservationMain.discount_code, 
    discounts, 
    storeDetails.sales_tax
  ]);
  
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