import { useCallback, useEffect, useState } from "react";
import { getDwpDivisionGroupList, getDwpDivisionList, getDwpVersionRecordDtoList, getQmVersionRecordDtoList } from "services/qms.service";
import Datatable from "../../datatable/Datatable";
import withRouter from '../../../common/with-router';
import Navbar from "../../Navbar/Navbar";
import "./dwp-revisionrecords.component.css"
import { format } from "date-fns";
import DwpDocPrint from "components/prints/qms/dwp-doc-print";
import AddDocumentSummaryDialog from "./dwp-add-document-summary-dialog";
import SelectPicker from "components/selectpicker/selectPicker";
import { Autocomplete, ListItemText, TextField } from "@mui/material";
import { CustomMenuItem } from "services/auth.header";
import { getLoginEmployeeDetails } from "services/header.service";
import DwpDocsAddIssueDialog from "./dwp-add-issue-dialog";
// import AddDocumentSummaryDialog from "./qm-add-document-summary-dialog";


const DwpRevisionRecordsComponent = ({ router, docName }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [versionRecordList, setVersionRecordList] = useState([]);
  const [versionRecordPrintList, setVersionRecordPrintList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [divisionGroupList, setDivisionGroupList] = useState([]);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [singleDoc, setSingleDoc] = useState(null);
  const [divisionId, setDivisionId] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [qmsDocTypeDto, setQmsDocTypeDto] = useState(null);
  const [groupDivisionId, setGroupDivisionId] = useState(null);
  const [revisionListRefresh, setRevisionListRefresh] = useState(null);

  const [openAddIssueDialog, setOpenAddIssueDialog] = useState(false);


  const { navigate, location } = router;

  useEffect(() => {

    console.log('docName------', docName)


    const fetchData = async () => {
      const { empName, designation, empId, imsFormRoleId, formRoleName } = await getLoginEmployeeDetails();
      setDwpDivisionList(imsFormRoleId, empId);
      setDwpDivisionGroupList(imsFormRoleId, empId);
    }

    fetchData();
  }, [])

  useEffect(() => {
    
    const fetchData = async () => {
      try {

        var divId = 0;

        if(groupDivisionId) {
          divId = groupDivisionId;
        }

        const qmsDocTypeDto = {
          docType: docName,
          groupDivisionId:divId
        }
    
        setQmsDocTypeDto(qmsDocTypeDto);

        // setQmsDocTypeDto(prevState => ({...prevState, groupDivisionId: dwpDivisionList[0]?.divisionId || 0 }));

        console.log("divId-----", divId)
        const versionRecorList = await getDwpVersionRecordDtoList(qmsDocTypeDto);
        const mappedData = versionRecorList.map((item, index) => ({
          sn: index + 1,
          description: item.description || '-' || '-',
          // from: 'V' + item[5] + '-R' + item[6] || '-',
          from: index + 1 < versionRecorList.length ? 'I' + versionRecorList[index + 1].issueNo + '-R' + versionRecorList[index + 1].revisionNo : '--',
          to: 'I' + item.issueNo + '-R' + item.revisionNo || '-',
          issueDate: item.dateOfRevision,
          issueDate: format(new Date(item.dateOfRevision), 'dd-MM-yyyy') || '-',
          status: item.statusCode || '--',
          action: (
            <div>
              {!["APR", "APR-GDDQA", "APR-DGAQA"].includes(item.statusCode) && (
                <>
                  <button className="icon-button edit-icon-button me-1" onClick={() => redirecttoQmDocument(item)} title="Edit"> <i className="material-icons"  >edit_note</i></button>
                  {/* <button className="btn summary-btn-outline btn-sm"  onClick={() => {
                                  // setOpenDialog2(true);
                                  setSingleDoc(item);
                              }} title="Document Summary"> <i className="material-icons" >summarize</i></button> */}
                  {getDocPDF('', item)}
                  <button className="icon-button me-1" style={{ color: '#439cfb' }} onClick={() => { setSingleDoc(item); setOpenDialog2(true); }} title="Document Summary"> <i className="material-icons"  >summarize</i></button>
                 {docName && docName==='dwp' ? (<button className="icon-button me-1" style={{ color: '#439cfb' }} onClick={() => redirecttoRiskRegisterComponent(item)}  title="Risk"> <i className="material-icons"  >app_registration</i></button> ) : " "}
                  
                  {/* <button className="icon-button me-1" style={{color: '#ea5753'}} title="Mapping Of Clauses" onClick={()=>addMappingOfClasses(item)} > <i className="material-icons"  >table_chart</i></button> */}
                  <button className="icon-button kpi-icon-button me-1" onClick={() => addKpi(item)} title="Add KPI"> <i className="material-icons"  >fact_check</i></button>
                </>
              )}
            </div>
          ),
        }));

        setVersionRecordPrintList(mappedData);
        setVersionRecordList(versionRecorList);
        setIsLoading(false);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [groupDivisionId, revisionListRefresh]);

  const getDocPDF = (action, revisionElements) => {
    return <DwpDocPrint action={action} revisionElements={revisionElements} />
  }

  const addKpi = (item)=>{
    navigate('/kpi-objective', { state: { dwpGwp: item } })
  }

  const redirecttoQmDocument = useCallback((element) => {
    navigate('/dwp-add-content', { state: { revisionElements: element } })
  }, [navigate]);

  const redirecttoRiskRegisterComponent = useCallback((element) => {
    navigate('/risk-register', { state: { revisionElements: element } })
  }, [navigate]);

  const setDwpDivisionList = async (imsFormRoleId, empId) => {
    
    const dwpDivisionList = await getDwpDivisionList(imsFormRoleId, empId);

    if(dwpDivisionList && dwpDivisionList.length > 0) {
      if(docName==='dwp'){
        setGroupDivisionId(dwpDivisionList[0].divisionId);
        setQmsDocTypeDto(prevState => ({...prevState, groupDivisionId: dwpDivisionList[0]?.divisionId || 0 }));
      }
    }

    setDivisionList(dwpDivisionList);

  };

  const setDwpDivisionGroupList = async (imsFormRoleId, empId) => {

    const dwpDivisionGroupList = await getDwpDivisionGroupList(imsFormRoleId, empId);
    if(dwpDivisionGroupList && dwpDivisionGroupList.length > 0) {
      if(docName==='gwp'){
        setGroupDivisionId(dwpDivisionGroupList[0].groupId);
        setQmsDocTypeDto(prevState => ({...prevState, groupDivisionId: dwpDivisionGroupList[0]?.groupId || 0 }));
      }
    }
    setDivisionGroupList(dwpDivisionGroupList);

  };

  const handleCloseDocSummaryDialog = () => {
    setOpenDialog2(false)
    setSingleDoc(null);
  };

  const handleCloseDialog = () => {
    setOpenAddIssueDialog(false)
    setSingleDoc([]);
    setRevisionListRefresh(!revisionListRefresh)
};



  const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
    { name: 'Description', selector: (row) => row.description, sortable: true, grow: 2, align: 'text-start' },
    { name: 'Issue From', selector: (row) => row.from, sortable: true, grow: 2, align: 'text-center' },
    { name: 'Issue To', selector: (row) => row.to, sortable: true, grow: 2, align: 'text-center' },
    { name: 'Date Of Revision', selector: (row) => row.issueDate, sortable: true, grow: 2, align: 'text-center' },
    { name: 'Status', selector: (row) => row.status, sortable: false, grow: 2, align: 'text-center' },
    { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center' },
  ];

  return (

    <div className="card">
      <Navbar />
      <div className="card-body">
        {/* <h3>DWP - Revision Record </h3> */}

        <div className="row">
            <div className="col-md-10">
            <h3>{docName.toString().toUpperCase()} - Revision Record</h3>
            </div>
            <div className="col-md-2">
              {/* <SelectPicker options={divisionList} label="Division Name"
                value={divisionList && divisionList.length > 0 && divisionList.find(option => option.value === divisionId) || null}
                handleChange={(newValue) => { setDivisionId(newValue?.value) }} /> */}
            {docName === "dwp" && (
              <Autocomplete
                options={divisionList}
                disablePortal
                getOptionLabel={(division) => `${division.divisionCode} - ${division.divisionName}`}
                renderOption={(props, option) => {
                  return (
                    <CustomMenuItem {...props} key={option.divisionId}>
                      <ListItemText primary={`${option.divisionCode} - ${option.divisionName}`} />
                    </CustomMenuItem>
                  );
                }}
                value={divisionList.find((division) => division.divisionId === groupDivisionId) || null}
                onChange={(event, value) => setGroupDivisionId(value ? value.divisionId : null)}
                renderInput={(params) => <TextField {...params} label="Division Name" margin="normal" InputProps={{
                  ...params.InputProps,
                  sx: { height: 40 },
                }} />}
              />
            )}

            {docName === "gwp" && (
              <Autocomplete
                options={divisionGroupList}
                disablePortal
                getOptionLabel={(divisionGroup) => `${divisionGroup.groupCode} - ${divisionGroup.groupName}`}
                renderOption={(props, option) => {
                  return (
                    <CustomMenuItem {...props} key={option.groupId}>
                      <ListItemText primary={`${option.groupCode} - ${option.groupName}`} />
                    </CustomMenuItem>
                  );
                }}
                value={divisionGroupList.find((divisionGroup) => divisionGroup.groupId === groupDivisionId) || null}
                onChange={(event, value) => setGroupDivisionId(value ? value.groupId : null)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Group"
                    size="small"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
            )}

            </div>
          </div>
          <br />
        <div id="card-body customized-card">
          {isLoading ? (
            <h3>Loading...</h3>
          ) : error ? (
            <h3 color="error">{error}</h3>
          ) : (
            <Datatable columns={columns} data={versionRecordPrintList} />
          )}
        </div>

        <br />

        <div className="text-center">
          {(versionRecordPrintList.length === 0 && ((docName === 'dwp' && divisionList.length > 0) || (docName === 'gwp' && divisionGroupList.length > 0)) ) && (
            <button
              type="button"
              className="btn add"
              onClick={() => {setOpenAddIssueDialog(true)}}
            >
              Add Issue (V1-R0)
            </button>
          )}
        </div>

      </div>

      <DwpDocsAddIssueDialog
        open={openAddIssueDialog}
        onClose={handleCloseDialog}
        revisionElements={singleDoc}
        docType={docName}
        groupDivisionId={groupDivisionId}
      //  onConfirm={handleIssueConfirm}
      />

      <AddDocumentSummaryDialog
        open={openDialog2}
        onClose={handleCloseDocSummaryDialog}
        revisionElements={singleDoc}
      />
      

    </div>

  )

}

export default withRouter(DwpRevisionRecordsComponent);