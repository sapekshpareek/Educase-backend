import { Request, Response, Router } from 'express';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '../middleware/auth';
import Form from '../models/Form';
import { AuthRequest } from '../types';

const router = Router();

// Get a form by shareable link - this needs to come BEFORE /:id
router.get('/shared/:shareableLink', async (req: Request, res: Response): Promise<void> => {
  try {
    const form = await Form.findOne({ shareableLink: req.params.shareableLink });
    
    if (!form) {
      res.status(404).json({ message: 'Form not found' });
      return;
    }

    // Convert Mongoose document to plain object and ensure proper date formatting
    const formObject = {
      ...form.toObject(),
      _id: form._id.toString(),
      creator: form.creator.toString(),
      createdAt: form.createdAt.toISOString()
    };

    res.json(formObject);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
});

// Get all forms
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    console.log('GET /forms - Starting fetch');
    const forms = await Form.find();
    console.log('Database query result:', forms);

    // Convert Mongoose documents to plain objects and ensure proper date formatting
    const formObjects = forms.map(form => {
      const obj = {
        _id: form._id.toString(),
        title: form.title,
        description: form.description,
        fields: form.fields.map(field => ({
          ...field.toObject(),
          _id: field._id.toString()
        })),
        creator: form.creator.toString(),
        shareableLink: form.shareableLink,
        createdAt: form.createdAt.toISOString()
      };
      return obj;
    });

    console.log('Sending response:', formObjects);
    return res.json(formObjects);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Server error' 
    });
  }
});

// Get a specific form by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('GET /forms/:id - Fetching form:', req.params.id);
    const form = await Form.findById(req.params.id);
    
    if (!form) {
      res.status(404).json({ message: 'Form not found' });
      return;
    }

    // Convert Mongoose document to plain object and ensure proper date formatting
    const formObject = {
      ...form.toObject(),
      _id: form._id.toString(),
      creator: form.creator.toString(),
      createdAt: form.createdAt.toISOString()
    };

    console.log('Sending form to client:', formObject);
    res.json(formObject);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
});

// Create a new form
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received form data:', req.body);

    const form = new Form({
      ...req.body,
      creator: new Types.ObjectId('65a0f3f0e567d3e8e0524321'),
      shareableLink: uuidv4(),
      fields: req.body.fields.map((field: any) => ({
        ...field,
        _id: new Types.ObjectId()
      }))
    });

    console.log('Created form object:', form);

    const newForm = await form.save();
    console.log('Saved form:', newForm);
    
    // Convert the Mongoose document to a plain object
    const formObject = {
      ...newForm.toObject(),
      _id: newForm._id.toString(),
      creator: newForm.creator.toString(),
      createdAt: newForm.createdAt.toISOString()
    };
    
    res.status(201).json(formObject);
  } catch (error) {
    console.error('Form creation error:', error);
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Invalid form data',
      error: error
    });
  }
});

// Update a form
router.put('/:id', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      res.status(404).json({ message: 'Form not found' });
      return;
    }

    if (form.creator.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    Object.assign(form, req.body);
    const updatedForm = await form.save();
    res.json(updatedForm);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid form data' });
  }
});

// Delete a form
router.delete('/:id', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      res.status(404).json({ message: 'Form not found' });
      return;
    }

    if (form.creator.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await form.deleteOne();
    res.json({ message: 'Form deleted' });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
});

export default router; 