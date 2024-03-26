import { postAPICall, defaultCallback } from './BaseAPI';

export const getClientSecret = async (payload:any, callback=defaultCallback) => {
  return await postAPICall({ route: 'stripe/getsecret/', payload, callback });
}