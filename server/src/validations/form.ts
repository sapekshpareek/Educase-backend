import { body } from 'express-validator';

export const formValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Form title is required'),
  
  body('fields')
    .isArray()
    .withMessage('Fields must be an array'),
  
  body('fields.*.type')
    .isIn(['text', 'number', 'date', 'checkbox', 'select', 'radio'])
    .withMessage('Invalid field type'),
  
  body('fields.*.label')
    .trim()
    .notEmpty()
    .withMessage('Field label is required')
]; 