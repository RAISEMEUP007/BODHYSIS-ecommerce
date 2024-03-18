import { basePostAPICall, getAPICall, defaultCallback } from './BaseAPI';

export const getTestToken = async (callback=defaultCallback) => {
  return await getAPICall({ route: 'auth/ttt', callback });
}