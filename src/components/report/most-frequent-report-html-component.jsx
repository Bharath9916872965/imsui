import React from "react";

const MncReportHtmlComponent = ({ data }) => (
  <div id="mnc-report-html">
    <h1 className="header">Most Frequent NCs</h1>
    <table border="1">
      <thead>
        <tr className="tableHeader">
          <th>SN</th>
          <th>Clause No</th>
          <th>Description</th>
          <th>NC Count</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.clauseNo || "-"}</td>
            <td>{item.description || "-"}</td>
            <td>{item.ncCount || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default MncReportHtmlComponent;