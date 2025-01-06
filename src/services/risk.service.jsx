import axios from 'axios';
import { authHeader } from './auth.header';
import  config  from "../environment/config";

const API_URL=config.API_URL;

export class RiskRegisterDto{
    
    constructor(revisionRecordId,riskDescription,probability,technicalPerformance,time,cost,average,riskNo){
        this.revisionRecordId=revisionRecordId;
        this.riskDescription=riskDescription;
        this.probability=probability;
        this.technicalPerformance=technicalPerformance;
        this.time=time;
        this.cost=cost;
        this.average=average;
        this.riskNo=riskNo;

    }
};


export const getRiskRegisterList = async (revisionRecordId) => {
    
    try {
        return (await axios.post(`${API_URL}risk-register-list`,revisionRecordId,{headers : {'Content-Type': 'text/plain', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getRiskRegisterList', error);
        throw error; 
    }
    
};


export const insertRiskRegister = async (values)=>{
    try {
        return (await axios.post(`${API_URL}insert-risk-register`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in insertRiskRegister:', error);
        throw error;
    }
};

export const mitigationRiskRegisterList = async (riskRegisterId) => {
    
    try {
        return (await axios.post(`${API_URL}mititgation-risk-register-list`,riskRegisterId,{headers : {'Content-Type': 'text/plain', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in mitigationRiskRegisterList', error);
        throw error; 
    }
    
};

export const insertMitigationRiskRegister = async (values)=>{
    try {
        return (await axios.post(`${API_URL}insert-mititgation-risk-register`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in insertMitigationRiskRegisterList:', error);
        throw error;
    }
};

export const RiskRegisterMitigation = async (groupDivisionId, docType) => {
    
    try {
        return (await axios.post(`${API_URL}risk-RegMitigation-List/${groupDivisionId}/${docType}`, [], { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in risk-RegMitigation-List', error);
        throw error; 
    }
    
};
