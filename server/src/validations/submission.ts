import { body } from 'express-validator';
import { Types } from 'mongoose';
import Form from '../models/Form';

export const submissionValidation = [
  body('formId')
    .notEmpty()
    .withMessage('Form ID is required')
    .custom(async (formId) => {
      if (!Types.ObjectId.isValid(formId)) {
        throw new Error('Invalid form ID');
      }
      
      const form = await Form.findById(formId);
      if (!form) {
        throw new Error('Form not found');
      }
      
      return true;
    }),
  
  body('data')
    .isObject()
    .withMessage('Submission data must be an object')
    .custom(async (data, { req }) => {
      const form = await Form.findById(req.body.formId);
      if (!form) return true; // Already checked above
      
      // Check required fields
      for (const field of form.fields) {
        if (field.required && !data[field.label]) {
          throw new Error(`${field.label} is required`);
        }
        
        // Type validation could be added here
        // Example: validate number fields contain numbers, etc.
      }
      
      return true;
    })
]; 