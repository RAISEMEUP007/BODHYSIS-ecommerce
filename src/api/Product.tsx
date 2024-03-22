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

export const getHeaderData = (tableId:string|number, callback=defaultCallback) => {
  getAPICall({route:'price/getheaderdata/' + tableId, callback});
}