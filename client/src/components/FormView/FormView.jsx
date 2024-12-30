import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formService, submissionService } from '../../services/api';

const FormView = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadForm();
  }, [id]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const response = await formService.getForm(id);
      setForm(response.data);
      initializeFormData(response.data.fields);
    } catch (err) {
      setError('Failed to load form');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initializeFormData = (fields) => {
    const initialData = {};
    fields.forEach(field => {
      initialData[field.label] = field.type === 'checkbox' ? false : '';
    });
    setFormData(initialData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submissionService.submitForm(form._id, formData);
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit form');
      console.error(err);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
        return (
          <TextField
            fullWidth
            type={field.type}
            label={field.label}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.label] || ''}
            onChange={(e) => setFormData({
              ...formData,
              [field.label]: e.target.value
            })}
            margin="normal"
          />
        );

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={formData[field.label] || false}
                onChange={(e) => setFormData({
                  ...formData,
                  [field.label]: e.target.checked
                })}
                required={field.required}
              />
            }
            label={field.label}
          />
        );

      case 'radio':
        return (
          <FormControl component="fieldset" margin="normal" required={field.required}>
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup
              value={formData[field.label] || ''}
              onChange={(e) => setFormData({
                ...formData,
                [field.label]: e.target.value
              })}
            >
              {field.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'select':
        return (
          <FormControl fullWidth margin="normal" required={field.required}>
            <FormLabel>{field.label}</FormLabel>
            <select
              value={formData[field.label] || ''}
              onChange={(e) => setFormData({
                ...formData,
                [field.label]: e.target.value
              })}
            >
              <option value="">Select an option</option>
              {field.options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormControl>
        );

      default:
        return null;
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!form) return <Typography>Form not found</Typography>;
  if (submitted) return <Typography>Thank you for your submission!</Typography>;

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        {form.title}
      </Typography>
      
      {form.description && (
        <Typography variant="body1" sx={{ mb: 3 }}>
          {form.description}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <FormGroup>
          {form.fields.map((field, index) => (
            <Box key={index}>
              {renderField(field)}
            </Box>
          ))}
        </FormGroup>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default FormView; 