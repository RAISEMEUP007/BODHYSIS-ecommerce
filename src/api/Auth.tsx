import { postAPICall, defaultCallback, getAPICall } from './BaseAPI';

export const logIn = async (payload:any, callback=defaultCallback) => {
  return await postAPICall({ route: 'customer/login', payload, callback });
}

export const adminTry = async (payload:any, callback=defaultCallback) => {
  return await postAPICall({ route: 'customer/admintry', payload, callback });
}

export const register = async (payload:any, callback=defaultCallback) => {
  return await postAPICall({ route: 'customer/signup', payload, callback });
}

export const testTokenVaild = async (callback=defaultCallback) => {
  return await getAPICall({ route: 'testtokenvalid', callback });
}