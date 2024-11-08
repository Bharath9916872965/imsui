import axios from 'axios';
import config from '../environment/config';
import { authHeader } from './auth.header';

const API_URL = config.API_URL;
const GRANT_TYPE = config.GRANT_TYPE;
const CLIENT_ID  = config.CLIENT_ID;
const CLIENT_SECRET = config.CLIENT_SECRET;
const TOKEN_URL = config.TOKEN_URL;


export const login = async (username, password) => {
    try {
  
      const params = new URLSearchParams();
      params.append('grant_type', GRANT_TYPE);
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET); 
      params.append('username', username);
      params.append('password', password);
      for (const [key, value] of params.entries()) {
        console.log(`${key}: ${value}`);
    }
  
      const headers = {'Content-Type': 'application/x-www-form-urlencoded',};
      const response = await axios.post(TOKEN_URL, params, { headers });
  
      if (response.data.access_token) {
        localStorage.setItem('user', JSON.stringify({
          token: response.data.access_token,
          username: username
        }));
  
        // await customAuditStampingLogin(username);
        // const emp = await getEmpDetails(username);
        // localStorage.setItem('roleId',emp.qmsFormRoleId)
        console.log('response.data------', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Error occurred in login:', error);
      throw error;
    }
  };

  export const  getEmpDetails= async(username) => {
    if (!username) {
      throw new Error('No user found');
    } try {
      return (await axios.post(`${API_URL}get-emp-details`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
      console.error('Error occurred in getEmpDetails():', error);
      throw error;
    }
  };