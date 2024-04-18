import { postAPICall, defaultCallback } from './BaseAPI';

export const logIn = async (payload:any, callback=defaultCallback) => {
  return await postAPICall({ route: 'customer/login', payload, callback });
}