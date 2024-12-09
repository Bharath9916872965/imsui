import { useEffect, useState } from 'react';
import { addNewDwpSection, dwpUnAddListToAddList, getDwpUnAddedChapters,  } from 'services/qms.service';
// import QaQtDocSections from '../Models/QaQtDocSections';

import './dwp-add-doc-content.component.css';
import AlertConfirmation from 'common/AlertConfirmation.component';

const DwpAddSectionDialog = ({ open, onClose, revisionElements }) => {
    const [error, setError] = useState(null);
    const [unAddedChapterList, setUnAddedChapterList] = useState([]);
    const [sectionIds, setSectionIds] = useState([]);
    const [newSectionName, setNewSectionName] = useState('');
    const [qmsDocTypeDto, setQmsDocTypeDto] = useState(null);


    useEffect(() => {


        const fetchData = async () => {

            const qmsDocTypeDto = {
                docType: revisionElements.docType,
                groupDivisionId:revisionElements.groupDivisionId
            }

            setQmsDocTypeDto(qmsDocTypeDto);

            try {
                setUnAddedChapterList([]);
                setSectionIds([]);
                setNewSectionName('');

                getUnAddedChapterlist(qmsDocTypeDto);
            } catch (error) {
                setError('An error occurred');
            }
        };
        if (open) fetchData();
    }, [open]);

    const getUnAddedChapterlist = async (qmsDocTypeDto) => {
        try {
            let unAddedChapterList = await getDwpUnAddedChapters(qmsDocTypeDto);
            setUnAddedChapterList(unAddedChapterList);
        } catch (error) {
            setError('An error occurred');
        }
    };

    const handleCheckboxChange = (id, event) => {
        if (event.target.checked) {
            setSectionIds([...sectionIds, id]);
        } else {
            setSectionIds(sectionIds.filter((val) => val !== id));
        }
    };


    const submitNewChapter = async () => {
        const isConfirmed = await AlertConfirmation({
            title: 'Are you sure to add ?',
            message: '',
        });

        var dwpSectionDto = {
            sectionName: newSectionName,
            docType: revisionElements.docType,
            groupDivisionId: revisionElements.groupDivisionId,
        }

        if (isConfirmed) {
            let res = await addNewDwpSection(dwpSectionDto);
            if (res && res > 0) {
                getUnAddedChapterlist(qmsDocTypeDto);
                Swal.fire({
                    icon: "success",
                    title: "Added Section Successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Add Section Unsuccessful!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
        setNewSectionName('');
    };

    const submitUnAddSectins = async () => {
        const isConfirmed = await AlertConfirmation({
            title: 'Are you sure to submit ?',
            message: '',
        });

        if (isConfirmed) {
            let res = await dwpUnAddListToAddList(sectionIds);
            if (res && res > 0) {
                getUnAddedChapterlist(qmsDocTypeDto);
                Swal.fire({
                    icon: "success",
                    title: "Submitted Section Successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Submit Section Unsuccessful!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            onClose(false);
            setSectionIds([]);
        }
    };

    return (
        <>
            {open && (
                <div>
                    <div className={`modal ${open ? 'show' : ''}`} style={{ display: open ? 'block' : 'none' }} tabIndex="-1" onClick={() => { onClose(false) }} >
                        <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content">
                                {/* <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center"> */}
                                <div className="modal-header bg-secondary text-white d-flex justify-content-between align-items-center">
                                    {/* <h5 className="modal-title">Choose Additional Chapter</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={() => onClose(false)}></button> */}
                                    <div>
                                        <h5 className="modal-title">Choose Additional Chapter</h5>
                                    </div>
                                    <div>
                                        <button type="button" className="modal-close" onClick={() => onClose(false)}>
                                            <i className="material-icons">close</i>
                                        </button>
                                    </div>
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
                                            {unAddedChapterList.map((obj) => (
                                                <tr key={obj.sectionId} className="table-active">
                                                    <td className="text-center">
                                                        <input
                                                            type="checkbox"
                                                            name="SectionIds"
                                                            value={obj.sectionId}
                                                            onChange={(event) => handleCheckboxChange(obj.sectionId, event)}
                                                        />
                                                    </td>
                                                    <td className="text-start">
                                                        <input
                                                            type="text"
                                                            className="form-control w-75"
                                                            value={obj.sectionName}
                                                            readOnly
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="table-active">
                                                <td className="text-center">
                                                    <button
                                                        onClick={() => submitNewChapter()}
                                                        className="btn btn-primary"
                                                        disabled={!newSectionName}
                                                    >
                                                        Add
                                                    </button>
                                                </td>
                                                <td className="text-start">
                                                    <input
                                                        type="text"
                                                        className="form-control w-75"
                                                        value={newSectionName}
                                                        placeholder="Enter new section"
                                                        onChange={(e) => setNewSectionName(e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="text-center">
                                        <button
                                            onClick={() => submitUnAddSectins()}
                                            className="btn btn-success"
                                            disabled={sectionIds.length === 0}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                                {/* <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={() => onClose(false)}>
                            <i className="material-icons">close</i>
                        </button>
                    </div> */}
                            </div>
                        </div>
                    </div>
                    {open && <div className="modal-backdrop fade show"></div>}
                </div>
            )}
        </>
    );
};

export default DwpAddSectionDialog;
