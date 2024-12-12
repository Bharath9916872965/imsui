import { useEffect, useState } from "react";
import withRouter from "common/with-router";
import {addChapterNameById } from "services/qms.service";
import { getMocTotalList,CheckListMaster,updateChapterDescById,deleteChapterDescById,addNewChapter,addChapterToMasters,deleteSubChapterDescById,updateCheckListChapters } from "services/audit.service";
import {Button, Card, CardContent, Grid, IconButton, TextField, Tooltip,Box,Checkbox} from '@mui/material';
import { Helmet } from 'react-helmet';

import './check-list.css';

import $ from 'jquery';

import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite.js';
import Navbar from "components/Navbar/Navbar";
import AlertConfirmation from "common/AlertConfirmation.component";
import AddChecklistSectionDialog from "./add-checklist-section";

const CheckListMasterComponent = ({ router }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allChapters, setAllChapters] = useState([]);
  const [filChapters, setFilChapters] = useState([]);
  const [mocId,setMocId] = useState(undefined)
  const [ChapterListFirstLvl, setChapterListFirstLvl] = useState([]);
  const [ChapterListSecondLvl, setChapterListSecondLvl] = useState([]);
  const [ChapterListThirdLvl, setChapterListThirdLvl] = useState([]);
  const [ChapterListFourthLvl, setChapterListFourthLvl] = useState([]);

  const [editMocId, setEditMocId] = useState(null);
  const [editLv1MocId, setEditLv1MocId] = useState(null);
  const [editLv2MocId, setEditLv2MocId] = useState(null);
  const [editLv3MocId, setEditLv3MocId] = useState(null);
  const [editLv4MocId, setEditLv4MocId] = useState(null);
  const [sectionNo, setSectionNo] = useState(null);
  const [mocParentLv1Id,setMocParentLv1Id] = useState(null)
  const [mocParentLv2Id,setMocParentLv2Id] = useState(null)
  const [mocParentLv3Id,setMocParentLv3Id] = useState(null)
  const [lv1Desc, setLv1Desc] = useState('');
  const [lv2Desc, setLv2Desc] = useState('');
  const [lv3Desc, setLv3Desc] = useState('');
  const [lv4Desc, setLv4Desc] = useState('');
  const [editMocValue,setEditMocValue] = useState('')
  const [openDialog, setOpenDialog] = useState(false);
  const [firstLvlDesc,setFirstLvlDesc] = useState(undefined)
  const [secondLvlDesc,setSecondLvlDesc] = useState(undefined)
  const [thirdLvlDesc,setThirdLvlDesc] = useState(undefined)
  const [fourthLvlDesc,setFourthLvlDesc] = useState(undefined)
  const [mocIds, setMocIds] = useState([]);

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


  useEffect(() => {
      $.fn.tooltip = function () {
          return this;
      };
  }, []);

  const getAllChapters = async () => {
      try {
          let allChapters = await getMocTotalList();
          setMocIds(allChapters.filter(data => data.isForCheckList === 'Y').map(data => data.mocId) || []);
          setAllChapters(allChapters);
          allChapters=allChapters.filter(obj =>  Number(obj.clauseNo) === Number(obj.sectionNo) && obj.isActive === 1) 
          setFilChapters(allChapters);

      }catch (error) {
          setError('An error occurred');
          setIsLoading(false);
          console.error(error)
      }
  };




  const afterSubmit = async (level) =>{

    try {
        const allChapters = await getMocTotalList();
        setAllChapters(allChapters);
        const filterChapters = allChapters.filter(obj =>  Number(obj.clauseNo) === Number(obj.sectionNo) && obj.isActive === 1) 
        setFilChapters(filterChapters);
        if(level === 1){
            const lv1 =  allChapters.filter(data => data.sectionNo === sectionNo && data.mocId !== mocId && data.mocParentId === mocId && data.isActive === 1);
            setFirstLvlDesc('');
            setChapterListFirstLvl(lv1);
            setEditLv1MocId(null);
        }
        if(level === 2){
            setChapterListSecondLvl(allChapters.filter(data => data.mocParentId === mocParentLv1Id && data.isActive === 1));
            setSecondLvlDesc('');
            setEditLv2MocId(null)
        }
        if(level === 3){
            setChapterListThirdLvl(allChapters.filter(data => data.mocParentId === mocParentLv2Id && data.isActive === 1));
            setThirdLvlDesc('');
            setEditLv3MocId(null)
        }
        if(level === 4){
            setChapterListFourthLvl(allChapters.filter(data => data.mocParentId === mocParentLv3Id && data.isActive === 1));
            setFourthLvlDesc('');
            setEditLv4MocId(null)
        }

    } catch (error) {
        setError('An error occurred');
        setIsLoading(false);
        console.error(error)
    }
  }


  const getSubChapters = async (sectionNo,mocId, level) => {
      if (level === 1) {
          setMocId(mocId)
          setSectionNo(prevId => prevId === sectionNo ? null : sectionNo);
          const lv1 =  allChapters.filter(data => data.sectionNo === sectionNo && data.mocId !== mocId && data.mocParentId === mocId && data.isActive === 1)
          setChapterListFirstLvl(lv1);
      } else if (level === 2) {
        setMocParentLv1Id(prevId => prevId === mocId ? null : mocId);
        setChapterListSecondLvl(allChapters.filter(data => data.mocParentId === mocId && data.isActive === 1));
      }else if(level === 3){
        setMocParentLv2Id(prevId => prevId === mocId ? null : mocId);
        setChapterListThirdLvl(allChapters.filter(data => data.mocParentId === mocId && data.isActive === 1));
      }else if(level === 4){
        setMocParentLv3Id(prevId => prevId === mocId ? null : mocId);
        setChapterListFourthLvl(allChapters.filter(data => data.mocParentId === mocId && data.isActive === 1));
      }
  };


  const enableEditMoc = (mocId,mode,desc,level) => {
    if(level === 0){
        setSectionNo(null);
        setEditMocValue(desc)
        if (mode === 'edit') {
            setEditMocId(mocId);
        } else {
            setEditMocId(null);
        }
    }else if(level === 1){
        setLv1Desc(desc)
        if (mode === 'edit') {
            setEditLv1MocId(mocId);
        } else {
            setEditLv1MocId(null);
        }
    }else if(level === 2){
        setLv2Desc(desc)
        if (mode === 'edit') {
            setEditLv2MocId(mocId);
        } else {
            setEditLv2MocId(null);
        }
    }else if(level === 3){
        setLv3Desc(desc)
        if (mode === 'edit') {
            setEditLv3MocId(mocId);
        } else {
            setEditLv3MocId(null);
        }
    }else if(level === 4){
        setLv4Desc(desc)
        if (mode === 'edit') {
            setEditLv4MocId(mocId);
        } else {
            setEditLv4MocId(null);
        }
    }
  }

    const updateChapterName = async (mocId,level) => {
        const isConfirmed = await AlertConfirmation({
            title: 'Are you sure to update ?',
            message: '',
        });

        if (isConfirmed) {
            let res = await updateChapterDescById(new CheckListMaster(mocId, (level === 0?editMocValue:(level === 1?lv1Desc:level === 2?lv2Desc:level === 3?lv3Desc:lv4Desc)),'',0,''));

            if (res && res  === 'Successfully') {
                afterSubmit(level);
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
        setEditMocId(null);
    };

  const deleteChapterById = async ( mocId,level) => {
        
        const isConfirmed = await AlertConfirmation({
            title: 'Are you sure to delete ?',
            message: '',
        });

        if (isConfirmed) {
         if(level === 0){
            let res = await deleteChapterDescById(mocId);
            if (res && res === 'S') {
                afterSubmit(level);
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
         }else{
            let res = await deleteSubChapterDescById(mocId);
            if (res && res === 'S') {
                afterSubmit(level);
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
    }

  };

    const addSubChapter = async (mocId, level, clauseNo) => {

        const isConfirmed = await AlertConfirmation({
            title: 'Are you sure to add chapter ?',
            message: '',
        });
        if (isConfirmed) {
            try {
                if(level === 1 || level === 2 || level === 3 || level === 4){
                    const response = await addNewChapter(new CheckListMaster(mocId,(level === 1?firstLvlDesc:level === 2?secondLvlDesc:level === 3?thirdLvlDesc:fourthLvlDesc),sectionNo,level,clauseNo));
                    if (response && response  === 'Successfully') {
                        afterSubmit(level);
                        Swal.fire({
                            icon: "success",
                            title: "Chapter Added Successfully!",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Chapter Added Unsuccessful!",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                }
            } catch {
                setError('An error occurred');
                setIsLoading(false);
                console.error(error)
            }
        }
    };

    const handleOpenUnaddedSections = () => {
        setOpenDialog(true)
    };

    const handleCloseSectionDialog = () => {
        setOpenDialog(false)
    };

    const handleChapterAddConfirm = async(mocIds)=>{

            const isConfirmed = await AlertConfirmation({
                title: 'Do you want to Add Chapters To CheckList Master ?',
                message: '',
            });
    
            if (isConfirmed) {
            const response = await addChapterToMasters(mocIds);
            if (response && response  === 'Successfully') { 
                afterSubmit(0);
                setOpenDialog(false)
                Swal.fire({
                    icon: "success",
                    title: "Chapters Added Successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Chapters Added Unsuccessful!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    }

    const updateCheckList = async()=>{
        if(mocIds.length === 0){
            Swal.fire({
                icon: "error",
                title: "Please Select Chapters",
                showConfirmButton: false,
                timer: 1500
            });
        }else{
            const isConfirmed = await AlertConfirmation({
                title: 'Do you want to Update CheckList Chapters ?',
                message: '',
            });
    
            if (isConfirmed) {
            const response = await updateCheckListChapters(mocIds);
            if (response && response  === 'Successfully') { 
                let allChapters = await getMocTotalList();
                setMocIds(allChapters.filter(data => data.isForCheckList === 'Y').map(data => data.mocId) || []);
                setOpenDialog(false)
                Swal.fire({
                    icon: "success",
                    title: "Chapters Added Successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Chapters Added Unsuccessful!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }

        }
    }

    const handleCheckboxChange = (id, event) => {
        if (event.target.checked) {
            setMocIds([...mocIds, id]);
        } else {
            setMocIds(mocIds.filter((val) => val !== id));
        }
    };

  return (
      <div className="main-body">
          <Helmet><title>IMS - CHECK-LIST-MASTER</title></Helmet>
          <Navbar/>
          <div id="main-container" className='main-container'>
           <div id="main-wrapper">
            <div className="subHeadingLink d-flex ">
             <div align='left' className="d-flex flex-column flex-md-row gap-1"><h4>Check List Master</h4></div>
             <div className="d-flex gap-2"><button onClick={() => updateCheckList()} className="btn btn-success">Submit</button></div> 
             {/* <button className="btn btn-primary" title="Add New Chapter"  onClick={handleOpenUnaddedSections}><i className="material-icons">playlist_add</i></button>*/}
            </div>
            
            <div id="card-body" >
             <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
               <Card>
                <CardContent className="card-content" >
                 {filChapters.map((chapter, i) => (
                  <Grid key={i}>
                   <Grid className="custom-header main-header">
                   <Box display="flex" alignItems="center" gap="10px">
                      <Box flex="4%"><Checkbox checked={mocIds.includes(chapter.mocId)} value={chapter.mocId} onChange={(event) => handleCheckboxChange(chapter.mocId, event)}/></Box>
                      <Box flex="3%">{chapter.clauseNo}.</Box>
                      <Box flex="86%">
                        {editMocId === chapter.mocId ? (<TextField size="small" fullWidth value={editMocValue} onChange={(e) =>setEditMocValue( e.target.value )}/>
                        ):(<TextField size="small" fullWidth value={chapter.description} InputProps={{ readOnly: true }}/>)}
                      </Box>
                      {/* {editMocId !== chapter.mocId ? (
                      <Box flex="5%">
                       <Tooltip title="Edit"><span>
                        <IconButton className="btn-styles" onClick={(e) => enableEditMoc(chapter.mocId, 'edit',chapter.description,0)}><i className="material-icons" style={{ color: 'orange' }}>edit</i></IconButton>
                       </span></Tooltip>
                      </Box>
                      ) : (
                      <Box flex="5%">
                       <Tooltip title="Update"><span>
                        <IconButton className="btn-styles" onClick={() => updateChapterName(chapter.mocId,0)}><i className="material-icons" style={{ color: '#198754' }}>update</i></IconButton>
                       </span></Tooltip>
                       <Tooltip title="Cancel Edit"><span>
                        <IconButton className="btn-styles" onClick={() => enableEditMoc(chapter.mocId, '','',0)}><i className="material-icons" style={{ color: 'red' }}>close</i></IconButton>
                       </span></Tooltip>
                      </Box>
                      )} */}
                     <Box flex="7%" display="flex" justifyContent="flex-end">
                      <Tooltip title={sectionNo === chapter.sectionNo ? 'Expand less' : 'Expand more'}><span>
                       <Button className="btn-styles expand-less" onClick={() => getSubChapters(chapter.sectionNo,chapter.mocId, 1)}>
                        {sectionNo === chapter.sectionNo ?(<i className="material-icons ex-less" >expand_less</i>):(<i className="material-icons ex-more" >expand_more</i>)}
                       </Button>
                      </span></Tooltip>
                      <Tooltip title="Remove"><span>
                        <Button   onClick={() => deleteChapterById( chapter.mocId,0)} className='delete-icon btn-styles'><i className="material-icons">remove</i></Button>
                      </span></Tooltip> 
                     </Box>
                    </Box>
                    {/* Second Level Start */}
                    {sectionNo === chapter.sectionNo && (<><br />
                     {ChapterListFirstLvl.map((chapter1, j) => (
                     <Grid key={chapter1.mocId} className="custom-header sub-header">
                      <Box display="flex" alignItems="center" gap="10px">
                         <Box flex="4%"><Checkbox checked={mocIds.includes(chapter1.mocId)} value={chapter1.mocId} onChange={(event) => handleCheckboxChange(chapter1.mocId, event)}/></Box>
                         <Box flex="3%">{chapter1.clauseNo}.</Box>
                         <Box flex="76%">
                         {editLv1MocId === chapter1.mocId ? (
                          <TextField size="small" fullWidth alue={lv1Desc} onChange={(e) => setLv1Desc(e.target.value)}/>):(
                          <TextField size="small" fullWidth value={chapter1.description} InputProps={{ readOnly: true }} />
                         )}</Box>
                         <Box flex="5%" display={editLv1MocId === chapter1.mocId ? 'none' : 'block'}>
                          <Tooltip title="Edit"><span>
                           <IconButton className="btn-styles" onClick={() => enableEditMoc(chapter1.mocId, 'edit', chapter1.description,1)}><i className="material-icons cl-orange" >edit</i></IconButton>
                          </span></Tooltip>
                         </Box>
                         <Box flex="5%" display={editLv1MocId === chapter1.mocId ? 'flex' : 'none'}>
                          <Tooltip title="Update"><span>
                           <IconButton className="btn-styles" onClick={() => updateChapterName(chapter1.mocId,1)} ><i className="material-icons cl-update" >update</i></IconButton>
                          </span></Tooltip>
                          <Tooltip title="Cancel Edit"><span>
                           <IconButton className="btn-styles" onClick={() => enableEditMoc(chapter1.mocId, '','',1)}><i className="material-icons cl-red" >close</i></IconButton>
                          </span></Tooltip>
                         </Box>
                        <Box flex="7%" display="flex" justifyContent="flex-end">
                         <Tooltip title={mocParentLv1Id === chapter1.mocId ? 'Expand less' : 'Expand more'}>
                          <Button className="btn-styles expand-less" onClick={() => getSubChapters(chapter1.sectionNo,chapter1.mocId, 2)}>{mocParentLv1Id === chapter1.mocId ? (<i className="material-icons ex-less font-30" >expand_less</i>
                                                                                                                    ) : (<i className="material-icons ex-more font-30" >expand_more</i>
                          )}</Button>
                         </Tooltip>
                         <Tooltip title="Remove"><span>
                          <Button onClick={() => deleteChapterById(chapter1.mocId,1)}  className='delete-icon btn-styles'><i className="material-icons">remove</i></Button>
                         </span></Tooltip>
                        </Box>
                      </Box>
                 
                      {/* Third Level (Nested) */}
                      {mocParentLv1Id === chapter1.mocId && (
                      <Grid><br />
                      {ChapterListSecondLvl.map((chapter2, k) => (
                       <Grid key={chapter2.mocId} className="custom-header sub-header">
                       <Box display="flex" alignItems="center" gap="10px">
                         <Box flex="4%"><Checkbox checked={mocIds.includes(chapter2.mocId)} value={chapter2.mocId} onChange={(event) => handleCheckboxChange(chapter2.mocId, event)}/></Box>
                         <Box flex="3%">{chapter2.clauseNo}.</Box>
                         <Box flex="76%">{editLv2MocId === chapter2.mocId ? 
                          (<TextField size="small" fullWidth value={lv2Desc} onChange={(e) => setLv2Desc(e.target.value)}/>) : 
                          (<TextField size="small" fullWidth value={chapter2.description} InputProps={{ readOnly: true }}/>)}
                         </Box>
                         <Box flex="5%" display={editLv2MocId === chapter2.mocId ? 'none' : 'block'}>
                          <Tooltip title="Edit"><IconButton className="btn-styles" onClick={() => enableEditMoc(chapter2.mocId, 'edit', chapter2.description,2)}><i className="material-icons cl-orange" >edit</i></IconButton></Tooltip>
                         </Box>
                         <Box flex="5%" display={editLv2MocId === chapter2.mocId ? 'flex' : 'none'}>
                          <Tooltip title="Update"><IconButton className="btn-styles" onClick={() => updateChapterName(chapter2.mocId, 2)} ><i className="material-icons cl-update" >update</i></IconButton></Tooltip>
                          <Tooltip title="Cancel Edit"><IconButton className="btn-styles" onClick={() => enableEditMoc(chapter2.mocId, '','',2)}><i className="material-icons cl-red" >close</i></IconButton></Tooltip>
                         </Box>
                        <Box flex="7%" display="flex" justifyContent="flex-end">
                           <Tooltip title={mocParentLv2Id === chapter2.mocId ? 'Expand less' : 'Expand more'}>
                             <Button className="btn-styles expand-less" onClick={() => getSubChapters(chapter2.sectionNo,chapter2.mocId, 3)}>{mocParentLv2Id === chapter2.mocId ? (<i className="material-icons ex-less font-30" >expand_less</i>
                                                                                                                    ) : (<i className="material-icons ex-more font-30" >expand_more</i>
                             )}</Button>
                          </Tooltip>
                          <Tooltip title="Remove"><Button onClick={() => deleteChapterById(chapter2.mocId,2)} className='delete-icon btn-styles'><i className="material-icons">remove</i></Button></Tooltip>
                        </Box>
                       </Box>
                       
                       {/* Fourth Level (Nested) */}
                       {mocParentLv2Id === chapter2.mocId && (
                       <Grid><br />
                        {ChapterListThirdLvl.map((chapter3, l) => (
                        <Grid key={chapter3.mocId} className="custom-header sub-header">
                        <Box display="flex" alignItems="center" gap="10px">
                            <Box flex="4%"><Checkbox checked={mocIds.includes(chapter3.mocId)} value={chapter3.mocId} onChange={(event) => handleCheckboxChange(chapter3.mocId, event)}/></Box>
                            <Box flex="3%">{chapter3.clauseNo}.</Box>
                            <Box flex="76%">{editLv3MocId === chapter3.mocId ?
                                (<TextField size="small" fullWidth value={lv3Desc} onChange={(e) => setLv3Desc(e.target.value)} />) :
                                (<TextField size="small" fullWidth value={chapter3.description} InputProps={{ readOnly: true }} />)}
                            </Box>
                            <Box flex="5%" display={editLv3MocId === chapter3.mocId ? 'none' : 'block'}>
                                <Tooltip title="Edit"><IconButton className="btn-styles" onClick={() => enableEditMoc(chapter3.mocId, 'edit', chapter3.description, 3)}><i className="material-icons cl-orange" >edit</i></IconButton></Tooltip>
                            </Box>
                            <Box flex="5%" display={editLv3MocId === chapter3.mocId ? 'flex' : 'none'}>
                                <Tooltip title="Update"><IconButton className="btn-styles" onClick={() => updateChapterName(chapter3.mocId, 3)} ><i className="material-icons cl-update" >update</i></IconButton></Tooltip>
                                <Tooltip title="Cancel Edit"><IconButton className="btn-styles" onClick={() => enableEditMoc(chapter3.mocId, '', '', 3)}><i className="material-icons cl-red" >close</i></IconButton></Tooltip>
                            </Box>
                            <Box flex="7%" display="flex" justifyContent="flex-end">
                                <Tooltip title={mocParentLv3Id === chapter3.mocId ? 'Expand less' : 'Expand more'}>
                                    <Button className="btn-styles expand-less" onClick={() => getSubChapters(chapter3.sectionNo, chapter3.mocId, 4)}>{mocParentLv3Id === chapter3.mocId ? (<i className="material-icons ex-less font-30">expand_less</i>
                                    ) : (<i className="material-icons ex-more font-30" >expand_more</i>
                                    )}</Button>
                                </Tooltip>
                                <Tooltip title="Remove"><Button onClick={() => deleteChapterById(chapter3.mocId, 3)} className='delete-icon btn-styles'><i className="material-icons">remove</i></Button></Tooltip>
                            </Box>
                        </Box>

                        {/* Fifth Level (Nested) */}
                        {mocParentLv3Id === chapter3.mocId && (
                        <Grid><br />
                         {ChapterListFourthLvl.map((chapter4, m) => (
                         <Grid key={chapter4.mocId} className="custom-header sub-header">
                            <Box display="flex" alignItems="center" gap="10px">
                                <Box flex="4%"><Checkbox checked={mocIds.includes(chapter4.mocId)} value={chapter4.mocId} onChange={(event) => handleCheckboxChange(chapter4.mocId, event)}/></Box>
                                <Box flex="3%">{chapter4.clauseNo}.</Box>
                                <Box flex="76%">{editLv4MocId === chapter4.mocId ?
                                    (<TextField size="small" fullWidth value={lv4Desc} onChange={(e) => setLv4Desc(e.target.value)} />) :
                                    (<TextField size="small" fullWidth value={chapter4.description} InputProps={{ readOnly: true }} />)}
                                </Box>
                                <Box flex="5%" display={editLv4MocId === chapter4.mocId ? 'none' : 'block'}>
                                    <Tooltip title="Edit"><IconButton className="btn-styles" onClick={() => enableEditMoc(chapter4.mocId, 'edit', chapter4.description, 4)}><i className="material-icons cl-orange" >edit</i></IconButton></Tooltip>
                                </Box>
                                <Box flex="5%" display={editLv4MocId === chapter4.mocId ? 'flex' : 'none'}>
                                    <Tooltip title="Update"><IconButton className="btn-styles" onClick={() => updateChapterName(chapter4.mocId, 4)} ><i className="material-icons cl-update" >update</i></IconButton></Tooltip>
                                    <Tooltip title="Cancel Edit"><IconButton className="btn-styles" onClick={() => enableEditMoc(chapter4.mocId, '', '', 4)}><i className="material-icons cl-red" >close</i></IconButton></Tooltip>
                                </Box>
                                <Box flex="7%" display="flex" justifyContent="flex-end">
                                    <Tooltip title="Remove"><Button onClick={() => deleteChapterById(chapter4.mocId, 4)} className='delete-icon btn-styles'><i className="material-icons">remove</i></Button></Tooltip>
                                </Box>
                            </Box>
                         </Grid>
                         ))}

                         {/* Add 5 Sub Chapter */}
                         <Grid className="custom-header sub-header" alignItems="center">
                            <Grid item xs={9}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={1.8}>{chapter.sectionNo}.{j + 1}.{k + 1}.{l + 1}.{ChapterListFourthLvl?.length > 0 ? ChapterListFourthLvl.length + 1 : 1}.</Grid>
                                    <Grid item xs={9}>
                                        <TextField size="small" fullWidth label="Add New Sub Chapter" value={fourthLvlDesc} onChange={(e) => setFourthLvlDesc(e.target.value)} />
                                    </Grid>
                                    <Grid item xs={1.2}>
                                        <Button onClick={() => addSubChapter(chapter3.mocId, 4, (chapter.sectionNo + '.' + (Number(j) + 1) + '.' + (Number(k) + 1) + '.' + (Number(l) + 1) + '.' + (ChapterListFourthLvl?.length > 0 ? ChapterListFourthLvl.length + 1 : 1)))} disabled={!(fourthLvlDesc && fourthLvlDesc.trim())} variant="contained" color="primary">Add</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                         </Grid>
                        </Grid>
                        )}
                        </Grid>
                        ))}

                        {/* Add 4 Sub Chapter */}
                        <Grid className="custom-header sub-header" alignItems="center">
                            <Grid item xs={9}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={1.8}>{chapter.sectionNo}.{j + 1}.{k + 1}.{ChapterListThirdLvl?.length > 0 ? ChapterListThirdLvl.length + 1 : 1}.</Grid>
                                    <Grid item xs={9}>
                                        <TextField size="small" fullWidth label="Add New Sub Chapter" value={thirdLvlDesc} onChange={(e) => setThirdLvlDesc(e.target.value)} />
                                    </Grid>
                                    <Grid item xs={1.2}>
                                        <Button onClick={() => addSubChapter(chapter2.mocId, 3, (chapter.sectionNo + '.' + (Number(j) + 1) + '.' + (Number(k) + 1) + '.' + (ChapterListThirdLvl?.length > 0 ? ChapterListThirdLvl.length + 1 : 1)))} disabled={!(thirdLvlDesc && thirdLvlDesc.trim())} variant="contained" color="primary">Add</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                       </Grid>
                       )}
                       </Grid>))}
                       {/* Add 3 Sub Chapter */}
                       <Grid className="custom-header sub-header" alignItems="center">
                        <Grid item xs={9}>
                         <Grid container spacing={2} alignItems="center">
                          <Grid item xs={1.8}>{chapter.sectionNo}.{j + 1}.{ChapterListSecondLvl?.length > 0 ? ChapterListSecondLvl.length + 1 : 1}.</Grid>
                          <Grid item xs={9}>
                            <TextField size="small" fullWidth label="Add New Sub Chapter" value={secondLvlDesc} onChange={(e) => setSecondLvlDesc(e.target.value)}/>
                          </Grid>
                          <Grid item xs={1.2}>
                            <Button onClick={() => addSubChapter(chapter1.mocId, 2, (chapter.sectionNo+'.'+(Number(j) + 1)+'.'+(ChapterListSecondLvl?.length > 0 ? ChapterListSecondLvl.length + 1 : 1)))}  disabled={!(secondLvlDesc && secondLvlDesc.trim())} variant="contained" color="primary">Add</Button>
                          </Grid>
                         </Grid>
                        </Grid>
                       </Grid>
                      </Grid>)}
                     </Grid>
                     ))}
                     <Grid className="custom-header sub-header" alignItems="center">
                      <Grid item xs={9}>
                       <Grid container spacing={2} alignItems="center">
                        <Grid item xs={1.7}>{chapter.sectionNo}.{ChapterListFirstLvl?.length > 0 ? ChapterListFirstLvl.length + 1 : 1}.</Grid>
                         <Grid item xs={9.7}>
                           <TextField size="small" fullWidth label="Add New Sub Chapter" value={firstLvlDesc} onChange={(e) => setFirstLvlDesc(e.target.value)}/>
                         </Grid>
                         <Grid item xs={0.5}>
                          <Button onClick={() => addSubChapter(chapter.mocId, 1, (chapter.sectionNo+'.'+(ChapterListFirstLvl?.length > 0 ? ChapterListFirstLvl.length + 1 : 1)))} disabled={!(firstLvlDesc && firstLvlDesc.trim())} variant="contained" color="primary">Add</Button>
                         </Grid>
                       </Grid>
                      </Grid>
                     </Grid>
                    </>)}
                    {/* Second Level End */}
                   </Grid>
                  </Grid>
                  ))}
                </CardContent>
               </Card>
              </Grid>
             </Grid>      
            </div>
           </div>
          </div>
          <AddChecklistSectionDialog open={openDialog} onClose={handleCloseSectionDialog} onConfirm={handleChapterAddConfirm} list = {allChapters} />
      </div>
  );
};

export default withRouter(CheckListMasterComponent);
