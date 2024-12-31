import withRouter from 'common/with-router';
import Datatable from 'components/datatable/Datatable';
import Navbar from 'components/Navbar/Navbar';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { getProjectMasterList } from 'services/admin.serive';

const ProjectMaster = ({ router }) => {

const [projectDetailsList, setProjectDetailsList] = useState([]);

useEffect(() => {
    fetchProjectMasterList();
  }, []);

const fetchProjectMasterList = async () => {
    try {
        const projectDetails = await getProjectMasterList();
        mappedData(projectDetails);
    } catch (error) {
        console.error("An error occured");
    }
};

const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
    { name: 'Project Code', selector: (row) => row.prjCode, sortable: true, grow: 2, align: 'text-center' },
    { name: 'Project Name', selector: (row) => row.prjName, sortable: true, grow: 2, align: 'text-left' }, 
    { name: 'PDC', selector: (row) => row.pdc, sortable: true, grow: 2 , align: 'text-center'},
    { name: 'Project Director', selector: (row) => row.prjDirName, sortable: true, grow: 2 , align: 'text-left'},
    { name: 'Description', selector: (row) => row.prjDescription, sortable: true, grow: 2 , align: 'text-left'},
];

const mappedData = (list) => {
    setProjectDetailsList(
        list.map((item, index) => ({
            sn: index + 1,
            prjCode: item.projectCode || '-',
            prjName: item.projectName || '-',
            pdc: format(new Date(item.pdc), 'dd-MM-yyyy')   || '-',
            prjDirName:  item.prjDirectorName+', '+item.prjDirectorDesig || '-', 
            prjDescription: item.projectDescription || '-',
        }))
    );
};

    return (
        <div>
          <Navbar></Navbar>
          <div className="card">
                <div className="card-body text-center">
                    <h3>Project Master List</h3>
                    <div id="card-body customized-card">
                        {<Datatable columns={columns} data={projectDetailsList} />}
                    </div>
                </div>
            </div>
       </div>
    )
}

export default withRouter(ProjectMaster);