
import axios from 'axios';
import { authHeader } from './auth.header';
import  config  from "../environment/config";

const API_URL=config.API_URL;
console.log('authHeader-------', authHeader())
// const API_URL="http://192.168.1.23:4578/ims_api/";
// const token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc0FkbWluIjp0cnVlLCJzdWIiOiJhZG1pbiIsImlhdCI6MTcyOTgzNjQ1MCwiZXhwIjoxNzMwNTM2NDUwfQ.rILdlPEvI3-e2cDlPEfs7oNz5Pp0lDHulf-oTalqP6U";

export const getQmVersionRecordDtoList = async () => {
    
    try {
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
        return (await axios.post(`${API_URL}updatechapter-pagebreak-landscape`, chapterPagebreakOrLandscape, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
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

export const updateChapterNameById = async (chapterId, chapterName) => {
    try {
        return (await axios.post(`${API_URL}update-qm-chaptername/${chapterId}`, chapterName, { headers: { 'Content-Type': 'plain/text', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateChapterNameById', error);
        throw error;
    }
}

export const updateChapterContent = async (chapterId, chaperContent) => {
    try {
        return (await axios.post(`${API_URL}update-qm-chaptercontent/${chapterId}`, chaperContent, { headers: { 'Content-Type': 'plain/text', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateChapterContent', error);
        throw error;
    }
}

export const deleteChapterByChapterIdId = async (chapterId) => {
    try {
        return (await axios.post(`${API_URL}delete-qm-chapteId`, chapterId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in deleteChapterById', error);
        throw error;
    }
}

export const addChapterNameById = async (chapterId, chapterName) => {
    try {
        return (await axios.post(`${API_URL}add-qm-new-subchapter/${chapterId}`, chapterName, { headers: { 'Content-Type': 'plain/text', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in addChapterNameById', error);
        throw error;
    }
}

export const getChapterById = async (chapterId) => {
    try {
        return (await axios.post(`${API_URL}get-qm-chapter`, chapterId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in addChapterNameById', error);
        throw error;
    }
}

export const getUnAddedChapters = async () => {
    try {
        return (await axios.post(`${API_URL}un-added-qm-section-list`, [], { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getUnAddedChapters', error);
        throw error;
    }
}

export const UnAddListToAddList = async (SelectedSections) => {
    try {
        return (await axios.post(`${API_URL}qm-unaddlist-to-addlist`, SelectedSections, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in UnAddListToAddList', error);
        throw error;
    }
}

export const AddNewSection = async (sectionName) => {
    try {
        return (await axios.post(`${API_URL}add-new-qm-section`, sectionName, { headers: { 'Content-Type': 'plain/text', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getUnAddedChapters', error);
        throw error;
    }
}

export const getLabDetails = async () => {
    try {
        return (await axios.get(`${API_URL}lab-details`, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getLabDetails', error);
        throw error;
    }
}

export const getLogoImage = async () => {
    try {
        return (await axios.get(`${API_URL}lab-logo`, null, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getLogoImage', error);
        throw error;
    }
}

export const getDocSummarybyId = async (documentId) => {
    try {
        return (await axios.post(`${API_URL}get-docsummary`, documentId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getDocSummarybyId', error);
        throw error;
    
    }
}
export const getQmAbbreviationsById = async (documentId) => {
    try {
        // return (await axios.post(`${API_URL}getQAQTDocSummarybyId.htm`, documentId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getQmAbbreviationsById', error);
        throw error;
    }
}

export const getDocTemplateAttributes = async () => {
    try {
        return (await axios.post(`${API_URL}get-DocTemplateAttributes`, null, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getDocTemplateAttributes', error);
        throw error;
    }
}
