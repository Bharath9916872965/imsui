import React, { useEffect, useRef, useState } from 'react';
import './qm-add-doc-content.component.css';
import Navbar from 'components/Navbar/Navbar';
import { getAbbreviationsByIdNotReq, updateNotReqAbbreviationIds } from 'services/qms.service';
import { FaTrash } from 'react-icons/fa';
import AlertConfirmation from 'common/AlertConfirmation.component';


function AbbreviationModal(props) {

  const revisionData = props?.revisionData;
  const [abbreviationList, setAbbreviationList] = useState([].sort());
  const [deletedItems, setDeletedItems] = useState([[], [], []]);
  const [selectedItems, setSelectedItems] = useState({ 0: [], 1: [], 2: [] });
  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [filteredLetter, setFilteredLetter] = useState("");
  const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteSearchQuery, setDeleteSearchQuery] = useState('');


  
useEffect(() => {
  getAbbreviationsList();
}, []);

const getAbbreviationsList = async () => {
    try {
        let list = await getAbbreviationsByIdNotReq("0");
        const mainlist = list.filter((item) => !revisionData.abbreviationIdNotReq.includes(item.abbreviationId));
        let deletedList = list.filter((item) => revisionData.abbreviationIdNotReq.includes(item.abbreviationId));
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

  let cleanAbbreviationIdNotReq = [];
  if (typeof revisionData.abbreviationIdNotReq === "string") {
    cleanAbbreviationIdNotReq = revisionData.abbreviationIdNotReq.split(",").map(Number);
  } else {
    console.warn("Unexpected data type for abbreviationIdNotReq:", revisionData.abbreviationIdNotReq);
  }
  const combinedData = [...cleanAbbreviationIdNotReq, abbreviationId];
  const isConfirmed = await AlertConfirmation({
    title: 'Are you sure to delete?',
    message: '',
  });
  if (isConfirmed) {
    let res = await updateNotReqAbbreviationIds(combinedData + '', revisionData.revisionRecordId + '');
      if (res && res > 0) {
          Swal.fire({
              icon: "success",
              title: "Abbreviation Deleted Successfully!",
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
              title: "Abbreviation Delete Unsuccessful!",
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

  const handleAddBack = async () => {
    const isConfirmed = await AlertConfirmation({
      title: 'Are you sure to add ?',
      message: '',
    });
    if (isConfirmed) {
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
   }
  };

  const handleAddNewItem = () => {
    if (newCode && !abbreviationList.includes(newCode)) {
      setAbbreviationList([...abbreviationList, newCode].sort());
    }
    setNewCode("");
    setNewDescription("");
    setShowModal(false);
  };

  return (
    <div>
    <Navbar></Navbar>
    <div className="container-fluid mt-4 p-4">
      <div className="row">
        {/* Left Side Div */}
        
        <div
          className="col-md-1 d-flex flex-column align-items-center border rounded p-3"
          style={{
            height: "555px",
            overflowY: "scroll",
            marginTop: "31px",
            scrollbarWidth: "thin",
            msOverflowStyle: "none",
            background:"#d2d2d2"
          }}
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
          <h5>Abbreviation List</h5>
          <div className="d-flex justify-content-end mb-3">
            <input
              type="text"
              placeholder="Search"
              className="form-control w-20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div
            className="border rounded p-3 overflow-auto"
            style={{ height: "500px", scrollbarWidth: "thin" }}
          >
            {filteredList.map((abbr, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center border-bottom py-2 abbreclass"
              >
                <span>{abbr.meaning} ({abbr.abbreviation})</span>
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
            onClick={() => setShowModal(true)}
          >
            Add
          </button>
        </div>

        {/* Right Side Div */}
       <div className="col-md-7">
      <h5>Deleted Items</h5>
      <div className="row">
        <div className="d-flex justify-content-end mb-3">
          <input
            type="text"
            placeholder="Search"
            className="form-control w-20"
            value={deleteSearchQuery}
            onChange={(e) => setDeleteSearchQuery(e.target.value)}
          />
        </div>
        {deletedItems.map((column, colIndex) => (
          <div key={colIndex} className="col-md-4">
            <div
              className="border rounded p-3 overflow-auto"
              style={{ height: "500px" }}
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
                  <div key={rowIndex} className="form-check border-bottom py-2">
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
                      {item.meaning} ({item.abbreviation})
                    </label>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-success mt-3" onClick={handleAddBack}>
        Add Back
      </button>
    </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Abbreviation</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="abbreviationCode" className="form-label">
                    Abbreviation Code
                  </label>
                  <input
                    type="text"
                    id="abbreviationCode"
                    className="form-control"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    className="form-control"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddNewItem}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default AbbreviationModal;
