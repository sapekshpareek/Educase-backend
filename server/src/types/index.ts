import { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface IField {
  type: 'text' | 'number' | 'date' | 'checkbox' | 'select' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface IForm extends Document {
  title: string;
  description?: string;
  fields: IField[];
  creator: Types.ObjectId;
  shareableLink: string;
  createdAt: Date;
}

export interface ISubmission extends Document {
  formId: Types.ObjectId;
  data: Map<string, any>;
  submittedAt: Date;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

export interface AuthRequest extends Request {
  user?: {
    _id: Types.ObjectId;
  };
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
} 