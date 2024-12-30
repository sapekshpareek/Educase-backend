import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import React from 'react';

const FIELD_TYPES = [
  { type: 'text', label: 'Text' },
  { type: 'number', label: 'Number' },
  { type: 'date', label: 'Date' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'select', label: 'Dropdown' },
  { type: 'radio', label: 'Radio' }
];

const FieldTypeSelector = ({ onAddField }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add Field
      </Typography>
      <ButtonGroup variant="outlined" aria-label="field type selector">
        {FIELD_TYPES.map(({ type, label }) => (
          <Button
            key={type}
            onClick={() => onAddField(type)}
            sx={{ textTransform: 'none' }}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default FieldTypeSelector; 