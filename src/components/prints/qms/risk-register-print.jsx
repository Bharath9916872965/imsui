import React, { useEffect, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import htmlToPdfmake from 'html-to-pdfmake';
import { getEmployeesList } from 'services/header.service';
import { format } from 'date-fns';

const RiskRegisterPrint = ({ action, revisionElements, buttonType }) => {

    console.log('inside report of Risk Register');
    console.log('revisionElements123456',revisionElements);
  useEffect(() => {

  }, []);

}

export default RiskRegisterPrint;
