import axios from 'axios';
import { authHeader } from './auth.header';
import config from "../environment/config";
const API_URL = config.API_URL;
const resetPsdLink = config.RESET_PASSWORD_LINK;

export const getHeaderModuleList = async (role) => {
    try {
        return (await axios.post(`${API_URL}header-module`, role, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getHeaderModuleList:', error);
        throw error;
    }
};

export const getHeaderModuleDetailList = async (role) => {
    try {
        return (await axios.post(`${API_URL}header-detail`, role, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getHeaderModuleDetailList:', error);
        throw error;
    }
};

export const changePassword = async () => {
    window.open(resetPsdLink, '_blank'); 
  }
  
