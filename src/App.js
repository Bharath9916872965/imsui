import logo from './logo.svg';
import './App.css';
import Login from './components/Login/Login';
import { Routes, Route } from "react-router-dom";
import QmRevisionRecordsComponent from './components/qms/qm/qm-revisionrecords.component';
import Dashboard from './components/dashboard/dashboard.component';
import QmAddDocContentComponent from './components/qms/qm/qm-add-doc-content/qm-add-doc-content.component';
import AuditorListComponent from './components/audit/auditor-list.component';
import IqaListComponent from './components/audit/iqa-list.component';
import AuditeeListComponent from './components/audit/auditee-list.component';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* QMS */}
        <Route path="/quality-manual" element={<QmRevisionRecordsComponent />} />
        <Route path="/qm-add-content" element={<QmAddDocContentComponent />} />


        {/* Audit */}
        <Route path="/auditor-list" element={<AuditorListComponent />} />
        <Route path="/iqa-list" element={<IqaListComponent />} />
        <Route path="/auditee-list" element={<AuditeeListComponent />} />


        
      </Routes>
{/* <Login/> */}
    </div>
  );
}

export default App;
