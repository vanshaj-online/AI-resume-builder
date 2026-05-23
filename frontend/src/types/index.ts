export interface User {
  _id: string;
  name: string;
  email: string;
}

export type UserCredentials = {
  name: string;
  email: string;
  password: string;
};

export interface AuthResponse {
  success: boolean;
  data: User & { token: string };
  message?: string;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade?: string;
  description?: string;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location?: string;
  responsibilities?: string[];
  currentlyWorking?: boolean;
  bulletPoints?: string[]; 
}

export interface Project {
  title: string;
  description: string;
  link?: string;
  technologies?: string[];
  bulletPoints?: string[];
}

export interface Certification {
  name: string;
  issuer?: string;
  date?: string;
  credentialId?: string;
  url?: string;
}

export interface Achievement {
  title: string;
  date?: string;
  description?: string;
}

export interface Language {
  name: string;
  proficiency?: string;
}

export interface Resume {
  _id?: string;
  userId?: string;
  title: string;
  targetRole: string;
  selectedTemplate: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    github: string;
    portfolio: string;
  };
  summary: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: string[];
  certifications: Certification[];
  achievements: Achievement[];
  languages: Language[];
  resumeScore?: number;
  createdAt?: string;
  updatedAt?: string;
}