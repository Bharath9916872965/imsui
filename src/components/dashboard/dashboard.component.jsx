import React from "react";

const Dashboard = () => {
  return (
    <div>
      {/* <HeaderComponent /> */}

      {/* Main Content Below Header */}
      <div className="container-fluid page-body-wrapper" style={{ overflow: "hidden" }}>
        <div className="main-panel">
          <div className="row">
            <div className="col">
              <h2 className="text-center mb-4">
                <span style={{ color: "black" }}>DASHBOARD</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
