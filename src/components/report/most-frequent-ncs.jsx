import React, { useEffect, useState } from "react";
import { getMostFrequentNC } from "../../services/audit.service";
import { Box } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import Datatable from "../datatable/Datatable";
import mostFrequentNcsPdf from "components/prints/qms/mostFrequent-Ncs-print";
const MostFrequentNcs = () => {
  const [filmostFrequentNcsList, setFilmostFrequentNcsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { name: "SN", selector: (row) => row.sn, sortable: true, width: "3%" },
    // { name: "Section No", selector: (row) => row.sectionNo, sortable: true, width: "10%" },
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

  const setOfi = (list) => {
    
    const mappedData = list.map((item, index) => ({
      sn: index + 1,
      // sectionNo: item.sectionNo || "-",
      clauseNo: item.clauseNo || "-",
      description: item.description || "-",
      ncCount: item.ncCount || "-",
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
      </div>
    </div>
  );
};

export default MostFrequentNcs;
