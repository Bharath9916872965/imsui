import { useCallback, useEffect, useState } from "react";
import { getQmVersionRecordDtoList } from "../../../services/qms.service";
import Datatable from "../../datatable/Datatable";
import withRouter from '../../../common/with-router';
import { IconButton} from '@mui/material';
import Navbar from "../../Navbar/Navbar";
import "./qm-revisionrecords.component.css"


const QmRevisionRecordsComponent = ({router}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [versionRecordList, setVersionRecordList] = useState([]);
    const [versionRecordPrintList, setVersionRecordPrintList] = useState([]);


    const { navigate, location } = router;

    useEffect(() => {
        const fetchData = async () => {
          try {
            const VersionRecorList = await getQmVersionRecordDtoList();
            console.log('response--', VersionRecorList)
            const mappedData = VersionRecorList.map((item, index) => ({
              sn: index + 1,
              description: item.description || '-'              || '-',
              // from: 'V' + item[5] + '-R' + item[6] || '-',
              from: index+1 < VersionRecorList.length ? 'I'+VersionRecorList[index+1].issueNo+'-R'+VersionRecorList[index+1].revisionNo : '--',
              to: 'I' + item.issueNo + '-R' + item.revisionNo || '-',
              issueDate: item.dateOfRevision,
              status: item.statusCode || '--',
              action: (
                  <div>
                      {!["APR", "APR-GDDQA", "APR-DGAQA"].includes(item.statusCode) && (
                          <>
                              <button className=" btn btn-outline-warning btn-sm me-1" onClick={() => redirecttoQmDocument(item)} title="Edit"> <i className="material-icons"  >edit_note</i></button>
                              <button className="btn summary-btn-outline btn-sm"  onClick={() => {
                                  // setOpenDialog2(true);
                                  // setSingleDoc(item);
                              }} title="Document Summary"> <i className="material-icons" >summarize</i></button>
                          </>
                      )}
                  </div>
              ),
          }));

          setVersionRecordPrintList(mappedData);
          setVersionRecordList(VersionRecorList);
          setIsLoading(false);

          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
      
        fetchData();
      }, []);

    //   const getDocPDF = (action, versionElements) => {

    //   }

      const redirecttoQmDocument = useCallback((element) => {
        console.log('hhh---')
        navigate('/qm-add-content', { state: { versionElements: element } })
      }, [navigate]);


      const columns = [
        { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
        { name: 'Description', selector: (row) => row.description , sortable: true, grow: 2, align: 'text-center' },
        { name: 'Issue From', selector: (row) => row.from, sortable: true, grow: 2, align: 'text-center' },
        { name: 'Issue To', selector: (row) => row.to, sortable: true, grow: 2, align: 'text-center' },
        { name: 'Date Of Revision', selector: (row) => row.issueDate, sortable: true, grow: 2, align: 'text-center' },
        { name: 'Status', selector: (row) => row.status, sortable: false, grow: 2, align: 'text-center' },
        { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center' },
      ];

    return (

        <div className="card">
          <Navbar/>
            <div className="card-body">
            <h3>QM - Revision Record </h3>
            <div id="card-body customized-card">
                        {isLoading ? (
                            <h3>Loading...</h3>
                        ) : error ? (
                            <h3 color="error">{error}</h3>
                        ) : (
                            <Datatable columns={columns} data={versionRecordPrintList} />
                        )}
                    </div>
            </div>
        </div>

    )

}

export default withRouter(QmRevisionRecordsComponent);