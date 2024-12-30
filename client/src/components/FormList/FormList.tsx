'use client';

import { formService } from '@/services/formService';
import { Form } from '@/types/form';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Card, CardContent, Skeleton, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const FormList = () => {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForms = async () => {
      try {
        console.log('FormList: Starting to load forms');
        setLoading(true);
        setError(null);
        
        const response = await formService.getForms();
        console.log('FormList: Response from API:', response);

        // Handle axios response format
        const formsData = response.data || response;
        
        if (!Array.isArray(formsData)) {
          console.error('FormList: Expected array but got:', typeof formsData, formsData);
          throw new Error('Invalid response format');
        }

        setForms(formsData);
        console.log('FormList: Forms state updated:', formsData);
      } catch (err) {
        console.error('FormList: Error loading forms:', err);
        setError(err instanceof Error ? err.message : 'Failed to load forms');
      } finally {
        setLoading(false);
      }
    };

    loadForms();
  }, []);

  // Add debug logs
  console.log('FormList: Current loading state:', loading);
  console.log('FormList: Current error state:', error);
  console.log('FormList: Current forms state:', forms);

  const renderFormCard = (form: Form) => (
    <Card key={form._id} sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{form.title}</Typography>
        {form.description && (
          <Typography color="text.secondary" paragraph>
            {form.description}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Created: {format(new Date(form.createdAt), 'PPP')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {form.fields.length} field{form.fields.length !== 1 ? 's' : ''}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => router.push(`/form/${form.shareableLink}`)}
            startIcon={<VisibilityIcon />}
          >
            View
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => router.push(`/forms/${form._id}/edit`)}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={() => router.push(`/forms/${form._id}/submissions`)}
            startIcon={<AssessmentIcon />}
          >
            Submissions
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
        {[1, 2, 3].map((n) => (
          <Card key={n} sx={{ mb: 2 }}>
            <CardContent>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="20%" />
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Skeleton variant="rectangular" width={100} height={36} />
                <Skeleton variant="rectangular" width={100} height={36} />
                <Skeleton variant="rectangular" width={100} height={36} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Forms</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/forms/new')}
        >
          Create New Form
        </Button>
      </Box>

      {forms.length === 0 ? (
        <Typography>No forms yet. Create your first form!</Typography>
      ) : (
        forms.map((form: Form) => renderFormCard(form))
      )}
    </Box>
  );
};

export default FormList; 