import { getAPICall, getAPIProps, postAPICall, postAPIProps, defaultCallback } from './BaseAPI';

export const getStoreDetailDB = async (payload:any, callback=defaultCallback) => {
  return await postAPICall({ route: 'settings/getstoredetailbyurl', payload, callback });
}