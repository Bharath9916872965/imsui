import axios from 'axios';
import { authHeader } from './auth.header';
import  config  from "../environment/config";

const API_URL=config.API_URL;

export class KpiObjDto {
    constructor(ratingList,iqaId,revisionRecordId){
        this.ratingList       = ratingList;
        this.iqaId            = iqaId;
        this.revisionRecordId = revisionRecordId;
    }
}

const convertMapToOrderedArray = (map) => {
    return Array.from(map.entries()).map(([key, value]) => ({
        kpiId: key,
      ...value,
    }));
  };

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

export const insertKpiObjective = async (values)=>{
    try {
        const valuesToSend = {
            ...values,
            ratingList: convertMapToOrderedArray(values.ratingList),
        };
        return (await axios.post(`${API_URL}insert-kpi-objective`,valuesToSend,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in insertKpiObjective:', error);
        throw error;
    }
}

export const updateKpiObjective = async (values)=>{
    try {
        const valuesToSend = {
            ...values,
            ratingList: convertMapToOrderedArray(values.ratingList),
        };
        return (await axios.post(`${API_URL}update-kpi-objective`,valuesToSend,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in updateKpiObjective:', error);
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

export const getKpiObjRatingList = async ()=>{
    try {
        return (await axios.post(`${API_URL}get-kpi-obj-rating-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getKpiObjRatingList:', error);
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
