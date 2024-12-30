'use client';

import { Field } from '@/types/form';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Checkbox,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import { ChangeEvent } from 'react';

interface FormFieldProps {
  field: Field;
  onFieldChange: (field: Field) => void;
  onDeleteField: () => void;
}

const FormField = ({ field, onFieldChange, onDeleteField }: FormFieldProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    onFieldChange({
      ...field,
      [name as string]: value
    });
  };

  const handleRequiredChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFieldChange({
      ...field,
      required: e.target.checked
    });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
      <TextField
        name="label"
        label="Field Label"
        value={field.label}
        onChange={handleChange}
        fullWidth
      />
      
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Type</InputLabel>
        <Select
          name="type"
          value={field.type}
          label="Type"
          onChange={handleChange}
        >
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="number">Number</MenuItem>
          <MenuItem value="select">Select</MenuItem>
        </Select>
      </FormControl>

      <Checkbox
        checked={field.required}
        onChange={handleRequiredChange}
        sx={{ mt: 1 }}
      />

      <IconButton 
        onClick={onDeleteField}
        sx={{ mt: 1 }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default FormField; 