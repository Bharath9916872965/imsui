import React, { useEffect, useState,useRef } from "react";
import { Box,Grid,Card,CardContent,Tooltip,TextField} from '@mui/material';
import Navbar from "components/Navbar/Navbar";
import '../../auditor-list.component.css';
import withRouter from "common/with-router";
import { getMocTotalList,getObservation,AuditCheckList,addAuditCheckList,getAuditCheckList,updateAuditCheckList,uploadCheckListImage,CheckListImgDto } from "services/audit.service";
import { format } from "date-fns";
import SelectPicker from "components/selectpicker/selectPicker";
import AlertConfirmation from "common/AlertConfirmation.component";

const AuditCheckListComponent = ({router}) => {

  const {navigate,location} = router;
  const [element,setElement] = useState(undefined)
  const [masterChapters,setMasterChapters] = useState([]);
  const [mainClause,setMainClause] = useState([]);
  const [filMainClause,setFilMainClause] = useState([])
  const [sections,setSections] = useState([]);
  const sectionOpenRef = useRef('');
  const [observationList,setObservationList] = useState([]);
  const [selectOptions,setSelectOptions] = useState([]);
  const [observations, setObservations] = useState(new Map());
  const [remarks, setRemarks] = useState(new Map());
  const [checkListIds, setCheckListIds] = useState(new Map());
  const [checkList,setCheckList] = useState([]);
  const [isAddMode,setIsAddMode] = useState(true);
  const [successBtns,setSuccessBtns] = useState([]);
  const [unSuccessBtns,setunsuccessBtns] = useState([]);
  const [remarksValidation,setRemarksValidation] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);
  const [imgView, setimgView] = useState('');
  let attachMocId = 0;
  let auditorRemarks = false
  let lv1MocId ='';
  let leve1MocId ='';
  let k = 0;
  let l = 0;

  const fetchData = async () => {
    try {
      const eleData = router.location.state?.element;
      if(eleData){
        setElement(eleData)
       const chapters = await getMocTotalList();
       const obsList  = await getObservation();
       const chList   = await getAuditCheckList(eleData.scheduleId);
       console.log('chList-------- ',chList)
       setCheckList(chList)
       setButtoncolors(chList)
       setObservationList(obsList);
       const filChapters = chapters.filter(data => data.isActive == 1 && data.isForCheckList == 'Y')

       const filDoc =  obsList.map(item=>({
              value : item.auditObsId,
              label : item.observation
        }));
        setSelectOptions(filDoc)

       filChapters.sort((a, b) => {
        const splitA = a.clauseNo.split('.').map(Number); 
        const splitB = b.clauseNo.split('.').map(Number);
    
        for (let i = 0; i < Math.max(splitA.length, splitB.length); i++) {
            const numA = splitA[i] || 0; 
            const numB = splitB[i] || 0;
            if (numA !== numB) {
                return numA - numB; 
            }
        }
         return 0; 
      });
      setMasterChapters(filChapters) 
      const mainChapter =  filterMain(filChapters)
      setMainClause(mainChapter);
      setFilMainClause(mainChapter.filter((item, index, self) => index === self.findIndex((el)=>el.sectionNo === item.sectionNo)))
      sectionOpenRef.current = mainChapter && mainChapter.length > 0 && mainChapter[0].sectionNo;
      setInitialValues(mainChapter,mainChapter && mainChapter.length > 0 && mainChapter[0].sectionNo,filChapters,chList)
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setButtoncolors = (list)=>{
    let newSuccessBtns = [];
    let newUnsuccessBtns = [];
    const secs = [...new Set(list.map(data => data.sectionNo))];
    secs.forEach(item =>{
      if(setColor(list,item)){
        newUnsuccessBtns.push(String(item))
      }else{
        newSuccessBtns.push(String(item))
      }
    });
    setSuccessBtns(newSuccessBtns)
    setunsuccessBtns(newUnsuccessBtns)
  }

  const setColor = (list,sec)=>{
   return list.some(data => {
      if (Number(sec) === Number(data.sectionNo)) {
        if (data.auditObsId === 2 || data.auditObsId === 3 || data.auditObsId === 4) {
             return true; 
        }
      }
      return false;
    });

  }

  const afterSubmit = async ()=>{
    const chList   = await getAuditCheckList(element.scheduleId);
    setButtoncolors(chList)
    setCheckList(chList);
    if(isAddMode){
      const nextSection = getNextValue(sectionOpenRef.current);
      sectionOpenRef.current = nextSection;
      setInitialValues(mainClause,nextSection,masterChapters,chList)
    }else{
      setInitialValues(mainClause,sectionOpenRef.current,masterChapters,chList)
    }
  }

  const getNextValue = (value) => {
    const strValue = String(value); 
    const index = sections.indexOf(strValue); 
    if (index === -1 || index === (sections.length - 1)) {
      return value;
    } else {
      return sections[index + 1];
    }
  };
  

  const setInitialValues = (mainChapter,secNo,filChapter,chList)=>{
    setObservations(new Map());
    const initialObservations = new Map();
    const initialRemarks      = new Map();
    const inticheckListIds    = new Map();
    if(chList.some(data => Number(data.sectionNo) === Number(secNo))){
      chList.forEach((chapter) => {
        if (Number(chapter.sectionNo) === Number(secNo)) {
          initialObservations.set(chapter.mocId, chapter.auditObsId);
          initialRemarks.set(chapter.mocId, chapter.auditorRemarks);
          inticheckListIds.set(chapter.mocId,chapter.auditCheckListId)
        }
      });
      setIsAddMode(false);
      setCheckListIds(inticheckListIds);
    }else{

      mainChapter.forEach((chapter) => {
        if(Number(chapter.clauseNo) === Number(secNo)){
          initialObservations.set(chapter.mocId, 0);
          initialRemarks.set(chapter.mocId, 'NA');
        }
        if (Number(chapter.sectionNo) === Number(secNo)) {
              filChapter.forEach((chapter1) => {
                if(chapter1.mocParentId === chapter.mocId){
                  leve1MocId = chapter1.mocId;
                  if(!checksubChapter(chapter1.mocId)){
                    initialObservations.set(chapter1.mocId, 1);
                    initialRemarks.set(chapter1.mocId, 'NA');
                  }else{
                    initialObservations.set(chapter1.mocId, 0);
                    initialRemarks.set(chapter1.mocId, 'NA');
                  }
                }
                if(chapter1.mocParentId === leve1MocId){
                  initialObservations.set(chapter1.mocId, 1);
                  initialRemarks.set(chapter1.mocId, 'NA');
                }
              })
        }
      });

      setIsAddMode(true)
    }
    setObservations(initialObservations);
    setRemarks(initialRemarks);
  }

  const filterMain =(list)=>{
    const result = [];
    //filter All Main Chapters
    const sections = [...new Set(list.map(data =>data.sectionNo))];
    setSections(sections)
    sections.forEach(section =>{
      const sectionItems = list.filter(item => item.sectionNo === section);

      let level1 = 0;
      let level2 = 0;
      let level3 = 0;
      let clause = '';
      let j = 0;
      let k = 0;

      //loop each Main Chapter Content
      for(let i =0;i<sectionItems.length;i++){

        //inserting Main Chapter
          if(i === 0){
            level1 = sectionItems[i].mocId
            result.push(sectionItems[i]);
          }
          //skip we are having conitinues sub Chapter
          if(i !== 0 && sectionItems[i].mocParentId === level1){
            level2 = sectionItems[i].mocId;
            j = 0;
            k = 0
          }else if(i !== 0 && sectionItems[i].mocParentId === level2){
            //in sub chapter continues miss adding like 8.5.1 after 8.5.5
            if(clause !== '' && j !== 0){
              const cn1 = clause.split('.');
              const cn2 = sectionItems[i].clauseNo.split('.');
              if(!((Number(cn1[cn1.length -1])+1) === Number(cn2[cn2.length -1]))){
               result.push(sectionItems[i]);
               k++;
              }else if(k > 0){
                //continueing adding subchapters after break
                result.push(sectionItems[i]);
              }
            }
            j++;
            clause = sectionItems[i].clauseNo;
            level3 = sectionItems[i].mocId
          }else if(i !== 0 && sectionItems[i].mocParentId !== level3){
            result.push(sectionItems[i]);
            level2 = sectionItems[i].mocId;
            j = 0;
            k = 0
          }
      }
    })
    return result;
  }

  const toRoman = (num) => {
    const romanNumerals = [["M", 1000],["CM", 900],["D", 500],["CD", 400],["C", 100],["XC", 90],["L", 50],["XL", 40],["x", 10],["ix", 9],["v", 5],["iv", 4],["i", 1],];
    let result = "";
    for (const [roman, value] of romanNumerals) {
      while (num >= value) {
        result += roman;
        num -= value;
      }
    }
    return result;
  }

  const toLetter = (index) => {
    return String.fromCharCode(97 + index); 
  };

  const back = ()=>{
    navigate('/schedule-approval',{state:{iqaNo:element.iqaNo}})
  }

  const openTable = (item)=>{
    setInitialValues(mainClause,item,masterChapters,checkList);
    //setSectionOpen(item)
    sectionOpenRef.current = item;
  }

  const checkForRemarksManditory = (mocId)=>{
    observations.forEach((value,key)=>{
      if(key !== mocId){
        if(value !== 0 && value !== 5 && value !== 1){
          if(remarks.get(key).trim() === 'NA' || remarks.get(key).trim() === ''){
            setRemarksValidation(prev => [...prev, mocId])
          }
        }
      }
    })
  }

  const onObsChange = (value, mocId) => {
    setObservations((prev) => new Map(prev).set(mocId, value));
    if(value === 0 || value === 1 || value === 5){
      setRemarksValidation(prev => prev.filter(id => Number(id) !== Number(mocId)));
      checkForRemarksManditory(mocId);
    }else{
      if(remarks.get(mocId).trim() === '' || remarks.get(mocId).trim() === 'NA'){
        setRemarksValidation(prev => [...prev, mocId])
      }
    }
  };

  const onRemarksChange = (value, mocId) => {
    setRemarks((prev) => new Map(prev).set(mocId, value));
    if(value === '' || value === 'NA' || value === 'N'){
     if(observations.get(mocId) === 0 || observations.get(mocId)  === 1 || observations.get(mocId)  === 5){
      setRemarksValidation(prev => prev.filter(id => id !== mocId));
      checkForRemarksManditory(mocId);
    }else{
      setRemarksValidation(prev => [...prev, mocId])
    }
  }else{
    setRemarksValidation(prev => prev.filter(id => id !== mocId));
  }
  };

  const handleConfirm = async()=>{
    auditorRemarks = false
    const mergedMap = new Map();
    observations.forEach((value,key)=>{
      if(value !== 0 && value !== 5 && value !== 1){
        if(remarks.get(key).trim() === 'NA' || remarks.get(key).trim() === ''){
          auditorRemarks = true
        }
      }
      if(isAddMode){
        mergedMap.set(key,{
          observation      : value,
          remark           : remarks.get(key) || '',
          auditCheckListId : 0,
        })
      }else{
        mergedMap.set(key,{
          observation      : value,
          remark           : remarks.get(key) || '',
          auditCheckListId : checkListIds.get(key),
        })
      }
    });
    if(auditorRemarks){
      Swal.fire({
        icon: "error",
        title: 'Please Add Remarks to Non-Complied Observation',
        showConfirmButton: false,
        timer: 2500
      });
    }else{
      if(isAddMode){
        await AlertConfirmation({
          title: 'Are you sure Add Audit Check List ?' ,
          message: '',
          }).then(async (result) => {
          if (result) {
            try {
            const response = await addAuditCheckList(new AuditCheckList(mergedMap,element.scheduleId,element.iqaId));
            if(response.status === 'S'){
              afterSubmit();
              Swal.fire({
                icon: "success",
                title: response.message,
                showConfirmButton: false,
                timer: 1500
              });
            } else {
              Swal.fire({
                icon: "error",
                title: response.message,
                showConfirmButton: false,
                timer: 1500
              });
            }
            }catch (error) {
                Swal.fire('Error!', 'There was an issue Adding the Audit Check List.', 'error');
              }
          }
        })
      }else{
        await AlertConfirmation({
          title: 'Are you sure Update Audit Check List ?' ,
          message: '',
          }).then(async (result) => {
          if (result) {
            try {
            const response = await updateAuditCheckList(new AuditCheckList(mergedMap,element.scheduleId,element.iqaId));
            if(response.status === 'S'){
              afterSubmit();
              Swal.fire({
                icon: "success",
                title: response.message,
                showConfirmButton: false,
                timer: 1500
              });
            } else {
              Swal.fire({
                icon: "error",
                title: response.message,
                showConfirmButton: false,
                timer: 1500
              });
            }
            }catch (error) {
                Swal.fire('Error!', 'There was an issue Updating the Audit Check List.', 'error');
              }
          }
        })
      }
    }
  }

  const checksubChapter =(mocId)=>{
    return masterChapters.some(data => data.mocParentId === mocId)
  }

  const onFileSelected = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      if (!validImageTypes.includes(file.type)) {
        setFileError('Please select a valid image file (jpg, png).');
        setSelectedImage(null);

        // Clear the input value
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setimgView(reader.result); 
          setSelectedImage(file);    
          setFileError('');          
        };
        reader.readAsDataURL(file);
      }
    }
  }

  const uploadImage = async()=>{
    console.log('element--------- ',element)
    const response = await uploadCheckListImage(new CheckListImgDto(attachMocId,element.scheduleId,selectedImage.name,element.iqaNo,element.iqaId),selectedImage);
  }
    

  return (
    <div>
      <Navbar />
      <div className="card">
         <Box display="flex" alignItems="center" gap="10px" >
          <Box flex="87%" className='text-center'><h3>{element && element.iqaNo}: Audit Check List</h3></Box>
          <Box flex="13%"><button className="btn backClass" onClick={() => back()}>Back</button></Box>
         </Box>
          <Box className="col-md-11 card l-bg-blue-dark text-left-center-card mg-top-10"  >
            <Box display="flex" alignItems="center" gap="10px">
              <Box flex="22%"><span className="fw-bolder">Date & Time (Hrs)</span> - {element && element.scheduleDate && format(new Date(element.scheduleDate),'dd-MM-yyyy HH:mm')}</Box>
              <Box flex="37%"><span className="fw-bolder">Division/Group/Project</span> - {element && (element.divisionName !== ''?element.divisionName:element.groupName !== ''?element.groupName:element.projectName)}</Box>
              <Box flex="30%"><span className="fw-bolder">Auditee</span> - {element && element.auditeeEmpName}</Box>
              <Box flex="11%"><span className="fw-bolder">Team</span> - {element && element.teamCode}</Box>
            </Box>
          </Box>
          <div id="card-body customized-card">
           <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
             <Card>
              <CardContent className="card-content check-list-card mg-b-10 mg-top-10" >
                <Box display="flex" alignItems="center" gap="10px">
                 <Box flex="3%"></Box>
                  {filMainClause.length > 0 &&filMainClause.map(item =>{
                    const fx = 90/filMainClause.length -1;
                    return (<Box flex={fx+'%'}><Tooltip title={<span className="tooltip-title">{'Clause '+item.clauseNo+' : '+item.description}</span>}><button className={unSuccessBtns.includes(item.sectionNo)?'btn btn-sm bt-error-color':(successBtns.includes(item.sectionNo)?'btn btn-sm bt-success-color':'btn btn-sm bt-color')} onClick={()=>openTable(Number(item.sectionNo))}>{item.sectionNo}</button></Tooltip></Box>)
                  })}
                 <Box flex="3%"></Box>
                </Box>
                <Card>
                 <CardContent className="card-content no-shadow mg-b-10 mg-top-10" >
                 {mainClause.map((chapter, i) => {
                  if(Number(chapter.sectionNo) === Number(sectionOpenRef.current)){
                    if(chapter.clauseNo === '8.3.1'){
                      attachMocId = chapter.mocId;
                    }
                    k = 0;
                    return(
                        <Grid key={i}>
                         <table className="table table-responsive">
                          <thead className="table-light">
                           <tr>
                              <th colSpan={3} scope="col" className="text-left">&nbsp;{'Clause '+chapter.clauseNo+' : '+chapter.description}</th>
                           </tr>
                          </thead>
                          <tbody>
                           {masterChapters.map((chapter1,j) => {
                            //for Image
                            if(Number(chapter1.mocId) === Number(attachMocId) && attachMocId === chapter.mocId){
                              return(
                              <tr  className="table-active box-border">
                                <td colSpan={3} className="text-left width60 box-border">
                                  <TextField label="Choose File" variant="outlined" type="file" size="small" margin="normal"
                                   onChange={(e) => onFileSelected(e)} InputLabelProps={{ shrink: true,}}
                                   inputProps={{ accept: "image/*",}} error={Boolean(fileError)} helperText={fileError} inputRef={fileInputRef} />&emsp;&emsp;
                                   <button title="Upload Image" onClick={() => uploadImage()} className="btn btn-sm btn-success bt-sty upload-bt">Upload</button></td>
                              </tr>)
                            }
                            if(chapter1.mocParentId === chapter.mocId){
                              k++;
                              l = 0;
                              lv1MocId = chapter1.mocId;

                              if(checksubChapter(chapter1.mocId)){
                                return(
                                  <tr  className="table-active box-border">
                                   <td colSpan={3} className="text-left width60 box-border">&nbsp;{toRoman(k)+'. '+chapter1.description}</td>
                                  </tr>
                                 )
                              }else{
                                return(
                                  <tr className="table-active box-border">
                                   <td className="text-left width60 box-border">&nbsp;{toRoman(k)+'. '+chapter1.description}</td>
                                   <td className="text-center width15 box-border"><SelectPicker options={selectOptions} label="Observation"
                                      value={selectOptions.find((option) => option.value === observations.get(chapter1.mocId)) || null}
                                    handleChange={(newValue) => {onObsChange( newValue?.value,chapter1.mocId) }}/></td>
                                   <td className="width25 box-border">
                                    <TextField className="form-control w-100" label="Remarks" variant="outlined" size="small" value={remarks.get(chapter1.mocId) || ''}
                                     onChange={(e) => onRemarksChange(e.target.value, chapter1.mocId)}
                                     InputLabelProps={{ style: {color: remarksValidation.includes(chapter1.mocId) ? 'red' : 'inherit',},}}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        "&:hover .MuiOutlinedInput-notchedOutline": {borderColor: remarksValidation.includes(chapter1.mocId) ? 'red' : 'inherit',},
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: remarksValidation.includes(chapter1.mocId)? 'red' : 'inherit',},
                                      },
                                      "& .MuiOutlinedInput-notchedOutline": {border: remarksValidation.includes(chapter1.mocId) ? '1px solid red' : '1px solid inherit' },
                                      "& .MuiInputLabel-root.Mui-focused": {color: remarksValidation.includes(chapter1.mocId) ? 'red' : 'inherit',}, }}/>
                                   </td>
                                  </tr>
                                 )
                              }
                            }
                            if(chapter1.mocParentId === lv1MocId){
                              l++;
                              return(
                               <tr  className="table-active box-border">
                                <td className="text-left width60 box-border">&emsp;&nbsp;&nbsp;{toLetter(l-1)+'. '+chapter1.description}</td>
                                <td className="text-center width15 box-border"><SelectPicker options={selectOptions} label="Observation"
                                      value={selectOptions.find((option) => option.value === observations.get(chapter1.mocId)) || null}
                                    handleChange={(newValue) => {onObsChange( newValue?.value,chapter1.mocId) }}/></td>
                                <td className="width25 box-border">
                                 <TextField className="form-control w-100" label="Remarks" variant="outlined" size="small" value={remarks.get(chapter1.mocId) || ''}
                                    onChange={(e) => onRemarksChange(e.target.value, chapter1.mocId)}
                                    InputLabelProps={{ style: {color: remarksValidation.includes(chapter1.mocId) ? 'red' : 'inherit',},}}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        "&:hover .MuiOutlinedInput-notchedOutline": {borderColor: remarksValidation.includes(chapter1.mocId) ? 'red' : 'inherit',},
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: remarksValidation.includes(chapter1.mocId)? 'red' : 'inherit',},
                                      },
                                      "& .MuiOutlinedInput-notchedOutline": {border: remarksValidation.includes(chapter1.mocId) ? '1px solid red' : '1px solid inherit' },
                                      "& .MuiInputLabel-root.Mui-focused": {color: remarksValidation.includes(chapter1.mocId) ? 'red' : 'inherit',}, }}/>
                                </td>

                               </tr>
                              )
                            }

                            })}
                          </tbody>
                         </table>
                        </Grid>
                      )
                    }
                 })}
                 {isAddMode ?<div className="text-center"><button onClick={() => handleConfirm()} className="btn btn-success bt-sty">Submit</button></div>:
                 <div className="text-center"><button onClick={() => handleConfirm()} className="btn btn-warning bt-sty update-bg">Update</button></div>}
                 </CardContent>
                </Card>
              </CardContent>
             </Card>
            </Grid>
           </Grid>

          </div>
        </div>
    </div>
  );

}
export default withRouter(AuditCheckListComponent);