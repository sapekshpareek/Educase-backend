export interface Field {
  _id: string;
  type: 'text' | 'number' | 'date' | 'checkbox' | 'select' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface Form {
  _id: string;
  title: string;
  description?: string;
  fields: Field[];
  creator: string;
  shareableLink: string;
  createdAt: string;
}

export interface Submission {
  _id: string;
  form: string;
  data: Record<string, any>;
  submittedAt: string;
} 