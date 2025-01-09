import { useEffect, useState } from "react";
import withRouter from '../../../../common/with-router';
import { addDwpChapterNameById, deleteDwpChapterByChapterId, getChapterById, getDwpAllChapters, getDwpChapterById, getDwpRevistionRecordById, getDwpSubChaptersById, updateChapterContent, updateDwpChapterContent, updateDwpChapterNameById, updateDwpPagebreakAndLandscape } from "../../../../services/qms.service";
import { Helmet } from 'react-helmet';

import './dwp-add-doc-content.component.css';

import $ from 'jquery';

import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite.js';
import Navbar from "../../../Navbar/Navbar";
import AlertConfirmation from "../../../../common/AlertConfirmation.component";
import DwpAddSectionDialog from "./dwp-add-section-dialog";
import DwpDocPrint from "components/prints/qms/dwp-doc-print";
import DwpAddAbbreviationDialog from "./dwp-add-abbreviation-dialog";

const DwpAddDocContentComponent = ({ router }) => {


    const { navigate, location } = router
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { revisionElements } = location.state || {};
    const [AllChapters, setAllChapters] = useState([]);
    const [ChapterListFirstLvl, setChapterListFirstLvl] = useState([]);
    const [ChapterListSecondLvl, setChapterListSecondLvl] = useState([]);
    const [ChapterListThirdLvl, setChapterListThirdLvl] = useState([]);

    const [editChapterId, setEditChapterId] = useState(null);
    const [ChapterIdFirstLvl, setChapterIdFirstLvl] = useState(null);
    const [ChapterIdSecondLvl, setChapterIdSecondLvl] = useState(null);
    const [ChapterIdThirdLvl, setChapterIdThirdLvl] = useState(null);
    const [editChapterForm, setEditChapterForm] = useState({
        editChapterName: ''
    });
    const [AddNewChapterFormThirdLvl, setAddNewChapterFormThirdLvl] = useState({
        SubChapterName: ''
    });
    const [AddNewChapterFormSecondLvl, setAddNewChapterFormSecondLvl] = useState({
        SubChapterName: ''
    });
    const [qmsDocTypeDto, setQmsDocTypeDto] = useState(null);


    const [level, setLevel] = useState(0);
    const [refreshChapterId, setRefreshChapterId] = useState(0);
    const [addChapterLevel, setAddChapterLevel] = useState(0);
    const [addChapterToId, setAddChapterToId] = useState(0);

    const [EditorTitle, setEditorTitle] = useState(null);
    const [editorContent, setEditorContent] = useState('');
    const [editorContentChapterId, setEditorContentChapterId] = useState('');
    const [data, setData] = useState('');
    // const [editorChapterId, setEditorChapterId] = useState('');

    const [deleteChapterId, setDeleteChapterId] = useState('');
    const [deleteRefreshChapterId, setDeleteRefreshChapterId] = useState('');
    const [deleteLevel, setDeleteLevel] = useState('');

    const [content, setContent] = useState('Enter something.....');
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialog2, setOpenDialog2] = useState(false);

    const [isPagebreakAfter, setIsPagebreakAfter] = useState(false);
    const [isLandscape, setIsLandscape] = useState(false);

    useEffect(() => {


        window.$('#summernote').summernote({
            airMode: false,
            tabDisable: true,
            popover: {
                table: [
                    ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
                    ['delete', ['deleteRow', 'deleteCol', 'deleteTable']]
                ],
                image: [
                    ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
                    ['float', ['floatLeft', 'floatRight', 'floatNone']],
                    ['remove', ['removeMedia']]
                ],
                link: [['link', ['linkDialogShow', 'unlink']]],
                air: [
                    [
                        'font',
                        [
                            'bold',
                            'italic',
                            'underline',
                            'strikethrough',
                            'superscript',
                            'subscript',
                            'clear'
                        ]
                    ]
                ]
            },
            height: '400px',
            placeholder: 'Enter text here...',
            toolbar: [
                // ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
                [
                    'font',
                    [
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        'superscript',
                        'subscript',
                        'clear'
                    ]
                ],
                ['fontsize',
                    [
                        // 'fontname', 
                        // 'fontsize', 
                        'color']],
                ['para', ['style0', 'ul', 'ol', 'paragraph',
                    // 'height'
                ]],
                ['insert', ['table', 'picture', 'link',
                    // 'video', 
                    'hr']],
                ['customButtons', ['testBtn']],
                ['view', ['fullscreen', 'codeview', 'help']]
            ],
            fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36', '44', '56', '64', '76', '84', '96'],
            fontNames: ['Arial', 'Times New Roman', 'Inter', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times', 'MangCau', 'BayBuomHep', 'BaiSau', 'BaiHoc', 'CoDien', 'BucThu', 'KeChuyen', 'MayChu', 'ThoiDai', 'ThuPhap-Ivy', 'ThuPhap-ThienAn'],
            codeviewFilter: true,
            codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
            codeviewIframeFilter: true,

        });

        $('#summernote').summernote('code', editorContent);

        return () => {
            $('#summernote').summernote('destroy');
        };

    }, [editorContent, AllChapters]);

    const handlePagebreakChange = async (event) => {
        setIsPagebreakAfter(event.target.checked);
        // onchangeIsPagebreakAfter(editorChapterId);
        let chapterPagebreakOrLandscape = new Array;
        chapterPagebreakOrLandscape.push(editorContentChapterId)
        chapterPagebreakOrLandscape.push(event.target.checked ? 'Y' : 'N')
        chapterPagebreakOrLandscape.push(isLandscape ? 'Y' : 'N')
        let response = await updateDwpPagebreakAndLandscape(chapterPagebreakOrLandscape);
    };

    const handleLandscapeChange = async (event) => {
        setIsLandscape(event.target.checked);
        // onchangeIsPagebreakAfter(editorChapterId); // Adjust this function as needed
        let chapterPagebreakOrLandscape = new Array;
        chapterPagebreakOrLandscape.push(editorContentChapterId)
        chapterPagebreakOrLandscape.push(isPagebreakAfter ? 'Y' : 'N')
        chapterPagebreakOrLandscape.push(event.target.checked ? 'Y' : 'N')
        let response = await updateDwpPagebreakAndLandscape(chapterPagebreakOrLandscape);
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const qmsDocTypeDto = {
                    docType: revisionElements.docType,
                    groupDivisionId:revisionElements.groupDivisionId,
                    revisionRecordId: revisionElements.revisionRecordId,
                    statusCode: revisionElements.statusCode,
                }
        
                setQmsDocTypeDto(qmsDocTypeDto);
                getAllChapters(qmsDocTypeDto);
            } catch (error) {
                setError('An error occurred');
                setIsLoading(false);
                console.error(error)
            }
        }
        fetchData();
    }, []);

    // Disable Bootstrap tooltips
    // useEffect(() => {
    //     $('[data-toggle="tooltip"]').tooltip('disable');
    // }, []);

    // Disable Bootstrap 5 tooltip functionality
    useEffect(() => {
        $.fn.tooltip = function () {
            return this;
        };
    }, []);

    const subHeadingLinkStyle = {
        border: '1.5px solid #96c6ea',
        borderRadius: '6px',
        backgroundColor: '#ebf4f5',
        padding: '.2rem 2rem',
        margin: '0.5rem 1rem 1rem 1rem'
    };

    const getAllChapters = async (qmsDocTypeDto) => {
        try {

            let AllChapters = await getDwpAllChapters(qmsDocTypeDto);
            AllChapters = AllChapters.filter(obj => obj.chapterParentId == 0)
            if (AllChapters && AllChapters.length > 0) {
                setEditorTitle(AllChapters[0].chapterName);
                // setEditorChapterId(AllChapters[0][0])
                if (AllChapters[0].chapterContent !== null) {
                    setEditorContent(AllChapters[0].chapterContent);
                    $('#summernote').summernote('code', AllChapters[0].chapterContent);
                } else {
                    setEditorContent('')
                    $('#summernote').summernote('code', '');
                }
                setEditorContentChapterId(AllChapters[0].chapterId)


                if (AllChapters[0].isPagebreakAfter != null && AllChapters[0].isPagebreakAfter + '' === 'Y') {
                    setIsPagebreakAfter(true);
                } else {
                    setIsPagebreakAfter(false);
                }
                if (AllChapters[0].isLandscape != null && AllChapters[0].isLandscape + '' === 'Y') {
                    setIsLandscape(true);
                } else {
                    setIsLandscape(false);
                }

            }
            setAllChapters(AllChapters);

        } catch (error) {
            setError('An error occurred');
            setIsLoading(false);
            console.error(error)
        }
    };


    const getSubChapters = async (chapterId, level) => {
        if (level === 1) {
            setChapterIdFirstLvl(prevId => prevId === chapterId ? null : chapterId);
        } else if (level === 2) {
            setChapterIdSecondLvl(prevId => prevId === chapterId ? null : chapterId);
        } else if (level === 3) {
            setChapterIdThirdLvl(prevId => prevId === chapterId ? null : chapterId);
        }

        try {
            const response = await getDwpSubChaptersById(chapterId);

            if (level === 1) {
                setChapterListFirstLvl(response);
            } else if (level === 2) {
                setChapterListSecondLvl(response);
            } else if (level === 3) {
                setChapterListThirdLvl(response);
            }
        } catch (error) {
            // Handle error here
            console.error(error);
        }

    };

    const enableEditChapter = (chapterId, mode, value, refreshChapterId, level) => {
        setEditChapterForm({ editChapterName: value })
        setRefreshChapterId(refreshChapterId)
        setLevel(level);
        if (mode === 'edit') {
            setEditChapterId(chapterId);
        } else {
            setEditChapterId(null);
        }
    };

    const updateChapterName = async () => {
        const isConfirmed = await AlertConfirmation({
            title: 'Are you sure to update ?',
            message: '',
        });

        if (isConfirmed) {
            let res = await updateDwpChapterNameById(editChapterId, editChapterForm.editChapterName);

            if (res && res > 0) {
                if (level > 0) {
                    if (level === 1) {
                        setChapterIdFirstLvl(null);
                    } else if (level === 2) {
                        setChapterIdSecondLvl(null);
                    }
                    getSubChapters(refreshChapterId, level);
                } else {
                    getAllChapters(qmsDocTypeDto);
                }
                Swal.fire({
                    icon: "success",
                    title: "Updated Chapter Successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Update Chapter Unsuccessful!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
        setEditChapterId(null);
    };

    const getQaQtQmChaptersDto = async (editChapter) => {
        const chapter = await getDwpChapterById(editChapter.chapterId);
        setEditorTitle(chapter.chapterName)
        if (chapter.chapterContent != null) {
            setEditorContent(chapter.chapterContent)
            $('#summernote').summernote('code', chapter.chapterContent);
        } else {
            setEditorContent('')
            $('#summernote').summernote('code', '');
        }
        setEditorContentChapterId(chapter.chapterId);
        if (chapter.isPagebreakAfter != null && chapter.isPagebreakAfter + '' === 'Y') {
            setIsPagebreakAfter(true);
        } else {
            setIsPagebreakAfter(false);
        }

        if (chapter.isLandscape != null && chapter.isLandscape + '' === 'Y') {
            setIsLandscape(true);
        } else {
            setIsLandscape(false);
        }
    };

    const deleteChapterById = async (reloadchpter, chapterId, level) => {
        setDeleteChapterId(chapterId)
        setDeleteRefreshChapterId(reloadchpter)
        setDeleteLevel(level)



        const isConfirmed = await AlertConfirmation({
            title: 'Are you sure to delete ?',
            message: '',
        });

        if (isConfirmed) {

            let res = await deleteDwpChapterByChapterId(chapterId);

            if (res && res > 0) {
                if (level > 0) {
                    if (level === 1) {
                        setChapterIdFirstLvl(null);
                    } else if (level === 2) {
                        setChapterIdSecondLvl(null);
                    }
                    getSubChapters(reloadchpter, level);
                } else {
                    getAllChapters(qmsDocTypeDto);
                }
                Swal.fire({
                    icon: "success",
                    title: "Deleted Chapter Successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Delete Chapter Unsuccessful!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }

        }

    };

    const submitAddSubChapterForm = async (chapterId, level, chapterName) => {
        setAddChapterLevel(level);
        setAddChapterToId(chapterId);

        const isConfirmed = await AlertConfirmation({
            title: 'Are you sure to add chapter ?',
            message: '',
        });

        if (isConfirmed) {

            try {

                let res = await addDwpChapterNameById(chapterId, chapterName);

                if (res && res > 0) {
                    if (level > 0) {
                        if (level === 1) {
                            setChapterIdFirstLvl(null);
                        } else if (level === 2) {
                            setChapterIdSecondLvl(null);
                        }
                        getSubChapters(chapterId, level);
                    } else {
                        getAllChapters(qmsDocTypeDto);
                    }
                    Swal.fire({
                        icon: "success",
                        title: "Added Chapter Successfully!",
                        showConfirmButton: false,
                        timer: 1500
                    });

                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Add Chapter Unsuccessful!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }

                setAddChapterLevel(0);
                setAddChapterToId(0);
                setAddNewChapterFormSecondLvl({ SubChapterName: '' });
                setAddNewChapterFormThirdLvl({ SubChapterName: '' });
            } catch {
                setError('An error occurred');
                setIsLoading(false);
                console.error(error)
            }
        }

    };


    const updateEditorContent = async () => {

        const isConfirmed = await AlertConfirmation({
            title: 'Are you sure to update ?',
            message: '',
        });

        if (isConfirmed) {
            var content = $('#summernote').summernote('code');
            // if(!content){
            //     content=''
            // }
            let res = await updateDwpChapterContent(editorContentChapterId, content);

            if (res && res > 0) {
                Swal.fire({
                    icon: "success",
                    title: "Updated Content Successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Update Content Unsuccessful!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }

        }
    };


    const handleOpenUnaddedSections = () => {
        setOpenDialog(true)
    };

    const handleCloseSectionDialog = () => {
        setOpenDialog(false)
        getAllChapters(qmsDocTypeDto);
    };

    const handleCloseAbbreviationDialog = () => {
        setOpenDialog2(false)
    }


    const goBack = () => {
        navigate(-1);
    };

    const getDocPDF = (action) => {
        return <DwpDocPrint action={action} revisionElements={revisionElements} buttonType="Button" />
    }

    const abbreviationModal = async () =>{
        const revision = await getDwpRevistionRecordById(revisionElements.revisionRecordId);
        navigate('/add-abbreviation', { state: { revisionData: revision, docType: revisionElements.docType.toUpperCase() } })
    };

    return (
        <div sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowX: 'hidden' }}>
            <Helmet>
                <title>IMS - ISO</title>
            </Helmet>

            {/* <HeaderComponent /> */}
            <Navbar />
            <div id="main-container" className='main-container'>
                <div id="main-breadcrumb">

                </div>

                <div id="main-wrapper">
                    <div className="subHeadingLink d-flex flex-column flex-md-row justify-content-between">
                        <div align='left' className="d-flex flex-column flex-md-row gap-1">
                            {/* <button className='btn topButtons' onClick={() => setOpenDialog2(true)}>Abbreviation<i className="material-icons" >text_fields</i></button> */}
                            <button className='btn topButtons' onClick={abbreviationModal}>Abbreviation New<i className="material-icons" >text_fields</i></button>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-1">

                        </div>
                        <div className=" text-md-end mt-2 mt-md-0">
                            <div className="doc-name">
                               {revisionElements.docType && revisionElements.docType==='dwp' ? 'Division Work Procedure (DWP)' : ' Group Work Procedure (GWP)'}
                            </div>
                        </div>
                    </div>
                    <div id="card-body" sx={{ marginBottom: '1px!important' }}>
                        {/* <Container maxWidth="xl"> */}
                        <div className="row g-3">
                            <div className="col-12">
                                <div className="row g-3">
                                    <div className="col-12 col-md-6">
                                        <div className="card">
                                            <div
                                                className="card-body"
                                                style={{
                                                    height: '75vh',
                                                    overflowY: 'auto',
                                                    border: '0.3px solid #ABB2B9',
                                                }}
                                            >
                                                {AllChapters.map((chapter, i) => (
                                                    <div key={i}>
                                                        <div className="custom-header">
                                                            <div className="d-flex align-items-center mb-2">
                                                                <div className="d-flex align-items-center flex-grow-1">
                                                                    <div className="me-2">{i + 1}.</div>
                                                                    <div className="flex-grow-1 me-2">
                                                                        {editChapterId === chapter.chapterId ? (
                                                                            <input
                                                                                type="text"
                                                                                className="form-control form-control-sm w-100 "
                                                                                value={editChapterForm.editChapterName}
                                                                                onChange={(e) => setEditChapterForm({ editChapterName: e.target.value })}
                                                                            />
                                                                        ) : (
                                                                            <input
                                                                                type="text"
                                                                                className="form-control form-control-sm w-100 "
                                                                                value={chapter.chapterName}
                                                                                readOnly
                                                                            />
                                                                        )}
                                                                    </div>
                                                                    {editChapterId !== chapter.chapterId ? (
                                                                        <button
                                                                            className="btn icon-button edit-icon-button"
                                                                            onClick={() => enableEditChapter(chapter.chapterId, 'edit', chapter.chapterName, 0, 0)}
                                                                        >
                                                                            <i className="material-icons" >edit</i>
                                                                        </button>
                                                                    ) : (
                                                                        <div className="d-flex">
                                                                            <button
                                                                                className="btn icon-button"
                                                                                onClick={() => updateChapterName(chapter.chapterId)}
                                                                                disabled={!editChapterForm.editChapterName}
                                                                            >
                                                                                <i className="material-icons" style={{ color: '#198754' }}>update</i>
                                                                            </button>
                                                                            <button
                                                                                className="btn icon-button delete-icon-button"
                                                                                onClick={() => enableEditChapter(chapter.chapterId, '')}
                                                                            >
                                                                                <i className="material-icons" >close</i>
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="d-flex justify-content-end">
                                                                    <button
                                                                        className="btn icon-button"
                                                                        onClick={() => getSubChapters(chapter.chapterId, 1)}
                                                                    >
                                                                        {ChapterIdFirstLvl === chapter.chapterId ? (
                                                                            <i className="material-icons" style={{ color: '#FF0800' }}>expand_less</i>
                                                                        ) : (
                                                                            <i className="material-icons" style={{ color: '#138808' }}>expand_more</i>
                                                                        )}
                                                                    </button>
                                                                    <button
                                                                        className="btn icon-button edit-icon-button"
                                                                        onClick={() => getQaQtQmChaptersDto(chapter)}
                                                                    >
                                                                        <i className="material-icons" >edit_note</i>
                                                                    </button>
                                                                    <button
                                                                        className="btn icon-button delete-icon-button"
                                                                        onClick={() => deleteChapterById(0, chapter.chapterId, 0)}
                                                                    >
                                                                        <i className="material-icons">remove</i>
                                                                    </button>
                                                                </div>
                                                            </div>



                                                            {/* Second Level Start */}
                                                            {ChapterIdFirstLvl === chapter.chapterId && (
                                                                <div className=""  >
                                                                    {ChapterListFirstLvl.map((chapter1, j) => (
                                                                        <div key={chapter1.chapterId} className="custom-header">
                                                                            <div className="row align-items-center g-3">
                                                                                <div className="col-12">
                                                                                    <div className="d-flex align-items-center mb-2">
                                                                                        <div className="d-flex align-items-center flex-grow-1">
                                                                                            <div className="me-2">{i + 1}.{j + 1}.</div>
                                                                                            <div className="flex-grow-1 me-2">
                                                                                                {editChapterId === chapter1.chapterId ? (
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        className="form-control form-control-sm w-100"
                                                                                                        value={editChapterForm.editChapterName}
                                                                                                        onChange={(e) => setEditChapterForm({ editChapterName: e.target.value })}
                                                                                                    />
                                                                                                ) : (
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        className="form-control form-control-sm w-100"
                                                                                                        value={chapter1.chapterName}
                                                                                                        readOnly
                                                                                                    />
                                                                                                )}
                                                                                            </div>
                                                                                            {editChapterId === chapter1.chapterId ? (
                                                                                                <div className="d-flex">
                                                                                                    <button
                                                                                                        className="btn icon-button"
                                                                                                        onClick={() => updateChapterName(chapter1.chapterId)}
                                                                                                        disabled={!editChapterForm.editChapterName}
                                                                                                    >
                                                                                                        <i className="material-icons" style={{ color: '#198754' }}>update</i>
                                                                                                    </button>
                                                                                                    <button
                                                                                                        className="btn icon-button delete-icon-button"
                                                                                                        onClick={() => enableEditChapter(chapter1.chapterId, '')}
                                                                                                    >
                                                                                                        <i className="material-icons">close</i>
                                                                                                    </button>
                                                                                                </div>
                                                                                            ) : (
                                                                                                <button
                                                                                                    className="btn icon-button edit-icon-button"
                                                                                                    onClick={() => enableEditChapter(chapter1.chapterId, 'edit', chapter1.chapterName, chapter.chapterId, 1)}
                                                                                                >
                                                                                                    <i className="material-icons">edit</i>
                                                                                                </button>
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="d-flex justify-content-end">
                                                                                            <button
                                                                                                className="btn icon-button"
                                                                                                onClick={() => getSubChapters(chapter1.chapterId, 2)}
                                                                                            >
                                                                                                {ChapterIdSecondLvl === chapter1.chapterId ? (
                                                                                                    <i className="material-icons" style={{ fontSize: '30px', color: '#FF0800' }}>expand_less</i>
                                                                                                ) : (
                                                                                                    <i className="material-icons" style={{ fontSize: '30px', color: '#138808' }}>expand_more</i>
                                                                                                )}
                                                                                            </button>
                                                                                            <button
                                                                                                className="btn icon-button edit-icon-button"
                                                                                                onClick={() => getQaQtQmChaptersDto(chapter1)}
                                                                                            >
                                                                                                <i className="material-icons">edit_note</i>
                                                                                            </button>
                                                                                            <button
                                                                                                className="btn icon-button delete-icon-button"
                                                                                                onClick={() => deleteChapterById(chapter.chapterId, chapter1.chapterId, 1)}
                                                                                            >
                                                                                                <i className="material-icons">remove</i>
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>


                                                                                    {/* Third Level (Nested) */}
                                                                                    {ChapterIdSecondLvl === chapter1.chapterId && (
                                                                                        <div className="container">
                                                                                            {ChapterListSecondLvl.map((chapter2, k) => (
                                                                                                <div className="row custom-header align-items-center" key={chapter2.chapterId}>
                                                                                                    <div className="col-12">
                                                                                                        <div className="row align-items-center">
                                                                                                            <div className="col-11 d-flex align-items-center">
                                                                                                                <div className="col-1">
                                                                                                                    {i + 1}.{j + 1}.{k + 1}.
                                                                                                                </div>
                                                                                                                <div className="col-8">
                                                                                                                    {editChapterId === chapter2.chapterId ? (
                                                                                                                        <input
                                                                                                                            type="text"
                                                                                                                            className="form-control form-control-sm w-100"
                                                                                                                            value={editChapterForm.editChapterName}
                                                                                                                            onChange={(e) =>
                                                                                                                                setEditChapterForm({
                                                                                                                                    editChapterName: e.target.value,
                                                                                                                                })
                                                                                                                            }
                                                                                                                        />
                                                                                                                    ) : (
                                                                                                                        <input
                                                                                                                            type="text"
                                                                                                                            className="form-control form-control-sm w-100"
                                                                                                                            value={chapter2.chapterName}
                                                                                                                            readOnly
                                                                                                                        />
                                                                                                                    )}
                                                                                                                </div>
                                                                                                                <div
                                                                                                                    className={`col-2 m-1 ${editChapterId === chapter2.chapterId ? "d-none" : "d-block"
                                                                                                                        }`}
                                                                                                                >
                                                                                                                    <button
                                                                                                                        className="btn icon-button edit-icon-button"
                                                                                                                        onClick={() =>
                                                                                                                            enableEditChapter(
                                                                                                                                chapter2.chapterId,
                                                                                                                                "edit",
                                                                                                                                chapter2.chapterName,
                                                                                                                                chapter1.chapterId,
                                                                                                                                2
                                                                                                                            )
                                                                                                                        }
                                                                                                                    >
                                                                                                                        <i className="material-icons text-warning">edit</i>
                                                                                                                    </button>
                                                                                                                </div>
                                                                                                                <div
                                                                                                                    className={`col-3 m-1 ${editChapterId === chapter2.chapterId ? "d-flex" : "d-none"
                                                                                                                        }`}
                                                                                                                >
                                                                                                                    <button
                                                                                                                        className="btn icon-button "
                                                                                                                        onClick={() =>
                                                                                                                            updateChapterName(chapter2.chapterId, 2, chapter1.chapterId)
                                                                                                                        }
                                                                                                                        disabled={!editChapterForm.editChapterName}
                                                                                                                    >
                                                                                                                        <i className="material-icons text-success">update</i>
                                                                                                                    </button>
                                                                                                                    <button
                                                                                                                        className="btn icon-button delete-icon-button"
                                                                                                                        onClick={() => enableEditChapter(chapter2.chapterId, "")}
                                                                                                                    >
                                                                                                                        <i className="material-icons text-danger">close</i>
                                                                                                                    </button>
                                                                                                                </div>
                                                                                                            </div>

                                                                                                            {/* Third Level Buttons */}
                                                                                                            <div className="col-1 d-flex justify-content-end">
                                                                                                                <button
                                                                                                                    className="btn icon-button edit-icon-button"
                                                                                                                    onClick={() => getQaQtQmChaptersDto(chapter2)}
                                                                                                                >
                                                                                                                    <i className="material-icons text-warning">edit_note</i>
                                                                                                                </button>
                                                                                                                <button
                                                                                                                    className="btn icon-button delete-icon-button"
                                                                                                                    onClick={() =>
                                                                                                                        deleteChapterById(chapter1.chapterId, chapter2.chapterId, 2)
                                                                                                                    }
                                                                                                                >
                                                                                                                    <i className="material-icons text-danger">remove</i>
                                                                                                                </button>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                            {/* Add New Sub Chapter */}
                                                                                            <div className="row custom-header align-items-center">
                                                                                                <div className="col-10">
                                                                                                    <div className="row align-items-center">
                                                                                                        <div className="col-1">
                                                                                                            {i + 1}.{j + 1}.
                                                                                                            {ChapterListSecondLvl?.length > 0 ? ChapterListSecondLvl.length + 1 : 1}.
                                                                                                        </div>
                                                                                                        <div className="col-8">
                                                                                                            <input
                                                                                                                type="text"
                                                                                                                className="form-control form-control-sm w-100"
                                                                                                                placeholder="Add New Sub Chapter"
                                                                                                                value={AddNewChapterFormThirdLvl.SubChapterName}
                                                                                                                onChange={(e) =>
                                                                                                                    setAddNewChapterFormThirdLvl({
                                                                                                                        SubChapterName: e.target.value,
                                                                                                                    })
                                                                                                                }
                                                                                                            />
                                                                                                        </div>
                                                                                                        <div className="col-2">
                                                                                                            <button
                                                                                                                className="btn btn-primary btn-sm"
                                                                                                                onClick={() =>
                                                                                                                    submitAddSubChapterForm(
                                                                                                                        chapter1.chapterId,
                                                                                                                        2,
                                                                                                                        AddNewChapterFormThirdLvl.SubChapterName
                                                                                                                    )
                                                                                                                }
                                                                                                                disabled={!AddNewChapterFormThirdLvl.SubChapterName}
                                                                                                            >
                                                                                                                Add
                                                                                                            </button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}

                                                                    <div className="d-flex align-items-center custom-header mb-2">
                                                                        <div className="flex-grow-1">
                                                                            <div className="row align-items-center g-2">
                                                                                <div className="col-1">
                                                                                    {i + 1}.{ChapterListFirstLvl?.length > 0 ? ChapterListFirstLvl.length + 1 : 1}.
                                                                                </div>
                                                                                <div className="col-8">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control form-control-sm w-100"
                                                                                        placeholder="Add New Sub Chapter"
                                                                                        value={AddNewChapterFormSecondLvl.SubChapterName}
                                                                                        onChange={(e) =>
                                                                                            setAddNewChapterFormSecondLvl({ SubChapterName: e.target.value })
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                                <div className="col-2">
                                                                                    <button
                                                                                        className="btn btn-primary btn-sm w-100"
                                                                                        onClick={() =>
                                                                                            submitAddSubChapterForm(
                                                                                                chapter.chapterId,
                                                                                                1,
                                                                                                AddNewChapterFormSecondLvl.SubChapterName
                                                                                            )
                                                                                        }
                                                                                        disabled={!AddNewChapterFormSecondLvl.SubChapterName}
                                                                                    >
                                                                                        Add
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>


                                                                </div>
                                                            )}



                                                            {/* Second Level End */}

                                                        </div>

                                                    </div>



                                                ))}
                                                <div className="text-start">
                                                    <div title="Add Sections">
                                                        <button
                                                            className="btn btn-primary mt-3"
                                                            onClick={handleOpenUnaddedSections}
                                                        >
                                                            <i className="material-icons">playlist_add</i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="col-12 col-md-6">
                                        <div className="card text-start">
                                            {AllChapters.length > 0 && (
                                                <div
                                                    className="card-body"
                                                    style={{
                                                        height: '75vh',
                                                        overflowY: 'auto',
                                                        border: '0.3px solid #ABB2B9',
                                                    }}
                                                >
                                                    <div className="d-flex flex-row mb-3">
                                                        <div>
                                                            <h5
                                                                className="editor-title"
                                                                style={{
                                                                    backgroundColor: '#ffc107',
                                                                    color: '#000',
                                                                    padding: '0.5rem 1rem',
                                                                    borderRadius: '50px',
                                                                    display: 'inline-block',
                                                                }}
                                                            >
                                                                {EditorTitle}
                                                            </h5>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <textarea id="summernote" className="form-control"></textarea>
                                                    </div>

                                                    <div className="row g-3 mt-3">
                                                        <div className="col-md-4 d-flex align-items-center">
                                                            <span className="me-3">1. Is Pagebreak?</span>
                                                            <div className="form-check form-switch d-inline-block">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id="isPagebreakAfter"
                                                                    checked={isPagebreakAfter}
                                                                    onChange={handlePagebreakChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 d-flex align-items-center">
                                                            <span className="me-3">2. Is Landscape?</span>
                                                            <div className="form-check form-switch d-inline-block">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id="isLandscape"
                                                                    checked={isLandscape}
                                                                    onChange={handleLandscapeChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 text-end">
                                                            <button className="btn edit" onClick={() => updateEditorContent()}>
                                                                Update
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>




                                </div>
                            </div>
                        </div>
                        {/* </Container> */}
                        <div className='m-3' align="center" >
                            {getDocPDF()}
                            <button
                                onClick={goBack}
                                className="back ms-1"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                    
                    <DwpAddSectionDialog
                        open={openDialog}
                        onClose={handleCloseSectionDialog}
                        revisionElements={revisionElements}
                    />

                    <DwpAddAbbreviationDialog
                        open={openDialog2}
                        onClose={handleCloseAbbreviationDialog}
                        revisionElements={revisionElements}
                    />
                    
                </div>
            </div>

        </div>
    );
};

export default withRouter(DwpAddDocContentComponent);