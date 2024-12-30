import { Schema, model, models } from 'mongoose';
import { IForm } from '../types';

const fieldSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['text', 'number', 'date', 'checkbox', 'select', 'radio']
  },
  label: {
    type: String,
    required: true
  },
  placeholder: String,
  required: {
    type: Boolean,
    default: false
  },
  options: [String]
});

const formSchema = new Schema<IForm>({
  title: {
    type: String,
    required: true
  },
  description: String,
  fields: [fieldSchema],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shareableLink: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Check if the model exists before creating it
export default models.Form || model<IForm>('Form', formSchema); 