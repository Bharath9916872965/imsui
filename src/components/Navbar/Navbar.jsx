import withRouter from "../../common/with-router";
import { logout } from "../../services/auth.service";

import "./navbarTop.css"
import "../../static/buttons.css"
import { useEffect, useState } from "react";
import { getHeaderModuleDetailList, getHeaderModuleList } from "../../services/admin.serive";

const Navbar = (props) => {

  const [headerModuleList, setHeaderModuleList] = useState([]);
  const [headerModuleDetailList, setHeaderModuleDetailList] = useState([]);

  useEffect(() => {
    try {
      const imsFormRoleId = 2;
      fetchHeaderModuleList(imsFormRoleId);
      fetchHeaderModuleDetailList(imsFormRoleId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

  }, []);

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
      const moduleDetailListResponse = await getHeaderModuleDetailList(imsFormRoleId);
      setHeaderModuleDetailList(moduleDetailListResponse);
    } catch (error) {
      console.error('Error fetching Header Module Detail list:', error);
    }
  };

  return (

    <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark bg-gradient">
      <div className="container d-flex">
        {/* Left-aligned IMS item */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a href="/dashboard" className="nav-link">
              <h3><span className="i-name">I</span><span className="ms-name">MS</span></h3>
            </a>
          </li>
        </ul>

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
            <a href="#" onClick={handleLogout} className="nav-link nav-animate">
              <i className="material-icons" style={{ fontSize: '20px' }}>logout</i> Logout
            </a>
          </li>
        </ul>
      </div>

    </nav>

  )
}

export default withRouter(Navbar);