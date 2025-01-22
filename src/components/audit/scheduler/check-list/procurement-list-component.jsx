import withRouter from "common/with-router";
import Datatable from "components/datatable/Datatable";
import Navbar from "components/Navbar/Navbar";
import React, { useState, useEffect, useCallback } from 'react';
import { Box,Tabs, Tab,Badge} from '@mui/material';
import { getActiveProcurementList, getDivisionList, getItemReceivedList, getSupplyOrderList } from "services/audit.service";
import { format } from "date-fns";

const ProcurementListComponent = ({ router }) => {


    const LabCode = localStorage.getItem('labCode')
    const { navigate, location } = router
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { revisionElements } = location.state || {};
    const [selectedTab, setSelectedTab] = useState(0);
    const [tblprocurementList, setTblProcurementList] = useState([]);
    const [tblSupplyOrderList, setTblSupplyOrderList] = useState([]);
    const [tblItemReceivedList, setTblItemReceivedList] = useState([]);
    const [selfinalProcurementList,setSelfinalProcurementList] = useState('');
    const [selfinalSupplyOrderList,setSelfinalSupplyOrderList] = useState('');
    const [selfinalItemReceivedList,setSelfinalItemReceivedList] = useState('')


    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    }

    useEffect(() => {
        procurementList();
    },[])

    const procurementList = async() =>{
       const activeProcurementList = await getActiveProcurementList();
       const supplyorderList = await getSupplyOrderList(LabCode);
       const itemReceivedList = await getItemReceivedList();
       let finalProcurementList=[]; 
       let finalsupplyorderList=[];
       let finalitemReceivedList=[];
       if(revisionElements.divisionId>0){
              finalProcurementList=activeProcurementList.filter(data => data.divisionCode===revisionElements.divisionCode);
              finalsupplyorderList=supplyorderList.filter(data => data.divisionCode===revisionElements.divisionCode);
              finalitemReceivedList=itemReceivedList.filter(data => data.divisionCode===revisionElements.divisionCode);
       }else if(revisionElements.groupId>0){
            const seldivisionList = await getDivisionList();
            const fileterdDivisionList = seldivisionList.filter(div => div.groupId === revisionElements.groupId).map(item => item.divisionCode);
             finalProcurementList = activeProcurementList.filter(procurement => fileterdDivisionList.includes(procurement.divisionCode));
              finalsupplyorderList=supplyorderList.filter(order => fileterdDivisionList.includes(order.divisionCode));
              finalitemReceivedList=itemReceivedList.filter(item => fileterdDivisionList.includes(item.divisionCode));
       }else if(revisionElements.projectId>0){
            finalProcurementList=activeProcurementList.filter(data => data.projectCode===revisionElements.projectCode);
            finalsupplyorderList=supplyorderList.filter(data => data.projectCode===revisionElements.projectCode);
            finalitemReceivedList=itemReceivedList.filter(data => data.projectCode===revisionElements.projectCode);
       }
       setSelfinalProcurementList(finalProcurementList.length);
       setSelfinalSupplyOrderList(finalsupplyorderList.length);
       setSelfinalItemReceivedList(finalitemReceivedList.length);
       setprocurementTableData(finalProcurementList);
       setsupplyorderTableData(finalsupplyorderList);
       setitemReceivedTableData(finalitemReceivedList);
       
    }


    const procurementcolumns = [
        { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '3%'  },
        { name: 'DemandNo', selector: (row) => row.demandNo, sortable: true, grow: 2, align: 'text-center', width: '9%'  },
        { name: 'DemandDate', selector: (row) => row.demandDate, sortable: true, grow: 2, align: 'text-center', width: '15%'  },
        { name: 'Item For', selector: (row) => row.item, sortable: true, grow: 2, align: 'text-start', width: '19%'  },
        { name: 'Estimated Cost', selector: (row) => row.estimatedCost, sortable: true, grow: 2, align: 'text-end', width: '15%'  },
      ];

      const supplyordercolumns = [
        { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '3%'  },
        { name: 'SONo', selector: (row) => row.soNo, sortable: true, grow: 2, align: 'text-center', width: '9%'  },
        { name: 'SODate', selector: (row) => row.soDate, sortable: true, grow: 2, align: 'text-center', width: '15%'  },
        { name: 'Item For', selector: (row) => row.item, sortable: true, grow: 2, align: 'text-start', width: '19%'  },
        { name: 'Total Cost', selector: (row) => row.totalCost, sortable: true, grow: 2, align: 'text-end', width: '15%'  },
        { name: 'Vendor', selector: (row) => row.vendor, sortable: true, grow: 2, align: 'text-start', width: '15%'  },
      ];

      const receivedcolumns = [
        { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '3%'  },
        { name: 'SONo', selector: (row) => row.soNo, sortable: true, grow: 2, align: 'text-center', width: '9%'  },
        { name: 'SODate', selector: (row) => row.soDate, sortable: true, grow: 2, align: 'text-center', width: '15%'  },
        { name: 'Item For', selector: (row) => row.itemFor, sortable: true, grow: 2, align: 'text-start', width: '19%'  },
        { name: 'ReceivedQty', selector: (row) => row.receivedQty, sortable: true, grow: 2, align: 'text-start', width: '15%'  },
        { name: 'RIN No', selector: (row) => row.rinNo, sortable: true, grow: 2, align: 'text-center', width: '15%'  },
        { name: 'RIN Date', selector: (row) => row.rinDate, sortable: true, grow: 2, align: 'text-center', width: '15%'  },
      ];

      const setprocurementTableData = (list) => {
        const mappedData = list.map((item, index) => {  
          return{
            sn: index + 1,
            demandNo: item.demandNo || '-',
            demandDate: format(new Date(item.demandDate), 'dd-MM-yyyy') || '-',
            item: item.itemFor || '-',
            estimatedCost: item.estimatedCost || '-',
          }
        });
        setTblProcurementList(mappedData);
      }

      const setsupplyorderTableData = (list) => {
        const supplyOrdermappedData = list.map((item, index) => {  
          return{
            sn: index + 1,
            soNo: item.soNo || '-',
            soDate:format(new Date(item.soDate), 'dd-MM-yyyy') || '-',
            item: item.itemFor || '-',
            totalCost: item.totalCost || '-',
            vendor: item.vendorName || '-',
          }
        });
        setTblSupplyOrderList(supplyOrdermappedData);
      }

      const setitemReceivedTableData = (list) => {
        const itemReceivedmappedData = list.map((item, index) => {  
          return{
            sn: index + 1,
            soNo: item.soNo || '-',
            soDate: format(new Date(item.soDate), 'dd-MM-yyyy') || '-',
            itemFor: item.description || '-',
            receivedQty: item.recievedQty || '-',
            rinNo: item.rinNo || '-',
            rinDate: format(new Date(item.rinDate), 'dd-MM-yyyy') || '-',
          }
        });
        setTblItemReceivedList(itemReceivedmappedData);
      }

    return(
        <div className="card">
            <Navbar></Navbar>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h3>Procurement Details (Last Six Months)</h3>
                        <br />
                        <Tabs className="max-h35" value={selectedTab} onChange={handleTabChange} aria-label="inspection tabs"  variant="fullWidth" >
                            <Tab className='mgt8' icon={<i className="material-icons">sort</i>} iconPosition="start"  label={ <span style={{ display: 'flex', alignItems: 'center' }}>Active Procurement List<Badge showZero badgeContent = {selfinalProcurementList}  color="error" className="badge-position"/></span>}  />
                            <Tab className='mgt8' icon={<i className="material-icons">sort</i>} iconPosition="start"  label={ <span style={{ display: 'flex', alignItems: 'center' }}>Supply Order List<Badge showZero badgeContent = {selfinalSupplyOrderList}  color="error" className="badge-position"/></span>} />
                            <Tab className='mgt8' icon={<i className="material-icons">sort</i>} iconPosition="start"  label={ <span style={{ display: 'flex', alignItems: 'center' }}>Item Received List<Badge showZero badgeContent = {selfinalItemReceivedList}  color="error" className="badge-position"/></span>} />
                        </Tabs>
                        {selectedTab === 0 && (<Datatable columns={procurementcolumns} data={tblprocurementList} />) }
                        {selectedTab === 1 && (<Datatable columns={supplyordercolumns} data={tblSupplyOrderList} />)}
                        {selectedTab === 2 && (<Datatable columns={receivedcolumns} data={tblItemReceivedList} />)}
                    </div>
                </div>
            </div>
        </div>
    )
};
export default withRouter(ProcurementListComponent);