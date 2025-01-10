import React, { useEffect, useState } from "react";
import Datatable from "../datatable/Datatable";
import Navbar from "../Navbar/Navbar";
import Swal from "sweetalert2";
import AlertConfirmation from "../../common/AlertConfirmation.component";
import { getAuditPatchList } from "services/admin.serive";
import { format } from "date-fns";

const AuditPatchComponent = () => {

    const [tblAuditPatchList, setTblAuditPatchList]= useState([]);
    useEffect(() =>{
        auditpatchList();
    },[]);

    const columns = [
        { name: "SN", selector: (row) => row.sn, sortable: true, align: 'text-center' },
        { name: "Version No", selector: (row) => row.versionNo, sortable: true, align: 'text-center' },
        { name: "Description", selector: (row) => row.description, sortable: true, align: 'text-left' },
        { name: "Patch Date", selector: (row) => row.patchDate, sortable: true, align: 'text-center' },
        { name: "Updated Date", selector: (row) => row.updateDate, sortable: true, align: 'text-center' },
        { name: "Action", selector: (row) => row.action, sortable: true, align: 'text-center', },
      ];

      const auditpatchList = async() =>{
        try {
            const auditPatchList = await getAuditPatchList();
            console.log('auditPatchList',auditPatchList);
            setTableData(auditPatchList);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
      };

      const setTableData = (list) => {
        const mappedData = list.map((item, index) => {
          return{
            sn: index + 1,
            versionNo: item.versionNo || '-',
            description: item.description || '-',
            patchDate: item.patchDate ? format(new Date(item.patchDate), 'dd-MM-yyyy HH:mm:ss') : '-', 
            updateDate: item.createdDate ? format(new Date(item.createdDate), 'dd-MM-yyyy HH:mm:ss') : '-', 
            action: (
             <>
             <button className=" btn btn-outline-warning btn-sm me-1" onClick={() => editAuditPatch(item)} title="Edit"> <i className="material-icons"  >edit_note</i></button>
             </>
            ),
          }
        });
        setTblAuditPatchList(mappedData);
      }
      
      const editAuditPatch = async(item) =>{
        console.log('item',item);
      }
    return(
        <div>
        <Navbar />
        <div className="card">
          <div className="card-body text-center">
            <h3>Audit Patch List</h3>
            <div id="card-body customized-card">
              {<Datatable columns={columns} data={tblAuditPatchList} />}
            </div>
          </div>
        </div>
      </div>
    )
}
export default AuditPatchComponent;