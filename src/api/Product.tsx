import { getAPICall, getAPIProps, postAPICall, postAPIProps, defaultCallback } from './BaseAPI';

export const getProductCategoriesData = async (callback=defaultCallback) => {
  return await getAPICall({ route: 'product/getproductcategoriesdata', callback });
}

export const getProductFamiliesData = async (categoryId:string|number, callback=defaultCallback) => {
  return await getAPICall({ route: 'product/getproductfamiliesdatabydiplayname/' + categoryId, callback });
}

export const getProductLinesData = async (categoryId:string|number, callback=defaultCallback) => {
  return await getAPICall({ route: 'product/getproductlinesdata2/' + categoryId, callback });
}

export const getExtrasData = async (callback=defaultCallback) => {
  return await getAPICall({ route: 'settings/getextrasdata', callback });
}

export const getPriceDataByGroup = async (payload:any, callback=defaultCallback) => {
  return await postAPICall({ route: 'price/getpricedatabygroup', payload, callback });
}

export const getPriceLogicData = async (callback=defaultCallback) => {
  return await getAPICall({route: 'price/getpricelogicdata', callback});
}

export const getHeaderData = async (tableId:string|number, callback=defaultCallback) => {
  return await getAPICall({route:'price/getheaderdata/' + tableId, callback});
}

export const getTableData = async (tableId:string|number, callback=defaultCallback) => {
  return await getAPICall({route:'price/gettabledata/' + tableId, callback});
}

export const createReservation = async (payload:any, callback=defaultCallback) => {
  return await postAPICall({ route : 'reservations/createreservation', payload, callback});
};

export const createTransaction = async (payload:any, callback=defaultCallback) => {
  return await postAPICall({ route : 'reservation/createtransaction', payload, callback});
};

export const getExtrasDataByDisplayName = async (payload:any,callback=defaultCallback) => {
  return await postAPICall({ route: 'settings/getextrasdatabydisplayname', payload, callback });
}

export const verifyQuantityByDisplayName = async (payload:any,callback=defaultCallback) => {
  return await postAPICall({ route: 'reservation/verifyquantitybydisplayname', payload, callback });
}

export const getDiscountCodes = async (callback=defaultCallback) => {
  return await getAPICall({ route: 'settings/getdiscountcodesdata', callback });
}