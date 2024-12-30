'use client';

import { formService } from '@/services/formService';
import { Field, Form } from '@/types/form';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FormField from './FormField';

const FormBuilder = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const addField = () => {
    const newField: Field = {
      _id: uuidv4(),
      type: 'text',
      label: '',
      required: false,
      placeholder: ''
    };
    setFields([...fields, newField]);
  };

  const updateField = (updatedField: Field) => {
    setFields(fields.map(field => 
      field._id === updatedField._id ? updatedField : field
    ));
  };

  const deleteField = (fieldId: string) => {
    setFields(fields.filter(field => field._id !== fieldId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);

      if (!title.trim()) {
        throw new Error('Title is required');
      }

      if (fields.length === 0) {
        throw new Error('At least one field is required');
      }

      const invalidFields = fields.filter(field => !field.label.trim());
      if (invalidFields.length > 0) {
        throw new Error('All fields must have labels');
      }

      const formData: Omit<Form, '_id' | 'creator' | 'shareableLink' | 'createdAt'> = {
        title,
        description,
        fields
      };

      await formService.createForm(formData);
      router.push('/forms');
    } catch (err) {
      console.error('Error saving form:', err);
      setError(err instanceof Error ? err.message : 'Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create New Form
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Form Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          sx={{ mb: 3 }}
        />

        <Typography variant="h6" gutterBottom>
          Form Fields
        </Typography>

        {fields.map((field) => (
          <FormField
            key={field._id}
            field={field}
            onFieldChange={updateField}
            onDeleteField={() => deleteField(field._id)}
          />
        ))}

        <Button
          variant="outlined"
          onClick={addField}
          sx={{ mb: 3 }}
        >
          Add Field
        </Button>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Form'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default FormBuilder; 