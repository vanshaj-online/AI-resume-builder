import api from './api';
import type { Education, Experience, Project } from '../types';

export const aiService = {
    generateSummary: async (payload: {
        targetRole: string;
        skills: string[];
        projects: Project[];
        education: Education[];
        experience: Experience[];
    }) => {
        const response = await api.post('/ai/generate-summary', payload);
        return response.data;
    },

    improveBullet: async (payload: {
        text: string;
        targetRole: string;
        skills: string[];
    }) => {
        const response = await api.post('/ai/improve-bullet', payload);
        return response.data;
    },
    
    analyzeRoleSkills: async (role: string) => {
        const response = await api.post('/ai/analyze-skills', { role });
        return response.data;
    }

};