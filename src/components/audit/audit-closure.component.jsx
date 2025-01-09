import React, { useEffect, useState } from "react";
import { getIqaScheduleList,AuditClosureDTO,addAuditClosure,getAuditClosureList,updateAuditClosure } from "services/audit.service";
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
  const [filAuditClouserList,setFilAuditClouserList] = useState([]);
  const [element,setElement] = useState('')




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

    await AlertConfirmation({
      title: isAddMode?'Are you sure Add Audit Closure ?':'Are you sure Update Audit Closure ?' ,
      message: '',
      }).then(async (result) => {
      if (result) {
        try {

            if(isAddMode){
              const response = await addAuditClosure(new AuditClosureDTO(0,Number(iqaId),content,closureDate));
              if (response.status === 'S') {
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
            }else{
              const response = await updateAuditClosure(new AuditClosureDTO(element.closureId,Number(iqaId),content,closureDate));
              if (response.status === 'S') {
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
            }
          

        } catch (error) {
          Swal.fire('Error!', 'There was an issue adding the Audit Closure.', 'error');
        }
      }
    });

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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box item  className="mg-top-10 mg-down-10 text-left">
                      <DatePicker format='DD-MM-YYYY'  value={closureDate} label="Closure Date" views={['year', 'month', 'day']}
                      onChange={(newValue) => {ClosureDateChange(newValue)}}slotProps={{ textField: { size: 'small' } }}/>
                    </Box>
                  </LocalizationProvider>
                  <textarea id="summernote" className="form-control mg-top-10"></textarea>
              </div>
               
              {isComplted && (isAddMode ?<div className="text-center mg-top-10 mg-down-10"><button onClick={() => closureAdd()} className="btn btn-success bt-sty">Submit</button></div>:
              <div className="text-center mg-top-10 mg-down-10"><button onClick={() => closureAdd()} className="btn btn-warning bt-sty update-bg">Update</button></div>)}
             </div>
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