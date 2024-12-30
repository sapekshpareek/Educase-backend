import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Link,
    Stack,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formService, submissionService } from '../../services/api';

const FormList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      const response = await formService.getForms();
      setForms(response.data);
    } catch (err) {
      setError('Failed to load forms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await formService.deleteForm(formId);
        setForms(forms.filter(form => form._id !== formId));
      } catch (err) {
        console.error('Failed to delete form:', err);
      }
    }
  };

  const handleExport = async (formId) => {
    try {
      const response = await submissionService.exportSubmissions(formId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `form-${formId}-submissions.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to export submissions:', err);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">My Forms</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/forms/new')}
        >
          Create New Form
        </Button>
      </Stack>

      {forms.length === 0 ? (
        <Typography>No forms created yet.</Typography>
      ) : (
        forms.map(form => (
          <Card key={form._id} sx={{ mb: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">{form.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {form.description}
                  </Typography>
                  <Link
                    href={`/form/${form.shareableLink}`}
                    target="_blank"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    Share Link
                  </Link>
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    onClick={() => navigate(`/forms/${form._id}/edit`)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleExport(form._id)}
                    color="primary"
                  >
                    <DownloadIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(form._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default FormList; 