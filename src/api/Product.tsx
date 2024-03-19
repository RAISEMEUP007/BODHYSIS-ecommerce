import { getAPICall, getAPIProps, postAPICall, postAPIProps, defaultCallback } from './BaseAPI';

export const getProductCategoriesData = async (callback=defaultCallback) => {
  return await getAPICall({ route: 'product/getproductcategoriesdata', callback });
}

export const getProductLinesData = async (categoryId:string|number, callback=defaultCallback) => {
  return await getAPICall({ route: 'product/getproductlinesdata2/' + categoryId, callback });
}

export const getExtrasData = async (callback=defaultCallback) => {
  return await getAPICall({ route: 'settings/getextrasdata', callback });
}