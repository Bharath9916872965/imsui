import React, { useEffect, useState,useRef } from "react";
import { getIqaScheduleList,AuditClosureDTO,addAuditClosure,getAuditClosureList,updateAuditClosure,uploadAuditClosureFile,downloadAuditClosureFile,givePreview } from "services/audit.service";
import { Box, Typography, Button, TextField,Autocomplete, Grid } from '@mui/material';
import Navbar from "components/Navbar/Navbar";
import './auditor-list.component.css';
import dayjs from 'dayjs';
import SelectPicker from "components/selectpicker/selectPicker";
import withRouter from "common/with-router";
import {format} from 'date-fns'
import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite.js';
import $ from 'jquery';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AlertConfirmation from "common/AlertConfirmation.component";
import  AuditClosurePrint from "components/prints/qms/auditClosure-print";



const AuditClosureComponent = ({router}) => {

  const [isReady, setIsReady] = useState(false);
  const [isComplted, setComplted] = useState(false);
  const [iqaFullList,setIqaFullList] = useState([]);
  const [iqaOptions,setIqaOptions] = useState([]);
  const [iqaNo,setIqaNo] = useState('');
  const [iqaId,setIqaId] = useState('');
  const [iqaFromDate,setIqaFromDate] = useState(dayjs(new Date()));
  const [iqaToDate,setIqaToDate] = useState(dayjs(new Date()));
  const [isAddMode,setIsAddMode] = useState(true);
  const [editorContent, setEditorContent] = useState('');
  const [closureDate,setClosureDate] = useState(dayjs());
  const [totalAuditeeCount,setTotalAuditeeCount] = useState(0);
  const [auditeeSubmitCount,setAuditeeSubmitCount] = useState(0);
  const [auditorSubmitCount,setAuditorSubmitCount] = useState(0);
  const [auditeeAcceptCount,setAuditeeAcceptCount] = useState(0);
  const [auditClouserList,setAuditClouserList] = useState([]);
  const [element,setElement] = useState('');
  const [selectedFile, setSelectedFile] = useState(undefined);
  const fileInputRef = useRef(null);
console.log('auditClouserList',auditClouserList);



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
          ['misc', [ 'undo', 'redo', 'codeBlock']],
          [
              'font',
              [
                  'bold',
                  'italic',
                  'underline',
                  'strikethrough',
              ]
          ],
          ['fontsize', ['fontname', 'fontsize', 'color']],
          ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
          ['insert', ['table', 'picture', 'link', 'video', 'hr']],
          ['customButtons', ['testBtn']],
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


    },[editorContent])



  const fetchData = async () => {
    try {
      const iqaList = await getIqaScheduleList();
      const auditClouser = await getAuditClosureList();

      setAuditClouserList(auditClouser);
      setIqaFullList(iqaList);

      const iqaData = iqaList.map(data => ({
        value : data.iqaId,
        label : data.iqaNo
      }));

      if(iqaList.length >0){
        const iqa = iqaList[0];
        setIqaNo(iqa.iqaNo)
        setIqaId(iqa.iqaId)
        setIqaFromDate(new Date(iqa.fromDate))
        setIqaToDate(new Date(iqa.toDate))
        setTotalAuditeeCount(iqa.auditees)
        setAuditeeSubmitCount(iqa.auditeeSub)
        setAuditorSubmitCount(iqa.auditorSub)
        setAuditeeAcceptCount(iqa.auditeeAcp)
        if(Number(iqa.auditees) == Number(iqa.auditeeAcp)){
          setComplted(true)
        }

        if(auditClouser && auditClouser.length > 0){
          const iqaAuditData = auditClouser.find(data => data.iqaId === iqa.iqaId);
          if(iqaAuditData){
            setClosureDate(dayjs(new Date(iqaAuditData.closureDate)));
            setEditorContent(iqaAuditData.remarks)
            setIsAddMode(false)
            setElement(iqaAuditData)
          }else{
            setIsAddMode(true)
            setElement('')
            setClosureDate(dayjs())
            setEditorContent('')
          }
        }else{
          setIsAddMode(true)
          setElement('')
          setClosureDate(dayjs())
          setEditorContent('')
        }
      }
      setIqaOptions(iqaData)
      setIsReady(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isReady]);

  const afterSubmit = async ()=>{

    const auditClouser = await getAuditClosureList();
    setAuditClouserList(auditClouser);
    setIsAddMode(false);
    setSelectedFile(undefined)
    fileInputRef.current.value = '';
    if(auditClouser && auditClouser.length > 0){
      const iqaAuditData = auditClouser.find(data => data.iqaId === iqaId);
      if(iqaAuditData){
        setClosureDate(dayjs(new Date(iqaAuditData.closureDate)));
        setEditorContent(iqaAuditData.remarks)
        setIsAddMode(false)
        setElement(iqaAuditData)
      }else{
        setIsAddMode(true)
        setElement('')
        setClosureDate(dayjs())
        setEditorContent('')
      }
    }else{
      setIsAddMode(true)
      setElement('')
      setClosureDate(dayjs())
      setEditorContent('')
    }

  }
  

  const closureAdd = async()=>{

    const content = $('#summernote').summernote('code');
console.log('content',content);
    if(content.trim() === ''){
      Swal.fire({
        icon: "warning",
        title: 'Plase Add Remarks',
        showConfirmButton: false,
        timer: 1500
      });
    }else{
      await AlertConfirmation({
        title: isAddMode?'Are you sure Add Audit Closure ?':'Are you sure Update Audit Closure ?' ,
        message: '',
        }).then(async (result) => {
        if (result) {
          try {
            let attchmentName = '';
              if(isAddMode){
                if(selectedFile && selectedFile !=null){
                  attchmentName = selectedFile.name;
                }
                const response = await addAuditClosure(new AuditClosureDTO(0,Number(iqaId),content,closureDate,attchmentName,iqaNo,''));
                if (response.status === 'S') {
                  if(selectedFile && selectedFile !=null){
                   const fileResponse = await uploadAuditClosureFile(new AuditClosureDTO(0,Number(iqaId),content,closureDate,attchmentName,iqaNo,''),selectedFile);
                   afterSubmit();
                  }else{
                    afterSubmit();
                  }
                  
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
              }else{
                if(selectedFile && selectedFile !=null){
                  attchmentName = selectedFile.name;
                }else{
                  attchmentName = element.attachmentName;
                }
                const response = await updateAuditClosure(new AuditClosureDTO(element.closureId,Number(iqaId),content,closureDate,attchmentName,iqaNo,''));
                if (response.status === 'S') {
                  if(selectedFile && selectedFile !=null){
                    const fileResponse = await uploadAuditClosureFile(new AuditClosureDTO(element.closureId,Number(iqaId),content,closureDate,attchmentName,iqaNo,element.attachmentName),selectedFile);
                    afterSubmit();
                   }else{
                     afterSubmit();
                   }
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
              }
            
  
          } catch (error) {
            Swal.fire('Error!', 'There was an issue adding the Audit Closure.', 'error');
          }
        }
      });
    }



  }

  const onIqaChange = (value)=>{
    const selectedIqa = iqaFullList.find(data => data.iqaId === value);
    if(selectedIqa){
      setIqaNo(selectedIqa.iqaNo)
      setIqaFromDate(dayjs(new Date(selectedIqa.fromDate)))
      setIqaToDate(dayjs(new Date(selectedIqa.toDate)))
      setTotalAuditeeCount(selectedIqa.auditees)
      setAuditeeSubmitCount(selectedIqa.auditeeSub)
      setAuditorSubmitCount(selectedIqa.auditorSub)
      setAuditeeAcceptCount(selectedIqa.auditeeAcp)

      if(Number(selectedIqa.auditees) == Number(selectedIqa.auditeeAcp)){
        setComplted(true)
      }

      if(auditClouserList && auditClouserList.length > 0){
        const iqaAuditData = auditClouserList.find(data => data.iqaId === selectedIqa.iqaId);
        console.log('iqaAuditData',iqaAuditData);
        if(iqaAuditData){
          setClosureDate(dayjs(new Date(iqaAuditData.closureDate)));
          setEditorContent(iqaAuditData.remarks)
          setIsAddMode(false)
          setElement(iqaAuditData)
        }else{
          setIsAddMode(true)
          setElement('')
          setClosureDate(dayjs())
          setEditorContent('')
        }
      }else{
        setIsAddMode(true)
        setElement('')
        setClosureDate(dayjs())
        setEditorContent('')
      }
    }
    setIqaId(value);
  }

  const ClosureDateChange = (value)=>{
    setClosureDate(value)
  }

  const onFileSelected = (e) => {
    const file = e.target.files[0];
    if (file) {
        if(file.size>200485760){
          setSelectedFile(undefined)
          Swal.fire({
            icon: "warning",
            title: 'Maximum file upload size is 200Mb !!!',
            showConfirmButton: false,
            timer: 2500
          });
        }else{
          setSelectedFile(file)
        }
      }else{
        setSelectedFile(undefined)
      }
  }

    const downloadAtachment = async()=>{
            const EXT= element.attachmentName.slice(element.attachmentName.lastIndexOf('.')+1);
            const response =   await downloadAuditClosureFile(element.attachmentName,iqaNo);
            givePreview(EXT,response,element.attachmentName);
   }

  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body text-center">
         <Box display="flex" alignItems="center" gap="10px" className='mg-down-10'>
          <Box flex="45%" className='text-center'><h3>{iqaNo} : Audit Closure - {format(new Date(iqaFromDate),'dd-MM-yyyy')+' - '+format(new Date(iqaToDate),'dd-MM-yyyy')}</h3></Box>
          <Box flex="45%">
            <span className="text-heading">Auditees : </span><button className="button-count auditees">{totalAuditeeCount}</button>
            <span className="text-heading">&nbsp;  Auditee Submit : </span><button className="button-count auditee-sub">{auditeeSubmitCount}</button>
            <span className="text-heading">&nbsp;  Auditor Submit : </span><button className="button-count total-auditee-count">{auditorSubmitCount}</button>
            <span className="text-heading">&nbsp;  Auditee Accept : </span><button className="button-count assigned-count">{auditeeAcceptCount}</button>
            <div style={{ textAlign: "center" }}>
            <button onClick={() =>  AuditClosurePrint(iqaNo,iqaFromDate,iqaToDate,closureDate,element) }title="Audit Closure" aria-label="Audit Closure"style={{ margin: "0 5px" }}>
            <i className="material-icons">print</i> &nbsp; 
          </button>
          </div>
            </Box>
          <Box flex="10%">
            <SelectPicker options={iqaOptions} label="IQA No"
            value={iqaOptions && iqaOptions.length >0 && iqaOptions.find(option => option.value === iqaId) || null}
             handleChange={(newValue) => {onIqaChange( newValue?.value) }}/>
          </Box>
         </Box>
          <div id="card-body customized-card-body">
          <Box display="flex" alignItems="center" gap="10px" className='mg-top-10'>
            <Box flex="20%"></Box>
            <Box flex="60%">
             <div className="card">
              <div className="text-center box-margin">
              <Box display="flex" alignItems="center" gap="10px" className='mg-top-10'>
               <Box flex="30%">
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Box item  className="mg-top-10 mg-down-10 text-left">
                        <DatePicker format='DD-MM-YYYY'  value={closureDate} label="Closure Date" views={['year', 'month', 'day']}
                        minDate = {iqaFromDate && dayjs(new Date(iqaFromDate))} onChange={(newValue) => {ClosureDateChange(newValue)}}slotProps={{ textField: { size: 'small' } }}/>
                      </Box>
                 </LocalizationProvider>
               </Box>
               <Box flex="30%">
                <TextField className="bottom-5-rel" label="Choose File" variant="outlined" type="file" size="small" margin="normal"
                  onChange={(e) => onFileSelected(e)} InputLabelProps={{ shrink: true,}} inputRef={fileInputRef} />
               </Box>
               <Box flex="40%">
                <Box className='attachment' onClick = {()=>downloadAtachment()}>{element && element.attachmentName !== '' && element.attachmentName}</Box>
               </Box>
                </Box>
                <Box display="flex" alignItems="center" gap="10px" className='mg-top-10'>
                  <Box flex="100%">
                    <textarea id="summernote" className="form-control mg-top-10"></textarea>
                  </Box>
                </Box>
              </div>
              {isComplted && (isAddMode ?<div className="text-center mg-top-10 mg-down-10"><button onClick={() => closureAdd()} className="btn btn-success bt-sty">Submit</button></div>:
              <div className="text-center mg-top-10 mg-down-10"><button onClick={() => closureAdd()} className="btn btn-warning bt-sty update-bg">Update</button></div>)}
             </div>
             <h6 className="noteColor mg-top-10" >Note : All schedules must be Accepted by the auditee before Audit closure</h6>
            </Box>
            <Box flex="20%"></Box>
          </Box>
          </div>
          <div>
          </div>
        </div>
      </div>
    </div>
  );

}
export default withRouter(AuditClosureComponent);