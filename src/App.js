import logo from './logo.svg';
import './App.css';
//import Login from './components/Login/Login';
import Login from  './components/Login/login.component.jsx'
import AuditStampingComponent from './components/admin/auditStamping.component.jsx';
import { Routes, Route } from "react-router-dom";
import QmRevisionRecordsComponent from './components/qms/qm/qm-revisionrecords.component';
import Dashboard from './components/dashboard/dashboard.component';
import QmAddDocContentComponent from './components/qms/qm/qm-add-doc-content/qm-add-doc-content.component';
import AuditorListComponent from './components/audit/auditor-list.component';
import IqaListComponent from './components/audit/iqa-list.component';
import ScheduleListComponent from './components/audit/scheduler/schedule-list.component';
import AuditeeListComponent from './components/audit/auditee-list.component';
import AuditTeamListComponent from './components/audit/audit-team-list.component';
import DwpRevisionrecordsComponent from 'components/qms/dwp/dwp-revisionrecords.component';
import DwpAddDocContentComponent from './components/qms/dwp/dwp-add-doc-content/dwp-add-doc-content.component';
import ScheduleApprovalComponent from './components/audit/scheduler/schedule-approval.component';
import ScheduleTransactionComponent from './components/audit/scheduler/schedule-transaction';
import CheckListMasterComponent from './components/audit/scheduler/check-list/check-list-master.jsx';
import AuditCheckListComponent from 'components/audit/scheduler/check-list/audit-check-list.jsx';
import UseIdleTimer from 'common/idle-logout';
import IqaAuditeeListComponent from 'components/audit/iqa-auditee-list.component';
import KpiObjectiveMaster from 'components/KPI/masters/kpi-objective-master';
import UserManagerComponent from 'components/admin/userManager.component';
import FormRoleAccess from 'components/admin/formRoleAccess.component';
import RiskRegisterComponent from 'components/riskregister/risk-register.component';
import MitigationRiskRegisterComponent from 'components/riskregister/mitigation-risk-register.component';
import RevisionTransactionComponent from 'components/qms/qm/qm-revision-transaction';
import KpiObjectiveAction from 'components/KPI/masters/kpi-objective-action';
import AuditSummaryReport from 'components/report/auditSummary-component-report';
import NcReportComponent from 'components/report/nc-component-report';
import DWPRevisionTransactionComponent from 'components/qms/dwp/dwp-revision-transaction';
import QspComponent from 'components/qms/qsp/qsp.component';
import QspAddDocContentComponent from 'components/qms/qsp/qsp-add-doc-content/qsp-add-doc-content.component';

function App() {
  return (
    <div className="App">
      <UseIdleTimer/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/audit-stamping" element={<AuditStampingComponent />} />

        {/* Admin */}
        <Route path="/user-manager-list" element={<UserManagerComponent />} />
        <Route path="/form-role-access" element={<FormRoleAccess />} />
        
        {/* QMS */}
        <Route path="/quality-manual" element={<QmRevisionRecordsComponent />} />
        <Route path="/qm-add-content" element={<QmAddDocContentComponent />} />
        <Route path="/dwp" element={<DwpRevisionrecordsComponent docName='dwp' />} />
        <Route path="/gwp" element={<DwpRevisionrecordsComponent docName='gwp' />} />
        <Route path="/dwp-add-content" element={<DwpAddDocContentComponent />} />
        <Route path="/qm-revision-tran" element={<RevisionTransactionComponent />} />
        <Route path="/dwp-revision-tran" element={<DWPRevisionTransactionComponent />} />
        


        {/* Audit */}
        <Route path="/auditor-list" element={<AuditorListComponent />} />
        <Route path="/iqa-list" element={<IqaListComponent />} />
        <Route path="/auditee-list" element={<AuditeeListComponent />} />
        <Route path="/audit-team-list" element={<AuditTeamListComponent />} />
        <Route path="/iqa-auditee-list" element={<IqaAuditeeListComponent />} />

        {/* Schedule */}
        <Route path="/schedule-list" element={<ScheduleListComponent />} />
        <Route path="/schedule-approval" element={<ScheduleApprovalComponent />} />
        <Route path="/schedule-tran" element={<ScheduleTransactionComponent />} />
        <Route path="/check-list-master" element={<CheckListMasterComponent />} />
        <Route path="/audit-check-list" element={<AuditCheckListComponent />} />

        {/* Schedule */}
        <Route path="/kpi-objective" element={<KpiObjectiveMaster />} />
        <Route path="/kpi-list" element={<KpiObjectiveAction />} />

        

         {/* Risk Register */}
         <Route path="/risk-register" element={<RiskRegisterComponent />} />
         <Route path="/mitigation-risk-register" element={<MitigationRiskRegisterComponent />} />


          {/* Report */}
          <Route path="/audit-summary-report" element={<AuditSummaryReport />} />
          <Route path="/nc-report" element={<NcReportComponent />} />


         
         {/* QSP */}
         <Route path="/qsp1" element={<QspComponent docName={'qsp1'}/>} />
         <Route path="/qsp2" element={<QspComponent docName={'qsp2'}/>} />
         <Route path="/qsp3" element={<QspComponent docName={'qsp3'}/>} />
         <Route path="/qsp4" element={<QspComponent docName={'qsp4'}/>} />
         <Route path="/qsp5" element={<QspComponent docName={'qsp5'}/>} />
         <Route path="/qsp6" element={<QspComponent docName={'qsp6'}/>} />
         <Route path="/qsp7" element={<QspComponent docName={'qsp7'}/>} />
         <Route path="/qsp8" element={<QspComponent docName={'qsp8'}/>} />
         <Route path="/qsp-add-content" element={<QspAddDocContentComponent/>} />

         
      </Routes>
{/* <Login/> */}
    </div>
  );
}

export default App;
