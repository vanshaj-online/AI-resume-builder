import { Response } from 'express';
import Resume from '../models/resume.model';
import { AuthRequest } from '../middleware/auth.middleware';


export const createResume = async (req: AuthRequest, res: Response) => {
  try {
    const { title, targetRole, selectedTemplate } = req.body;

    if (!title || !targetRole) {
      return res.status(400).json({ success: false, message: 'Title and target role are required' });
    }

    const resume = await Resume.create({
      userId: req.userId,
      title,
      targetRole,
      selectedTemplate: selectedTemplate || 'classic',
    });

    res.status(201).json({ success: true, data: resume });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};


export const getResumes = async (req: AuthRequest, res: Response) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({ updatedAt: -1 });
    
    res.status(200).json({ success: true, data: resumes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};




export const getResumeById = async (req: AuthRequest, res: Response) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found or unauthorized' });
    }

    res.status(200).json({ success: true, data: resume });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Invalid Resume ID or Server Error' });
  }
};


export const updateResume = async (req: AuthRequest, res: Response) => {
  try {
    // findOneAndUpdate ensures we only update if the user owns this specific resume
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true } // Returns the updated document
    );

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found or unauthorized' });
    }

    res.status(200).json({ success: true, data: resume });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};


export const deleteResume = async (req: AuthRequest, res: Response) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found or unauthorized' });
    }

    res.status(200).json({ success: true, message: 'Resume successfully deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Invalid Resume ID or Server Error' });
  }
};