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
        <Route path="/revision-tran" element={<RevisionTransactionComponent />} />


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

         
      </Routes>
{/* <Login/> */}
    </div>
  );
}

export default App;
