'use client';

import FormView from '@/components/FormView/FormView';
import { useParams } from 'next/navigation';

export default function FormPage() {
  const params = useParams();
  const formId = params.id as string;

  return <FormView formId={formId} />;
} 