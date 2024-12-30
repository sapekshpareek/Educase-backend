'use client';

import { formService } from '@/services/api';
import { Field } from '@/types/form';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import FieldTypeSelector from './FieldTypeSelector';
import FormField from './FormField';

const FormBuilder: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [fields, setFields] = useState<Field[]>([]);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addField = (fieldType: Field['type']) => {
    const newField: Field = {
      _id: `temp-${Date.now()}`,
      type: fieldType,
      label: `New ${fieldType} field`,
      placeholder: '',
      required: false,
      options: fieldType === 'select' || fieldType === 'radio' ? ['Option 1'] : undefined
    };
    setFields([...fields, newField]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex(field => field.id === active.id);
      const newIndex = fields.findIndex(field => field.id === over?.id);
      const newFields = [...fields];
      const [removed] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, removed);
      setFields(newFields);
    }
  };

  const handleSave = async () => {
    try {
      if (!formTitle.trim()) {
        setError('Form title is required');
        return;
      }

      if (fields.length === 0) {
        setError('At least one field is required');
        return;
      }

      setSaving(true);
      setError(null);
      
      const formData = {
        title: formTitle.trim(),
        description: formDescription.trim(),
        fields: fields.map(({ _id, ...field }) => ({
          ...field,
          label: field.label.trim(),
          placeholder: field.placeholder?.trim()
        }))
      };

      const data = await formService.createForm(formData);

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      enqueueSnackbar('Form saved successfully!', { variant: 'success' });
      router.push('/forms');
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Error saving form');
      enqueueSnackbar(err instanceof Error ? err.message : 'Error saving form', { 
        variant: 'error' 
      });
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
        <SortableContext items={fields.map(f => f._id)} strategy={verticalListSortingStrategy}>
          {fields.map((field) => (
            <FormField
              key={field._id}
              field={field}
              onUpdate={(updatedField: Field) => {
                const newFields = fields.map(f => 
                  f._id === updatedField._id ? updatedField : f
                );
                setFields(newFields);
              }}
              onDelete={(fieldId: string) => {
                setFields(fields.filter(f => f._id !== fieldId));
              }}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={saving}
        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
        sx={{ mt: 2 }}
      >
        {saving ? 'Saving...' : 'Save Form'}
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default FormBuilder; 