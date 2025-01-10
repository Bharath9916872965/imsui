import React, { useEffect, useState } from "react";
import Datatable from "../datatable/Datatable";
import Navbar from "../Navbar/Navbar";
import Swal from "sweetalert2";
import AlertConfirmation from "../../common/AlertConfirmation.component";
import { getAuditPatchList, updateAuditPatch } from "services/admin.serive";
import { format } from "date-fns";
import { Field, Form, Formik } from "formik";
import { TextField } from "@mui/material";


const AuditPatchComponent = () => {

    const [tblAuditPatchList, setTblAuditPatchList]= useState([]);
    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState({ 
        versionNo: "", 
        description: "", 
    });
    const [auditPatchesId, setAuditPatchesId] = useState('');
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
        setShowModal(true);
        setInitialValues({
            versionNo: item.versionNo,
            description: item.description,
        });
        setAuditPatchesId(item.auditPatchesId);
      }


      const handleSubmit = async (values) => {
        const finalvalue = {
            ...values,
            auditPatchesId,
        };
        const successMessage = "Audit Patch Updated Successfully!" ;
        const unsuccessMessage = "Audit Patch Update Unsuccessful!" ;
        const Title =  "Are you sure to Update ?" ;
        const confirm = await AlertConfirmation({
            title: Title,
            message: '',
        });

        // if (!confirm.isConfirmed) return;
        if (confirm) {
            try {
                const result = await updateAuditPatch(finalvalue);
                if (result === 200) {
                    auditpatchList();
                    setShowModal(false);
                    setInitialValues({
                        versionNo: "",
                        description: "",
                    });
                    Swal.fire({
                        icon: "success",
                        title: '',
                        text: `${successMessage}`,
                        showConfirmButton: false,
                        timer: 2500
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: unsuccessMessage,
                        showConfirmButton: false,
                        timer: 2500
                    });
                }
            } catch (error) {
                console.error('Error Edit Audit Patch :', error);
                Swal.fire('Error!', 'There was an issue Edit Audit Patch Update.', 'error');
            }
        }
    };

    return(
        <div>
        <Navbar />
        <div className="card">
          <div className="card-body text-center">
            <h3>Audit Patch List</h3>
            <div id="card-body customized-card">
              {<Datatable columns={columns} data={tblAuditPatchList} />}
            </div>
            {showModal && (
            <>
              {/* Backdrop */}
              <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
              <div className="modal fade show" style={{ display: "block" }}>
                <div className="modal-dialog modal-lg modal-lg-custom">
                  <div className="modal-content modal-content-custom">
                    <div className="modal-header bg-secondary d-flex justify-content-between text-white modal-header-custom">
                      <h5 className="modal-title">Audit Patch Edit</h5>
                      <button type="button" className="btn btn-danger modal-header-danger-custom" onClick={() => setShowModal(false)}>
                        &times;
                      </button>
                    </div>
                    <div className="modal-body">
                      <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
                      {({ values, setFieldValue }) => (
                        <Form>
                            <div className="row">
                                <div className="col-md-12">
                                    <Field name="versionNo">
                                        {({ field, form }) => (
                                            <TextField
                                                {...field}
                                                label="Version No"
                                                placeholder="Version No"
                                                size="small"
                                                error={Boolean(form.errors.versionNo && form.touched.versionNo)}
                                                helperText={form.touched.versionNo && form.errors.versionNo}
                                                fullWidth
                                                InputProps={{
                                                    inputProps: { maxLength: 990,readOnly: true },
                                                    autoComplete: "off"
                                                }}
                                            />
                                        )}
                                    </Field>
                                </div>
                            </div><br />
                            <div className="row">
                                <div className="col-md-12">
                                    <Field name="description">
                                        {({ field, form }) => (
                                            <TextField
                                                {...field}
                                                label="Description"
                                                multiline
                                                minRows={3}
                                                placeholder="Description"
                                                size="small"
                                                error={Boolean(form.errors.description && form.touched.description)}
                                                helperText={form.touched.description && form.errors.description}
                                                fullWidth
                                                InputProps={{
                                                    inputProps: { maxLength: 990 },
                                                    autoComplete: "off"
                                                }}
                                            />
                                        )}
                                    </Field>
                                </div>
                            </div><br />
                            <div className="col text-center subclass">
                                <button type="submit" className="btn btn-warning">
                                    Update
                                </button>
                            </div>
                        </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          </div>
        </div>
      </div>
    )
}
export default AuditPatchComponent;