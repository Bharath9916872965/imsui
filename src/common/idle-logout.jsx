import React, { useEffect, useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { login } from 'services/auth.service';
import AlertConfirmation from './AlertConfirmation.component';
import config from 'environment/config'; 
import axios from 'axios';

const CLIENT_ID  = config.CLIENT_ID;
const CLIENT_SECRET = config.CLIENT_SECRET;
const TOKEN_URL = config.TOKEN_URL;
const REFRESH_GRANT_TYPE = config.REFRESH_GRANT_TYPE;


const UseIdleTimer = (open) => {
  const navigate = useNavigate();

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [message,setMessage] = useState('');
  const warningTimeoutRef = useRef(null);
  const logoutTimeoutRef = useRef(null);

  useEffect(() => {
      checkToken();
      return () => {
        clearTimeout(warningTimeoutRef.current);
        clearTimeout(logoutTimeoutRef.current);
      };
  }, [navigate]);

  useEffect(() => {
    const confirmDialog  = async () => {
      const isConfirmed = await AlertConfirmation({
        title: message,
        message: '',
      });

      if (isConfirmed) {
        handleDialogConfirm();
      } else {
        setOpenConfirmationDialog(false);
      }
    }

    if (openConfirmationDialog) {
      confirmDialog();
    }

  }, [openConfirmationDialog])

  const checkToken = ()=>{
    if(open){
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.token) {
        try {
          const decodedToken = jwtDecode(user.token);
          const currentTime = Date.now();
          const tokenExpireTime = decodedToken.exp * 1000;
  
          const remainingTime = tokenExpireTime - currentTime;
          if (remainingTime > 0) {
            const warningTime = remainingTime - 60000;
            clearTimeout(warningTimeoutRef.current);
            clearTimeout(logoutTimeoutRef.current);

            warningTimeoutRef.current = setTimeout(() => {
              const token = JSON.parse(localStorage.getItem('user'));
              if (token) {
                setOpenConfirmationDialog(true);
                setMessage('Session expires in 1 minute. Click Yes to continue');
              }
            }, warningTime);

            logoutTimeoutRef.current = setTimeout(() => {
              console.log('Logout due to inactivity');
              handleLogout();
              setOpenConfirmationDialog(false);
            }, remainingTime);
            // setTimeout(() => {
            //   const token = JSON.parse(localStorage.getItem('user'));
            //   if(token){
            //     setOpenConfirmationDialog(true);
            //     setMessage('Session expires in 1 minute Click Yes to continue')
            //   }
            // }, waringTime);
            // setTimeout(() => {
            //   console.log('Logout------------',remainingTime)
            //   handleLogout();
            //   setOpenConfirmationDialog(false);
            // }, remainingTime);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
          handleLogout();
        }
      } else {
        handleLogout();
      }
    }
  }

  const handleLogout = () => {
    if(localStorage.getItem('license-exp') === 'N'){
        localStorage.removeItem('user');
        localStorage.removeItem('roleId');
        localStorage.removeItem('password');
        navigate('/login');
    }
  };

  const handleDialogClose = () => {
    setOpenConfirmationDialog(false);
  };

  const handleDialogConfirm = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    await refreshAcessToken(user.username);
    setOpenConfirmationDialog(false);
    checkToken();
  }

  const refreshAcessToken = async (username) =>{
    const params = new URLSearchParams();
    params.append('grant_type', REFRESH_GRANT_TYPE);
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET); 
    params.append('refresh_token', localStorage.getItem('refreshToken'));
  
    const headers = {'Content-Type': 'application/x-www-form-urlencoded',};
    const response = await axios.post(TOKEN_URL, params, { headers });
  
    if (response.data.access_token) {
      localStorage.setItem('user', JSON.stringify({
        token: response.data.access_token,
        username: username,
        refreshToken : response.data.refresh_token
      }));
    }
  }


  // return(
  //   <ConfirmationDialog open={openConfirmationDialog} onClose={handleDialogClose} onConfirm={handleDialogConfirm} message={message}/>
  // )
};

export default UseIdleTimer;
