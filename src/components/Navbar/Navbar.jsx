import withRouter from "../../common/with-router";
import { logout } from "../../services/auth.service";

import "./navbarTop.css"
import "../../static/buttons.css"

const Navbar = (props) => {


  const handleLogout = (e) => {
    e.preventDefault();
    logout('L');
    props.router.navigate("/login");
  };

  return (

    <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark bg-gradient">
      <div className="container d-flex">
  {/* Left-aligned IMS item */}
  <ul className="navbar-nav">
  <li className="nav-item">
      <a href="/dashboard" className="nav-link">
        <h3>IMS</h3> 
      </a>
    </li>
  </ul>
  
  {/* Right-aligned navigation items */}
  <ul className="navbar-nav ms-auto">
    <li className="nav-item">
      <a href="/dashboard" className="nav-link">
        <i className="material-icons" style={{ fontSize: '20px' }}>home</i> Home
      </a>
    </li>
    <li className="nav-item dropdown">
      <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        <i className="material-icons" style={{ fontSize: '20px' }}>assignment</i> QMS
      </a>
      <ul className="dropdown-menu">
        <li><a className="dropdown-item" href="/quality-manual">Quality Manual</a></li>
      </ul>
    </li>
    <li className="nav-item dropdown">
      <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        <i className="material-icons" style={{ fontSize: '20px' }}>checklist_rtl</i> Audit
      </a>
      <ul className="dropdown-menu">
        <li><a className="dropdown-item" href="/audit-list">Audit list</a></li>
      </ul>
    </li>
    {/* <li className="nav-item">
      <a href="/audit-list" className="nav-link">
        <i className="material-icons" style={{ fontSize: '20px' }}>checklist_rtl</i> Audit
      </a>
    </li> */}
    <li className="nav-item">
      <a href="#" onClick={handleLogout} className="nav-link">
        <i className="material-icons" style={{ fontSize: '20px' }}>logout</i> Logout
      </a>
    </li>
  </ul>
</div>

    </nav>

  )
}

export default withRouter(Navbar);