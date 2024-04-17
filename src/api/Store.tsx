import { getAPICall, getAPIProps, postAPICall, postAPIProps, defaultCallback } from './BaseAPI';

export const getStoreDetailDB = async (payload:any, callback=defaultCallback) => {
  return await postAPICall({ route: 'settings/getstoredetailbyurl', payload, callback });
}

export const searchAddress = async (str:any, callback=defaultCallback) => {
  const encodedStr = encodeURIComponent(str);
  return await getAPICall({ route: 'address/search/'+encodedStr, callback });
}