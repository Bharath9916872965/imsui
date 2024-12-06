
import axios from 'axios';
import { authHeader } from './auth.header';
import  config  from "../environment/config";

const API_URL=config.API_URL;

export const getQmDashboardDetailedList = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-qm-dashboard-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getQmDashboardDetailsDtoList', error);
        throw error;
    }
    
}



export const getActiveAuditorsCount = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-no-of-active-auditors`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getActiveAuditorsCount', error);
        throw error;
    }
    
}



export const getActiveAuditeeCount = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-no-of-active-auditee`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getActiveAuditeeCount', error);
        throw error;
    }
    
}


export const getActiveTeams = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-no-of-active-teams`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getActiveTeams', error);
        throw error;
    }
    
}

export const getActiveSchedules = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-no-of-active-schedules`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getActiveSchedules', error);
        throw error;
    }
    
}