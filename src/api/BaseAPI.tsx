import { API_URL } from '../common/AppConstants';

export interface baseGetAPIProps {
  route: string;
  headers: HeadersInit | undefined;
  callback: (data?: object | null, status?: number | null, error?: any) => void;
}

export interface basePostAPIProps {
  route: string;
  headers: HeadersInit;
  body: BodyInit | null | undefined;
  callback: (data?: object | null, status?: number | null, error?: any) => void;
}

export interface getAPIProps {
  route: string;
  callback: (data?: object | null, status?: number | null, error?: any) => void;
}

export interface postAPIProps {
  route: string;
  payload: object;
  callback: (data?: object | null, status?: number | null, error?: any) => void;
}

export const defaultCallback = (data?: object | null, status?: number | null, error?: any) =>{
  
}

export const baseGetAPICall = async ({ route, headers, callback }: baseGetAPIProps) => {
  const token = localStorage.getItem('access-token');
  headers = {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await fetch(`${API_URL}/${route}`, {
      method: 'GET',
      headers: headers,
    });

    if (response.status === 401) {
      localStorage.removeItem('access-token');
      return;
    }
    
    if(response.ok){
      const jsonRes = await response.clone().json();
      
      if (jsonRes) {
        callback(jsonRes, response.status, null);
      }
    }else{
      const jsonRes = await response.clone().json();
      if(jsonRes){
        callback(jsonRes, response.status, response.statusText);
      }else callback(null, response.status, response.statusText);
    }
    
    return response;
  } catch (error) {
    console.log(error);
    callback(null, 500, error);
    return error;
  }
};

export const getAPICall = async ({ route, callback }: getAPIProps) => {
  return await baseGetAPICall({ route, headers: { 'Content-Type': 'application/json' }, callback });
};

export const basePostAPICall = async ({route, headers, body, callback}:basePostAPIProps) => {
  try {
    const token = localStorage.getItem('access-token');
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
    const response = await fetch(`${API_URL}/${route}`, {
      method: 'POST',
      headers: headers,
      body: body,
    });
    
    if (response.status === 401) {
      localStorage.removeItem('access-token');
      return;
    }
    
    if(response.ok){
      const jsonRes = await response.clone().json();
      
      if (jsonRes) {
        callback(jsonRes, response.status, null);
      }
    }else{
      const jsonRes = await response.clone().json();
      if(jsonRes){
        callback(jsonRes, response.status, response.statusText);
      }else callback(null, response.status, response.statusText);
    }
    
    return response;
  } catch (error) {
    callback(null, 500, error);
    return error;
  }
};

export const postAPICall = async ({route, payload, callback}:postAPIProps) => {
  return await basePostAPICall({ route, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), callback });
};
