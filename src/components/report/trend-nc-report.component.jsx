import React, { useEffect, useState } from "react";
import Navbar from "components/Navbar/Navbar";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { AgCharts } from 'ag-charts-react';
import { getTrendNCAndObsList } from "services/dashboard.service";

const TrendNCAndOBSReport = () => {
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [fromDateTrend, setFromDateTrend] = useState(dayjs().subtract(5, 'year').format('YYYY-MM-DD'));
  const [toDateTrend, setToDateTrend] = useState(dayjs().format('YYYY-MM-DD'));
  const [trendOfNCReportList, setTrendOfNCReportList] = useState([]);
  const [AgChartTrendOfNCandOBSOption, setAgChartTrendOfNCandOBSOption] = useState({});

  const fetchDataForTrendReport = async () => {
    try {
                // console.log('fromDateSel :'+fromDateTrend);
                // console.log('toDateSel :'+toDateTrend);
      const trendNCObsReportListIqaWise = await getTrendNCAndObsList();
      setTrendOfNCReportList(trendNCObsReportListIqaWise);
      //console.log('trendNCObsReportListIqaWise :'+JSON.stringify(trendNCObsReportListIqaWise,null,2));

      setIsReady(true);
    } catch (error) {
      setError(error);
      setIsReady(false);
      console.error("Error fetching data:", error);
    }
  };



  const trendOfNCandOBSGraph= async (fromDate, toDate) => {
    try {
// Mapping the received data to match the structure for chart
let dataForTrendReport = '';

const fromDateObj = new Date(fromDate); // Example: '2020-01-07' => Date object
const toDateObj = new Date(toDate);

if (Array.isArray(trendOfNCReportList) && trendOfNCReportList.length > 0) {
// Filter the data based on the date range
const filteredData = trendOfNCReportList.filter((item) => {
// Convert item.fromDate and item.toDate into Date objects
const itemFromDate = new Date(item.fromDate);
const itemToDate = new Date(item.toDate);

// Check if the item's fromDate and toDate fall within the selected date range
return itemFromDate >= fromDateObj && itemToDate <= toDateObj;
});

dataForTrendReport = filteredData.map((item) => ({
iqaName: item.iqaNo || "",
nc: item.totalCountNC || 0, // Use 0 instead of an empty string for numeric data
obs: item.totalCountOBS || 0, // Same for OBS count
}));

}
 
 
  // function getData() {
  //     return [
  //       { iqaName: "IQA 33", nc: 20, obs: 30 },
  //       { iqaName: "IQA 34", nc: 30, obs: 20 },
  //       { iqaName: "IQA 35", nc: 35, obs: 30 },
  //       { iqaName: "IQA 36", nc: 10, obs: 20 },
  //       { iqaName: "IQA 37", nc: 40, obs: 20 },
  //       { iqaName: "IQA 38", nc: 40, obs: 20 },
  //     ];
  //   }

  function getData() {
    return dataForTrendReport;
  }

    const formatDate = (dateString) => {
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    };

    const formattedFromDate = formatDate(fromDateTrend);
    const formattedToDate = formatDate(toDateTrend);


    const optionsTrendNCandOBSdata = {
      title: {
        text: `Trend of NC and OBS from ${formattedFromDate} to ${formattedToDate}`,
        fontSize: 16, 
        // fontWeight: 'bold', 
        spacing: 10, 
       
      },
      data: getData(),
      series: [
        {
          type: "line",
          xKey: "iqaName",
          yKey: "nc",
          yName: "NC",
          stroke: "red",
          fill: "rgba(255, 0, 0, 0.2)",
          marker: {
            fill: "red",
            stroke: "darkred",
            size: 8,
          },
          tooltip: {
            enabled: true,
            renderer: ({ datum, color }) => {
              return `
                <div style="padding: 10px; border-radius: 5px; background: #f9f9f9; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                  <span style="display: inline-block; width: 12px; height: 12px; background-color: ${color}; margin-right: 8px; border-radius: 2px;"></span>
                  <b>${datum.iqaName}</b> (NC): ${datum.nc}
                </div>
              `;
            },
          },
        },
        {
          type: "line",
          xKey: "iqaName",
          yKey: "obs",
          yName: "OBS",
          stroke: "blue",
          fill: "rgba(0, 0, 255, 0.2)",
          marker: {
            fill: "blue",
            stroke: "darkblue",
            size: 8,
          },
          tooltip: {
            enabled: true,
            renderer: ({ datum, color }) => {
              return `
                <div style="padding: 10px; border-radius: 5px; background: #f9f9f9; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                  <span style="display: inline-block; width: 12px; height: 12px; background-color: ${color}; margin-right: 8px; border-radius: 2px;"></span>
                  <b>${datum.iqaName}</b> (OBS): ${datum.obs}
                </div>
              `;
            },
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          label: {
            rotation: 0, // Rotate labels if needed
          },
        },
        {
          type: "number",
          position: "left",
          min: 0, // Ensure the Y-axis starts at 0
          tick: {
            count: 5, // Optional: Control the number of ticks
          },
          title: {
            text: "", // Optional: Add a title to the Y-axis
          },
        },
      ],
    };

    setAgChartTrendOfNCandOBSOption(optionsTrendNCandOBSdata);
  
    } catch (error) {
      console.error('Error fetching trendOfNCandOBSGraph:', error);
    }
    };

         
 
    useEffect(() => {
      fetchDataForTrendReport();
    }, []);
  
    useEffect(() => {
      if (isReady) {
        trendOfNCandOBSGraph(fromDateTrend, toDateTrend);
      }
    }, [fromDateTrend, toDateTrend, isReady]);

  // Handle date changes and reset + re-run graph logic
  const handleDateChange = (newFromDate, newToDate) => {
    const resetFromDate = newFromDate || dayjs().subtract(5, 'year').format('YYYY-MM-DD');
    const resetToDate = newToDate || dayjs().format('YYYY-MM-DD');

    setFromDateTrend(resetFromDate);
    setToDateTrend(resetToDate);

    trendOfNCandOBSGraph(resetFromDate, resetToDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Navbar />
        <div className="card">
          <div className="card-body text-center">
            <h3>Trend of NC/OBS</h3>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', width: '100%' }}>
              <DatePicker
                label="From Date"
                maxDate={dayjs(toDateTrend)}
                value={dayjs(fromDateTrend)}
                onChange={(date) => handleDateChange(date.format('YYYY-MM-DD'), toDateTrend)}
                format="DD-MM-YYYY"
                slotProps={{ textField: { size: 'small', style: { width: '180px' } } }}
              />
              <DatePicker
                label="To Date"
                minDate={dayjs(fromDateTrend)}
                value={dayjs(toDateTrend)}
                onChange={(date) => handleDateChange(fromDateTrend, date.format('YYYY-MM-DD'))}
                format="DD-MM-YYYY"
                slotProps={{ textField: { size: 'small', style: { width: '180px' } } }}
              />
            </div>
            <div className="trend-nc-graph">
              <AgCharts options={AgChartTrendOfNCandOBSOption} />
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default TrendNCAndOBSReport;