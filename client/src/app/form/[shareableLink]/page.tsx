'use client';

import FormView from '@/components/FormView/FormView';
import { Box } from '@mui/material';

interface FormPageProps {
  params: {
    shareableLink: string;
  };
}

export default function FormPage({ params }: FormPageProps) {
  return (
    <Box>
      <FormView formId={params.shareableLink} />
    </Box>
  );
} 