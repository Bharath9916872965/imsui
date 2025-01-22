import React, { useEffect, useState } from "react";
import Datatable from "../datatable/Datatable";
import Navbar from "../Navbar/Navbar";
import Swal from "sweetalert2";
import AlertConfirmation from "../../common/AlertConfirmation.component";
import { downloadAuditAttach, getAuditPatchList, updateAuditPatch } from "services/admin.serive";
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

    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
      const file = event.target.files[0];
  
      if (file) {
          const allowedExtensions = ['.txt', '.sql'];
          const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
          const maxFileSize = 100 * 1024; // 100 KB in bytes
  
          // Check file extension
          if (!allowedExtensions.includes(fileExtension)) {
              Swal.fire({
                  icon: 'error',
                  title: 'Invalid File Type',
                  text: 'Please upload only .txt or .sql files.',
              });
              event.target.value = ''; // Reset the file input
              return;
          }
  
          // Check file size
          if (file.size > maxFileSize) {
              Swal.fire({
                  icon: 'error',
                  title: 'File Too Large',
                  text: 'The file size must not exceed 100 KB.',
              });
              event.target.value = ''; // Reset the file input
              return;
          }
  
          // If the file passes all checks, update state
          setFile(file);
      }
  };

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
             {item.attachment && (
              <button className="btn btn-outline-success btn-sm me-1" onClick={() => handleDownload(item)} title="Download">
              <i className="material-icons">file_download</i>
              </button>
             )}
             </>
            ),
          }
        });
        setTblAuditPatchList(mappedData);
      }
      
      const handleDownload = async(item) =>{
        const downloadAttach = await downloadAuditAttach(item);
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
        const finalValue = {
            ...values,
            auditPatchesId,
        };
    
        const successMessage = "Audit Patch Updated Successfully!";
        const unsuccessMessage = "Audit Patch Update Unsuccessful!";
        const Title = "Are you sure to Update ?";
        
        const confirm = await AlertConfirmation({
            title: Title,
            message: '',
        });
    
        if (confirm) {
            try {
                // Collect the file input
                const fileInput = document.querySelector('input[type="file"]'); // Assuming your file input is <input type="file">
                const file = fileInput ? fileInput.files[0] : null;
    
                // Construct FormData
                const formData = new FormData();
                formData.append('file', file); // Add the file to FormData
                formData.append('versionNo', finalValue.versionNo); // Add other fields
                formData.append('description', finalValue.description);
                formData.append('auditPatchesId', finalValue.auditPatchesId);
    
                const result = await updateAuditPatch(formData);
    
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
                console.error('Error Edit Audit Patch:', error);
                Swal.fire('Error!', 'There was an issue with the Edit Audit Patch Update.', 'error');
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
                <div className="modal-dialog modal-lg modal-lg-custom" >
                  <div className="modal-content modal-content-custom" >
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
                                <div className="col-md-6">
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
                                <div className="col-md-6">
                                  <Field name="file">
                                    {({ field, form }) => (
                                      <>
                                        <input
                                          id="file"
                                          name="file"
                                          type="file"
                                          className="form-control"
                                          onChange={handleFileChange}
                                        />
                                        {form.errors.file && form.touched.file && (
                                          <div className="invalid-feedback d-block">
                                            {form.errors.file}
                                          </div>
                                        )}
                                      </>
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
                            </div><br/>
                            <div className="col text-start">
                              <span style={{color:'red'}}>*Please attach .sql or .txt file only</span><br/>
                              <span style={{color:'red'}}>*Attachment size should be less than 100KB</span>
                            </div>
                            <div className="col text-center" style={{marginTop:"70px"}}>
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