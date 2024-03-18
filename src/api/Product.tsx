import { getAPICall, getAPIProps, postAPICall, postAPIProps, defaultCallback } from './BaseAPI';

export const getProductCategoriesData = async (callback=defaultCallback) => {
  return await getAPICall({ route: 'product/getproductcategoriesdata', callback });
}