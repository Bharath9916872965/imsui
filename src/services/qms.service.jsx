
import axios from 'axios';
import { authHeader } from './auth.header';
import  config  from "../environment/config";

const API_URL=config.API_URL;
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