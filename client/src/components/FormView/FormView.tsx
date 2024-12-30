'use client';

import { formService } from '@/services/formService';
import { Form } from '@/types/form';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    TextField,
    Typography
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FormViewProps {
  formId: string;
}

const FormView = ({ formId }: FormViewProps) => {
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadForm = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await formService.getFormByShareableLink(formId);
        setForm(data);
      } catch (err) {
        console.error('Error loading form:', err);
        setError(err instanceof Error ? err.message : 'Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);

      // Validate required fields
      const missingFields = form?.fields
        .filter(field => field.required && !formData[field._id])
        .map(field => field.label);

      if (missingFields && missingFields.length > 0) {
        throw new Error(`Please fill in required fields: ${missingFields.join(', ')}`);
      }

      await formService.submitForm(formId, formData);
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!form) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Form not found</Typography>
      </Box>
    );
  }

  if (submitted) {
    return (
      <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Thank You!
        </Typography>
        <Typography paragraph>
          Your response has been submitted successfully.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setSubmitted(false);
            setFormData({});
          }}
        >
          Submit Another Response
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        {form.title}
      </Typography>
      
      {form.description && (
        <Typography variant="body1" color="text.secondary" paragraph>
          {form.description}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            {form.fields.map((field) => (
              <Box key={field._id} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label={field.label}
                  placeholder={field.placeholder}
                  required={field.required}
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={formData[field._id] || ''}
                  onChange={(e) => 
                    setFormData({
                      ...formData,
                      [field._id]: e.target.value
                    })
                  }
                  select={field.type === 'select'}
                  error={field.required && !formData[field._id]}
                  helperText={field.required && !formData[field._id] ? 'This field is required' : ''}
                  disabled={submitting}
                >
                  {field.type === 'select' && field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </TextField>
              </Box>
            ))}
          </CardContent>
        </Card>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.back()}
            disabled={submitting}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default FormView; 