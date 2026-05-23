import api from './api';
import type { Resume } from '../types';

export const resumeService = {
    getAll: async () => {
        const response = await api.get('/resumes');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/resumes/${id}`);
        return response.data;
    },

    create: async (data: { title: string; targetRole: string }) => {
        const response = await api.post('/resumes', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Resume>) => {
        const response = await api.put(`/resumes/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/resumes/${id}`);
        return response.data;
    }
};