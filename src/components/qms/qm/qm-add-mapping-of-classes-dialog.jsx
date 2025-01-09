import React, { useEffect, useState } from "react";
import { addMappingOfClasses, getMocListById, getQmMocExcel } from "../../../services/qms.service";
import * as XLSX from 'xlsx';
import AlertConfirmation from "../../../common/AlertConfirmation.component";

const QmAddMappingOfClassesDialog = ({ open, onClose, revisionRecordId,statusCode }) => {
  const [data, setData] = useState([]);
  const [isThereAnyFile, setIsThereAnyFile] = useState(false);

  console.log('statusCode',statusCode);
  useEffect(() => {
    const fetchData = async () => {
      const mocList = await getMocListById(revisionRecordId,statusCode);
      console.log('mocList',mocList);
      setData(mocList);
    }
    fetchData();
  }, []);

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });

        // Grab the first sheet
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        // Convert the sheet to JSON
        const sheetData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        // Check for the correct header values
        if (sheetData[0][0] !== 'QM Section No.' || sheetData[0][2] !== 'Description') {
          setData([]);
          setIsThereAnyFile(false);
          Swal.fire({
            icon: "alert",
            title: "Please choose correct excel!",
            showConfirmButton: true,
            timer: 2000
          });
        } else {
          setData(sheetData);
          setIsThereAnyFile(true);
        }
      };

      reader.readAsBinaryString(file);
    }
  };


  const downloadQmMocExcel = async () => {
    const blob = await getQmMocExcel();

    if (blob instanceof Blob) {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Mapping_of_classes.xlsx';
        link.click();
    } else {
        console.error('The response is not a valid blob:', blob);
    }
};

  
  

  const submitMappingOfClasses = async () => {

    const isConfirmed = await AlertConfirmation({
      title: 'Are you sure to submit ?',
      message: '',
    });

    if (isConfirmed) {

      let res = await addMappingOfClasses(data, revisionRecordId);

      if (res && res > 0) {
        Swal.fire({
          icon: "success",
          title: "MOC Submitted Successfully!",
          showConfirmButton: false,
          timer: 1500
        });

        onClose(false)
      } else {
        Swal.fire({
          icon: "success",
          title: "MOC Submit Unsuccessful!",
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  };

  return (

    <>
      <div>
        {open && (
          <div className={`modal ${open ? 'show' : ''}`} style={{ display: open ? 'block' : 'none' }} tabIndex="-1" onClick={() => { onClose(false) }} >
            <div className="modal-dialog modal-dialog-centered modal-xl" onClick={(e) => e.stopPropagation()} >
              <div className="modal-content">
                <div className="modal-header bg-secondary text-white d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="modal-title">Mapping Of Clauses</h5>
                  </div>
                  <div>
                    <button type="button" className="modal-close" onClick={() => onClose(false)}>
                      <i className="material-icons">close</i>
                    </button>
                  </div>
                </div>
                <div className="modal-body">
                  <br />
                  <div>

                    {/* <hr /> */}

                    <div>
                      {/* <div className="d-flex mb-3 gap-3">
                        <div className="fw-bold">
                          <h4>Choose Mapping Of Clauses file</h4>
                        </div>

                        <div style={{ flex: "40%" }}>
                          <input
                            type="file"
                            id="file1"
                            onChange={onFileChange}
                            style={{ padding: "0px 16px" }}
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            required
                          />
                        </div>

                        <div style={{ flex: "30%" }}>
                          <button
                            className="btn text-success"
                            title="Download Format"
                            onClick={downloadQmMocExcel}
                          >
                            <i className="material-icons">file_download</i>
                          </button>
                        </div>
                      </div> */}

                      <div>
                        <table className="table table-striped table-hover">
                          {data.length > 1 && !isThereAnyFile && (
                            <thead>
                              <tr>
                                <th>QM Section No.</th>
                                <th>ISO 9001:2015 Clause. No.</th>
                                <th>Description</th>
                              </tr>
                            </thead>
                          )}
                          <tbody>
                            {data.map((row, i) => (
                              <tr className="table-active" key={i}>
                                <td style={{ fontWeight: "normal", textAlign: "left" }} >
                                    {row[0]}
                                  </td>
                                <td style={{ fontWeight: "normal", textAlign: "left" }} >
                                    {row[1]}
                                  </td>
                                <td style={{ fontWeight: "normal", textAlign: "left" }} >
                                    {row[2]}
                                  </td>
                                {/* {row.map((val, j) => (
                                  <td style={{ fontWeight: "normal", textAlign: "left" }} key={j}>
                                    {val}
                                  </td>
                                ))} */}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div align="center" className="mt-3">
                        {isThereAnyFile && (
                          <button
                            className="btn btn-primary"
                            onClick={submitMappingOfClasses}
                          >
                            Upload
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
        {open && <div className="modal-backdrop fade show"></div>}
      </div>

    </>
  );
};

export default QmAddMappingOfClassesDialog;
