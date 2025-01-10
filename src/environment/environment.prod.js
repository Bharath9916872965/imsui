// src/environment/environment.prod.js
const environment = {
  API_URL: "http://10.128.21.227:8082/ims_api/",
  GRANT_TYPE : 'password',
  CLIENT_ID : 'ims-vts22',
  CLIENT_SECRET : 'HqWpEDmsZFTZQKMbQsFKPQxvfPtOjtGZ',
  TOKEN_URL : 'http://192.168.1.15:9090/realms/DRDONEW/protocol/openid-connect/token',
  RESET_PASSWORD_LINK:"http://192.168.1.15:9090/realms/DRDONEW/login-actions/reset-credentials",
  MOM_URL : 'http://10.128.19.42:8080/pmslrde/CommitteeMinutesViewAllDownloadPdf.htm',
  PFTS_URL : 'http://10.128.19.42:8080/pfts/getActiveProcurementList.htm',
  IBAS_URL : 'http://10.128.19.42:8080/ibas/getSupplyOrderList.htm'
  // Add other development-specific configurations here
  

  };
  
  export default environment;