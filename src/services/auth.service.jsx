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
  
        await customAuditStampingLogin(username);
        console.log('response.data------', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Error occurred in login:', error);
      throw error;
    }
  };

// Function for custom audit stamping login
export const customAuditStampingLogin = async (username) => {
  if (!username) {
    throw new Error('No user found');
  }

  try {
    const response = await axios.post(
      `${API_URL}custom-audit-stamping-login`,
      username,  
      { headers: { 'Content-Type': 'application/json', ...authHeader() } }
    );
    return response.data;
  } catch (error) {
    console.error('Error occurred in customAuditStampingLogin:', error);
    throw error;
  }
};



  export const logout = async (logoutType) => {
    const user = getCurrentUser();
    if (user && user.username) {
      try {
  
         customAuditStampingLogout(user.username, logoutType);
        localStorage.removeItem('user');
        localStorage.removeItem('roleId');
        localStorage.removeItem('password');
  
  
      } catch (error) {
        console.error('Error occurred in logout:', error);
        throw error; 
      }
    } else {
      // No user found in localStorage, just remove the item
      localStorage.removeItem('user');
      localStorage.removeItem('roleId');
      localStorage.removeItem('password');
    }
  };



// Function for custom audit stamping logout
export const customAuditStampingLogout = async (username, logoutType) => {
  if (!username) {
    throw new Error('No user found');
  }

  try {
    const response = await axios.post(
      `${API_URL}custom-audit-stamping-logout`,
      { username, logoutType },  
      { headers: { 'Content-Type': 'application/json', ...authHeader() } }
    );
    return response.data;
  } catch (error) {
    console.error('Error occurred in customAuditStampingLogout:', error);
    throw error;
  }
};


  export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
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