// src/environment/environment.prod.js
const environment = {
  API_URL: "http://10.128.21.227:8082/ims_api/",
  GRANT_TYPE : 'password',
  CLIENT_ID : 'ims',
  CLIENT_SECRET : 'HqWpEDmsZFTZQKMbQsFKPQxvfPtOjtGZ',
  TOKEN_URL : 'http://10.128.21.228:9090/realms/DRDONEW/protocol/openid-connect/token'
  // Add other development-specific configurations here
  

  };
  
  export default environment;