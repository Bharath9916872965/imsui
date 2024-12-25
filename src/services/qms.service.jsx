

import axios from 'axios';
import { authHeader } from './auth.header';
import  config  from "../environment/config";

const API_URL=config.API_URL;
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
        return (await axios.post(`${API_URL}update-qm-chaptercontent/${chapterId}`, chaperContent, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
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
        return (await axios.post(`${API_URL}get-docsummary-by-revisionRecordId`, documentId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getDocSummarybyId', error);
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

export const addNewAbbreviation = async (qaqtDocAbbreviations) => {
    try {
        return (await axios.post(`${API_URL}addNewDocAbbreviation`, qaqtDocAbbreviations, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in addNewAbbreviation', error);
        throw error;
    }
}

export const getAbbreviationsByIdNotReq = async (abbreviationIdNotReq) => {
    try {
        return (await axios.post(`${API_URL}get-abbreviationlist`, abbreviationIdNotReq, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getAbbreviationsByDocVersionReleaseId', error);
        throw error;
    }
}

export const getQmRevistionRecordById = async (revisionRecordId) => {
    try {
        return (await axios.post(`${API_URL}get-qm-revision-record`, revisionRecordId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getQmRevistionRecordById', error);
        throw error;
    }
}

export const updateNotReqAbbreviationIds = async (abbreviationIds, revisionRecordId) => {
    try {
        return (await axios.post(`${API_URL}update-qm-notreq-abbreviation/${revisionRecordId}`, abbreviationIds, { headers: { 'Content-Type': 'plain/text', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateNotReqAbbreviationIds', error);
        throw error;
    }
}

export const addDocSummary = async (DocSummary) => {
    try {
        return (await axios.post(`${API_URL}add-docsummary`, DocSummary, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in addDocSummary', error);
        throw error;
    }
}


export const getDrdoLogo = async () => {
    try {
        return (await axios.post(`${API_URL}drdo-logo`, null, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getDrdoLogo', error);
        throw error;
    }
}
export const addMappingOfClasses = async (abbrevation, revisionId) => {
    try {
        return (await axios.post(`${API_URL}add-moc/${revisionId}`, abbrevation, { 'Content-Type': 'application/json', headers: { ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in addMappingOfClasses', error);
        throw error;
    }
}

export const getQmMocExcel = async () => {
    try {
        return (await axios.get(`${API_URL}get-qm-moc-excel`, {
            responseType: 'blob', 
            headers: { ...authHeader() }
        })).data;
    } catch (error) {
        console.error('Error occurred in getQmMocExcel', error);
        throw error;
    }
}

export const getMocListById = async (revisionRecordId) => {
    try {
        return (await axios.post(`${API_URL}get-moclist`, revisionRecordId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getMocListById', error);
        throw error;
    }
}

export const getDwpVersionRecordDtoList = async (qmsDocTypeDto) => {
    try {
        return (await axios.post(`${API_URL}get-dwp-version-record-list`, qmsDocTypeDto, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getDwpVersionRecordDtoList() ', error);
        throw error;
    }
}

export const getDwpAllChapters = async (qmsDocTypeDto) => {
    try {
        console.log('qmsDocTypeDto-----', qmsDocTypeDto)
        return (await axios.post(`${API_URL}get-all-dwp-chapters`, qmsDocTypeDto, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getDwpAllChapters', error);
        throw error;
    }
}

export const updateDwpChapterNameById = async (chapterId, chapterName) => {
    try {
        return (await axios.post(`${API_URL}update-dwp-chaptername/${chapterId}`, chapterName, { headers: { 'Content-Type': 'plain/text', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateDwpChapterNameById', error);
        throw error;
    }
}


export const getDwpSubChaptersById = async (chapterId) => {
    try {
        return (await axios.post(`${API_URL}get-dwp-subchapters`, chapterId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getDwpSubChaptersById', error);
        throw error;
    }
}


export const deleteDwpChapterByChapterId = async (chapterId) => {
    try {
        return (await axios.post(`${API_URL}delete-dwp-chapteId`, chapterId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in deleteDwpChapterByChapterId', error);
        throw error;
    }
}

export const addDwpChapterNameById = async (chapterId, chapterName) => {
    try {
        return (await axios.post(`${API_URL}add-dwp-new-subchapter/${chapterId}`, chapterName, { headers: { 'Content-Type': 'plain/text', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in addDwpChapterNameById', error);
        throw error;
    }
}

export const updateDwpPagebreakAndLandscape = async (chapterPagebreakOrLandscape) => {
    try {
        return (await axios.post(`${API_URL}update-dwp-pagebreak-landscape`, chapterPagebreakOrLandscape, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateDwpPagebreakAndLandscape', error);
        throw error;
    }
}

export const getDwpChapterById = async (chapterId) => {
    try {
        return (await axios.post(`${API_URL}get-dwp-chapter`, chapterId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getDwpChapterById', error);
        throw error;
    }
}

export const updateDwpChapterContent = async (chapterId, chaperContent) => {
    try {
        return (await axios.post(`${API_URL}update-dwp-chaptercontent/${chapterId}`, chaperContent, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateDwpChapterContent', error);
        throw error;
    }
}

export const getDwpUnAddedChapters = async (qmsDocTypeDto) => {
    try {
        return (await axios.post(`${API_URL}un-added-dwp-section-list`, qmsDocTypeDto, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getUnAddedChapters', error);
        throw error;
    }
}


export const addNewDwpSection = async (dwpSectionDto) => {
    try {
        return (await axios.post(`${API_URL}add-new-dwp-section`, dwpSectionDto, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in addNewDwpSection', error);
        throw error;
    }
}

export const dwpUnAddListToAddList = async (SelectedSections) => {
    try {
        return (await axios.post(`${API_URL}dwp-unaddlist-to-addlist`, SelectedSections, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in UnAddListToAddList', error);
        throw error;
    }
}

export const getDwpRevistionRecordById = async (revisionRecordId) => {
    try {
        return (await axios.post(`${API_URL}get-dwp-revision-record`, revisionRecordId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getDwpRevistionRecordById', error);
        throw error;
    }
}

export const updateDwpNotReqAbbreviationIds = async (abbreviationIds, revisionRecordId) => {
    try {
        return (await axios.post(`${API_URL}update-dwp-notreq-abbreviation/${revisionRecordId}`, abbreviationIds, { headers: { 'Content-Type': 'plain/text', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateNotReqAbbreviationIds', error);
        throw error;
    }
}

export const addDwpDocSummary = async (DocSummary) => {
    try {
        return (await axios.post(`${API_URL}add-dwp-docsummary`, DocSummary, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in addDocSummary', error);
        throw error;
    }
}


export const getDwpDocSummarybyId = async (documentId) => {
    try {
        return (await axios.post(`${API_URL}get-dwp-docsummary-byid`, documentId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getDocSummarybyId', error);
        throw error;
    
    }
}


export const getDwpDivisionList = async (imsFormRoleId, empId) => {
    
    try {
        return (await axios.post(`${API_URL}get-dwp-division-list/${imsFormRoleId}/${empId}`, [], { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getDwpDivisionList', error);
        throw error; 
    }
    
};


export const getDwpDivisionGroupList = async (imsFormRoleId, empId) => {
    
    try {
        return (await axios.post(`${API_URL}get-dwp-division-grouplist/${imsFormRoleId}/${empId}`, [], { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getDwpDivisionList', error);
        throw error; 
    }
    
};

export const addNewDwpIssue = async (qmsIssueDto) => {
    try {
        return (await axios.post(`${API_URL}add-dwp-new-issue`, qmsIssueDto, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in addNewDwpIssue', error);
        throw error;
    }
}


export const qspDocumentList = async () => {
    try {
        return (await axios.post(`${API_URL}get-qsp-version-record-list`, {},{ headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in qspDocumentList', error);
        throw error;
    }
}

export const updateQspNotReqAbbreviationIds = async (abbreviationIds, revisionRecordId) => {
    try {
        return (await axios.post(`${API_URL}update-qsp-notreq-abbreviation/${revisionRecordId}`, abbreviationIds, { headers: { 'Content-Type': 'plain/text', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateQspNotReqAbbreviationIds', error);
        throw error;
    }
}

export const getQspRevistionRecordById = async (revisionRecordId) => {
    try {
        return (await axios.post(`${API_URL}get-qsp-revision-record`, revisionRecordId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getQspRevistionRecordById', error);
        throw error;
    }
}

export const updateQspPagebreakAndLandscape = async (chapterPagebreakOrLandscape) => {
    try {
        return (await axios.post(`${API_URL}update-qsp-pagebreak-landscape`, chapterPagebreakOrLandscape, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateQspPagebreakAndLandscape', error);
        throw error;
    }
}

export const getQspAllChapters = async (qmsDocTypeDto) => {
    try {
        return (await axios.post(`${API_URL}get-all-qsp-chapters`, qmsDocTypeDto, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getQspAllChapters', error);
        throw error;
    }
}

export const getQspSubChaptersById = async (chapterId) => {
    try {
        return (await axios.post(`${API_URL}get-qsp-subchapters`, chapterId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getQspSubChaptersById', error);
        throw error;
    }
}

export const deleteQspChapterByChapterId = async (chapterId) => {
    try {
        return (await axios.post(`${API_URL}delete-qsp-chapteId`, chapterId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in deleteQspChapterByChapterId', error);
        throw error;
    }
}

export const updateQspChapterNameById = async (chapterId, chapterName) => {
    try {
        return (await axios.post(`${API_URL}update-qsp-chaptername/${chapterId}`, chapterName, { headers: { 'Content-Type': 'plain/text', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateQspChapterNameById', error);
        throw error;
    }
}

export const getQspChapterById = async (chapterId) => {
    try {
        return (await axios.post(`${API_URL}get-qsp-chapter`, chapterId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getQspChapterById', error);
        throw error;
    }
}

export const addQspChapterNameById = async (chapterId, chapterName) => {
    try {
        return (await axios.post(`${API_URL}add-qsp-new-subchapter/${chapterId}`, chapterName, { headers: { 'Content-Type': 'plain/text', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in addQspChapterNameById', error);
        throw error;
    }
}

export const updateQspChapterContent = async (chapterId, chaperContent) => {
    try {
        return (await axios.post(`${API_URL}update-qsp-chaptercontent/${chapterId}`, chaperContent, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateQspChapterContent', error);
        throw error;
    }
}

export const getQspDocSummarybyId = async (documentId) => {
    try {
        return (await axios.post(`${API_URL}get-qsp-docsummary-byid`, documentId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getQspDocSummarybyId', error);
    }
}

export const getSelectedEmpData = async (empId) => {
    try {
        return (await axios.post(`${API_URL}get-employee-byid`, empId, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getSelectedEmpData', error);

        throw error;
    
    }
}


export const addQspDocSummary = async (DocSummary) => {
    try {
        return (await axios.post(`${API_URL}add-qsp-docsummary`, DocSummary, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in addQspDocSummary', error);
    }
}

export const forwardQm = async(values) =>{
    try {
        return (await axios.post(`${API_URL}forward-qm`,values, {headers: {'Content-Type' : 'application/json', ...authHeader() }})).data;
    } catch (error) {
        console.error('Error occured in forwardQm', error);
        throw error;
    }
}



export const amendQm = async(values) =>{
    try {
        return (await axios.post(`${API_URL}add-new-qm-revision`,values, {headers: {'Content-Type' : 'application/json', ...authHeader() }})).data;
    } catch (error) {
        console.error('Error occured in amendQm', error);
        throw error;
    }
}

export const revokeSubmit = async(values) =>{
    try {
        return (await axios.post(`${API_URL}revoke-qm-revision`,values, {headers: {'Content-Type' : 'application/json', ...authHeader() }})).data;
    } catch (error) {
        console.error('Error occured in revokeSubmit', error);
        throw error;
    }
}


export const revisionTran = async (revisionRecordId)=>{
    try {
        return (await axios.post(`${API_URL}revision-tran`,revisionRecordId,{headers : {'Content-Type': 'text/plain', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in revisionTran:', error);
        throw error;
    }
}

export const forwardDwpGwp = async(values) =>{
    try {
        return (await axios.post(`${API_URL}forward-dwp-gwp`,values, {headers: {'Content-Type' : 'application/json', ...authHeader() }})).data;
    } catch (error) {
        console.error('Error occured in forwardDwpGwp', error);
        throw error;
    }
}

export const dwprevokeSubmit = async(values) =>{
    try {
        return (await axios.post(`${API_URL}revoke-dwp-revision`,values, {headers: {'Content-Type' : 'application/json', ...authHeader() }})).data;
    } catch (error) {
        console.error('Error occured in dwprevokeSubmit', error);
        throw error;
    }
}

export const getMRRepList = async() =>{
        try {
            return (await axios.post(`${API_URL}get-mr-rep-list`,{} , {
                headers: authHeader()
            })).data;
        } catch (error) {
            console.error('Error occurred in getMRRepList', error);
            throw error;
        }
}

export const getMRList = async() =>{
    try {
        return (await axios.post(`${API_URL}get-mr-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getMRList', error);
        throw error;
    }
}


export const amendDwpGwp = async(values) =>{
    try {
        return (await axios.post(`${API_URL}add-new-dwp-gwp-revision`,values, {headers: {'Content-Type' : 'application/json', ...authHeader() }})).data;
    } catch (error) {
        console.error('Error occured in amendDwpGwp', error);
        throw error;
    }
}


export const dwprevisionTran = async (revisionRecordId)=>{
    try {
        return (await axios.post(`${API_URL}dwp-revision-tran`,revisionRecordId,{headers : {'Content-Type': 'text/plain', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in dwprevisionTran:', error);
        throw error;
    }
}


export const getDivisionEmployee = async() =>{
    try {
        return (await axios.post(`${API_URL}get-division-employee-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getDivisionEmployee', error);
        throw error;
    }
}

export const UpdateQMDescription = async(values) =>{
    try {
        return (await axios.post(`${API_URL}update-qm-description`,values, {headers: {'Content-Type' : 'application/json', ...authHeader() }})).data;
    } catch (error) {
        console.error('Error occured in UpdateDescription', error);
        throw error;
    }
}

export const UpdateDwpGwpDescription = async(values) =>{
    try {
        return (await axios.post(`${API_URL}update-dwp-gwp-description`,values, {headers: {'Content-Type' : 'application/json', ...authHeader() }})).data;
    } catch (error) {
        console.error('Error occured in UpdateDwpGwpDescription', error);
        throw error;
    }
}
