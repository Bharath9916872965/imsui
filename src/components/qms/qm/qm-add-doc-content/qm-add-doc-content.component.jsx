import { useEffect, useState } from "react";
import withRouter from '../../../../common/with-router';
import { addChapterNameById, deleteChapterByChapterIdId, getChapterById, getQmAllChapters, getSubChaptersById, updateChapterContent, updateChapterNameById, updatechapterPagebreakAndLandscape } from "../../../../services/qms.service";
import {Button, Card, CardContent, FormControlLabel, Grid, IconButton, Switch, TextField, Tooltip, Typography, Alert} from '@mui/material';
import { Helmet } from 'react-helmet';

import './qm-add-doc-content.component.css';

import $ from 'jquery';

import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite.js';
import Navbar from "../../../Navbar/Navbar";
import AlertConfirmation from "../../../../common/AlertConfirmation.component";
import QmAddSectionDialog from "./qm-add-section-dialog";
import QmDocPrint from "../../../prints/qms/qm-doc-print";

const QmAddDocContentComponent = ({ router }) => {


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
  const [openEditorContentConfirmationDialog, setOpenEditorContentConfirmationDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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
              ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
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
              ['fontsize', ['fontname', 'fontsize', 'color']],
              ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
              ['insert', ['table', 'picture', 'link', 'video', 'hr']],
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
      let chapterPagebreakOrLandscape= new Array;
    chapterPagebreakOrLandscape.push(editorContentChapterId)
    chapterPagebreakOrLandscape.push(event.target.checked ? 'Y' : 'N')
    chapterPagebreakOrLandscape.push(isLandscape ? 'Y' : 'N')
      let response = await updatechapterPagebreakAndLandscape(chapterPagebreakOrLandscape);
    };
  
    const handleLandscapeChange = async (event) => {
      setIsLandscape(event.target.checked);
      // onchangeIsPagebreakAfter(editorChapterId); // Adjust this function as needed
      let chapterPagebreakOrLandscape= new Array;
      chapterPagebreakOrLandscape.push(editorContentChapterId)
      chapterPagebreakOrLandscape.push(isPagebreakAfter ? 'Y' : 'N')
      chapterPagebreakOrLandscape.push(event.target.checked ? 'Y' : 'N')
      let response = await updatechapterPagebreakAndLandscape(chapterPagebreakOrLandscape);
  };


  useEffect(() => {
      const fetchData = async () => {

          try {

            getAllChapters();

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

  const getAllChapters = async () => {
      try {

          let AllChapters = await getQmAllChapters();
          AllChapters=AllChapters.filter(obj => obj.chapterParentId == 0)
          if (AllChapters && AllChapters.length > 0) {
              setEditorTitle(AllChapters[0].chapterName);
              // setEditorChapterId(AllChapters[0][0])
              if(AllChapters[0].chapterContent !== null){
                  setEditorContent(AllChapters[0].chapterContent);
                  $('#summernote').summernote('code', AllChapters[0].chapterContent);
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
          const response = await getSubChaptersById(chapterId);

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
            let res = await updateChapterNameById(editChapterId, editChapterForm.editChapterName);

            if (res && res > 0) {
                if (level > 0) {
                    if (level === 1) {
                        setChapterIdFirstLvl(null);
                    } else if (level === 2) {
                        setChapterIdSecondLvl(null);
                    }
                    getSubChapters(refreshChapterId, level);
                } else {
                    getAllChapters();
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
    const chapter = await getChapterById(editChapter.chapterId);
      setEditorTitle(chapter.chapterName)
      if(chapter.chapterContent != null) {
          setEditorContent(chapter.chapterContent)
          $('#summernote').summernote('code',chapter.chapterContent);
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
      // console.log('Deleting chapter', chapterId);
      setDeleteChapterId(chapterId)
      setDeleteRefreshChapterId(reloadchpter)
      setDeleteLevel(level)


        
        const isConfirmed = await AlertConfirmation({
            title: 'Are you sure to delete ?',
            message: '',
        });

        if (isConfirmed) {

        let res = await deleteChapterByChapterIdId(chapterId);
  
        if (res && res > 0) {
            if (deleteLevel > 0) {
                if (deleteLevel === 1) {
                    setChapterIdFirstLvl(null);
                } else if (deleteLevel === 2) {
                    setChapterIdSecondLvl(null);
                }
                getSubChapters(deleteRefreshChapterId, deleteLevel);
            } else {
                getAllChapters();
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

                let res = await addChapterNameById(chapterId, chapterName);

                if (res && res > 0) {
                    if (level > 0) {
                        if (level === 1) {
                            setChapterIdFirstLvl(null);
                        } else if (level === 2) {
                            setChapterIdSecondLvl(null);
                        }
                        getSubChapters(chapterId, level);
                    } else {
                        getAllChapters();
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


  const handleEditorContentDialogClose = () => {
      setOpenEditorContentConfirmationDialog(false);
  };




  const handleSnackbarClose = () => {
      setSnackbarOpen(false);
  };

    const updateEditorContent = async () => {
        //   setOpenEditorContentConfirmationDialog(true);

        const isConfirmed = await AlertConfirmation({
            title: 'Are you sure to update ?',
            message: '',
        });

        if (isConfirmed) {
            const content = $('#summernote').summernote('code');
            setOpenEditorContentConfirmationDialog(false)
            // let chaperContent = new Array;
            // chaperContent.push(editorContentChapterId)
            // chaperContent.push(content)
            let res = await updateChapterContent(editorContentChapterId, content);

            if (res && res > 0) {
                Swal.fire({
                    icon: "success",
                    title: "Updated Content Successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Update Content Unsuccessful!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }

        }
    };

  const handleChange = (e) => {
      // console.log('--editor value---',e.target.value)
      // setSnackbarOpen(false);
  };

  const handleOpenUnaddedSections = () => {
      setOpenDialog(true)
  };

  const handleCloseSectionDialog = () => {
      setOpenDialog(false)
      getAllChapters();
  };


  const goBack = () => {
    navigate(-1);
  };

  const getDocPDF = (action) => {
    return <QmDocPrint action={action} revisionElements={revisionElements} buttonType="Button" />
  }


  return (
      <div sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowX: 'hidden' }}>
          <Helmet>
              <title>IMS - ISO</title>
          </Helmet>

          {/* <HeaderComponent /> */}
          <Navbar/>
          <div id="main-container" className='main-container'>
              <div id="main-breadcrumb">
                 
              </div>

              <div id="main-wrapper">
                  <div className="subHeadingLink d-flex flex-column flex-md-row justify-content-between">
                      <div align='left' className="d-flex flex-column flex-md-row gap-1">
                      </div>
                      <div className="d-flex flex-column flex-md-row gap-1">
                          {/* <div className="doc-name">
                                  QUALITY MANUAL
                          </div> */}
                      </div>
                      <div className=" text-md-end mt-2 mt-md-0">
                         <div className="doc-name">
                              {/* <button className="doc-name"> */}
                                  QUALITY MANUAL
                              {/* </button> */}
                          </div>
                      </div>
                  </div>
                  <div id="card-body" sx={{ marginBottom: '1px!important' }}>
                      {/* <Container maxWidth="xl"> */}
                      <Grid container spacing={2}>
                          <Grid item xs={12}>
                              <Grid container spacing={2}>
                                  <Grid item xs={12} md={6}>
                                      <Card>
                                          <CardContent
                                              sx={{ height: '75vh', overflowY: 'auto', border: '0.3px solid #ABB2B9' }}
                                          >
                                              {AllChapters.map((chapter, i) => (
                                                  <Grid key={i}>
                                                      <Grid className="custom-header">
                                                          <Grid container spacing={2} alignItems="center">
                                                              <Grid item xs={8} display="flex" alignItems="center">
                                                                  <Grid item xs={1}>
                                                                      {i + 1}.
                                                                  </Grid>
                                                                  <Grid item xs={9}>
                                                                      {editChapterId === chapter.chapterId ? (
                                                                          <TextField
                                                                              size="small"
                                                                              fullWidth
                                                                              value={editChapterForm.editChapterName}
                                                                              onChange={(e) =>
                                                                                  setEditChapterForm({ editChapterName: e.target.value })
                                                                              }
                                                                          />
                                                                      ) : (
                                                                          <TextField
                                                                              size="small"
                                                                              fullWidth
                                                                              value={chapter.chapterName}
                                                                              InputProps={{ readOnly: true }}
                                                                          />
                                                                      )}
                                                                  </Grid>
                                                                  {editChapterId !== chapter.chapterId ? (
                                                                      <Grid item xs={2} m={1}>
                                                                          <Tooltip title="Edit">
                                                                              <span>
                                                                                  <IconButton onClick={(e) => enableEditChapter(chapter.chapterId, 'edit', chapter.chapterName, 0, 0)}>
                                                                                      <i className="material-icons" style={{ color: 'orange' }}>edit</i>
                                                                                  </IconButton>
                                                                              </span>
                                                                          </Tooltip>
                                                                      </Grid>
                                                                  ) : (
                                                                      <Grid item xs={3} m={1} display="flex">
                                                                          <Tooltip title="Update">
                                                                              <span>
                                                                                  <IconButton onClick={() => updateChapterName(chapter.chapterId)} disabled={!editChapterForm.editChapterName}>
                                                                                      <i className="material-icons" style={{ color: '#198754' }}>update</i>
                                                                                  </IconButton>
                                                                              </span>
                                                                          </Tooltip>
                                                                          <Tooltip title="Cancel Edit">
                                                                              <span>
                                                                                  <IconButton onClick={() => enableEditChapter(chapter.chapterId, '')}>
                                                                                      <i className="material-icons" style={{ color: 'red' }}>close</i>
                                                                                  </IconButton>
                                                                              </span>
                                                                          </Tooltip>
                                                                      </Grid>
                                                                  )}
                                                              </Grid>
                                                              <Grid item xs={4} display="flex" justifyContent="flex-end">
                                                                  <Tooltip title={ChapterIdFirstLvl === chapter.chapterId ? 'Expand less' : 'Expand more'}>
                                                                      <span>
                                                                          <Button onClick={() => getSubChapters(chapter.chapterId, 1)}>
                                                                              {ChapterIdFirstLvl === chapter.chapterId ? (
                                                                                  <i className="material-icons" style={{ color: '#FF0800' }}>expand_less</i>
                                                                              ) : (
                                                                                  <i className="material-icons" style={{ color: '#138808' }}>expand_more</i>
                                                                              )}
                                                                          </Button>
                                                                      </span>
                                                                  </Tooltip>
                                                                  <Tooltip title="Open in editor">
                                                                      <span>
                                                                          <Button onClick={() => getQaQtQmChaptersDto(chapter)}>
                                                                              <i className="material-icons" style={{ color: 'orange' }}>edit_note</i>
                                                                          </Button>
                                                                      </span>
                                                                  </Tooltip>
                                                                  <Tooltip title="Remove">
                                                                      <span>
                                                                          <Button onClick={() => deleteChapterById(0, chapter.chapterId, 0)} className='delete-icon'>
                                                                              <i className="material-icons">remove</i>
                                                                          </Button>
                                                                      </span>
                                                                  </Tooltip>
                                                              </Grid>
                                                          </Grid>


                                                          {/* Second Level Start */}
                                                          {ChapterIdFirstLvl === chapter.chapterId && (
                                                              <Grid className=""  >
                                                                  {ChapterListFirstLvl.map((chapter1, j) => (
                                                                      <Grid key={chapter1.chapterId} className="custom-header">
                                                                          <Grid container spacing={2} alignItems="center">
                                                                              <Grid item xs={12}>
                                                                                  <Grid container spacing={2} alignItems="center">
                                                                                      <Grid item xs={9} display="flex" alignItems="center">
                                                                                          <Grid item xs={1.2}>
                                                                                              {i + 1}.{j + 1}.
                                                                                          </Grid>
                                                                                          <Grid item xs={8}>
                                                                                              {editChapterId === chapter1.chapterId ? (
                                                                                                  <TextField size="small"
                                                                                                      fullWidth
                                                                                                      value={editChapterForm.editChapterName}
                                                                                                      onChange={(e) => setEditChapterForm({ editChapterName: e.target.value })}
                                                                                                  />
                                                                                              ) : (
                                                                                                  <TextField size="small"
                                                                                                      fullWidth
                                                                                                      value={chapter1.chapterName}
                                                                                                      InputProps={{ readOnly: true }}
                                                                                                  />
                                                                                              )}
                                                                                          </Grid>
                                                                                          <Grid item xs={3} m={1} display={editChapterId === chapter1.chapterId ? 'none' : 'block'}>
                                                                                              <Tooltip title="Edit">
                                                                                                  <span>
                                                                                                      <IconButton onClick={() => enableEditChapter(chapter1.chapterId, 'edit', chapter1.chapterName, chapter.chapterId, 1)}>
                                                                                                          <i className="material-icons" style={{ color: 'orange' }}>edit</i>
                                                                                                      </IconButton>
                                                                                                  </span>
                                                                                              </Tooltip>
                                                                                          </Grid>
                                                                                          <Grid item xs={3} m={1} display={editChapterId === chapter1.chapterId ? 'flex' : 'none'}>
                                                                                              <Tooltip title="Update">
                                                                                                  <span>
                                                                                                      <IconButton onClick={() => updateChapterName(chapter1.chapterId)} disabled={!editChapterForm.editChapterName}>
                                                                                                          <i className="material-icons" style={{ color: '#198754' }}>update</i>
                                                                                                      </IconButton>
                                                                                                  </span>
                                                                                              </Tooltip>
                                                                                              <Tooltip title="Cancel Edit">
                                                                                                  <span>
                                                                                                      <IconButton onClick={() => enableEditChapter(chapter1.chapterId, '')}>
                                                                                                          <i className="material-icons" style={{ color: 'red' }}>close</i>
                                                                                                      </IconButton>
                                                                                                  </span>
                                                                                              </Tooltip>
                                                                                          </Grid>
                                                                                      </Grid>
                                                                                      <Grid item xs={3} display="flex" justifyContent="flex-end">
                                                                                          <Tooltip title={ChapterIdSecondLvl === chapter1.chapterId ? 'Expand less' : 'Expand more'}>
                                                                                              <Button onClick={() => getSubChapters(chapter1.chapterId, 2)}>
                                                                                                  {ChapterIdSecondLvl === chapter1.chapterId ? (
                                                                                                      <i className="material-icons" style={{ fontSize: '30px', color: '#FF0800' }}>expand_less</i>
                                                                                                  ) : (
                                                                                                      <i className="material-icons" style={{ fontSize: '30px', color: '#138808' }}>expand_more</i>
                                                                                                  )}
                                                                                              </Button>
                                                                                          </Tooltip>
                                                                                          <Tooltip title="Open in editor">
                                                                                              <span>
                                                                                                  <Button onClick={() => getQaQtQmChaptersDto(chapter1)}>
                                                                                                      <i className="material-icons" style={{ color: 'orange' }}>edit_note</i>
                                                                                                  </Button>
                                                                                              </span>
                                                                                          </Tooltip>
                                                                                          <Tooltip title="Remove">
                                                                                              <span>
                                                                                                  <Button onClick={() => deleteChapterById(chapter.chapterId, chapter1.chapterId, 1)} className='delete-icon'>
                                                                                                      <i className="material-icons">remove</i>
                                                                                                  </Button>
                                                                                              </span>
                                                                                          </Tooltip>
                                                                                      </Grid>
                                                                                  </Grid>

                                                                                  {/* Third Level (Nested) */}
                                                                                  {ChapterIdSecondLvl === chapter1.chapterId && (
                                                                                      <Grid>
                                                                                          {ChapterListSecondLvl.map((chapter2, k) => (
                                                                                              <Grid spacing={2} key={chapter2.chapterId} className="custom-header" alignItems="center">
                                                                                                  <Grid item xs={12}>
                                                                                                      <Grid container spacing={2} alignItems="center">
                                                                                                          <Grid item xs={9} display="flex" alignItems="center">
                                                                                                              <Grid item xs={1.5}>
                                                                                                                  {i + 1}.{j + 1}.{k + 1}.
                                                                                                              </Grid>
                                                                                                              <Grid item xs={8}>
                                                                                                                  {editChapterId === chapter2.chapterId ? (
                                                                                                                      <TextField size="small"
                                                                                                                          fullWidth
                                                                                                                          value={editChapterForm.editChapterName}
                                                                                                                          onChange={(e) => setEditChapterForm({ editChapterName: e.target.value })}
                                                                                                                      />
                                                                                                                  ) : (
                                                                                                                      <TextField size="small"
                                                                                                                          fullWidth
                                                                                                                          value={chapter2.chapterName}
                                                                                                                          InputProps={{ readOnly: true }}
                                                                                                                      />
                                                                                                                  )}
                                                                                                              </Grid>
                                                                                                              <Grid item xs={2} m={1} display={editChapterId === chapter2.chapterId ? 'none' : 'block'}>
                                                                                                                  <Tooltip title="Edit">
                                                                                                                      <IconButton onClick={() => enableEditChapter(chapter2.chapterId, 'edit', chapter2.chapterName, chapter1.chapterId, 2)}>
                                                                                                                          <i className="material-icons" style={{ color: 'orange' }}>edit</i>
                                                                                                                      </IconButton>
                                                                                                                  </Tooltip>
                                                                                                              </Grid>
                                                                                                              <Grid item xs={3} m={1} display={editChapterId === chapter2.chapterId ? 'flex' : 'none'}>
                                                                                                                  <Tooltip title="Update">
                                                                                                                      <IconButton onClick={() => updateChapterName(chapter2.chapterId, 2, chapter1.chapterId)} disabled={!editChapterForm.editChapterName}>
                                                                                                                          <i className="material-icons" style={{ color: '#198754' }}>update</i>
                                                                                                                      </IconButton>
                                                                                                                  </Tooltip>
                                                                                                                  <Tooltip title="Cancel Edit">
                                                                                                                      <IconButton onClick={() => enableEditChapter(chapter2.chapterId, '')}>
                                                                                                                          <i className="material-icons" style={{ color: 'red' }}>close</i>
                                                                                                                      </IconButton>
                                                                                                                  </Tooltip>
                                                                                                              </Grid>
                                                                                                          </Grid>

                                                                                                          {/* Third Level Buttons */}
                                                                                                          <Grid item xs={3} display="flex" justifyContent="flex-end">
                                                                                                              <Tooltip title="Open in editor">
                                                                                                                  <Button onClick={() => getQaQtQmChaptersDto(chapter2)}>
                                                                                                                      <i className="material-icons" style={{ color: 'orange' }}>edit_note</i>
                                                                                                                  </Button>
                                                                                                              </Tooltip>
                                                                                                              <Tooltip title="Remove">
                                                                                                                  <Button onClick={() => deleteChapterById(chapter1.chapterId, chapter2.chapterId, 2)} className='delete-icon'>
                                                                                                                      <i className="material-icons">remove</i>
                                                                                                                  </Button>
                                                                                                              </Tooltip>
                                                                                                          </Grid>
                                                                                                      </Grid>
                                                                                                  </Grid>
                                                                                              </Grid>
                                                                                          ))}
                                                                                          {/* Add New Sub Chapter */}
                                                                                          <Grid className="custom-header" alignItems="center">
                                                                                              <Grid item xs={9}>
                                                                                                  <Grid container spacing={2} alignItems="center">
                                                                                                      <Grid item xs={1.5}>
                                                                                                          {i + 1}.{j + 1}.{ChapterListSecondLvl?.length > 0 ? ChapterListSecondLvl.length + 1 : 1}.
                                                                                                      </Grid>
                                                                                                      <Grid item xs={8}>
                                                                                                          <TextField size="small"
                                                                                                              fullWidth
                                                                                                              label="Add New Sub Chapter"
                                                                                                              value={AddNewChapterFormThirdLvl.SubChapterName}
                                                                                                              onChange={(e) => setAddNewChapterFormThirdLvl({ SubChapterName: e.target.value })}
                                                                                                          />
                                                                                                      </Grid>
                                                                                                      <Grid item xs={2.5}>
                                                                                                          <Button
                                                                                                              onClick={() => submitAddSubChapterForm(chapter1.chapterId, 2, AddNewChapterFormThirdLvl.SubChapterName)}
                                                                                                              disabled={!AddNewChapterFormThirdLvl.SubChapterName}
                                                                                                              variant="contained"
                                                                                                              color="primary"
                                                                                                          >
                                                                                                              Add
                                                                                                          </Button>
                                                                                                      </Grid>
                                                                                                  </Grid>

                                                                                              </Grid>
                                                                                          </Grid>
                                                                                      </Grid>
                                                                                  )}

                                                                              </Grid>
                                                                          </Grid>
                                                                      </Grid>
                                                                  ))}

                                                                  <Grid className="custom-header" alignItems="center">
                                                                      <Grid item xs={9}>
                                                                          <Grid container spacing={2} alignItems="center">
                                                                              <Grid item xs={1.2}>
                                                                                  {i + 1}.{ChapterListFirstLvl?.length > 0 ? ChapterListFirstLvl.length + 1 : 1}.
                                                                              </Grid>
                                                                              <Grid item xs={7.7}>
                                                                                  <TextField
                                                                                      size="small"
                                                                                      fullWidth
                                                                                      label="Add New Sub Chapter"
                                                                                      value={AddNewChapterFormSecondLvl.SubChapterName}
                                                                                      onChange={(e) => setAddNewChapterFormSecondLvl({ SubChapterName: e.target.value })}
                                                                                  />
                                                                              </Grid>
                                                                              <Grid item xs={2}>
                                                                                  <Button
                                                                                      onClick={() => submitAddSubChapterForm(chapter.chapterId, 1, AddNewChapterFormSecondLvl.SubChapterName)}
                                                                                      disabled={!AddNewChapterFormSecondLvl.SubChapterName}
                                                                                      variant="contained"
                                                                                      color="primary"
                                                                                  >
                                                                                      Add
                                                                                  </Button>
                                                                              </Grid>
                                                                          </Grid>
                                                                      </Grid>
                                                                  </Grid>

                                                              </Grid>
                                                          )}



                                                          {/* Second Level End */}

                                                      </Grid>

                                                  </Grid>



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
                                              {/* <Grid className="custom-header" alignItems="center">
                                                  <Grid item xs={8}>
                                                      <Grid container spacing={2} alignItems="center">
                                                          <Grid item xs={1}>
                                                              {AllChapters?.length > 0 ? AllChapters.length + 1 : 1}.
                                                          </Grid>
                                                          <Grid item xs={9}>
                                                              <TextField size="small"
                                                                  fullWidth
                                                                  label="Add New Sub Chapter"
                                                                  value={AddNewChapterFormThirdLvl.SubChapterName}
                                                                  onChange={(e) => setAddNewChapterFormThirdLvl({ SubChapterName: e.target.value })}
                                                              />
                                                          </Grid>
                                                          <Grid item xs={2}>
                                                              <Button
                                                                  onClick={() => submitAddSubChapterForm(0, 0, AddNewChapterFormThirdLvl.SubChapterName)}
                                                                  disabled={!AddNewChapterFormThirdLvl.SubChapterName}
                                                                  variant="contained"
                                                                  color="primary"
                                                              >
                                                                  Add
                                                              </Button>
                                                          </Grid>
                                                      </Grid>

                                                  </Grid>
                                              </Grid> */}
                                          </CardContent>
                                      </Card>
                                  </Grid>


                                  <Grid item xs={12} md={6}>
                                      <Card className="text-start">
                                          {AllChapters.length>0 && (
                                          <CardContent
                                              sx={{
                                                  height: '75vh',
                                                  overflowY: 'auto',
                                                  border: '0.3px solid #ABB2B9',
                                              }}
                                          >
                                              <div className="d-flex flex-row m-2" >
                                                  <div >
                                                      <Typography
                                                          // variant="h5"
                                                          component="div"
                                                          className="editor-title"
                                                          sx={{
                                                              backgroundColor: '#ffc107',
                                                              color: '#000',
                                                              paddingY: 1,
                                                              paddingX: 2,
                                                              borderRadius: '999px',
                                                              display: 'inline-block',
                                                          }}
                                                      >
                                                          {EditorTitle}
                                                      </Typography>
                                                  </div>
                                                  <div className="w-50">
                                                      <ol className="w-100">
                                                          <li className="mb-2">
                                                              <div className="d-flex align-items-center">
                                                                  <span className='me-3'>Is Pagebreak?</span>
                                                                  <FormControlLabel
                                                                      control={
                                                                          <Switch
                                                                              color="primary"
                                                                              checked={isPagebreakAfter}
                                                                              onChange={handlePagebreakChange}
                                                                          />
                                                                      }
                                                                  />
                                                              </div>
                                                          </li>
                                                          <li>
                                                              <div className="d-flex align-items-center">
                                                                  <span className='me-3' >Is Landscape?</span>
                                                                  <FormControlLabel
                                                                      control={
                                                                          <Switch
                                                                              color="primary"
                                                                              checked={isLandscape}
                                                                              onChange={handleLandscapeChange}
                                                                          />
                                                                      }
                                                                  />
                                                              </div>
                                                          </li>
                                                      </ol>
                                                  </div>
                                              </div>

                                              <div>
                                                  <textarea id="summernote" ></textarea>
                                              </div>
                                                  {/* <div>{editorContent}</div> */}

                                              <div mt={3} className="text-center mt-1">
                                                  <button
                                                      className='btn edit'
                                                      onClick={() => updateEditorContent()}
                                                  >
                                                      Update
                                                  </button>
                                              </div>
                                          </CardContent>
                                          )}
                                      </Card>
                                  </Grid>



                              </Grid>
                          </Grid>
                      </Grid>
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
                  {/* <ConfirmationDialog open={openEditorContentConfirmationDialog} onClose={handleEditorContentDialogClose} onConfirm={handleEditorContentDialogConfirm} message={'Are you sure to update ?'} />*/}
                  {/* <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ marginTop: '50px' }}> 
                      <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                          {snackbarMessage}
                      </Alert>
                  </Snackbar> */}
                  {/* <QaqtDocsAddDocContentAddSectionDialog
                      open={openDialog}
                      onClose={handleCloseSectionDialog}
                      versionElements={versionElements}
                  /> */}
                  <QmAddSectionDialog
                      open={openDialog}
                      onClose={handleCloseSectionDialog}
                      revisionElements={revisionElements}
                  />
              </div>
          </div>

      </div>
  );
};

export default withRouter(QmAddDocContentComponent);