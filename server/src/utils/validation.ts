import { IField } from '../types';

export const validateField = (field: IField): boolean => {
  if (!field.type || !field.label) {
    return false;
  }

  if ((field.type === 'select' || field.type === 'radio') && (!field.options || field.options.length === 0)) {
    return false;
  }

  return true;
};

export const validateFormFields = (fields: IField[]): boolean => {
  return fields.every(validateField);
}; 