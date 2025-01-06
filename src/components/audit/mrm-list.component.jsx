import Datatable from "components/datatable/Datatable";
import Navbar from "components/Navbar/Navbar";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { getAssignedData, getCommitteeScheduleList, OpenMoMDocument } from "services/audit.service";

const MrmListComponent = () =>{

     const [tblMrmListData, setTblMrmListData] = useState([]);
     const [assignData, setAssignData] = useState([]);
     const [showAssignDataModal, setshowAssignDataModal] = useState(false);
     const [selFilterAssignedData,setSelFilterAssignedData]= useState([]);
     const [isReady, setIsReady] = useState(false);
     const [selLabCode, setSelLabCode] = useState('');
 
     useEffect(() => {
        MrmListData();
    }, [isReady]);

    const MrmListData = async () => {
        try {
            const LabCode = localStorage.getItem('labCode')
            const MrmList = await getCommitteeScheduleList('MRM');
            const assignedData = await getAssignedData('MRM');
            setAssignData(assignedData);
            mappedData(MrmList);
            setIsReady(true);
            setSelLabCode(LabCode);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {

        }
    }
    
    const columns = [
        { name: "SN", selector: (row) => row.sn, sortable: true, align: 'text-center',width: '10%' },
        { name: "Meeting Id", selector: (row) => row.meetingId, sortable: true, align: 'text-start',width: '40%' },
        { name: "Date & Time", selector: (row) => row.dateTime, sortable: true, align: 'text-center',width: '25%' },
        // { name: "Committee", selector: (row) => row.committee, sortable: true, align: 'text-center' },
        // { name: "Venue", selector: (row) => row.venue, sortable: true, align: 'text-start' },
        { name: "Action", selector: (row) => row.action, sortable: true, align: 'text-center',width: '25%' },
    ];

    const actioncolumns = [
        { name: "SN", selector: (row) => row.sn, sortable: true, align: 'text-center' },
        { name: "Action Item", selector: (row) => row.actionItem, sortable: true, align: 'text-start' },
        { name: "PDC", selector: (row) => row.pdc, sortable: true, align: 'text-center' },
        { name: "Progress", selector: (row) => row.progress, sortable: true, align: 'text-center' },
    ];

    const mappedData = (list) => {
        setTblMrmListData(
            list.map((item, index) => ({
                sn: index + 1,
                meetingId: `${item.meetingId || "-"}`,
                dateTime: format(new Date(item.scheduleDate), 'dd-MM-yyyy') + " - " + item.scheduleStartTime || '-',
                // committee: item.committeeShortName || "-",
                // venue: item.meetingVenue || "-",
                action: (
                    <>
                        <button className="icon-button print-icon-button" onClick={() => MomDownload(item)} title="MOM"> <i className="material-icons"  >print</i></button>
                        <button className=" btn btn-sm " style={{ color: 'grey',  marginBottom: "1rem" }} onClick={() => openActionItem(item)} title="Edit"> <i className="material-icons"  >visibility</i></button>
                    </>
                ),
            }))
        );
    };

    const MomDownload = async (item) => {
        const openMom = await OpenMoMDocument(item.scheduleId, selLabCode);
    }

    const openActionItem = async (item) => {
        setshowAssignDataModal(true);
        const filterAssignedData = assignData.filter(data => data.scheduleId === item.scheduleId);
        assignmappedData(filterAssignedData);
    }

    const assignmappedData = (list) => {
        setSelFilterAssignedData(
            list.map((item, index) => ({
                sn: index + 1,
                actionItem: `${item.actionItem || "-"}`,
                pdc: format(new Date(item.pdcorg), 'dd-MM-yyyy') || '-',
                progress: item.progress || 0,
            }))
        );
    };

    
        return (
            <div>
                <Navbar />
                <div className="card">
                    <div className="card-body text-center">
                        <h3>MRM Report List</h3>
                        <div id="card-body customized-card">
                            {<Datatable columns={columns} data={tblMrmListData} />}
                        </div>
                    {showAssignDataModal && (
                        <>
                        {/* Backdrop */}
                        <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
                        <div className="modal fade show" style={{ display: "block" }}>
                            <div className="modal-dialog modal-lg modal-lg-custom" style={{ maxWidth: "70%", width: "70%" }}>
                            <div className="modal-content modal-content-custom" style={{ minHeight: "300px" }}>
                                <div className="modal-header bg-secondary text-white modal-header-custom d-flex justify-content-between">
                                <h5 className="modal-title">MRM Action Items</h5>
                                <button type="button" className="btn btn-danger modal-header-danger-custom" onClick={() => setshowAssignDataModal(false)} aria-label="Close">
                                    &times;
                                </button>
                                </div>
                                <div id="card-body customized-card">
                                    {<Datatable columns={actioncolumns} data={selFilterAssignedData} />}
                                </div>
                            </div>
                            </div>
                        </div>
            
                        </>
                    )}
                    </div>
                </div>
            </div>
    
        );
};
export default MrmListComponent;