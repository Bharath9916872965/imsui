import React, { useEffect, useRef, useState } from 'react';
import './qm-add-doc-content.component.css';
import Navbar from 'components/Navbar/Navbar';
import { addNewAbbreviations, getAbbreviationsByIdNotReq, getDwpRevistionRecordById, getQmRevistionRecordById, getQspRevistionRecordById, updateDwpNotReqAbbreviationIds, updateNotReqAbbreviationIds, updateQspNotReqAbbreviationIds } from 'services/qms.service';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import AlertConfirmation from 'common/AlertConfirmation.component';
import withRouter from 'common/with-router';
import Swal from 'sweetalert2';


const AbbreviationMaster = ({ router }) => {

  const { navigate, location } = router
  const revisionData = location.state?.revisionData;
  const docType = location.state?.docType;
  const [abbreviationList, setAbbreviationList] = useState([].sort());
  const [deletedItems, setDeletedItems] = useState([[], [], []]);
  const [selectedItems, setSelectedItems] = useState({ 0: [], 1: [], 2: [] });
  const [showModal, setShowModal] = useState(false);
  const [filteredLetter, setFilteredLetter] = useState("");
  const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteSearchQuery, setDeleteSearchQuery] = useState('');
  const [rows, setRows] = useState([{ abbreviation: "", meaning: "" }]);
  const [allAbbreviationList, setAllAbbreviationList] = useState([]);
  const [isSubmit, setIsSubmit] = useState(null);
  const qspDoc = ['QSP1', 'QSP2', 'QSP3', 'QSP4', 'QSP5', 'QSP6', 'QSP7', 'QSP8'];
  
  useEffect(() => {
    getAbbreviationsList();
  }, []);

const getAbbreviationsList = async () => {
    try {
        let list = await getAbbreviationsByIdNotReq("0");
        setAllAbbreviationList(list);
        let revistionRecord;
        if(docType === 'QM'){
          revistionRecord = await getQmRevistionRecordById(revisionData.revisionRecordId);
        }else if(docType === 'DWP' || docType === 'GWP'){
          revistionRecord = await getDwpRevistionRecordById(revisionData.revisionRecordId);
        }else if(qspDoc.includes(docType)){
           revistionRecord = await getQspRevistionRecordById(revisionData.revisionRecordId);
        }
        let abbreviationIds = revistionRecord.abbreviationIdNotReq ? revistionRecord.abbreviationIdNotReq.split(",") : ["0"];
        const mainlist = list.filter((item) => !abbreviationIds.includes(item.abbreviationId));
        let deletedList = list.filter((item) =>
          abbreviationIds.some((id) => String(id) === String(item.abbreviationId))
        );
        const columns = chunkArray(deletedList, 3);
        setAbbreviationList(mainlist);
        setDeletedItems(columns);
    } catch (error) {
        setError('An error occurred');
    }
};

const chunkArray = (array, chunks) => {
  const result = [];
  for (let i = 0; i < chunks; i++) {
    result.push([]);
  }
  array.forEach((item, index) => {
    result[index % chunks].push(item);
  });
  return result;
};

const handleDelete = async (abbreviationId) => {

  let revistionRecord;
  if(docType === 'QM'){
    revistionRecord = await getQmRevistionRecordById(revisionData.revisionRecordId);
  }else if(docType === 'DWP' || docType === 'GWP'){
    revistionRecord = await getDwpRevistionRecordById(revisionData.revisionRecordId);
  }else if(qspDoc.includes(docType)){
     revistionRecord = await getQspRevistionRecordById(revisionData.revisionRecordId);
  }

  let cleanAbbreviationIdNotReq = [];
  cleanAbbreviationIdNotReq = revistionRecord.abbreviationIdNotReq ? revistionRecord.abbreviationIdNotReq.split(",").map(Number) : [0];
  const combinedData = [...cleanAbbreviationIdNotReq, abbreviationId];
  combinedData.sort((a, b) => a - b);

  const isConfirmed = await AlertConfirmation({
    title: 'Are you sure to delete?',
    message: '',
  });
  if (isConfirmed) {
      let res;
      if(docType === 'DWP' || docType === 'GWP'){
        res = await updateDwpNotReqAbbreviationIds(combinedData + '', revisionData.revisionRecordId + '');
      }else if(docType === 'QM'){
        res = await updateNotReqAbbreviationIds(combinedData + '', revisionData.revisionRecordId + '');
      }else if(qspDoc.includes(docType)){
        res = await updateQspNotReqAbbreviationIds(combinedData + '', revisionData.revisionRecordId + '');
      }
      if (res && res > 0) {
          Swal.fire({
              icon: "success",
              title: "Deleted",
              text: "Abbreviation Deleted Successfully!",
              showConfirmButton: false,
              timer: 1500
          });
          const updatedAbbreviationList = abbreviationList.filter(
            (item) => item.abbreviationId !== abbreviationId
          );
          setAbbreviationList(updatedAbbreviationList);
      
          const deletedItem = abbreviationList.find(
            (item) => item.abbreviationId === abbreviationId
          );
      
          if (deletedItem) {
            setDeletedItems((prev) => {
              // Determine the next column with the least number of items
              const nextColumnIndex =
                prev[0].length <= prev[1].length && prev[0].length <= prev[2].length
                  ? 0
                  : prev[1].length <= prev[2].length
                  ? 1
                  : 2;
              // Create a copy of the current deletedItems
              const updated = [...prev];
              // Add the deleted item to the appropriate column
              updated[nextColumnIndex] = [...updated[nextColumnIndex], deletedItem];
              return updated;
            });
          }
      } else {
          Swal.fire({
              icon: "error",
              title: "Error",
              text:"Abbreviation Delete Unsuccessful!",
              showConfirmButton: false,
              timer: 1500
          });
      }
  }
};


  const handleFilterByLetter = (letter) => {
    setFilteredLetter(letter);
  };

  const handleResetFilter = () => {
    setFilteredLetter("");
  };

  const filteredList = abbreviationList.filter((abbr) => {
    const matchesLetter =
      !filteredLetter || abbr.meaning.startsWith(filteredLetter);
    const matchesSearch = !searchQuery || abbr.meaning.toLowerCase().includes(searchQuery.toLowerCase()) || abbr.abbreviation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLetter && matchesSearch;
  });

  const handleSelectAll = (colIndex) => {
    const isAllSelected = selectedItems[colIndex].length === deletedItems[colIndex].length;
    const newSelectedItems = { ...selectedItems };
    newSelectedItems[colIndex] = isAllSelected ? [] : [...deletedItems[colIndex]];
    setSelectedItems(newSelectedItems);
  };



  const handleCheckboxChange = (colIndex, item) => {
    const newSelectedItems = { ...selectedItems };
    if (newSelectedItems[colIndex].includes(item)) {
      newSelectedItems[colIndex] = newSelectedItems[colIndex].filter((i) => i !== item);
    } else {
      newSelectedItems[colIndex].push(item);
    }
    setSelectedItems(newSelectedItems);
  };

  const handleAddBack = async (e) => {
    e.preventDefault();

    const arr = [];
    for(var i in selectedItems){
      for(var j in selectedItems[i]){
       arr.push(selectedItems[i][j].abbreviationId)
     }
   }

    if (!arr.length) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select at least one record",
      });
      return;
    }

    let revistionRecord;
    if(docType === 'QM'){
      revistionRecord = await getQmRevistionRecordById(revisionData.revisionRecordId);
    }else if(docType === 'DWP' || docType === 'GWP'){
      revistionRecord = await getDwpRevistionRecordById(revisionData.revisionRecordId);
    }else if(qspDoc.includes(docType)){
       revistionRecord = await getQspRevistionRecordById(revisionData.revisionRecordId);
    }

    const abbIdNotReq = revistionRecord.abbreviationIdNotReq ? revistionRecord.abbreviationIdNotReq.split(",").map(Number) : [0] ;
    const combinedIds = abbIdNotReq
                        .filter((id) => !arr.includes(id))
                        .sort((a, b) => a - b)
                        .concat([0])
                        .slice(0, Math.max(1, abbIdNotReq.filter((id) => !arr.includes(id)).length));
                        
    const isConfirmed = await AlertConfirmation({
      title: 'Are you sure to add ?',
      message: '',
    });
    if (isConfirmed) {
    let res;
    if(docType === 'DWP' || docType === 'GWP'){
       res = await updateDwpNotReqAbbreviationIds(combinedIds + '', revisionData.revisionRecordId + '');
    }else if(docType === 'QM'){
      res = await updateNotReqAbbreviationIds(combinedIds + '', revisionData.revisionRecordId + '');
    }else if(qspDoc.includes(docType)){
      res = await updateQspNotReqAbbreviationIds(combinedIds + '', revisionData.revisionRecordId + '');
    }
    if (res && res > 0) {
        Swal.fire({
            icon: "success",
            title: "Added",
            text: "Abbreviation Added to List Successfully!",
            showConfirmButton: false,
            timer: 1500
        });
        const newList = [...abbreviationList];
        const updatedDeletedItems = deletedItems.map((column, columnIndex) => {
          const remainingItems = column.filter(
            (item) => !selectedItems[columnIndex].includes(item)
          );
          selectedItems[columnIndex].forEach((item) => {
            if (!newList.includes(item)) newList.push(item);
          });
          return remainingItems;
        });
        setAbbreviationList(newList.sort());
        setDeletedItems(updatedDeletedItems);
        setSelectedItems({ 0: [], 1: [], 2: [] });
    } else {
      Swal.fire({
          icon: "error",
          title: "Error",
          text: "Abbreviation Add Unsuccessfulll!",
          showConfirmButton: false,
          timer: 1500
      });
    }
   }
  };

  const handleAddNew = () => {
    setRows([{ abbreviation: "", meaning: "" }]);
    setShowModal(true);
  };

  const handleClose = () => {
    setRows([{ abbreviation: "", meaning: "" }]);
    setShowModal(false);
  };

  const handleAddRow = () => {
    setRows([...rows, { abbreviation: "", meaning: "" }]);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };


  const handleInputChange = (index, field, value) => {
    // if (field === 'abbreviation' || field === 'meaning') {
    //   Swal.fire("Warning", `Abbreviation or Description should not be blank!`, "warning");
    //   setIsSubmit(false);
    //   return;
    // }
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleBlurValidation = (index, value) => {
    // if (!value.trim()) {
    //   setIsSubmit(false);
    //   Swal.fire("Warning", `Abbreviation should not be blank!`, "warning");
    //   return;
    // }
  
    if (allAbbreviationList?.length > 0) {
      const isDuplicate = allAbbreviationList.some(
        (data) => data.abbreviation?.toLowerCase() === value.trim().toLowerCase()
      );
  
      if (isDuplicate) {
        Swal.fire("Warning", `${value} Abbreviation Already Exists!`, "warning");
        setIsSubmit(false);
        return;
      }
    }
  
    const updatedRows = [...rows];
    setIsSubmit(true);
    setRows(updatedRows);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const abbreData = {
      abbreviationDetails:rows,
      revisionRecordId: revisionData.revisionRecordId || null,
      docName:docType,
    };
    const isConfirmed = await AlertConfirmation({
      title: 'Are you sure to add ?',
      message: '',
    });
    if (isConfirmed) {
    let res = await addNewAbbreviations(abbreData);
    if (res && res > 0) {
        Swal.fire({
            icon: "success",
            title: "Added",
            text: "Abbreviation Added Successfully!",
            showConfirmButton: false,
            timer: 1500
        });
        getAbbreviationsList();
        handleClose();
    } else {
      Swal.fire({
          icon: "error",
          title: "Error",
          text: "Abbreviation Add Unsuccessfulll!",
          showConfirmButton: false,
          timer: 1500
      });
    }
   }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div>
    <Navbar></Navbar>
    <div className="container-fluid mt-4 p-4">
      <div className="row">
        {/* Left Side Div */}
        
        <div
          className="col-md-1 d-flex flex-column align-items-center border rounded p-3 aplhabet-abbre"
        >
          {alphabet.map((letter) => (
            <div
              key={letter}
              className="text-center py-2 px-3 border mb-1 w-100"
              style={{
                cursor: "pointer",
                backgroundColor: filteredLetter === letter ? "red" : "white",
                color: filteredLetter === letter ? "white" : "black"
              }}
              onClick={() =>
                letter === "#" ? handleResetFilter() : handleFilterByLetter(letter)
              }
            >
              {letter === "#" ? 'ALL' : letter}
            </div>
          ))}
        </div>

      <div className="col-md-4">
          <h4>Abbreviation List</h4>
          <div className="d-flex justify-content-end mb-3">
            <input
              type="text"
              placeholder="Search"
              className="form-control abbresearch w-20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div
            className="border rounded p-3 overflow-auto card-delete"
          >
            {filteredList.map((abbr, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center border-bottom py-2 abbreclass"
              >
                <span>{abbr.abbreviation} - {abbr.meaning}</span>
                <button
                  className="btn btn-sm btn-danger abbredelete"
                  onClick={() => handleDelete(abbr.abbreviationId)}
                >
                  <FaTrash/>
                </button>
              </div>
            ))}
            {filteredList.length === 0 && (
              <p className="text-center text-muted">No items found</p>
            )}
          </div>
          <button
            className="btn btn-primary mt-3"
            onClick={handleAddNew}
          >
            ADD NEW
          </button>
        </div>

        {/* Right Side Div */}
       <div className="col-md-7">
      <h4>Deleted Abbreviations</h4>
      <div className="row">
        <div className="d-flex justify-content-end mb-3">
          <input
            type="text"
            placeholder="Search"
            className="form-control abbresearch w-20"
            value={deleteSearchQuery}
            onChange={(e) => setDeleteSearchQuery(e.target.value)}
          />
        </div>
        {deletedItems.map((column, colIndex) => (
          <div key={colIndex} className="col-md-4">
            <div
              className="border rounded p-3 overflow-auto border-bottom card-delete"
            >
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`selectAll-${colIndex}`}
                  onChange={() => handleSelectAll(colIndex)}
                  checked={
                    selectedItems[colIndex].length === deletedItems[colIndex].length &&
                    deletedItems[colIndex].length > 0
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor={`selectAll-${colIndex}`}
                >
                  Select All
                </label>
              </div>
              <hr />
              {column
                .filter((item) =>
                  item.meaning.toLowerCase().includes(deleteSearchQuery.toLowerCase()) ||
                  item.abbreviation.toLowerCase().includes(deleteSearchQuery.toLowerCase())
                )
                .map((item, rowIndex) => (
                  <div key={rowIndex} className="form-check border-bottom py-2 abbrename">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`item-${colIndex}-${rowIndex}`}
                      checked={selectedItems[colIndex].includes(item)}
                      onChange={() => handleCheckboxChange(colIndex, item)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`item-${colIndex}-${rowIndex}`}
                    >
                     {item.abbreviation} - {item.meaning}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className='mt-3'>
        <button className="btn btn-success" onClick={handleAddBack}>
          ADD TO LIST
        </button>
        <button
            onClick={goBack}
            className="btn btn-info ms-1"
        >
            BACK
        </button>
      </div>
    </div>
      </div>

      {/* Modal */}
      {showModal && (
            <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" onClick={() => { setShowModal(false) }} >
                <div className="modal-dialog modal-dialog modal-xl" onClick={(e) => e.stopPropagation()} >
                    <div className="modal-content">
                        <div className="modal-header bg-secondary text-white d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="modal-title">Add New Abbreviation</h5>
                            </div>
                            <div>
                                <button type="button" className="modal-close" onClick={() => setShowModal(false)}>
                                    <i className="material-icons">close</i>
                                </button>
                            </div>
                        </div>
                        <div className="modal-body">
                            {rows.map((row, index) => (
                              <div className="row mb-2" key={index}>
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    className="form-control w-100"
                                    placeholder="Abbreviation"
                                    value={row.abbreviation}
                                    onChange={(e) => handleInputChange(index, "abbreviation", e.target.value)}
                                    onBlur={(e) => handleBlurValidation(index, e.target.value)}
                                  />
                                </div>
                                <div className="col-md-7">
                                  <input
                                    type="text"
                                    className="form-control w-100"
                                    placeholder="Description"
                                    value={row.meaning}
                                    onChange={(e) => handleInputChange(index, "meaning", e.target.value)}
                                  />
                                </div>
                                <div className="col-md-1">
                                  <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleAddRow}
                                  >
                                    <FaPlus/>
                                  </button>
                                </div>
                                <div className="col-md-1">
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleRemoveRow(index)}
                                    disabled={rows.length === 1} 
                                  >
                                    <FaMinus/>
                                  </button>
                                </div>
                              </div>
                            ))}
                            <br />
                            <div align='center'>
                                <button   onClick={handleSubmit} variant="contained" className='submit' disabled={!isSubmit}>
                                    Submit
                                </button>
                            </div>
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        )}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
    </div>
  );
};

export default withRouter(AbbreviationMaster);
