import React, { useEffect, useState,useRef, useCallback } from "react";
import { Box,Grid,Card,CardContent,Tooltip,TextField} from '@mui/material';
import Navbar from "components/Navbar/Navbar";
import '../../auditor-list.component.css';
import withRouter from "common/with-router";
import { getMocTotalList,getObservation,AuditCheckList,addAuditCheckList,getAuditCheckList,uploadCheckListImage,CheckListImgDto,getCheckListimg,
         addAuditeeRemarks,updateAuditeeRemarks,givePreview,downloadCheckListFile} from "services/audit.service";
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
  const [selectOptions,setSelectOptions] = useState([]);
  const [observations, setObservations] = useState(new Map());
  const [mocDescription, setMocDescription] = useState(new Map());
  const [auditorRemarks, setAuditorRemarks] = useState(new Map());
  const [auditeeRemarks, setAuditeeRemarks] = useState(new Map());
  const [attachmentNames, setAttachmentNames] = useState(new Map());
  const [checkListIds, setCheckListIds] = useState(new Map());
  const [attachments, setAttachments] = useState(new Map());
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [checkList,setCheckList] = useState([]);
  const [isAddMode,setIsAddMode] = useState(true);
  const [auditorSuccessBtns,setAuditorSuccessBtns] = useState([]);
  const [auditeeSuccessBtns,setAuditeeSuccessBtns] = useState([]);
  const [unSuccessBtns,setunsuccessBtns] = useState([]);
  const [auditorRemarksValidation,setAuditorRemarksValidation] = useState([]);
  const [auditeeRemarksValidation,setAuditeeRemarksValidation] = useState([]); 
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);
  let    fileInputRefs = useRef([]);
  const [imgView, setimgView] = useState('');
  const [isValidationActive, setIsValidationActive] = useState(false);
  const [isAuditor,setIsAuditor] = useState(false);
  const [isAuditeeAdd,setIsAuditeeAdd] = useState(true);
  const [isAdmin,setIsAdmin] = useState(false)
  const [schduleDate,setSchduleDate] = useState(new Date())
  const [roleId,setRoleId] = useState(0);
  const [flag,setFlag] = useState('');
  let attachMocId = 0;
  let attachMocDescription = '';
  let auditorRemarksValid = false
  let lv1MocId ='';
  let leve1MocId ='';
  let k = 0;
  let l = 0;
  let selectionCount = 0;

  const fetchData = async () => {
    try {
     const role = localStorage.getItem('roleId')
     if(Number(role) === 7){
      setIsAuditor(true)
     }else {
      setIsAuditor(false)
     }

     if(['1','2','3','4','5'].includes(String(role))){
      setIsAdmin(true)
     }else{
      setIsAdmin(false)
     }

     setRoleId(role)
      const eleData = router.location.state?.element;

      const scDate = eleData.scheduleDate;
      const [datePart] = scDate.split(" ")
      

      setSchduleDate(new Date(datePart));
      const flag = router.location.state?.flag;
      setFlag(flag)
      if(eleData){
        setElement(eleData)
       const chapters  = await getMocTotalList();
       const obsList   = await getObservation();
       const chList    = await getAuditCheckList(eleData.scheduleId);
       const imgSource = await getCheckListimg(eleData);
       
      if( ['AES','ARS'].includes(eleData.scheduleStatus)){
        setIsAuditeeAdd(true)
      }
       setimgView(imgSource);
       setCheckList(chList)
       setButtoncolors(chList,Number(role) === 7,['1','2','3','4','5'].includes(String(role)))
       let filChapters = [];
       
       if(chList.length === 0 || eleData.scheduleStatus !== 'ARS'){
          filChapters = chapters.filter(data => data.isActive == 1 && data.isForCheckList == 'Y');
       }else{
        filChapters = chList;
       }


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
      setInitialValues(mainChapter,mainChapter && mainChapter.length > 0 && mainChapter[0].sectionNo,filChapters,chList,Number(role) === 7,['1','2','3','4','5'].includes(String(role)),flag,eleData)
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setButtoncolors = (list,isAuditor,isAdmin)=>{
    let newSuccessBtns = [];
    let newUnsuccessBtns = [];
    const secs = [...new Set(list.filter(data => data.clauseNo !== '8.3.1' && ((!isAuditor && !isAdmin) || data.auditorRemarks !== '')).map(item => item.sectionNo))];
    secs.forEach(item =>{
      if(setColor(list,item)){
        newUnsuccessBtns.push(String(item))
      }else{
        newSuccessBtns.push(String(item))
      }
    });
    setAuditorSuccessBtns(newSuccessBtns)
    setunsuccessBtns(newUnsuccessBtns);
    const AuditeeSec = [...new Set(list.map(item => item.sectionNo))]
    setAuditeeSuccessBtns(AuditeeSec)

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
    setButtoncolors(chList,isAuditor,isAdmin)
    setCheckList(chList);
    if(isAddMode){
      const nextSection = getNextValue(sectionOpenRef.current);
      sectionOpenRef.current = nextSection;
      setInitialValues(mainClause,nextSection,masterChapters,chList,isAuditor,isAdmin,flag,element)
    }else{
      setInitialValues(mainClause,sectionOpenRef.current,masterChapters,chList,isAuditor,isAdmin,flag,element)
    }
    setIsValidationActive(false)
    setSelectedFiles([]);
    fileInputRefs.current.forEach(ref => {
      if (ref) ref.value = ''; 
  });
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
  

  const setInitialValues = (mainChapter,secNo,filChapter,chList,isAuditor,isAdmin,flag,element)=>{
    selectionCount = 0; 
    //setIsAuditor(false)
    setAuditeeRemarksValidation([]);
    setObservations(new Map());
    setMocDescription(new Map());
    const initialObservations   = new Map();
    const initialMocDescription   = new Map();
    const initialAuditorRemarks = new Map();
    const initialAuditeeRemarks = new Map();
    const inticheckListIds      = new Map();
    const initialAttachmentNames = new Map();
    if(chList.some(data => Number(data.sectionNo) === Number(secNo) && (data.clauseNo !== '8.3.1'))){
      chList.forEach((chapter) => {
        if (Number(chapter.sectionNo) === Number(secNo)) {
          if(chapter.auditorRemarks === '' && (isAuditor || isAdmin ) && element.scheduleStatus !== 'AAA' ){
            //setIsAuditor(true)
            //afterAuditeeSubmit
            mainChapter.forEach((chapter) => {
              if(Number(chapter.clauseNo) === Number(secNo) || compareSec(chapter.clauseNo,secNo)){
                //these are clouses
                if(chapter.clauseNo !== '8.3.1'){
                initialObservations.set(chapter.mocId, 0);
                initialAuditorRemarks.set(chapter.mocId, 'NA');
                }
              }
              if (Number(chapter.sectionNo) === Number(secNo)) {
                  filChapter.forEach((chapter1) => {
                    if(chapter1.mocParentId === chapter.mocId){
                      leve1MocId = chapter1.mocId;
                      //withoutChaild
                      if(!checksubChapter(chapter1.mocId,filChapter)){
                        initialObservations.set(chapter1.mocId, 1);
                        initialAuditorRemarks.set(chapter1.mocId, 'NA');
                      }else{
                        initialObservations.set(chapter1.mocId, 0);
                        initialAuditorRemarks.set(chapter1.mocId, 'NA');
                      }
                    }
                    //childClouse
                    if(chapter1.mocParentId === leve1MocId){
                      initialObservations.set(chapter1.mocId, 1);
                      initialAuditorRemarks.set(chapter1.mocId, 'NA');
                    }
                  })
                }
            });
            setIsAddMode(true);
            //AfterBothSubmit
          }else{
            initialObservations.set(chapter.mocId, chapter.auditObsId);
            initialAuditorRemarks.set(chapter.mocId, chapter.auditorRemarks);
            setIsAddMode(false);
          }
          inticheckListIds.set(chapter.mocId,chapter.auditCheckListId);
          inticheckListIds.set(chapter.mocId,chapter.auditCheckListId);
          initialAuditeeRemarks.set(chapter.mocId, chapter.auditeeRemarks);
          initialMocDescription.set(chapter.mocId,chapter.description);
          initialMocDescription.set(chapter.mocId,chapter.description);
          initialAttachmentNames.set(chapter.mocId, chapter.attachmentName);
          //for only input tags
          if(chapter.auditeeRemarks !== 'NAA' || element.scheduleStatus !== 'AAA'){
            setAuditeeRemarksValidation(prev => [...new Set([...prev,chapter.mocId])]);
          }
        }
      });
      setCheckListIds(inticheckListIds);
      if(['RAR'].includes(element.scheduleStatus)){
        setIsAddMode(false);
      }
    }else{
      mainChapter.forEach((chapter) => {
        if(Number(chapter.clauseNo) === Number(secNo) || compareSec(chapter.clauseNo,secNo)){
          //these are clouses
          if(chapter.clauseNo !== '8.3.1'){
          initialObservations.set(chapter.mocId, 0);
          initialAuditorRemarks.set(chapter.mocId, 'NA');
          initialAuditeeRemarks.set(chapter.mocId, 'NAA');
          initialMocDescription.set(chapter.mocId,chapter.description);
          initialAttachmentNames.set(chapter.mocId, '');
          }
        }
        if (Number(chapter.sectionNo) === Number(secNo)) {
            filChapter.forEach((chapter1) => {
              if(chapter1.mocParentId === chapter.mocId){
                leve1MocId = chapter1.mocId;
                if(!checksubChapter(chapter1.mocId,filChapter)){
                  //withoutChaild
                  initialObservations.set(chapter1.mocId, 0);
                  initialAuditorRemarks.set(chapter1.mocId, 'NA');
                  initialAuditeeRemarks.set(chapter1.mocId, 'NA');
                  initialMocDescription.set(chapter1.mocId,chapter1.description);
                  initialAttachmentNames.set(chapter1.mocId, '');
                  setAuditeeRemarksValidation(prev => [...new Set([...prev,chapter1.mocId])]);

                }else{
                  initialObservations.set(chapter1.mocId, 0);
                  initialAuditorRemarks.set(chapter1.mocId, 'NA');
                  initialAuditeeRemarks.set(chapter1.mocId, 'NAA');
                  initialMocDescription.set(chapter1.mocId,chapter1.description);
                  initialAttachmentNames.set(chapter1.mocId, '');

                }
              }
              //subChapters
              if(chapter1.mocParentId === leve1MocId){
                initialObservations.set(chapter1.mocId, 0);
                initialAuditorRemarks.set(chapter1.mocId, '');
                initialAuditeeRemarks.set(chapter1.mocId, 'NA');
                initialMocDescription.set(chapter1.mocId,chapter1.description);
                initialAttachmentNames.set(chapter1.mocId, '');
                setAuditeeRemarksValidation(prev => [...new Set([...prev,chapter1.mocId])]);

              }
            })
          }
      });
      setIsAddMode(true)
    }
    setObservations(initialObservations);
    setAuditorRemarks(initialAuditorRemarks);
    setAuditeeRemarks(initialAuditeeRemarks);
    setMocDescription(initialMocDescription);
    setAttachmentNames(initialAttachmentNames);
    setIsValidationActive(false)
  }

  const compareSec =(clause,sec)=>{
    const splitVal = String(clause).split('.');
    if(splitVal.length >0){
      return Number(splitVal[0]) === Number(sec)
    }else{
      return false;
    }
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
    const romanNumerals = [["m", 1000],["cm", 900],["d", 500],["cd", 400],["c", 100],["xc", 90],["l", 50],["xl", 40],["x", 10],["ix", 9],["v", 5],["iv", 4],["i", 1],];
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
    setInitialValues(mainClause,item,masterChapters,checkList,isAuditor,isAdmin,flag,element);
    //setSectionOpen(item)
    sectionOpenRef.current = item;
  }

  const checkForRemarksManditory = (mocId)=>{
    observations.forEach((value,key)=>{
      if(key !== mocId){
        if((!value === 0 || value === 1 || value === 5)){
          if(auditorRemarks.get(key).trim() === 'NA' || auditorRemarks.get(key).trim() === ''){
            setAuditorRemarksValidation(prev => [...prev, mocId])
          }
        }
      }
    })
  }

  const onObsChange = (value, mocId) => {
    setObservations((prev) => new Map(prev).set(mocId, value));
    if(value === 0 || value === 1 || value === 5){
      setAuditorRemarksValidation(prev => prev.filter(id => Number(id) !== Number(mocId)));

    }else{
      if(auditorRemarks.get(mocId).trim() === '' || auditorRemarks.get(mocId).trim() === 'NA'){
        setAuditorRemarksValidation(prev => [...prev, mocId])
        //checkForRemarksManditory(mocId);
      }
    }
  };

  const onAuditorRemarksChange = (value, mocId) => {
    setAuditorRemarks((prev) => new Map(prev).set(mocId, value));
    if(value === '' || value === 'NA' || value === 'N'){
      if(observations.get(mocId) === 0 || observations.get(mocId)  === 1 || observations.get(mocId)  === 5){
       setAuditorRemarksValidation(prev => prev.filter(id => id !== mocId));
       checkForRemarksManditory(mocId);
      }else{
       setAuditorRemarksValidation(prev => [...prev, mocId])
     }
    }else{
     setAuditorRemarksValidation(prev => prev.filter(id => id !== mocId));
    }
  };

  const onAuditeeRemarksChange = (value, mocId) => {
    setAuditeeRemarks((prev) => new Map(prev).set(mocId, value));
    if(value.trim() === ''){
      setAuditeeRemarksValidation(prev => prev.filter(id => id !== mocId));
    }else{
      setAuditeeRemarksValidation(prev => [...new Set([...prev, mocId])])
    }
  }

  const handleFileChange = (mocId, event) => {
    const file = event.target.files[0];
    if(file){
      if(file.size>200485760){
        removeAttachment(mocId)
        Swal.fire({
          icon: "warning",
          title: 'Maximum file upload size is 200Mb !!!',
          showConfirmButton: false,
          timer: 2500
        });
      }else{
        setSelectedFiles(prev => {
          const updatedFiles = [...prev];
          updatedFiles[mocId] = file;
          return updatedFiles;
        });
        setAttachments((prev) => new Map(prev).set(mocId,file.name))
      }
    }else{
      removeAttachment(mocId)
    }
  };

  const removeAttachment = (mocId)=>{
    setAttachments((prev) => {
      const updatedMap = new Map(prev);
      updatedMap.delete(mocId);
      return updatedMap;
    })
  }

  const handleConfirm = async()=>{
    setIsValidationActive(true)
    auditorRemarksValid = false
    const mergedMap = new Map();
    //Auditor
    if((isAuditor && flag !== 'A') || isAdmin || (flag === 'L' && element.scheduleStatus === 'AES' )){
      observations.forEach((value,key)=>{
        if(value !== 0 && value !== 5 && value !== 1){
          if(auditorRemarks.get(key)?.trim() === 'NA' || auditorRemarks.get(key)?.trim() === ''){
            auditorRemarksValid = true
          }
        }

        if(isAddMode){
          mergedMap.set(key,{
            observation      : value,
            auditorRemarks   : auditorRemarks.get(key) || '',
            auditeeRemarks   : auditeeRemarks.get(key) || '',
            auditCheckListId : checkListIds.get(key),
            attachment       : attachments.get(key) || '',
            mocDescription   : mocDescription.get(key) || '',
          })
        }else{
          mergedMap.set(key,{
            observation      : value,
            auditorRemarks   : auditorRemarks.get(key) || '',
            auditeeRemarks   : auditeeRemarks.get(key) || '',
            auditCheckListId : checkListIds.get(key),
            attachment       : attachments.get(key) || '',
          })
        }
      });
    //Auditee
    }else{
      auditeeRemarks.forEach((value,key)=>{
        if(isAddMode){
          mergedMap.set(key,{
            observation      : 0,
            auditorRemarks   : auditorRemarks.get(key) || '',
            auditeeRemarks   : value || '',
            auditCheckListId : 0,
            attachment       : attachments.get(key) || '',
            mocDescription   : mocDescription.get(key) || '',
          })
        }else{
          mergedMap.set(key,{
            observation      : 0,
            auditorRemarks   : auditorRemarks.get(key) || '',
            auditeeRemarks   : value || '',
            auditCheckListId : checkListIds.get(key),
            attachment       : attachments.get(key) || '',
          })
        }
      });
    }
    if(auditeeRemarksValidation.length !== selectionCount && (!isAuditor || flag === 'A') && element.scheduleStatus === 'AAA'){
      Swal.fire({
        icon: "error",
        title: 'Please Add Auditee Remarks',
        showConfirmButton: false,
        timer: 2500
      });
    }else if(auditorRemarksValid){
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
             let response = '';
             if(((isAuditor && flag !== 'A') || (element.scheduleStatus === 'AES' && isAdmin) || (element.scheduleStatus === 'AES' && flag === 'L')) && (new Date(schduleDate) <= new Date())){
              response = await addAuditCheckList(new AuditCheckList(mergedMap,element.scheduleId,element.iqaId,element.iqaNo));
             }else{
              response = await addAuditeeRemarks(new AuditCheckList(mergedMap,element.scheduleId,element.iqaId,element.iqaNo),selectedFiles);
             }
      
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
             let response = '';
             if(((isAuditor && flag !== 'A') || ((['ARS','RBA','AES'].includes(element.scheduleStatus)) && isAdmin) || (element.scheduleStatus === 'AES' && flag === 'L')) && (new Date(schduleDate) <= new Date())){
              response = await addAuditCheckList(new AuditCheckList(mergedMap,element.scheduleId,element.iqaId,element.iqaNo));
             }else{
              response = await updateAuditeeRemarks(new AuditCheckList(mergedMap,element.scheduleId,element.iqaId,element.iqaNo),selectedFiles);
             }
            
            if(response.status === 'S'){
              afterSubmit();
              Swal.fire({
                icon: "success",
                title: 'Auditor Remarks Updated Successfully',
                showConfirmButton: false,
                timer: 1500
              });
            } else {
              Swal.fire({
                icon: "error",
                title: 'Auditor Remarks Update Unsuccessful',
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

  const checksubChapter =(mocId,masterChapters)=>{
    return masterChapters.some(data => Number(data.mocParentId) === Number(mocId))
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
          //setimgView(reader.result); 
          setSelectedImage(file);    
          setFileError('');          
        };
        reader.readAsDataURL(file);
      }
    }
  }

  const uploadImage = async()=>{
    if(selectedImage && selectedImage !=null){
      //const response = await uploadCheckListImage(element,selectedImage);
      const response = await uploadCheckListImage(new CheckListImgDto(attachMocId,element.scheduleId,selectedImage.name,element.iqaNo,element.iqaId,attachMocDescription),selectedImage);
      if(response.message === 'Image successfully uploaded: null'){
        Swal.fire({
          icon: "success",
          title: 'File Uploaded Successfully',
          showConfirmButton: false,
          timer: 1500
        });
        setSelectedImage(null);
        fileInputRef.current.value = '';
        const imgSource = await getCheckListimg(element);
        setimgView(imgSource);
      }
    }
  }

  const checkCont = (mocId, value) => {
    const row = masterChapters.filter(data => data.mocParentId === mocId);
    if (row && row.length > 0) {
        const currentClause = row[0].clauseNo;
        const splitClause = currentClause.split('.');
        return value === Number(splitClause[splitClause.length - 2]);
    } else {
        return true;
    }
  };

  const downloadAtachment = async(docName)=>{
          const EXT= docName.slice(docName.lastIndexOf('.')+1);
          const response =   await downloadCheckListFile(docName,element.iqaNo,element.scheduleId);
          givePreview(EXT,response,docName);
  }

 const redirecttoProcureComponent = useCallback((element) => {
    navigate('/procurement-list', { state: { revisionElements: element } })
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <div className="card">
         <Box display="flex" alignItems="center" gap="10px" >
          <Box flex="35%" className='text-center'><h3>{element && element.iqaNo}: Audit Check List</h3></Box>
          <Box flex="52%" className='text-center'>
           <span className="clr-unselected color-coding">. </span><span className="p-top-5 fw-bolder">&emsp;Not Submitted</span>&emsp;&emsp;
           <span className="selected-btn color-coding">. </span><span className="p-top-5 fw-bolder">&emsp;Selected</span>&emsp;&emsp;
           <span className="auditee-submit color-coding">. </span><span className="p-top-5 fw-bolder">&emsp;Auditee Submit</span>&emsp;&emsp;
           <span className="compiled color-coding">. </span><span className="p-top-5 fw-bolder">&emsp;Complied</span>&emsp;&emsp;
           <span className="non-compiled color-coding">. </span><span className="p-top-5 fw-bolder">&emsp;Non-Complied</span>&emsp;&emsp;
          </Box>
          <Box flex="13%"><button className="btn backClass" onClick={() => back()}>Back</button></Box>
         </Box>
          <Box className="col-md-11 card l-bg-blue-dark text-left-center-card mg-top-10 mg-down-10"  >
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
                    return (<Box flex={fx+'%'}><Tooltip title={<span className="tooltip-title">{'Clause '+item.clauseNo+' : '+ (mocDescription.get(item.mocId) || item.description)}</span>} className="mg-down-10">
                      <button className={((flag === 'L') || (isAuditor && flag !== 'A') || (['ARS','RBA','ABA'].includes(element.scheduleStatus)) || (isAdmin && ['AES','ARS'].includes(element.scheduleStatus)) && (new Date(schduleDate) <= new Date()) ) ? (unSuccessBtns.includes(item.sectionNo)?'btn btn-sm bt-error-color':(auditorSuccessBtns.includes(item.sectionNo)?'btn btn-sm bt-success-color':Number(sectionOpenRef.current) === Number(item.sectionNo)?'btn btn-sm bt-color':'btn btn-sm bg-unselected')):
                      (auditeeSuccessBtns.includes(item.sectionNo)?'btn btn-sm bg-auditee-success':Number(sectionOpenRef.current) === Number(item.sectionNo)?'btn btn-sm bt-color':'btn btn-sm bg-unselected')} 
                      onClick={()=>openTable(Number(item.sectionNo))}>{item.sectionNo}</button></Tooltip></Box>)
                  })}
                 <Box flex="3%"></Box>
                </Box>
                <Card>
                 <CardContent className="card-content no-shadow mg-b-10 mg-top-10" >
                 {mainClause.map((chapter, i) => {
                  if(Number(chapter.sectionNo) === Number(sectionOpenRef.current)){
                    if(chapter.clauseNo === '8.3.1'){
                      attachMocId = chapter.mocId;
                      attachMocDescription =  (mocDescription.get(chapter.mocId) || chapter.description);
                    }
                    k = 0;
                    return(
                        <Grid key={i}>
                         <table className="table table-responsive">
                          <thead className="table-light">
                       
                           <tr>
                            { chapter.clauseNo !== '8.4' && 
                                <th colSpan={3} scope="col" className="text-left">&nbsp;{'Clause '+chapter.clauseNo+' : '+ (mocDescription.get(chapter.mocId) || chapter.description)}</th>
                            }
                            {chapter.clauseNo === '8.4' &&
                            <>
                              <th colSpan={2} scope="col" className="text-left">&nbsp;{'Clause '+chapter.clauseNo+' : '+ (mocDescription.get(chapter.mocId) || chapter.description)}</th>
                              <th  scope="col" className="text-right"><button  className="icon-button edit-icon-button me-1" onClick={() => redirecttoProcureComponent(element)} title="Procurement">Procurement Details</button></th>
                            </>

                            }
                           </tr>
                          
                          </thead>
                          <tbody>
                           {masterChapters.map((chapter1,j) => {
                            //for Image
                            if(Number(chapter1.mocId) === Number(attachMocId) && attachMocId === chapter.mocId){
                              return(
                                <>
                              <tr  className="table-active box-border">
                                <td colSpan={3} className="text-left box-border">
                                  <TextField label="Choose File" variant="outlined" type="file" size="small" margin="normal"
                                   onChange={(e) => onFileSelected(e)} InputLabelProps={{ shrink: true,}}
                                   inputProps={{ accept: "image/*",}} error={Boolean(fileError)} helperText={fileError} inputRef={fileInputRef} />&emsp;&emsp;
                                   <button title="Upload Image" onClick={() => uploadImage()} className="btn btn-sm btn-success bt-sty upload-bt" disabled = {!isAuditor && !['1','2','3','4','7'].includes(String(roleId))}>Upload</button></td>
                              </tr>
                              <tr className="table-active box-border"><td colSpan={3} className="text-left  box-border">
                              {imgView && imgView !== '' && (<img src={imgView} alt="Selected" style={{  marginTop: '10px' }} /> )}
                              </td></tr></>)
                            }
                            if(chapter1.mocParentId === chapter.mocId){
                              k++;
                              l = 0;
                              if(checkCont(chapter1.mocId,k)){
                                lv1MocId = chapter1.mocId;
                                if(checksubChapter(chapter1.mocId,masterChapters)){
                                  return(
                                    <tr  className="table-active box-border">
                                     <td colSpan={3} className="text-left width60 box-border">&nbsp;{toRoman(k)+'. '+(mocDescription.get(chapter1.mocId) || chapter1.description)}</td>
                                    </tr>
                                   )
                                }else{
                                  selectionCount++;
                                  return(
                                    <tr className="table-active box-border">
                                     <td className="text-left width65 box-border">
                                     <Box display="flex" alignItems="center" gap="10px">
                                     <Box flex="42%" className='chapter-sty attach-input'> &nbsp;{toRoman(k) + ". " + (mocDescription.get(chapter1.mocId) || chapter1.description)} </Box>
                                      <Box flex="40%">
                                        <TextField className="form-control w-100" label="Auditee Remarks" variant="outlined" size="small" value={auditeeRemarks.get(chapter1.mocId) || ''}
                                         onChange={(e) => onAuditeeRemarksChange(e.target.value, chapter1.mocId)}
                                         InputLabelProps={{ style: {color: isValidationActive && !auditeeRemarksValidation.includes(chapter1.mocId) ? 'red' : isAuditeeAdd ? '#002CCD' : 'inherit',},}} inputProps={{readOnly :  (flag === 'L') || (isAuditor && flag !== 'A') || (['ARS','RBA','ABA','AES'].includes(element.scheduleStatus))}}
                                         sx={{
                                             '& .MuiInputBase-input': { color: isAuditeeAdd ? '#002CCD' : 'inherit',backgroundColor: (isAuditor || element.scheduleStatus === 'ARS') ? 'rgb(229, 229, 229)' : '#fff',},
                                             "& .MuiOutlinedInput-root": {
                                             "&:hover .MuiOutlinedInput-notchedOutline": {borderColor: isValidationActive && !auditeeRemarksValidation.includes(chapter1.mocId) ? 'red' : isAuditeeAdd ? '#002CCD' : 'inherit',},
                                             "&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: isValidationActive && !auditeeRemarksValidation.includes(chapter1.mocId)? 'red' : isAuditeeAdd ? '#002CCD' : 'inherit',},
                                           },
                                           "& .MuiOutlinedInput-notchedOutline": {border: isValidationActive && !auditeeRemarksValidation.includes(chapter1.mocId) ? '1px solid red' : '1px solid inherit' },
                                           "& .MuiInputLabel-root.Mui-focused": {color: isValidationActive && !auditeeRemarksValidation.includes(chapter1.mocId) ? 'red' : isAuditeeAdd ? '#002CCD' : 'inherit',}}}/>
                                      </Box>
                                      <Box flex="10%" >
                                        <input  type="file" ref={(el) => (fileInputRefs.current[chapter1.mocId] = el)} className='auditee-color'  onChange={(event) => handleFileChange(chapter1.mocId, event)} disabled = {(flag === 'L') || (isAuditor && flag !== 'A') || (['ARS','RBA','ABA','AES'].includes(element.scheduleStatus))}  />
                                      </Box>
                                      <Box flex="8%" >
                                        {attachmentNames.get(chapter1.mocId) !== '' && <button type="button" className=" btn btn-outline-success btn-sm me-1 float-right" onClick={() => downloadAtachment(attachmentNames.get(chapter1.mocId))}  title= {attachmentNames.get(chapter1.mocId)}> <i className="material-icons"  >download</i></button>}
                                      </Box>
                                     </Box>
                                     </td>
                                     <td className="text-center width15 box-border">
      {((['ARS','RBA','ABA'].includes(element.scheduleStatus)) || (flag === 'L' && element.scheduleStatus === 'AES') || ((isAuditor || isAdmin) && isAuditeeAdd && element.scheduleStatus === 'AES')) && (new Date(schduleDate) <= new Date()) && <SelectPicker options={selectOptions}  value={selectOptions.find((option) => option.value === observations.get(chapter1.mocId)) || null}
                                     readOnly = {['ARS','ABA'].includes(element.scheduleStatus) || (Number(roleId) === 6 && !flag === 'L')} label="Observation" handleChange={(newValue) => {onObsChange( newValue?.value,chapter1.mocId) }}/>}</td>  
                                     <td className="width20 box-border">
      {((['ARS','RBA','ABA'].includes(element.scheduleStatus)) || (flag === 'L' && element.scheduleStatus === 'AES') || ((isAuditor || isAdmin) && isAuditeeAdd && element.scheduleStatus === 'AES')) && (new Date(schduleDate) <= new Date()) &&<TextField className="form-control w-100" label="Auditor Remarks" variant="outlined" size="small" value={auditorRemarks.get(chapter1.mocId) || ''}
                                      inputProps={{readOnly : ['ARS','ABA'].includes(element.scheduleStatus) || (Number(roleId) === 6 && !flag === 'L')}} onChange={(e) => onAuditorRemarksChange(e.target.value, chapter1.mocId)}
                                       InputLabelProps={{ style: {color: auditorRemarksValidation.includes(chapter1.mocId) ? 'red' : 'inherit',},}}
                                      sx={{
                                        "& .MuiOutlinedInput-root": {
                                          "&:hover .MuiOutlinedInput-notchedOutline": {borderColor: auditorRemarksValidation.includes(chapter1.mocId) ? 'red' : 'inherit',},
                                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: auditorRemarksValidation.includes(chapter1.mocId)? 'red' : 'inherit',},
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {border: auditorRemarksValidation.includes(chapter1.mocId) ? '1px solid red' : '1px solid inherit' },
                                        "& .MuiInputLabel-root.Mui-focused": {color: auditorRemarksValidation.includes(chapter1.mocId) ? 'red' : 'inherit',},  }}/>}
                                     </td>
                                    </tr>
                                   )
                                }
                              }else{
                                lv1MocId = '';
                              }
                            }
                            if(chapter1.mocParentId === lv1MocId){
                              selectionCount++;
                              l++;
                              return(
                               <tr  className="table-active box-border">
                                <td className="text-left width65 box-border">
                                 <Box display="flex" alignItems="center" justifyContent="space-between" gap="10px">
                                 <Box flex="42%" className='chapter-sty attach-input'> &emsp;&nbsp;&nbsp;{toLetter(l-1) + ". " + (mocDescription.get(chapter1.mocId) || chapter1.description)}</Box>
                                    <Box flex="40%">
                                      <TextField className="form-control w-100" label="Auditee Remarks" variant="outlined" size="small" value={auditeeRemarks.get(chapter1.mocId) || ''}
                                         onChange={(e) => onAuditeeRemarksChange(e.target.value, chapter1.mocId)}
                                         InputLabelProps={{ style: {color: isValidationActive && !auditeeRemarksValidation.includes(chapter1.mocId) ? 'red' : isAuditeeAdd ? '#002CCD' : 'inherit',},}} inputProps={{readOnly : (flag === 'L') || (isAuditor && flag !== 'A') || (['ARS','RBA','ABA','AES'].includes(element.scheduleStatus))}}
                                         sx={{
                                           '& .MuiInputBase-input': { color: isAuditeeAdd ? '#002CCD' : 'inherit',backgroundColor: (isAuditor || element.scheduleStatus === 'ARS') ? 'rgb(229, 229, 229)' : '#fff',},
                                           "& .MuiOutlinedInput-root": {
                                             "&:hover .MuiOutlinedInput-notchedOutline": {borderColor: isValidationActive && !auditeeRemarksValidation.includes(chapter1.mocId) ? 'red' : isAuditeeAdd ? '#002CCD' : 'inherit',},
                                             "&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: isValidationActive && !auditeeRemarksValidation.includes(chapter1.mocId)? 'red' : isAuditeeAdd ? '#002CCD' : 'inherit',},
                                           },
                                           "& .MuiOutlinedInput-notchedOutline": {border: isValidationActive && !auditeeRemarksValidation.includes(chapter1.mocId) ? '1px solid red' : '1px solid inherit' },
                                           "& .MuiInputLabel-root.Mui-focused": {color: isValidationActive && !auditeeRemarksValidation.includes(chapter1.mocId) ? 'red' : isAuditeeAdd ? '#002CCD' : 'inherit',}, }}/>
                                    </Box>
                                    <Box flex="10%">
                                      <input  type="file" ref={(el) => (fileInputRefs.current[chapter1.mocId] = el)} className='auditee-color'  onChange={(event) => handleFileChange(chapter1.mocId, event)} disabled = {(flag === 'L') || (isAuditor && flag !== 'A') || (['ARS','RBA','ABA','AES'].includes(element.scheduleStatus))}  />
                                    </Box>
                                    <Box flex="8%">
                                      {attachmentNames.get(chapter1.mocId) !== '' && <button type="button" className=" btn btn-outline-success btn-sm me-1 float-right" onClick={() => downloadAtachment(attachmentNames.get(chapter1.mocId))}  title= {attachmentNames.get(chapter1.mocId)}> <i className="material-icons"  >download</i></button>}
                                    </Box>
                                 </Box>
                                </td>
                                <td className="text-center width15 box-border">
    {((['ARS','RBA','ABA'].includes(element.scheduleStatus)) || (flag === 'L' && element.scheduleStatus === 'AES') || ((isAuditor || isAdmin) && isAuditeeAdd && element.scheduleStatus === 'AES')) && (new Date(schduleDate) <= new Date()) && <SelectPicker options={selectOptions} value={selectOptions.find((option) => option.value === observations.get(chapter1.mocId)) || null}
                                 readOnly = {['ARS','ABA'].includes(element.scheduleStatus) || (Number(roleId) === 6 && !flag === 'L')} label="Observation" handleChange={(newValue) => {onObsChange( newValue?.value,chapter1.mocId) }}/>}
                                </td>
                                <td className="width20 box-border">
    {((['ARS','RBA','ABA'].includes(element.scheduleStatus)) || (flag === 'L' && element.scheduleStatus === 'AES') || ((isAuditor || isAdmin) && isAuditeeAdd && element.scheduleStatus === 'AES')) && (new Date(schduleDate) <= new Date()) && <TextField className="form-control w-100" label="Auditor Remarks" variant="outlined" size="small" value={auditorRemarks.get(chapter1.mocId) || ''}
                                   inputProps={{readOnly : ['ARS','ABA'].includes(element.scheduleStatus) || Number(roleId) === 6 && !flag === 'L'}} onChange={(e) => onAuditorRemarksChange(e.target.value, chapter1.mocId)}
                                    InputLabelProps={{ style: {color: auditorRemarksValidation.includes(chapter1.mocId) ? 'red' : 'inherit',},}}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        "&:hover .MuiOutlinedInput-notchedOutline": {borderColor: auditorRemarksValidation.includes(chapter1.mocId) ? 'red' : 'inherit',},
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: auditorRemarksValidation.includes(chapter1.mocId)? 'red' : 'inherit',},
                                      },
                                      "& .MuiOutlinedInput-notchedOutline": {border: auditorRemarksValidation.includes(chapter1.mocId) ? '1px solid red' : '1px solid inherit' },
                                      "& .MuiInputLabel-root.Mui-focused": {color: auditorRemarksValidation.includes(chapter1.mocId) ? 'red' : 'inherit',}, }}/>}
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
                 {element && (!['ARS','ABA'].includes(element.scheduleStatus)) && (isAddMode ?<div className="text-center"><button onClick={() => handleConfirm()} className="btn btn-success bt-sty">Submit</button></div>:
                 <div className="text-center"><button onClick={() => handleConfirm()} className="btn btn-warning bt-sty update-bg">Update</button></div>)}
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