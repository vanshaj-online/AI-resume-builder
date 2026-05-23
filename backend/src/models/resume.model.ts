import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  targetRole: string;
  selectedTemplate: string;
  personalInfo: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedIn?: string;
    github?: string;
    portfolio?: string;
  };
  summary?: string;
  education: any[];
  experience: any[];
  projects: any[];
  skills: string[];
  certifications: any[];
  achievements: any[];
  languages: any[];
  resumeScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    targetRole: {
      type: String,
      required: true
    },
    selectedTemplate: {
      type: String,
      default: 'classic'
    },

    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      linkedIn: String,
      github: String,
      portfolio: String
    },

    summary: String,

    education: [{
      degree: String,
      institution: String,
      startYear: String,
      endYear: String,
      score: String,
      location: String
    }],

    experience: [{
      company: String,
      role: String,
      startDate: String,
      endDate: String,
      currentlyWorking: Boolean,
      bulletPoints: [String]
    }],

    projects: [{
      title: String,
      technologies: [String],
      description: String,
      bulletPoints: [String],
      githubLink: String,
      liveLink: String
    }],

    skills: [String],

    certifications: [{
      name: String,
      organization: String,
      issueDate: String,
      link: String
    }],

    achievements: [{
      title: String,
      description: String,
      date: String
    }],

    languages: [{
      name: String,
      proficiency: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Native']
      }
    }],

    resumeScore: Number
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IResume>('Resume', ResumeSchema);