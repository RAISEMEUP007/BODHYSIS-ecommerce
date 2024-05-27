import { postAPICall, defaultCallback } from './BaseAPI';

export const getClientSecret = async (payload:any, callback=defaultCallback) => {
  return await postAPICall({ route: 'stripe/getsecret/', payload, callback });
}

export const sendReservationConfirmationEmail = async (payload:any, callback=defaultCallback) => {
  return await postAPICall({ route: 'stripe/sendreservationconfirmationemail/', payload, callback });
}

export const addLastPaymentMethosToCustomer = async (payload:any, callback=defaultCallback) => {
  return await postAPICall({ route: 'stripe/addlastpaymentmethostocustomer/', payload, callback });
}