import axios from 'axios';
import { authHeader } from './auth.header';
import  config  from "../environment/config";
import saveAs from 'file-saver'
import environment from 'environment/environment.dev';

const API_URL=config.API_URL;



  
 export class AuditorDto{
    
    constructor(auditorId,isActive){
        this.auditorId=auditorId;
        this.isActive=isActive;
    }
};

export class AuditeeDto{
    
    constructor(empId,groupId,divisionId,projectId,headType,auditeeId){
        this.empId=empId;
        this.groupId=groupId;
        this.divisionId=divisionId;
        this.projectId=projectId;
        this.headType=headType;
        this.auditeeId=auditeeId;
    }

};

export class AuditRescheduleDto{
    constructor(auditScheduleDto,auditScheduleListDto){
        this.auditScheduleDto=auditScheduleDto;
        this.auditScheduleListDto=auditScheduleListDto;
    }
}

export class CheckListMaster{
    constructor(mocId,description,sectionNo,level,clauseNo){
        this.mocId       = mocId;
        this.description = description;
        this.sectionNo   = sectionNo;
        this.level       = level;
        this.clauseNo    = clauseNo;
    }
}

export class IqaAuditeeDto{
    constructor(iqaId,auditeeIds){
        this.iqaId = iqaId;
        this.auditeeIds = auditeeIds;
    }
}

export class AuditCheckList{
    constructor(checkListMap,scheduleId,iqaId,iqaNo){
        this.checkListMap = checkListMap;
        this.scheduleId   = scheduleId;
        this.iqaId        = iqaId;
        this.iqaNo        = iqaNo;
    }
}

export  class CheckListImgDto{
    constructor(mocId,scheduleId,checkListAttachementName,iqaNo,iqaId,mocDescription){
        this.mocId              = mocId;
        this.scheduleId         = scheduleId;
        this.checkListAttachementName = checkListAttachementName;
        this.iqaNo              = iqaNo;
        this.iqaId              = iqaId;
        this.mocDescription     = mocDescription;
    }
}
export class MostFqNCDescDto{
  
    constructor(auditObsId,scheduleId,iqaId){
        this.iqaId=iqaId;
        this.scheduleId=scheduleId;
        this.auditObsId=auditObsId;
    }
};

export class AuditTransDto{
    constructor(id,auditType){
        this.id = id;
        this.auditType = auditType;
    }
}

export class AuditClosureDTO{
    constructor(closureId,iqaId,content,completionDate,attchmentName,iqaNo,oldAttchmentName){
        this.closureId        = closureId;
        this.iqaId            = iqaId;
        this.content          = content;
        this.completionDate   = completionDate;
        this.attchmentName    = attchmentName;
        this.iqaNo            = iqaNo;
        this.oldAttchmentName = oldAttchmentName;
    }
}
export class AuditClosuredto{
    constructor(iqaId,iqaNo){
        this.iqaId   = iqaId;
        this.iqaNo=iqaNo;
     
    }
}

export class CarDto{
    constructor(correctiveActionId,action,employee,targetDate){
        this.correctiveActionId = correctiveActionId;
        this.action = action;
        this.employee = employee;
        this.targetDate = targetDate;
    }
}


export const givePreview = (EXT, data, name) => {
    let blob;
  
    if (EXT.toLowerCase() === 'pdf') {
    blob = new Blob([data], { type: 'application/pdf' });
    const blobUrl = window.URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');

    } else if (['jpg', 'jpeg', 'png'].includes(EXT.toLowerCase())) {
      blob = new Blob([data], { type: 'image/jpeg' });
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } else {
      const MIME_TYPES = {
        txt: 'text/plain',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };
  
      const mimeType = MIME_TYPES[EXT.toLowerCase()] || 'application/octet-stream';
      saveAs(new Blob([data], { type: mimeType }), name);
    }
};

export const getAuditorDtoList = async () => {
    
    try {
        return (await axios.post(`${API_URL}auditor-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getAuditorDtoList', error);
        throw error; 
    }
    
};

export const getEmployee = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-employee-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getEmployee', error);
        throw error; 
    }
    
};

export const insertAditor = async (empIds) => {
    
    try {
        return (await axios.post(`${API_URL}insert-auditor-employees`,  empIds , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in insertAditor', error);
        throw error; 
    }
};

export const deleteAditor = async (AuditorId,isActive) => {
    try {
      const response = await axios.post(
          `${API_URL}auditor-inactive`,
          new AuditorDto(AuditorId,isActive),
         {headers: authHeader() }
      );
      return response.data;
  
    } catch (error) {
      console.error('Error occurred in deleteAditor:', error);
      throw error;
    }
  };

  export const getIqaDtoList = async () => {
    
    try {
        return (await axios.post(`${API_URL}iqa-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getIqaDtoList', error);
        throw error; 
    }
    
};


export const insertIqa = async (values) => {
    
    try {
        return (await axios.post(`${API_URL}insert-iqa`, values, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in insertIqa', error);
        throw error; 
    }
};

  export const getAuditeeDtoList = async () => {
    
    try {
        return (await axios.post(`${API_URL}auditee-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getAuditeeDtoList', error);
        throw error; 
    }
};

export const getIqaAuditeelist = async () => {
    
    try {
        return (await axios.post(`${API_URL}iqa-auditee-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getIqaAuditeelist', error);
        throw error; 
    }
};



export const getDivisionList = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-division-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getDivisionList', error);
        throw error; 
    }
    
};

export const getDivisionGroupList = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-division-group-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getDivisionGroupList', error);
        throw error; 
    }
    
};

export const getProjectList = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-project-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getProjectList', error);
        throw error; 
    }
    
};

export const insertAuditee = async (values) => {
    try {
      const response = await axios.post(
          `${API_URL}auditee-insert`,
            values,
         {headers: authHeader() }
      );
      return response.data;
  
    } catch (error) {
      console.error('Error occurred in insertAuditee:', error);
      throw error;
    }
  };

  export const getScheduleList = async ()=>{
    try {
        return (await axios.post(`${API_URL}schedule-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getScheduleList:', error);
        throw error;
    }
}

export const getTeamList = async ()=>{
    try {
        return (await axios.post(`${API_URL}get-team-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getTeamList:', error);
        throw error;
    }
}

export const addSchedule = async (values)=>{
    try {
        return (await axios.post(`${API_URL}insert-audit-schedule`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in addSchedule:', error);
        throw error;
    }
}

export const editScheduleSubmit = async (values)=>{
    try {
        return (await axios.post(`${API_URL}edit-audit-schedule`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in editScheduleSubmit:', error);
        throw error;
    }
}

export const reScheduleSubmit = async (values)=>{
    try {
        return (await axios.post(`${API_URL}insert-audit-reschedule`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in reScheduleSubmit:', error);
        throw error;
    }
}



  export const deleteAuditee = async (auditeeId) => {
    try {
      const response = await axios.post(
        `${API_URL}auditee-inactive`,
        auditeeId,
       {headers: { 'Content-Type': 'text/plain', ...authHeader() } }
    );
    return response.data;
  
    } catch (error) {
      console.error('Error occurred in deleteAditor:', error);
      throw error;
    }
  };

  export const forwardSchedule = async (values)=>{
    try {
        return (await axios.post(`${API_URL}forward-schedule`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in forwardSchedule:', error);
        throw error;
    }
  }

export const scheduleMailSend = async (values)=>{
    try {
        return (await axios.post(`${API_URL}schedule-mail-send`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in scheduleMailSend:', error);
        throw error;
    }
}

export const getTotalTeamMembersList = async ()=>{
    try {
        return (await axios.post(`${API_URL}get-total-team-members-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getTotalTeamMembersList:', error);
        throw error;
    }
}

export const rescheduleMailSend = async (values)=>{
    try {
        return (await axios.post(`${API_URL}reschedule-mail-send`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in rescheduleMailSend:', error);
        throw error;
    }
}
  export const getAuditeeTeamDtoList = async () => {
    
    try {
        return (await axios.post(`${API_URL}audit-team-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getAuditeeTeamDtoList', error);
        throw error; 
    }
    
};

export const insertAuditTeam = async (values) => {
    try {
      const response = await axios.post(
          `${API_URL}audit-team-insert`,
            values,
         {headers: authHeader() }
      );
      return response.data;
  
    } catch (error) {
      console.error('Error occurred in insertAuditTeam:', error);
      throw error;
    }
  };

  export const getAuditorIsActiveList = async () => {
    
    try {
        return (await axios.post(`${API_URL}auditor-isactive-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getAuditorIsActiveList', error);
        throw error; 
    }
    
};

export const getTeamMemberIsActiveList = async () => {
    
    try {
        return (await axios.post(`${API_URL}team-member-isactive-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getTeamMemberIsActiveList', error);
        throw error; 
    }
    
};

export const getAuditTeamMemberList = async () => {
    
    try {
        return (await axios.post(`${API_URL}audit-team-member-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getAuditTeamMemberList', error);
        throw error; 
    }
    
};

export const getScheduleApprovalList = async ()=>{
    try {
        return (await axios.post(`${API_URL}schedule-approval-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getScheduleApprovalList:', error);
        throw error;
    }
}


export const approveSchedule = async (values)=>{
    try {
        return (await axios.post(`${API_URL}approve-schedule`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in approveSchedule:', error);
        throw error;
    }
}

export const returnSchedule = async (values)=>{
    try {
        return (await axios.post(`${API_URL}return-schedule`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in returnSchedule:', error);
        throw error;
    }
}

export const getScheduleRemarks = async ()=>{
    try {
        return (await axios.post(`${API_URL}schedule-remarks`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getScheduleRemarks:', error);
        throw error;
    }
}

export const scheduleTran = async (values)=>{
    try {
        return (await axios.post(`${API_URL}schedule-tran`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in scheduleTran:', error);
        throw error;
    }
}

export const getMocTotalList = async ()=>{
    try {
        return (await axios.post(`${API_URL}get-moc-total-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getMocTotalList:', error);
        throw error;
    }
}

export const updateChapterDescById = async (values)=>{
    try {
        return (await axios.post(`${API_URL}update-chapter-desc`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in updateChapterDescById:', error);
        throw error;
    }
}

export const deleteChapterDescById = async (mocId)=>{
    try {
        return (await axios.post(`${API_URL}delete-chapter-desc`,mocId,{headers : {'Content-Type': 'text/plain', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in deleteChapterDescById:', error);
        throw error;
    }
}

export const deleteSubChapterDescById = async (mocId)=>{
    try {
        return (await axios.post(`${API_URL}delete-sub-chapter-desc`,mocId,{headers : {'Content-Type': 'text/plain', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in deleteSubChapterDescById:', error);
        throw error;
    }
}

// export const getSubMocs = async (values)=>{
//     try {
//         return (await axios.post(`${API_URL}get-sub-mocs`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
//     } catch (error) {
//         console.error('Error occurred in getSubMocs:', error);
//         throw error;
//     }
// }

export const addNewChapter = async (values)=>{
    try {
        return (await axios.post(`${API_URL}add-new-chapter`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in addNewChapter:', error);
        throw error;
    }
}

export const addChapterToMasters = async (values)=>{
    try {
        return (await axios.post(`${API_URL}add-chapter-to-master`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in addChapterToMasters:', error);
        throw error;
    }
}

export const updateCheckListChapters = async (values)=>{
    try {
        return (await axios.post(`${API_URL}update-check-list-chapters`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in updateCheckListChapters:', error);
        throw error;
    }
}

export const getIqaAuditeeList = async (iqaId) => {
    try {
      return (await axios.post(`${API_URL}get-iqa-auditee-list`,iqaId,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
      console.error('Error occurred in getIqaAuditeeList:', error);
      throw error;
    }
};

  export const insertIqaAuditee = async (iqaId,auditeeIds) => {
    try {
      const response = await axios.post(
          `${API_URL}insert-iqa-auditee`,
          new IqaAuditeeDto(iqaId,auditeeIds),
         {headers: authHeader() }
      );
      return response.data;
  
    } catch (error) {
      console.error('Error occurred in insertIqaAuditee:', error);
      throw error;
    }
  };

  export const getObservation = async (iqaId) => {
    try {
      return (await axios.post(`${API_URL}get-observation`,iqaId,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
      console.error('Error occurred in getObservation:', error);
      throw error;
    }
  };

  const convertMapToOrderedArray = (map) => {
    return Array.from(map.entries()).map(([key, value]) => ({
      mocId: key,
      ...value,
    }));
  };

  export const addAuditCheckList = async (values)=>{
    try {
        const valuesToSend = {
            ...values,
            checkListMap: convertMapToOrderedArray(values.checkListMap),
        };
        return (await axios.post(`${API_URL}add-audit-check-list`,valuesToSend,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in addAuditCheckList:', error);
        throw error;
    }
  }

  export const addAuditeeRemarks = async (values,files)=>{
    try {
        const valuesToSend = {
            ...values,
            checkListMap: convertMapToOrderedArray(values.checkListMap),
        };
        const formData = new FormData();
        if(files.length > 0){
            files.forEach((file) => {
                if (file) {
                  formData.append('files', file, file.name);
                } else {
                  formData.append('files', new Blob());
                }
              });
        }else{
            formData.append('files', new Blob());
        }
        formData.append('auditCheckListDTO', JSON.stringify(valuesToSend));
          
        return (await axios.post(`${API_URL}add-auditee-remarks`,formData,{headers : {'Content-Type': 'multipart/form-data', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in addAuditeeRemarks:', error);
        throw error;
    }
  }

  export const updateAuditeeRemarks = async (values,files)=>{
    try {
        const valuesToSend = {
            ...values,
            checkListMap: convertMapToOrderedArray(values.checkListMap),
        };
        const formData = new FormData();
        if(files.length > 0){
            files.forEach((file) => {
                if (file) {
                  formData.append('files', file, file.name);
                } else {
                  formData.append('files', new Blob());
                }
              });
        }else{
            formData.append('files', new Blob());
        }
        formData.append('auditCheckListDTO', JSON.stringify(valuesToSend));
        return (await axios.post(`${API_URL}update-auditee-remarks`,formData,{headers : {'Content-Type': 'multipart/form-data', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in updateAuditeeRemarks:', error);
        throw error;
    }
  }

  export const getAuditCheckList = async (scheduleId) => {
    try {
      return (await axios.post(`${API_URL}get-audit-check-list`,scheduleId,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
      console.error('Error occurred in getAuditCheckList:', error);
      throw error;
    }
  };

  export const updateAuditCheckList = async (values)=>{
    try {
        const valuesToSend = {
            ...values,
            checkListMap: convertMapToOrderedArray(values.checkListMap),
        };
        return (await axios.post(`${API_URL}update-audit-check-list`,valuesToSend,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in updateAuditCheckList:', error);
        throw error;
    }
  }

  export const uploadCheckListImage = async (attachment,file)=>{
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('ad', JSON.stringify(attachment));
        return (await axios.post(`${API_URL}upload-check-list-img`,formData,{headers : { 'Content-Type': 'multipart/form-data', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in uploadCheckListImage:', error);
        throw error;
    }
}

export const getCheckListimg = async (values)=>{
    try {
        return (await axios.post(`${API_URL}get-check-list-img`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getCheckListimg:', error);
        throw error;
    }
}

export const checkAuditorPresent = async (auditorId) => {
    try {
      return (await axios.post(`${API_URL}check-auditor-present`,auditorId,{headers : {'Content-Type': 'text/plain', ...authHeader()}})).data;
    } catch (error) {
      console.error('Error occurred in checkAuditorPresent:', error);
      throw error;
    }
};

export const deleteAuditor = async (auditorId) => {
    try {
      return (await axios.post(`${API_URL}delete-auditor`,auditorId,{headers : {'Content-Type': 'text/plain', ...authHeader()}})).data;
    } catch (error) {
      console.error('Error occurred in deleteAuditor:', error);
      throw error;
    }
};

export const auditorForward = async (values)=>{
    try {
        return (await axios.post(`${API_URL}auditor-forward`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in auditorForward:', error);
        throw error;
    }
}


  export const getAuditCheckListbyObs = async ()=>{
    try {
        return (await axios.post(`${API_URL}auditcheck-list-byObsIds`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in auditcheck-list-byObsIds:', error);
        throw error;
    }
}
export const getCarList = async (scheduleId) => {
    try {
      return (await axios.post(`${API_URL}get-car-list`,scheduleId,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
      console.error('Error occurred in getCarList:', error);
      throw error;
    }
};

const convertMapToArray = (map) => {
    return Array.from(map.entries()).map(([key, value]) => ({
        correctiveActionId: key,
      ...value,
    }));
  };

export const insertCorrectiveAction = async (values)=>{
    try {
        const valuesToSend = convertMapToArray(values);
        return (await axios.post(`${API_URL}add-corrective-action`,valuesToSend,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in insertCorrectiveAction:', error);
        throw error;
    }
  }

  export const editCorrectiveAction = async (values)=>{
    try {
        return (await axios.post(`${API_URL}edit-corrective-action`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in editCorrectiveAction:', error);
        throw error;
    }
  }
  export const getMostFrequentNC = async ()=>{
    try {
        return (await axios.post(`${API_URL}mostFrequent-Nc-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in mostFrequent-Nc-list:', error);
    }
}


export const getMostFreqNcDetails = async (mocId) => {
try {
        return (await axios.post(`${API_URL}mostFreq-NcDetails-list/${mocId}`,  {},{ headers: { 'Content-Type': 'application/json', ...authHeader()}})).data;
   
    } catch (error) {
        console.error('Error occurred in mostFreq-NcDetails-list', error);
        throw error; 
    }
    
};

  export const updateCorrectiveAction = async (values)=>{
    try {
        return (await axios.post(`${API_URL}update-corrective-action`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in updateCorrectiveAction:', error);
        throw error;
    }
  }

  export const uploadCarAttachment = async (attachment,file)=>{
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('ad', JSON.stringify(attachment));
        return (await axios.post(`${API_URL}upload-car-attachment`,formData,{headers : { 'Content-Type': 'multipart/form-data', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in uploadCarAttachment:', error);
        throw error;
    }
}


export const getCommitteeScheduleList = async (committeeType)=>{
    try {
        const data = { committeeType };
        return (await axios.post(`${API_URL}get-committee-schedule-list`,
            data,
            {headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getCommitteeScheduleList:', error);
        throw error;
    }
}

export const getAssignedData = async (committeeType)=>{
    try {
        const data = { committeeType };
        return (await axios.post(`${API_URL}get-schedule-action-assign-list`,data,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getAssignedData:', error);
        throw error;
    }
}

  export const getMostFqNCDesc = async (auditObsId, scheduleId, iqaId) => {
    
    try {
        return (await axios.post(`${API_URL}mostFqNc-Description-list/${auditObsId}/${scheduleId}/${iqaId}`, [], { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in mostFqNc-Description-list', error);
        throw error; 
    }
    
};


  export const downloadCarFile = async (attachment,reqNo)=>{
    try {
        const params = {fileName: attachment,reqNo: reqNo};
        const response = await axios.get(`${API_URL}car-download`, {
            params: params,headers: {'Content-Type': 'application/json', ...authHeader(),},responseType: 'arraybuffer',});
        return response.data;
    } catch (error) {
        console.error('Error occurred in downloadCarFile:', error);
        throw error;
    }
  }

  export const forwardCar = async (values)=>{
    try {
        return (await axios.post(`${API_URL}forward-car`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in forwardCar:', error);
        throw error;
    }
  }


  export const OpenMoMDocument = async (scheduleId,labcode) =>{
    try {
        const response = await axios({
          method: 'get',
          url: `${environment.MOM_URL   }`,  // Backend endpoint
          params: {
            committeescheduleid: scheduleId,  // Pass scheduleId to backend
            labcode: labcode,  // Pass labCode if necessary
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,  
          },
          responseType: 'blob',  // To handle the PDF as binary data (blob)
        });
    
        // Create a Blob URL from the binary data
        const pdfURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    
        // Open the PDF in a new tab
        window.open(pdfURL, '_blank');  // Open PDF in a new tab
      } catch (error) {
        console.error('Error while fetching the PDF:', error);
      }
  }
  
  export const carApproveEmpData = async (carId)=>{
    try {
        return (await axios.post(`${API_URL}car-approve-emp-data`,carId,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in carApproveEmpData:', error);
        throw error;
    }
  }

  export const returnCarReport = async (values)=>{
    try {
        return (await axios.post(`${API_URL}return-car-report`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in returnCarReport:', error);
        throw error;
    }
 }


 export const downloadCheckListFile = async (attachment,iqaNo,scheduleId)=>{
    try {
        const params = {fileName: attachment,iqaNo: iqaNo,scheduleId:scheduleId};
        const response = await axios.get(`${API_URL}check-list-file-download`, {
            params: params,headers: {'Content-Type': 'application/json', ...authHeader(),},responseType: 'arraybuffer',});
        return response.data;
    } catch (error) {
        console.error('Error occurred in downloadCheckListFile:', error);
        throw error;
    }
  }

  export const getIqaScheduleList = async ()=>{
    try {
        return (await axios.post(`${API_URL}get-iqa-schedule-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getIqaScheduleList:', error);
        throw error;
    }
  }

  export const addAuditClosure = async (values) => {
    try {
        return (await axios.post(`${API_URL}add-audit-closure`, values, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in addAuditClosure', error);
        throw error;
    }
  }

  export const getAuditClosureList = async (values)=>{
    try {
        return (await axios.post(`${API_URL}get-audit-closure-list`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getAuditClosureList:', error);
        throw error;
    }
  }

  export const updateAuditClosure = async (values) => {
    try {
        return (await axios.post(`${API_URL}update-audit-closure`, values, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in updateAuditClosure', error);
        throw error;
    }
  }

  export const uploadAuditClosureFile = async (attachment,file)=>{
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('ad', JSON.stringify(attachment));
        return (await axios.post(`${API_URL}upload-audit-closure-file`,formData,{headers : { 'Content-Type': 'multipart/form-data', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in uploadAuditClosureFile:', error);
        throw error;
    }
 }

    export const downloadAuditClosureFile = async (attachment,iqaNo)=>{
        try {
            const params = {fileName: attachment,iqaNo: iqaNo};
            const response = await axios.get(`${API_URL}audit-closure-file-download`, {
                params: params,headers: {'Content-Type': 'application/json', ...authHeader(),},responseType: 'arraybuffer',});
            return response.data;
        } catch (error) {
            console.error('Error occurred in downloadAuditClosureFile:', error);
            throw error;    
        }
    }

    export const getClosureDate = async (values) => {
        try {
            return (await axios.post(`${API_URL}gat-closure-date`, values, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
        } catch (error) {
            console.error('Error occurred in getClosureDate', error);
            throw error;
        }
      }

  export const getActiveProcurementList = async ()=>{
    try {
        return (await axios.post(`${API_URL}get-active-procurement-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getActiveProcurementList:', error);
        throw error;
    }
    };


    export const getSupplyOrderList = async (labCode)=>{
        try {
            const data = { labCode };
             const response= (await axios.post(`${API_URL}get-supply-order-list`,
                data,
                {headers : {'Content-Type': 'application/json', ...authHeader()}}));
                return response.data;
        } catch (error) {
            console.error('Error occurred in getSupplyOrderList:', error);
            throw error;
        }
    }


    export const getItemReceivedList = async ()=>{
        try {
            return (await axios.post(`${API_URL}get-item-received-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
        } catch (error) {
            console.error('Error occurred in getIqaScheduleList:', error);
            throw error;
        }
      }
    export const getAttachPdfList = async (iqaId,iqaNo)=>{
      try {
           const data = new AuditClosuredto(iqaId,iqaNo);
            return (await axios.post(`${API_URL}get-attach-pdf-list`,data,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
        } catch (error) {
            console.error('Error occurred in getAttachPdfList:', error);
            throw error;
        }
    }

    export const getCheckListAddCount = async (scheduleId) => {
        try {
            return (await axios.get(`${API_URL}get-checklist-add-count/${scheduleId}`, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
        } catch (error) {
            throw error;
        }
    }

    export const auditeeSubmit = async (scheduleId)=>{
    try {
        return (await axios.post(`${API_URL}auditee-submit`,scheduleId,{headers : {'Content-Type': 'text/plain', ...authHeader()}})).data;
    } catch (error) {
        throw error;
    }
}