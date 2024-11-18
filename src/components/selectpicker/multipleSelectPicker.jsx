import React from 'react';
import { Autocomplete, TextField, Chip, Box, ListItem, ListItemText } from '@mui/material';
//import CheckIcon from '@mui/icons-material/Check';
import { styled } from '@mui/system';
//import CancelIcon from '@mui/icons-material/Cancel';
import { MdClose } from "react-icons/md";
import { MdCheck } from "react-icons/md";
import { CustomMenuItem } from '../../services/auth.header';

const CustomChip = styled(Chip)({
  margin: '4px',
  height: '24px', // Reduce height of the Chip
  fontSize: '0.875rem', // Smaller font size
});


const HighlightedCross = styled(MdClose)({
  color: 'red', // Change this to your desired highlight color
  cursor: 'pointer',
  fontSize: '1rem', // Adjust size as needed
});

const MultipleSelectPicker = ({ options, label, value, handleChange }) => {
  const handleDelete = (val) => {
    handleChange(value.filter((item) => item !== val));
  };

  return (
    <Box>
      <Autocomplete
        multiple
        options={options}
        getOptionLabel={(option) => option.label}
        value={value}
        onChange={(event, newValue) => handleChange(newValue)}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <CustomChip
                key={key} // Directly apply key here
                label={option.label}
                onDelete={() => handleDelete(option)}
                deleteIcon={<HighlightedCross />} // Highlighted cross mark
                {...tagProps} // Spread other props
              />
            );
          })
        }
        renderOption={(props, option, { selected }) => {
          const { key, ...otherProps } = props; // Extract key from props
          return (
            <CustomMenuItem key={key} {...otherProps}>
              <ListItemText primary={option.label} />
              {selected && <MdCheck style={{ marginLeft: 'auto' }} />}
            </CustomMenuItem>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            size="small" // Adjust size here
            InputProps={{
              ...params.InputProps,
              endAdornment: params.InputProps.endAdornment,
            }}
          />
        )}
        disableCloseOnSelect
      />
    </Box>
  );
};

export default MultipleSelectPicker;
