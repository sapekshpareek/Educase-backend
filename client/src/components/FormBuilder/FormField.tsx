'use client';

import { Field } from '@/types/form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
    Box,
    Button,
    Card,
    CardContent,
    FormControlLabel,
    IconButton,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import React from 'react';

interface FormFieldProps {
  field: Field;
  onUpdate: (field: Field) => void;
  onDelete: (id: string) => void;
}

const FormField: React.FC<FormFieldProps> = ({ field, onUpdate, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: field._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const handleFieldChange = (property: keyof Field, value: any) => {
    onUpdate({
      ...field,
      [property]: value
    });
  };

  const renderFieldOptions = () => {
    if (field.type === 'select' || field.type === 'radio') {
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Options:</Typography>
          {field.options?.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <TextField
                size="small"
                value={option}
                onChange={(e) => {
                  const newOptions = [...(field.options || [])];
                  newOptions[index] = e.target.value;
                  handleFieldChange('options', newOptions);
                }}
              />
              <IconButton
                size="small"
                onClick={() => {
                  const newOptions = field.options?.filter((_, i) => i !== index);
                  handleFieldChange('options', newOptions);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            size="small"
            onClick={() => {
              handleFieldChange('options', [...(field.options || []), '']);
            }}
            sx={{ mt: 1 }}
          >
            Add Option
          </Button>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{ mb: 2 }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton {...attributes} {...listeners}>
            <DragIndicatorIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              label="Field Label"
              value={field.label}
              onChange={(e) => handleFieldChange('label', e.target.value)}
              size="small"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Placeholder"
              value={field.placeholder || ''}
              onChange={(e) => handleFieldChange('placeholder', e.target.value)}
              size="small"
              sx={{ mb: 2 }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={field.required}
                  onChange={(e) => handleFieldChange('required', e.target.checked)}
                />
              }
              label="Required"
            />
          </Box>

          <IconButton onClick={() => onDelete(field.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>

        {renderFieldOptions()}
      </CardContent>
    </Card>
  );
};

export default FormField; 