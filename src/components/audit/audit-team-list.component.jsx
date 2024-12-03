import React, { useEffect, useState } from "react";
import { getAuditeeTeamDtoList, getAuditorIsActiveList, getAuditTeamMemberList, getIqaDtoList, getTeamMemberIsActiveList, insertAuditTeam } from "../../services/audit.service";
import { Autocomplete, ListItemText, TextField } from "@mui/material";
import { Field, Formik, Form } from "formik";
import Navbar from "../Navbar/Navbar";
import "./audit-team-list.component.css";
import Swal from "sweetalert2";
import * as Yup from 'yup';
import SelectPicker from '../selectpicker/selectPicker';
import MultipleSelectPicker from "../selectpicker/multipleSelectPicker";
import AlertConfirmation from "../../common/AlertConfirmation.component";
import { CustomMenuItem } from "../../services/auth.header";

const AuditTeamListComponent = () => {

  const [showModal, setShowModal] = useState(false);
  const [teamLeadFilOptions, setTeamLeadFilOptions] = useState([]);
  const [teamMemberFilOptions, setTeamMemberFilOptions] = useState([]);
  //const [tblauditTeamData, setTblAuditTeamData] = useState([]);
  const [initialValues, setInitialValues] = useState({ teamLeadEmpId: "", teamMemberEmpId: [], iqaId: "", teamCode: "", teamId: "" });
  const [auditTeamDtoList, setAuditTeamDtoList] = useState([]);
  const [filAuditTeamDtoList, setFilAuditTeamDtoList] = useState([]);
  const [auditTeamMemberDtoList, setAuditTeamMemberDtoList] = useState([]);
  const [fullAuditorList, setFullAuditorList] = useState([]);
  const [teamMemberDtoList, setTeamMemberDtoList] = useState([]);
  const [iqaId, setIqaId] = useState('');
  const [iqaOptions, setIqaOptions] = useState([]);
  const [iqaNo, setIqaNo] = useState('');
  const [nextTeamCode, setNextTeamCode] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [actionFrom, setActionFrom] = useState("");
  const [iqaFullList, setIqaFullList] = useState([])

  const validationSchema = Yup.object().shape({
    teamLeadEmpId: Yup.string().required("TeamLead required"),
  });

  const columns = [
    { name: "SN", selector: (row) => row.sn, sortable: true, align: 'text-center' },
    { name: "Team Name", selector: (row) => row.teamName, sortable: true, align: 'text-start' },
    { name: "Auditor 1", selector: (row) => row.auditorOne, sortable: true, align: 'text-center' },
    { name: "Auditor 2", selector: (row) => row.auditorTwo, sortable: true, align: 'text-center', },
    { name: "Auditor 3", selector: (row) => row.auditorThree, sortable: true, align: 'text-center', },
    { name: "Action", selector: (row) => row.action, sortable: true, align: 'text-center', },
  ];

  useEffect(() => {
    auditTeamList();
  }, []);

  const teamMembersGrouped = auditTeamMemberDtoList.reduce((acc, member) => {
    if (!acc[member.teamId]) {
      acc[member.teamId] = [];
    }
    // Push an object containing both teamMembers and isLead
    acc[member.teamId].push({
      name: member.teamMembers, // Assuming `teamMembers` is the member name
      isLead: member.isLead,   // Include `isLead` property
    });
    return acc;
  }, {});



  const auditTeamList = async () => {
    try {
      const [AuditTeamDtoList, IqaList] = await Promise.all([getAuditeeTeamDtoList(), getIqaDtoList()]);

      setIqaFullList(IqaList)
      const iqaData = IqaList.map(data => ({
        value: data.iqaId,
        label: data.iqaNo
      }));
      if (IqaList.length > 0) {
        setIqaNo(IqaList[0].iqaNo)
        setIqaId(IqaList[0].iqaId)
        setFilAuditTeamDtoList(AuditTeamDtoList.filter(data => data.iqaId === IqaList[0].iqaId));
      }
      setIqaOptions(iqaData)
      latestData();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {

    }
  };

  const latestData = async () => {
    const [AuditTeamDtoList, AuditorList, TeamMemberList, AuditTeamMemberList, IqaList] = await Promise.all([getAuditeeTeamDtoList(), getAuditorIsActiveList(), getTeamMemberIsActiveList(), getAuditTeamMemberList(), getIqaDtoList()]);
    const filteredAuditorList = AuditorList.filter(
      (aud) => !TeamMemberList.some(
        (member) => member.iqaId === iqaId && member.auditorId === aud.auditorId
      )
    );
    setTeamLeadFilOptions(
      filteredAuditorList.map((item) => ({
        value: item.auditorId,
        label: `${item.empName}, ${item.designation}`,
      }))
    );

    setTeamMemberFilOptions(
      filteredAuditorList.map((item) => ({
        value: item.auditorId,
        label: `${item.empName}, ${item.designation}`,
      }))
    );
    setTeamMemberDtoList(TeamMemberList);
    setAuditTeamMemberDtoList(AuditTeamMemberList);
    // setTableDate(AuditTeamDtoList);
    setAuditTeamDtoList(AuditTeamDtoList);
    setFullAuditorList(AuditorList);
    if (IqaList.length > 0) {
      setFilAuditTeamDtoList(AuditTeamDtoList.filter(data => data.iqaId === (iqaId === '' ? IqaList[0].iqaId : iqaId)));
    }
  }


  useEffect(() => {
    if (filAuditTeamDtoList.length > 0) {
      // Find the teamCode with the highest numeric value
      const latestTeamCode = filAuditTeamDtoList
        .map((team) => {
          const [, numberPart] = team.teamCode.split("-");
          return {
            teamCode: team.teamCode,
            number: parseInt(numberPart, 10),
          };
        })
        .sort((a, b) => b.number - a.number)
        .shift()?.teamCode || "Team-0";
      const [prefix, numberPart] = latestTeamCode.split("-");
      const nextNumber = parseInt(numberPart, 10) + 1;
      const nextTeamCode = `${prefix}-${nextNumber}`;
      setTeamCode(nextTeamCode);
    } else {
      setTeamCode("Team-1");
    }
  }, [filAuditTeamDtoList]);

  const handleSubmit = async (values) => {
    if (values.teamMemberEmpId.length === 0) {
      return Swal.fire("Warning", "Please Select Team Members !", "warning");
    }
    const isEditMode = Boolean(values.teamId);
    const successMessage = isEditMode ? " Updated Successfully!" : " Added Successfully!";
    const unsuccessMessage = isEditMode ? " Update Unsuccessful!" : " Add Unsuccessful!";
    const Title = isEditMode ? "Are you sure to Update ?" : "Are you sure to Add ?";

    const confirm = await AlertConfirmation({
      title: Title,
      message: '',
    });

    // if (!confirm.isConfirmed) return;
    if (confirm) {
      try {
        const response = await insertAuditTeam(values);
        if (response === 200) {
          await latestData();
          setShowModal(false);
          setInitialValues({ teamLeadEmpId: "", teamMemberEmpId: [], iqaId: "", teamCode: "" });
          Swal.fire({
            icon: "success",
            title: `${iqaNo} - ${teamCode}`,
            text: successMessage,
            showConfirmButton: false,
            timer: 2500
          });
        } else {
          Swal.fire({
            icon: "error",
            title: unsuccessMessage,
            showConfirmButton: false,
            timer: 2500
          });
        }
      } catch (error) {
        console.error("Error adding auditor:", error);
        Swal.fire("Error!", "There was an issue adding the Auditor Team.", "error");
      }
    }
  };

  const onIqaChange = (value) => {
    const iqa = iqaFullList.filter(data => data.iqaId === value);
    setFilAuditTeamDtoList(auditTeamDtoList.filter(data => data.iqaId === value));
    setIqaId(value);
    setIqaNo(iqa && iqa.length > 0 && iqa[0].iqaNo)
  }

  const addTeam = (action) => {
    setShowModal(true);
    setInitialValues(prevValue => ({
      ...prevValue,
      iqaId: iqaId,
      teamCode: teamCode,
    }))
    setActionFrom(action);
    setIqaId(iqaId);
    latestData();
  }

  const editAuditTeam = (team) => {
    const editTeamMembers = auditTeamMemberDtoList.filter(data => data.teamId === team.teamId);
    const leadDetails = editTeamMembers.filter(data => data.isLead === 1);
    const memberDetails = editTeamMembers.filter(data => data.isLead === 0);
    const filteredAuditorList = fullAuditorList.filter(
      (aud) => !teamMemberDtoList.some((auditor) => auditor.auditorId === aud.auditorId && auditor.auditorId !== leadDetails[0].auditorId && auditor.iqaId === iqaId )
    );

    const filteredTeamMemberList = fullAuditorList.filter(
      (aud) => !teamMemberDtoList.some((auditor) => auditor.auditorId === aud.auditorId && auditor.iqaId === iqaId && !memberDetails.some(member => member.auditorId === aud.auditorId ))
    );

    setTeamLeadFilOptions(
      filteredAuditorList.map((item) => ({
        value: item.auditorId,
        label: `${item.empName}, ${item.designation}`,
      }))
    );

    setTeamMemberFilOptions(
      filteredTeamMemberList.map((item) => ({
        value: item.auditorId,
        label: `${item.empName}, ${item.designation}`,
      }))
    )

    setShowModal(true);
    setInitialValues(prevValue => ({
      ...prevValue,
      iqaId: team.iqaId,
      teamCode: team.teamCode,
      teamLeadEmpId: leadDetails && leadDetails.length > 0 && leadDetails[0].auditorId,
      teamMemberEmpId: memberDetails && memberDetails.length > 0 ? memberDetails.map(member => member.auditorId) : [],
      teamId: team.teamId,
    }))
    setTeamCode(`${team.teamCode}`);
    setActionFrom('Edit');
  }

  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body text-center">
          <div className="row">
            <div className="col-md-9">
              <h3>{iqaNo} : Auditee Team List</h3>
            </div>
            <div className="col-md-2">
              <SelectPicker options={iqaOptions} label="IQA No"
                value={iqaOptions && iqaOptions.length > 0 && iqaOptions.find(option => option.value === iqaId) || null}
                handleChange={(newValue) => { onIqaChange(newValue?.value) }} />
            </div>
            <div className="col-md-1">
            <button className="btn add btn-name" onClick={() => addTeam('Add')}>
              Add
            </button>
            </div>
          </div><br />
          <div className="team-list">
            {filAuditTeamDtoList.map((team, index) => (
              <div key={index} className="team-card">
                <h3>{team.teamCode}</h3>
                <ul>
                  {teamMembersGrouped[team.teamId] ? (
                    teamMembersGrouped[team.teamId].map((member, idx) => (
                      <li
                        key={idx}
                        style={{
                          color: member.isLead === 1 ? "#00fd0c" : "white", // Conditional color
                        }}
                      >
                        {member.name}
                      </li>
                    ))
                  ) : (
                    <li>No members assigned</li>
                  )}
                </ul>
                <button className=" btn btn-outline-warning btn-sm me-1" onClick={() => editAuditTeam(team)} title="Edit" style={{ position: "absolute", bottom: "10px", right: "10px", }}> <i className="material-icons"  >edit_note</i></button>
              </div>
            ))}
          </div>
          {showModal && (
            <>
              {/* Backdrop */}
              <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
              <div className="modal fade show" style={{ display: "block" }}>
                <div className="modal-dialog modal-lg modal-lg-custom" style={{ maxWidth: "55%" }}>
                  <div className="modal-content modal-content-custom" >
                    <div className="modal-header bg-secondary d-flex justify-content-between text-white modal-header-custom">
                      <h5 className="modal-title">{iqaNo} : Auditor Team {actionFrom}</h5>
                      <button type="button" className="btn btn-danger modal-header-danger-custom" onClick={() => setShowModal(false)}>
                        &times;
                      </button>
                    </div>
                    <div className="modal-body">
                      <Formik initialValues={initialValues} enableReinitialize validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {({ values, errors, touched, setFieldValue }) => (
                          <Form>
                            {/* Row 1 */}
                            <div className="row">
                              {/* IQA No (Readonly TextField) */}
                              <div className="col-md-2">
                                <Field
                                  name="teamCode"
                                  as={TextField}
                                  label="Team Code"
                                  size="small"
                                  margin="normal"
                                  value={teamCode}
                                  InputProps={{
                                    inputProps: { maxLength: 100 },
                                    autoComplete: "off",
                                    readOnly: true,
                                  }}
                                  style={{ marginTop: "1rem", width: "100%" }}
                                />
                              </div>
                              {/* Team Lead Single Select */}
                              <div className="col-md-5">
                                <Field name="teamLeadEmpId">
                                  {({ field, form }) => (
                                    <Autocomplete
                                      options={teamLeadFilOptions} // All options visible initially
                                      getOptionLabel={(option) => option.label || ""}
                                      renderOption={(props, option) => (
                                        <CustomMenuItem {...props} key={option.value}>
                                          <ListItemText primary={option.label} />
                                        </CustomMenuItem>
                                      )}
                                      value={
                                        teamLeadFilOptions.find((option) => option.value === form.values.teamLeadEmpId) || null
                                      }
                                      onChange={(event, newValue) => {
                                        form.setFieldValue("teamLeadEmpId", newValue ? newValue.value : "");
                                        if (newValue) {
                                          // Remove selected Team Lead from Team Members if already selected
                                          const filteredTeamMembers = form.values.teamMemberEmpId.filter(
                                            (memberId) => memberId !== newValue.value
                                          );
                                          form.setFieldValue("teamMemberEmpId", filteredTeamMembers);
                                        }
                                      }}
                                      onBlur={() => form.setFieldTouched("teamLeadEmpId", true)}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label="Team Lead"
                                          size="small"
                                          error={Boolean(touched.teamLeadEmpId && errors.teamLeadEmpId)}
                                          helperText={touched.teamLeadEmpId && errors.teamLeadEmpId}
                                          fullWidth
                                          variant="outlined"
                                          margin="normal"
                                        />
                                      )}
                                      ListboxProps={{ sx: { maxHeight: 200, overflowY: "auto" } }}
                                    />
                                  )}
                                </Field>
                              </div>

                              {/* Team Members Multi-Select */}
                              <div className="col-md-5 full-width">
                                <Field name="teamMemberEmpId">
                                  {({ form, field }) => {
                                    // Exclude selected Team Lead from options
                                    const MemberFilOptions = teamMemberFilOptions.filter(
                                      (option) => option.value !== form.values.teamLeadEmpId
                                    );

                                    return (
                                      <MultipleSelectPicker
                                        options={MemberFilOptions}
                                        label="Team Members"
                                        value={MemberFilOptions.filter((option) =>
                                          form.values.teamMemberEmpId.includes(option.value)
                                        )}
                                        handleChange={(newValue) =>
                                          form.setFieldValue(
                                            "teamMemberEmpId",
                                            newValue.map((item) => item.value)
                                          )
                                        }
                                      />
                                    );
                                  }}
                                </Field>
                              </div>
                            </div>
                            {/* Submit Button */}
                            <div className="col text-center subclass">
                              <button type="submit" className="btn btn-success">
                                Submit
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

};
export default AuditTeamListComponent; 