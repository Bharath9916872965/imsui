import {  useEffect, useState } from 'react';
import { addNewChapter,CheckListMaster,getMocTotalList } from 'services/audit.service';
import './check-list.css';
import AlertConfirmation from "common/AlertConfirmation.component";

const AddChecklistSectionDialog = ({ open, onClose,onConfirm,list }) => {

    const [inputValue, setInputValue] = useState('');
    const [filCharecterList,setFilCharecterList] = useState([]);
    const [mocIds, setMocIds] = useState([]);
    const [maxSectionNo,setMaxSectionNo] = useState('');

    useEffect (()=>{
        if(list && list.length >0){
            setMaxSec(list)
            setFilCharecterList(list.filter(obj => obj.mocParentId === 0 && Number(obj.clauseNo) === Number(obj.sectionNo) && obj.isActive === 1))
        }
    },[list])

    const afterSubmit = async()=>{
        try {
            const allChapters = await getMocTotalList();
            const filterChapters = allChapters.filter(obj => obj.mocParentId === 0 && Number(obj.clauseNo) === Number(obj.sectionNo) && obj.isActive === 1)
            if(allChapters.length >0){
                setMaxSec(allChapters)
            }
            setFilCharecterList(filterChapters);
    
        } catch (error) {
            console.error(error)
        }
    }

    const setMaxSec = (list)=>{
        const mainChapters = list.filter(obj => Number(obj.clauseNo) === Number(obj.sectionNo) && obj.isActive === 1);
        setMaxSectionNo(mainChapters[mainChapters.length -1].sectionNo)
      }

    const submitNewChapter = async()=>{

        const isConfirmed = await AlertConfirmation({
            title: 'Are you sure to Add New Chapter ?',
            message: '',
        });

        if (isConfirmed) {
            const response = await addNewChapter(new CheckListMaster(0,inputValue,Number(maxSectionNo)+1,0,''));
            if (response && response  === 'Successfully') {
                setInputValue('')
                afterSubmit();
                Swal.fire({
                    icon: "success",
                    title: "New Chapter Added Successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "New Chapter Added Unsuccessful!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    }

    const handleClose = ()=>{
        setMocIds([])
        onClose(false)
    }

    const handleConfirm = () => {
        if (onConfirm) onConfirm(mocIds);
    };

    const handleCheckboxChange = (id, event) => {
        if (event.target.checked) {
            setMocIds([...mocIds, id]);
        } else {
            setMocIds(mocIds.filter((val) => val !== id));
        }
    };
    return (
        <>
         {open && (
          <div>
           <div className={`modal ${open ? 'show' : ''}`} style={{ display: open ? 'block' : 'none' }} tabIndex="-1" onClick={handleClose} >
            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
             <div className="modal-content">
              <div className="modal-header bg-secondary text-white d-flex justify-content-between align-items-center">
               <div><h5 className="modal-title">Choose Additional Chapter</h5></div>
               <div><button type="button" className="modal-close" onClick={handleClose}><i className="material-icons">close</i></button></div>
              </div>
              <div className="modal-body">
               <table className="table table-responsive">
                <thead className="table-light">
                 <tr>
                    <th scope="col" className="text-center">Select</th>
                    <th scope="col" className="text-center">Section</th>
                 </tr>
                </thead>
                <tbody>
                 {filCharecterList.map((obj) => (
                  <tr key={obj.mocId} className="table-active">
                    <td className="text-center"><input type="checkbox" name="SectionIds" value={obj.mocId+'#'+obj.sectionNo} onChange={(event) => handleCheckboxChange(obj.mocId+'#'+obj.sectionNo, event)}/></td>
                    <td className="text-start"><input type="text" className="form-control w-75" value={obj.description} readOnly /></td>
                  </tr>
                 ))}
                 <tr className="table-active">
                  <td className="text-center"><button onClick={() => submitNewChapter()} className="btn btn-primary" disabled={!inputValue.trim()}>Add</button></td>
                  <td className="text-start"><input type="text" className="form-control w-75" value={inputValue} placeholder="Enter new section" onChange={(e) => setInputValue(e.target.value)}/></td>
                 </tr>
                </tbody>
               </table>
               <div className="text-center"><button onClick={() => handleConfirm()} className="btn btn-success" disabled={mocIds.length === 0}>Submit</button></div>
              </div>
             </div>
            </div>
           </div>
           {open && <div className="modal-backdrop fade show"></div>}
          </div>
         )}
        </>
    );
};

export default AddChecklistSectionDialog;
