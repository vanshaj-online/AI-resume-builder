import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
});

export const getSkillsByRole = async (role: string) => {
    const prompt = `
    Act as a professional technical recruiter. 
    List the top 5 or 10 core essential technical skills for a "${role}".
    Return ONLY a comma-separated list of skills. 
    Example: React, TypeScript, Next.js for a Frontend Developer
    Note: strictly keep concepts for later if space available, like ui,ux principles, and try to avoid skills like HTML, CSS, because if a developer knows react, typescript and next js then its obvious he would have known these fundamentals.
  `;

    try {

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        const text = response.text ?? '';

        return text.split(',').map(skill => skill.trim());

    } catch (error) {
        console.error("AI Skills Generation Error:", error);
        throw new Error("AI generation failed. Please try again.");
    }
};

export const generateResumeSummary = async (
    targetRole: string,
    skills: string[],
    projects: any[],
    education: any[],
    experience: any[]
): Promise<string> => {
    const prompt = `
    Generate a professional resume summary for a student or fresher.
    Target Role: ${targetRole}
    Skills: ${skills.join(', ')}
    Projects: ${JSON.stringify(projects)}
    Education: ${JSON.stringify(education)}
    Experience: ${JSON.stringify(experience)}
    
    Rules: 
    1. Keep it between 2 to 4 lines. 
    2. Make it professional and beginner friendly.
    3. Do not add fake experience. 
    4. Do not mention years of experience unless provided. 
    5. Return only the summary, with no formatting or introductory text.
  `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        const text = response.text ?? '';
        // Clean the response (sometimes AI wraps text in quotes or markdown)
        return text.replace(/^['"]|['"]$/g, '').trim();
    } catch (error) {
        console.error("AI Summary Generation Error:", error);
        throw new Error("AI generation failed. Please try again.");
    }
};

export const improveResumeBullet = async (
    text: string,
    targetRole: string,
    skills: string[]
): Promise<string> => {
    const prompt = `
    Improve the following resume bullet point.
    Original Text: ${text}
    Target Role: ${targetRole}
    Skills: ${skills.join(', ')}
    
    Rules: 
    1. Make it professional. 
    2. Keep it one bullet point. 
    3. Do not add fake metrics.
    4. Use action verbs. 
    5. Return only the improved bullet point, with no bullet symbols (* or -) and no introductory text.
  `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        return (response.text ?? '').replace(/^[-*•]\s*/, '').trim();
    } catch (error) {
        console.error("AI Bullet Improvement Error:", error);
        throw new Error("AI generation failed. Please try again.");
    }
};