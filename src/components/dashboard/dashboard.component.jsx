import React from "react";
import Navbar from "../Navbar/Navbar";


const Dashboard = () => {
  return (
    <div>
   <Navbar/>
      {/* <HeaderComponent /> */}

      {/* Main Content Below Header */}
      <div className="container-fluid page-body-wrapper" style={{ overflow: "hidden" }}>
        <div className="main-panel">
          <div className="row">
            <div className="col">
              <h2 className="text-center mb-4">
            
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
