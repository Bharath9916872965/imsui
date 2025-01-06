import withRouter from "../../common/with-router";
import { logout } from "../../services/auth.service";

import "./navbarTop.css"
import "../../static/buttons.css"
import { useEffect, useState } from "react";
import { getHeaderModuleDetailList, getHeaderModuleList,changePassword,getNotifiList,getNotifiCount,updateNotification  } from "../../services/admin.serive";
import { getLoginEmployeeDetails} from "services/header.service";





const Navbar = (props) => {

  const [headerModuleList, setHeaderModuleList] = useState([]);
  const [headerModuleDetailList, setHeaderModuleDetailList] = useState([]);
  const [empName, setEmpName] = useState('');
  const [title, setTitle] = useState('');
  const [designation, setDesignation] = useState('');
  const [formRoleName, setFormRoleName] = useState('');
  const [notifiCount, setNotifiCount] = useState(0);
  const [notifiList, setNotifiList] = useState([]);
  


  useEffect(() => {
    const fetchData = async () => {
      try {

        const { empName, designation, empId, imsFormRoleId, formRoleName, title } = await getLoginEmployeeDetails();

        setEmpName(empName);
        setDesignation(designation);
        setFormRoleName(formRoleName);
        setTitle(title);
        if(imsFormRoleId){
          fetchHeaderModuleList(imsFormRoleId);
          fetchHeaderModuleDetailList(imsFormRoleId);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

    }

    fetchData();

  }, []);

  const gotoNoti = async (event, item) => {
    event.preventDefault(); 
    const response = await updateNotification(item.notificationId);
    props.router.navigate(item.notificationUrl);
    if (response > 0) {
      const notifiCount = await getNotifiCount();
      const notifiList = await getNotifiList();
      setNotifiCount(notifiCount);
      setNotifiList(notifiList);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout('L');
    props.router.navigate("/login");
  };

  const fetchHeaderModuleList = async (imsFormRoleId) => {
    try {
      const moduleListResponse = await getHeaderModuleList(imsFormRoleId);
      setHeaderModuleList(moduleListResponse);
    } catch (error) {
      console.error('Error fetching Header Module list:', error);
    }
  };

  const fetchHeaderModuleDetailList = async (imsFormRoleId) => {
    try {
      console.log('dsdsds count'+await getNotifiCount());
      console.log('dsdsds list'+JSON.stringify(await getNotifiList()));
      const moduleDetailListResponse = await getHeaderModuleDetailList(imsFormRoleId);
      setHeaderModuleDetailList(moduleDetailListResponse);
      const notifiCount = await getNotifiCount();
      const notifiList = await getNotifiList();
      setNotifiCount(notifiCount);
      setNotifiList(notifiList);

    } catch (error) {
      console.error('Error fetching Header Module Detail list:', error);
    }
  };

  return (

    
    <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark bg-gradient">
      <div className="row" style={{width: '100%'}}>
      <div className="container d-flex">
        {/* Left-aligned IMS item */}
        <div className="col-md-3 ">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a href="/dashboard" className="nav-link">
              <div className="d-flex" style={{ float: 'left' }}>
                <h3 className="mb-0 d-flex align-items-center me-2">
                  <span className="i-name">I</span><span className="ms-name">MS</span>
                </h3>
                <h6 className="mb-0 d-flex align-items-end">
                  {title || ''} {empName}, {designation || ''} ({formRoleName || ''})
                </h6>
              </div>
            </a>
            
          </li>
        </ul>
        </div>
        <div className="col-md-9 d-flex justify-content-end">
        {/* Right-aligned navigation items */}
        <ul className="navbar-nav ms-auto">
          <li className="nav-item dropdown">
            <a href="/dashboard" className="nav-link nav-animate">
              <i className="material-icons" style={{ fontSize: '20px' }}>home</i> Home
            </a>
          </li>
          {headerModuleList.map((module, index) => {
            const filteredDetails = headerModuleDetailList.filter(
              (detail) => detail.formModuleId === module.formModuleId
            );

            return filteredDetails.length > 1 ? (
              <li key={index} className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link dropdown-toggle nav-animate"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="material-icons" style={{ fontSize: '20px' }}>
                    {module.moduleIcon}
                  </i>{' '}
                  {module.formModuleName}
                </a>
                <ul className="dropdown-menu">
                  {filteredDetails.map((detail, idx) => (
                    <li key={idx}>
                      <a className="dropdown-item" href={`/${detail.formUrl}`}>
                        {detail.formDispName}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={index} className="nav-item dropdown">
                <a
                  href={`/${filteredDetails[0]?.formUrl}`}
                  className="nav-link nav-animate"
                >
                  <i className="material-icons" style={{ fontSize: '20px' }}>{module.moduleIcon}</i>
                  {module.formModuleName}
                </a>
              </li>
            );
          })}

     
        <li className="nav-item dropdown">


            <a href="/dashboard" className="nav-link nav-animate">
              <i className="material-icons" style={{ fontSize: '20px' }}>help</i> Help
            </a>
            <ul className="dropdown-menu">
              
                    <li>
                      <a className="dropdown-item" href='#'  onClick={changePassword}>
                        Change Password
                      </a>
                    </li>

                    <li>
                      <a className="dropdown-item" href='audit-stamping'>
                        Audit Stamping
                      </a>
                    </li>
               
              </ul>
          </li>



          {/* <li className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="material-icons" style={{ fontSize: '20px' }}>checklist_rtl</i> Audit
            </a>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="/audit-list">Audit list</a></li>
            </ul>
          </li> */}
          {/* <li className="nav-item">
      <a href="/audit-list" className="nav-link">
        <i className="material-icons" style={{ fontSize: '20px' }}>checklist_rtl</i> Audit
      </a>
    </li> */}
          <li className="nav-item dropdown" >
               <a href="/dashboard" className="nav-link nav-animate">
              <i className="material-icons" style={{ fontSize: '20px' }}>notifications</i> 
              <span className='notification-count'>{Number(notifiCount)}</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-left" >
            {notifiList.length > 0 ? (

                notifiList.map((item, index) => (
                  <li key={index}>
                  <a  className="dropdown-item" key={index} onClick={(event) => gotoNoti(event, item)}>{item.notificationMessage}</a>
                 </li>
                ))
             
              ) : (
                <li>
                <a  className="dropdown-item"  onClick={(event) => event.preventDefault()}>No Notifications</a>
               </li>
              )}
              </ul>
            </li> 

          <li className="nav-item dropdown" >
            <a href="#" onClick={handleLogout} className="nav-link nav-animate">
              <i className="material-icons" style={{ fontSize: '20px' }}>logout</i> Logout
            </a>
          </li>
        </ul>
        </div>
        </div>
        </div>
    </nav>

  )
}

export default withRouter(Navbar);