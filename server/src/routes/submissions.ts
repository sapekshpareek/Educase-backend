import { Request, Response, Router } from 'express';
import Form from '../models/Form';
import Submission from '../models/Submission';

const router = Router();

// Create a new submission
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { formId, data } = req.body;

    // Validate form exists
    const form = await Form.findOne({ shareableLink: formId });
    if (!form) {
      res.status(404).json({ message: 'Form not found' });
      return;
    }

    // Create submission
    const submission = new Submission({
      form: form._id,
      data: data,
      submittedAt: new Date()
    });

    const newSubmission = await submission.save();

    // Convert the Mongoose document to a plain object
    const submissionObject = {
      ...newSubmission.toObject(),
      _id: newSubmission._id.toString(),
      form: newSubmission.form.toString(),
      submittedAt: newSubmission.submittedAt.toISOString()
    };

    res.status(201).json(submissionObject);
  } catch (error) {
    console.error('Submission creation error:', error);
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Invalid submission data',
      error: error
    });
  }
});

// Get submissions for a form
router.get('/form/:formId', async (req: Request, res: Response): Promise<void> => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) {
      res.status(404).json({ message: 'Form not found' });
      return;
    }

    const submissions = await Submission.find({ form: form._id });

    // Convert Mongoose documents to plain objects
    const submissionObjects = submissions.map(submission => ({
      ...submission.toObject(),
      _id: submission._id.toString(),
      form: submission.form.toString(),
      submittedAt: submission.submittedAt.toISOString()
    }));

    res.json(submissionObjects);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Server error' 
    });
  }
});

export default router; 