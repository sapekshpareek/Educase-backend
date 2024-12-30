import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { formService } from '../../services/api';
import FieldTypeSelector from './FieldTypeSelector';
import FormField from './FormField';

const FormBuilder = () => {
  const [fields, setFields] = useState([]);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const addField = (fieldType) => {
    const newField = {
      id: `field-${Date.now()}`,
      type: fieldType,
      label: `New ${fieldType} field`,
      placeholder: '',
      required: false,
      options: fieldType === 'select' || fieldType === 'radio' ? ['Option 1'] : undefined
    };
    setFields([...fields, newField]);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex(field => field.id === active.id);
      const newIndex = fields.findIndex(field => field.id === over.id);
      const newFields = [...fields];
      const [removed] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, removed);
      setFields(newFields);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const formData = {
        title: formTitle,
        description: formDescription,
        fields: fields.map(({ id, ...field }) => field)
      };

      const response = await formService.createForm(formData);
      console.log('Form saved:', response.data);
      // You might want to redirect to the forms list or show a success message
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving form');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Form Builder
      </Typography>
      
      <TextField
        fullWidth
        label="Form Title"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Form Description"
        value={formDescription}
        onChange={(e) => setFormDescription(e.target.value)}
        multiline
        rows={2}
        sx={{ mb: 3 }}
      />

      <FieldTypeSelector onAddField={addField} />

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
          {fields.map((field) => (
            <FormField
              key={field.id}
              field={field}
              onUpdate={(updatedField) => {
                const newFields = fields.map(f => 
                  f.id === updatedField.id ? updatedField : f
                );
                setFields(newFields);
              }}
              onDelete={(fieldId) => {
                setFields(fields.filter(f => f.id !== fieldId));
              }}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 2 }}
      >
        Save Form
      </Button>
    </Box>
  );
};

export default FormBuilder; 