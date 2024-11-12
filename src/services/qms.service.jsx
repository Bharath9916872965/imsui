
import axios from 'axios';
import { authHeader } from './auth.header';
import  config  from "../environment/config";

const API_URL=config.API_URL;
console.log('authHeader-------', authHeader())
// const API_URL="http://192.168.1.23:4578/ims_api/";
// const token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc0FkbWluIjp0cnVlLCJzdWIiOiJhZG1pbiIsImlhdCI6MTcyOTgzNjQ1MCwiZXhwIjoxNzMwNTM2NDUwfQ.rILdlPEvI3-e2cDlPEfs7oNz5Pp0lDHulf-oTalqP6U";

export const getQmVersionRecordDtoList = async () => {
    
    try {
        console.log('authHeader-----', authHeader());
        return (await axios.post(`${API_URL}get-qm-version-record-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getQmVersionRecordDtoList', error);
        throw error;
    }
    
}

export const updatechapterPagebreakAndLandscape = async (chapterPagebreakOrLandscape) => {
    try {
        return (await axios.post(`${API_URL}updatechapterPagebreakAndLandscape`, chapterPagebreakOrLandscape, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updatechapterPagebreakAndLandscape', error);
        throw error;
    }
}

export const getQmAllChapters = async () => {
    try {
        return (await axios.post(`${API_URL}get-all-qm-chapters`, {}, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getQmAllChapters', error);
        throw error;
    }
}

export const getSubChaptersById = async (chapterId) => {
    try {
        return (await axios.post(`${API_URL}get-qm-subchapters`, chapterId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getSubChaptersById', error);
        throw error;
    }
}

export const updateChapterNameById = async (chapterName) => {
    try {
        return (await axios.post(`${API_URL}QaQtupdateChapterNameById`, chapterName, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateChapterNameById', error);
        throw error;
    }
}

export const updateChapterContent = async (chaperContent) => {
    try {
        return (await axios.post(`${API_URL}QaQtupdateChapterContentById`, chaperContent, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateChapterContent', error);
        throw error;
    }
}

export const deleteChapterByChapterIdId = async (chapterId) => {
    try {
        return (await axios.post(`${API_URL}deleteChapterById.htm`, chapterId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in deleteChapterById', error);
        throw error;
    }
}

export const addChapterNameById = async (chapterName) => {
    try {
        return (await axios.post(`${API_URL}QaQtAddNewSubChapter`, chapterName, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in addChapterNameById', error);
        throw error;
    }
}
