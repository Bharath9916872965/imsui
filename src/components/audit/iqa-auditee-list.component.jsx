import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Swal from 'sweetalert2';
import { getAuditeeDtoList, getIqaAuditeeList, getIqaDtoList, insertIqaAuditee } from "services/audit.service";
import SelectPicker from "components/selectpicker/selectPicker";
import AlertConfirmation from "common/AlertConfirmation.component"
import { useLocation } from "react-router-dom";



const IqaAuditeeListComponent = () =>{
   const location = useLocation();
    const [iqaId, setIqaId] = useState('');
    const [iqaOptions, setIqaOptions] = useState([]);
    const [iqaNo, setIqaNo] = useState('');
    const [iqaFullList, setIqaFullList] = useState([]);
    const [selauditeeData,setAuditeeData]=useState([]);
    const [auditeeList, setAuditeeList] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [iqaIdSelFromDahboard, setIqaIdSelFromDahboard] = useState(''); 

    useEffect(() => {
        fetchIqaAuditeeList();
      }, []);


      const fetchIqaAuditeeList = async () => {
        try {
          const [auditeeData, iqaData] = await Promise.all([getAuditeeDtoList(), getIqaDtoList()]);
          const formattedIqaOptions = iqaData.map(data => ({
            value: data.iqaId,
            label: data.iqaNo
          }));
    
          setIqaFullList(iqaData);
          setIqaOptions(formattedIqaOptions);
          setAuditeeData(auditeeData);
          if (iqaData.length > 0) {
            setIqaNo(iqaData[0].iqaNo);
            setIqaId(iqaData[0].iqaId);
            changedata(iqaData[0].iqaId, auditeeData);
          }


          ////////////code to access auditee list from dashboard start////////////
      const queryParams = new URLSearchParams(location.search);
      const iqaIdSelFromDahboard = queryParams.get('iqaIdSel') || '';
      setIqaIdSelFromDahboard(iqaIdSelFromDahboard); 
      setIsReady(true); 
          ////////////code to access auditee list from dashboard end////////////

        } catch (error) {
          Swal.fire('Error', 'Failed to fetch data. Please try again later.', 'error');
        }
      };

 
      // The below useEffect runs only when either isReady or iqaIdSelFromDahboard changes
  useEffect(() => {
    if (isReady && iqaIdSelFromDahboard) {
      console.log('now it is ready to call it ' + isReady + ' sdsc ' + iqaIdSelFromDahboard);
      onIqaChange(iqaIdSelFromDahboard); 
    }
  }, [isReady, iqaIdSelFromDahboard]);



      const reloaddata = () =>{
        const formattedIqaOptions = iqaFullList.map(data => ({
            value: data.iqaId,
            label: data.iqaNo
          }));
    
          setIqaFullList(iqaFullList);
          setIqaOptions(formattedIqaOptions);
          setAuditeeData(selauditeeData);
      }

      const changedata = async (iqaId, auditeeData) => {
        
        const iqaAuditeeData = await getIqaAuditeeList(iqaId);
        setAuditeeList(iqaAuditeeData);
        // If there are no auditees for the selected iqaId, select all auditees
        if (iqaAuditeeData.length === 0) {
            // Select all auditees
            const allAuditees = auditeeData.map(auditee => auditee.auditeeId);
            setSelectedIds(allAuditees);
        } else {
            const selectedAuditees = auditeeData
                .filter(auditee => iqaAuditeeData.some(iqa => iqa.auditeeId === auditee.auditeeId))
                .map(auditee => auditee.auditeeId);
            setSelectedIds(selectedAuditees);
        }
    };
    

      const onIqaChange = async (value) => {
        const iqaId = Number(value); 
        console.log('iqaIddd'+iqaId);
        console.log("iqa change in auditee list:", JSON.stringify(iqaFullList, null, 2));
       if(iqaId){
        console.log("iqa change in auditee list:", iqaFullList.find(data => data.iqaId === iqaId))
        const selectedIqa = iqaFullList.find(data => data.iqaId === iqaId);
        setIqaId(iqaId);
        setIqaNo(selectedIqa?.iqaNo || '');
        const updatedAuditeeList = await getIqaAuditeeList(iqaId);
        changedata(iqaId,selauditeeData);
       }
      };

      const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
          chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
      };

      
    const chunkSize = Math.ceil(selauditeeData.length / 3); // Divide into 3 columns
    const chunkedAuditeeList = useMemo(() => chunkArray(selauditeeData, chunkSize), [selauditeeData]);

    const handleSelectAll = (chunk) => {
        const chunkIds = chunk.map((audit) => audit.auditeeId);
        if (chunkIds.every((id) => selectedIds.includes(id))) {
            setSelectedIds(selectedIds.filter((id) => !chunkIds.includes(id)));
        } else {
            setSelectedIds([...new Set([...selectedIds, ...chunkIds])]);
        }
    };

    const handleCheckboxChange = (auditeeId) => {
        setSelectedIds((prevState) =>
          prevState.includes(auditeeId)
            ? prevState.filter((id) => id !== auditeeId)
            : [...prevState, auditeeId]
        );
      };
    
      const getGroupDivisionProject = (audit) => {
        return audit.groupName || audit.divisionName || audit.projectShortName || '-';
      };

      const handleSubmit = async () => {
        if (selectedIds.length === 0) {
            return Swal.fire("Warning", "Please Select Atleast One Employee!", "warning");
          }
          const confirm = await AlertConfirmation({
            title: 'Are you sure to Add ?',
            message: '',
          });
       
          
    if (confirm) {
        try {
          const response = await insertIqaAuditee(iqaId,selectedIds);
  
          if (response === 200) {
            reloaddata();
            setIqaId(iqaId);
            setIqaNo(iqaNo);
            Swal.fire({
              icon: "success",
              title: `Auditee For `+iqaNo,
              text: "Added Successfully!",
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire("Error!", "Failed to Add Auditor!", "error");
          }
        } catch (error) {
          console.error("Error adding auditor:", error);
          Swal.fire("Error!", "There was an issue adding the auditor.", "error");
        }
      }
      };

      
      return (
        <div>
          <Navbar />
          <div className="card">
            <div className="card-body text-center">
              <div className="row">
                <div className="col-md-10">
                  <h3>{iqaNo} : IQA Auditee List</h3>
                </div>
                <div className="col-md-2">
                  <SelectPicker
                    options={iqaOptions}
                    label="IQA No"
                    value={iqaOptions.find(option => option.value === iqaId) || null}
                    handleChange={(newValue) => onIqaChange(newValue?.value)}
                  />
                </div>
              </div>
              <br />
              <div className="row">
                {chunkedAuditeeList.length > 0 ? (
                  chunkedAuditeeList.map((chunk, columnIndex) => (
                    <div className="col-md-4" key={columnIndex}>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>
                              <input
                                type="checkbox"
                                checked={chunk.every((audit) => selectedIds.includes(audit.auditeeId))}
                                onChange={() => handleSelectAll(chunk)}
                              />
                            </th>
                            <th>Auditee Name</th>
                            <th>Group/Division/Project</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chunk.map((audit, index) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="checkbox"
                                  value={audit.auditeeId}
                                  checked={selectedIds.includes(audit.auditeeId)}
                                  onChange={() => handleCheckboxChange(audit.auditeeId)}
                                />
                              </td>
                              <td style={{ textAlign: 'left' }}>{audit.auditee}</td>
                              <td style={{ textAlign: 'left' }}>{getGroupDivisionProject(audit)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))
                ) : (
                  <div>No data available</div>
                )}
              </div>
              <div className="row mt-4">
                <div className="col-md-12 text-center">
                    {auditeeList.length===0? <button type="submit" className="btn btn-success" onClick={handleSubmit}> Submit</button>: <button type="submit" className="btn edit" onClick={handleSubmit}>Update</button>}
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}
export default IqaAuditeeListComponent;