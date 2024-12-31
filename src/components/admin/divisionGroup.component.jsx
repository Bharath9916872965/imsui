import withRouter from 'common/with-router';
import Datatable from 'components/datatable/Datatable';
import Navbar from 'components/Navbar/Navbar';
import React, { useEffect, useState } from 'react';
import { getDivisionGroupMasterList } from 'services/admin.serive';

const DivisionGroupMaster = ({ router }) => {

const [divisionGroupList, setDivisionGroupList] = useState([]);

useEffect(() => {
    fetchDivisionGroupList();
  }, []);

const fetchDivisionGroupList = async () => {
    try {
        const divisionGroupDetails = await getDivisionGroupMasterList();
        mappedData(divisionGroupDetails);
    } catch (error) {
        console.error("An error occured");
    }
};

const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
    { name: 'Group Code', selector: (row) => row.groupCode, sortable: true, grow: 2, align: 'text-center' },
    { name: 'Group Name', selector: (row) => row.groupName, sortable: true, grow: 4, align: 'text-center' },
    { name: 'Group Head', selector: (row) => row.groupHeadName, sortable: true, grow: 2 , align: 'text-left'},
    { name: 'TD Name', selector: (row) => row.tdName, sortable: true, grow: 2 , align: 'text-center'},
];

const mappedData = (list) => {
    setDivisionGroupList(
        list.map((item, index) => ({
            sn: index + 1,
            groupCode: item.groupCode || '-',
            groupName: item.groupName || '-',
            groupHeadName: item.groupHeadName +', '+item.groupHeadDesig  || '-',
            tdName: item.tdName || '-',
        }))
    );
};

    return (
        <div>
           <Navbar></Navbar>
           <div className="card">
                <div className="card-body text-center">
                    <h3>Group Master List</h3>
                    <div id="card-body customized-card">
                        {<Datatable columns={columns} data={divisionGroupList} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(DivisionGroupMaster);