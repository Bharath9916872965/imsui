import React from "react";
import Navbar from "../Navbar/Navbar";
import "./dashboard.css";


const Dashboard = () => {
  return (
    <div>
   <Navbar/>
      {/* <HeaderComponent /> */}

      {/* Main Content Below Header */}
      
      <div className="container-fluid page-body-wrapper dashboard-container" style={{ overflow: "hidden" }}>
        <div className="main-panel">
          {/* <div className="content-wrapper dashboard-wrapper">
          <div className="row">
 


          <div className="container-fluid pt-4 px-4">
                <div className="row g-4">
                    <div className="col-sm-6 col-xl-3">
                        <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                            <i className="fa fa-chart-line fa-3x text-primary"></i>
                            <div className="ms-3">
                                <p className="mb-2 box-label">Team Count</p>
                                <h6 className="mb-0 box-data">20</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                            <i className="fa fa-chart-bar fa-3x text-primary"></i>
                            <div className="ms-3">
                                <p className="mb-2 box-label">Auditee Count</p>
                                <h6 className="mb-0 box-data">30</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                            <i className="fa fa-chart-area fa-3x text-primary"></i>
                            <div className="ms-3 ">
                                <p className="mb-2 box-label">Schedule Count</p>
                                <h6 className="mb-0 box-data">11</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                            <i className="fa fa-chart-pie fa-3x text-primary"></i>
                            <div className="ms-3">
                                <p className="mb-2 box-label">Approved Count</p>
                                <h6 className="mb-0 box-data">2</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>









            </div>


          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
