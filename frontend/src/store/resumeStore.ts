import { create } from 'zustand';
import type { Resume } from '../types';
import { resumeService } from '../services/resume.service';

interface ResumeState {
    resumes: Resume[];
    currentResume: Resume | null;
    isLoading: boolean;
    error: string | null;

    fetchResumes: () => Promise<void>;
    createResume: (data: { title: string; targetRole: string }) => Promise<string>;
    setCurrentResume: (resume: Resume | null) => void;
    updateResume: (id: string, data: Partial<Resume>) => Promise<void>;
    deleteResume: (id: string) => Promise<void>;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
    resumes: [],
    currentResume: null,
    isLoading: false,
    error: null,

    fetchResumes: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await resumeService.getAll();
            set({ resumes: data, isLoading: false });
        } catch {
            set({ error: 'Failed to fetch resumes', isLoading: false });
        }
    },

    updateResume: async (id, data) => {
        try {
            const response = await resumeService.update(id, data);

            const updatedResumes = get().resumes.map((r) =>
                r._id === id ? { ...r, ...response.data } : r
            );

            set({
                resumes: updatedResumes,
                currentResume: { ...get().currentResume, ...response.data } as Resume
            });
        } catch (error) {
            set({ error: 'Failed to sync modifications with database' });
            throw error;
        }
    },

    createResume: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await resumeService.create(data);
            set({ resumes: [response.data, ...get().resumes], isLoading: false });
            return response.data._id;
        } catch {
            set({ error: 'Failed to create resume', isLoading: false });
        }
    },

    setCurrentResume: (resume) => set({ currentResume: resume }),

    deleteResume: async (id) => {
        try {
            await resumeService.delete(id);
            set({ resumes: get().resumes.filter(r => r._id !== id) });
        } catch {
            set({ error: 'Failed to delete resume' });
        }
    }
}));