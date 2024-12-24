import React, { useState } from 'react';
import { Box,TextField,Button } from '@mui/material';
import './Login.css';

const ReturnDialog = ({ open, onClose, onConfirm,heading }) => {
  const [inputValue, setInputValue] = useState('');
  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm(inputValue);
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value); 
  };

  return (
   <div>
    {open && (
      <div className={`modal fade show modal-visible`} style={{ display: 'block' }} aria-modal="true" role="dialog">
        <div className="modal-dialog modal-lg modal-lg-custom">
          <div className="modal-content" >
            <div className="modal-header bg-secondary d-flex justify-content-between bg-primary text-white">
              <h5 className="modal-title">{heading}</h5>
              <button type="button" className="btn btn-danger" onClick={handleClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body model-max-height">
            <Box display="flex" alignItems="center" gap="10px">
              <Box flex="5%"></Box>
              <Box flex="90%">
                <TextField fullWidth label="Message" size="small" variant="outlined" value={inputValue} onChange={handleInputChange} />
              </Box>
              <Box flex="5%"></Box>
            </Box>
            <Box className="text-center mg-top-10">
              <Button type='button' variant="contained" title='Submit' className='submit'  onClick={handleConfirm}>Submit</Button>
            </Box>
            </div>
          </div>
        </div>
      </div>

    )}
  </div>
  );
};

export default ReturnDialog;
