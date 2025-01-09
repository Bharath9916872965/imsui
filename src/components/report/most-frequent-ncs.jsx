import React, { useEffect, useState } from "react";
import { getMostFrequentNC,getMostFreqNcDetails } from "../../services/audit.service";
import { Box } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import Datatable from "../datatable/Datatable";
import mostFrequentNcsPdf from "components/prints/qms/mostFrequent-Ncs-print";
const MostFrequentNcs = () => {
  const [filmostFrequentNcsList, setFilmostFrequentNcsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ModalData, setModalData] = useState("");
  const columns = [
    { name: "SN", selector: (row) => row.sn, sortable: true, width: "3%" },
    { name: "Clause No", selector: (row) => row.clauseNo, sortable: true, width: "10%" },
    { name: "Description", selector: (row) => row.description, align: 'text-left', sortable: true, width: "60%", },
    { name: "NC Count", selector: (row) => row.ncCount, sortable: true, width: "10%" },

  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const mostFrequentNcs = await getMostFrequentNC();
         setOfi(mostFrequentNcs);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const toggleModal = async (data) => {
    try {
           // Fetch the most frequent NC details
      const geNctdetails = await getMostFreqNcDetails(data.mocId);
       if (geNctdetails && geNctdetails.length > 0) {
        // Map through all the items and prepare the data
        const modalData = geNctdetails.map((item) => ({
          clauseNo: item.clauseNo || "-",
          carRefNo: item.carRefNo || "-",
          description: item.description || "-",
          carStatus:item.carStatus|| "-",
          auditorRemarks:item.auditorRemarks|| "-"
        }));
  
        // Set the modal data and show the modal
        setModalData(modalData); // Update to pass `modalData` instead of `data`
        setShowModal(true);
        setModalVisible(true);
      } else {
        console.error("No data found in response:", geNctdetails);
      }
    } catch (error) {
      console.error("Error in toggleModal:", error);
    }
  };
  
  
  const setOfi = (list) => {
 
    const mappedData = list.map((item, index) => ({
      sn: index + 1,
      clauseNo: item.clauseNo || "-",
      description: item.description || "-",
      ncCount: (
        <button  style={{background: "linear-gradient(#e95081, #974686)", border: "none",color: "white", padding: "8px 16px",borderRadius: "4px", }}
          onClick={() => toggleModal(item)} // Pass the item to the modal handler
        >
          {item.ncCount || "N/A"} {/* Display "N/A" if ncCount is not available */}
        </button>
      ),
      NcCount: item.ncCount || "-",
    }));

    setFilmostFrequentNcsList(mappedData);
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body text-center">
          <Box display="flex" alignItems="center" gap="10px" className='mg-down-10'>
          <Box flex="10%"></Box>
             <Box flex="10%" className='text-center'>
            <h3>Most Frequent NCs</h3>
          </Box>
               <Box flex="25%">
               <span className="text-heading">&nbsp;   </span>
               <button className=" btn-primary"  onClick={() =>mostFrequentNcsPdf(filmostFrequentNcsList)} title="Print" aria-label="Print checklist" > <i className="material-icons">print</i> </button>
            </Box>
          </Box>
          <div id="card-body customized-card">
            <Datatable columns={columns} data={filmostFrequentNcsList} />
          </div>
        </div>
{/* model open  */}
{showModal && (
         <>
    <div className={`modal-backdrop fade ${modalVisible ? 'show' : ''}`}   onClick={() => toggleModal()} // Close modal when clicking backdrop
      style={{ zIndex: 1040 }} // Ensure backdrop is behind modal
    ></div>

    {/* Modal Content */}
    <div
      className={`modal fade show modal-show-custom ${modalVisible ? 'modal-visible' : ''}`}
      style={{ display: 'block' }} // Ensure modal is visible
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-lg modal-xl-custom">
        <div className="modal-content modal-content-custom"> 
          {/* Modal Header */}
          <div className="modal-header d-flex justify-content-between bg-secondary text-white modal-header-custom">
          <h5 className="modal-title text-center">
          Most Frequent NCs
          </h5>
            <button type="button" className="btn btn-danger modal-header-danger-custom"onClick={() => setShowModal(false)} // Close modal when clicking close button aria-label="Close"
            >
            <span aria-hidden="true">&times;</span>
            </button>
          </div>

     <div className="modal-body">
        {ModalData.length > 0 ? (
    <table style={{width: "100%", borderCollapse: "collapse", marginTop: "10px",}}>
<thead>
  <tr>
  <th className="table-header">
      NC No
    </th>
    <th className="table-header">
      Clause No
    </th>
    <th className="table-header" >
      Description
    </th>
    <th className="table-header" >
    AuditorRemarks
    </th>
    <th className="table-header" >
    Status
    </th>
  </tr>
</thead>

      <tbody>
        
        {ModalData.map((item, index) => (
          <tr  key={index} style={{backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",border: "1px solid #ddd", }} >
            <td  style={{border: "1px solid #ddd",padding: "8px",textAlign: "left"}}>
              {item.carRefNo}
            </td>
            <td   style={{border: "1px solid #ddd",  padding: "8px",  textAlign: "left"}}  >
              {item.clauseNo}
            </td>
            <td   style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}  >
              {item.description}
            </td>
            <td   style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left"}}  >
              {item.auditorRemarks}
            </td>
          <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>
             {({ CAP: "Approved", CRM: "Recommended", FWD: "Forwarded",INI: "Initiated",CRH: "Returned By Head",CMR: "Returned By MR",}[item.carStatus] || item.carStatus)}
          </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No data available.</p>
  )}
</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary"  onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)}
{/* model close  */}
      </div>
    </div>
  );
};

export default MostFrequentNcs;
