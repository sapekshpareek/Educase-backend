import { Schema, model } from 'mongoose';
import { ISubmission } from '../types';

const submissionSchema = new Schema<ISubmission>({
  formId: {
    type: Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  data: {
    type: Map,
    of: Schema.Types.Mixed
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

export default model<ISubmission>('Submission', submissionSchema); 