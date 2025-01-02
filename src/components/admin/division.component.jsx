import withRouter from 'common/with-router';
import Datatable from 'components/datatable/Datatable';
import Navbar from 'components/Navbar/Navbar';
import React, { useEffect, useState } from 'react';
import { getDivisionMasterList } from 'services/admin.serive';

const DivisionMaster = ({ router }) => {

const [divisionDetailsList, setDivisionDetailsList] = useState([]);

useEffect(() => {
    fetchDivisionDetailsList();
  }, []);

const fetchDivisionDetailsList = async () => {
    try {
        const divisionDetails = await getDivisionMasterList();
        mappedData(divisionDetails);
    } catch (error) {
        console.error("An error occured");
    }
};

const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
    { name: 'Division Code', selector: (row) => row.divCode, sortable: true, grow: 2, align: 'text-center' },
    { name: 'Division Name', selector: (row) => row.divName, sortable: true, grow: 2, align: 'text-center' }, 
    { name: 'Division Head Name', selector: (row) => row.divHeadName, sortable: true, grow: 2 , align: 'text-left'},
    { name: 'Group Name', selector: (row) => row.divGroupName, sortable: true, grow: 2 , align: 'text-center'},
];

const mappedData = (list) => {
    setDivisionDetailsList(
        list.map((item, index) => ({
            sn: index + 1,
            divCode: item.divisionCode || '-',
            divName: item.divisionName || '-',
            divHeadName: item.divHeadName+', '+item.divHeadDesig || '-',
            divGroupName: item.divGroupName || '-',
        }))
    );
};


    return (
        <div>
            <Navbar></Navbar>
            <div className="card">
                <div className="card-body text-center">
                    <h3>Division Master List</h3>
                    <div id="card-body customized-card">
                        {<Datatable columns={columns} data={divisionDetailsList} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(DivisionMaster);