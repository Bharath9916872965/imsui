import withRouter from "common/with-router";
import Datatable from "components/datatable/Datatable";
import Navbar from "components/Navbar/Navbar";
import React, { useState, useEffect, useCallback } from 'react';
import { Box,Tabs, Tab,Badge} from '@mui/material';
//import { getActiveProcurementList } from "services/audit.service";

const ProcurementListComponent = ({ router }) => {


    const { navigate, location } = router
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { revisionElements } = location.state || {};
    const [selectedTab, setSelectedTab] = useState(0);

    console.log('revisionElements',revisionElements);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    }

    // const procurementList = async() =>{
    //     const activeProcurementList = await getActiveProcurementList();
    // }
    const procurementcolumns = [
        { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '3%'  },
        { name: 'DemandNo', selector: (row) => row.date, sortable: true, grow: 2, align: 'text-center', width: '9%'  },
        { name: 'DemandDate', selector: (row) => row.divisionCode, sortable: true, grow: 2, align: 'text-center', width: '15%'  },
        { name: 'Item For', selector: (row) => row.project, sortable: true, grow: 2, align: 'text-center', width: '19%'  },
        { name: 'Estimated Cost', selector: (row) => row.auditee, sortable: true, grow: 2, align: 'text-start', width: '15%'  },
      ];

      const supplyordercolumns = [
        { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '3%'  },
        { name: 'DemandNo', selector: (row) => row.date, sortable: true, grow: 2, align: 'text-center', width: '9%'  },
        { name: 'DemandDate', selector: (row) => row.divisionCode, sortable: true, grow: 2, align: 'text-center', width: '15%'  },
        { name: 'Item For', selector: (row) => row.project, sortable: true, grow: 2, align: 'text-center', width: '19%'  },
        { name: 'Estimated Cost', selector: (row) => row.auditee, sortable: true, grow: 2, align: 'text-start', width: '15%'  },
        { name: 'Supply Order No', selector: (row) => row.auditee, sortable: true, grow: 2, align: 'text-start', width: '15%'  },
        { name: 'Supply Order Date', selector: (row) => row.auditee, sortable: true, grow: 2, align: 'text-start', width: '15%'  },
      ];

      const receivedcolumns = [
        { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '3%'  },
        { name: 'DemandNo', selector: (row) => row.date, sortable: true, grow: 2, align: 'text-center', width: '9%'  },
        { name: 'DemandDate', selector: (row) => row.divisionCode, sortable: true, grow: 2, align: 'text-center', width: '15%'  },
        { name: 'Item For', selector: (row) => row.project, sortable: true, grow: 2, align: 'text-center', width: '19%'  },
        { name: 'Estimated Cost', selector: (row) => row.auditee, sortable: true, grow: 2, align: 'text-start', width: '15%'  },
        { name: 'Rin No', selector: (row) => row.auditee, sortable: true, grow: 2, align: 'text-start', width: '15%'  },
        { name: 'Rin Date', selector: (row) => row.auditee, sortable: true, grow: 2, align: 'text-start', width: '15%'  },
      ];

    return(
        <div className="card">
            <Navbar></Navbar>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h3>Procurement Details</h3>
                        <br />
                        <Tabs className="max-h35" value={selectedTab} onChange={handleTabChange} aria-label="inspection tabs"  variant="fullWidth" >
                            <Tab className='mgt8' icon={<i className="material-icons">sort</i>} iconPosition="start"  label={ <span style={{ display: 'flex', alignItems: 'center' }}>Active Procurement List<Badge showZero badgeContent = {0}  color="error" className="badge-position"/></span>}  />
                            <Tab className='mgt8' icon={<i className="material-icons">sort</i>} iconPosition="start"  label={ <span style={{ display: 'flex', alignItems: 'center' }}>Supply Order List<Badge showZero badgeContent = {0}  color="error" className="badge-position"/></span>} />
                            <Tab className='mgt8' icon={<i className="material-icons">sort</i>} iconPosition="start"  label={ <span style={{ display: 'flex', alignItems: 'center' }}>Item Received List<Badge showZero badgeContent = {0}  color="error" className="badge-position"/></span>} />
                        </Tabs>
                        {selectedTab === 0 && (<Datatable columns={procurementcolumns} data={''} />) }
                        {selectedTab === 1 && (<Datatable columns={supplyordercolumns} data={''} />)}
                        {selectedTab === 2 && (<Datatable columns={receivedcolumns} data={''} />)}
                    </div>
                </div>
            </div>
        </div>
    )
};
export default withRouter(ProcurementListComponent);