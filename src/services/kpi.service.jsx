import axios from 'axios';
import { authHeader } from './auth.header';
import  config  from "../environment/config";

const API_URL=config.API_URL;



export const getKpiUnitList = async ()=>{
    try {
        return (await axios.post(`${API_URL}get-kpi-unit-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getKpiUnitList:', error);
        throw error;
    }
}

export const insertKpi = async (values)=>{
    try {
        return (await axios.post(`${API_URL}insert-kpi`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in addKpi:', error);
        throw error;
    }
}

export const updateKpi = async (values)=>{
    try {
        return (await axios.post(`${API_URL}update-kpi`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in updateKpi:', error);
        throw error;
    }
}

export const getKpiMasterList = async ()=>{
    try {
        return (await axios.post(`${API_URL}get-kpi-master-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getKpiMasterList:', error);
        throw error;
    }
}

export const getKpiRatingList = async ()=>{
    try {
        return (await axios.post(`${API_URL}get-kpi-rating-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getKpiRatingList:', error);
        throw error;
    }
}

export const getDwpRevisonList = async ()=>{
    try {
        return (await axios.post(`${API_URL}get-dwp-revision-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getDwpRevisonList:', error);
        throw error;
    }
}
