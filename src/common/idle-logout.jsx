import React, { useEffect, useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { login } from 'services/auth.service';
import AlertConfirmation from './AlertConfirmation.component';


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
    localStorage.removeItem('user');
    localStorage.removeItem('roleId');
    localStorage.removeItem('password');
    navigate('/login');
  };

  const handleDialogClose = () => {
    setOpenConfirmationDialog(false);
  };

  const handleDialogConfirm = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    await login(user.username,localStorage.getItem('password'));
    setOpenConfirmationDialog(false);
    checkToken();
  }


  // return(
  //   <ConfirmationDialog open={openConfirmationDialog} onClose={handleDialogClose} onConfirm={handleDialogConfirm} message={message}/>
  // )
};

export default UseIdleTimer;
