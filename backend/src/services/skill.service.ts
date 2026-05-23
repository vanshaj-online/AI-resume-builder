import { SKILL_ROLES } from '../constants/skillRoles.ts';

export const analyzeSkills = (targetRole: string, userSkills: string[]) => {
    const requiredSkills = SKILL_ROLES[targetRole];

    if (!requiredSkills) {
        throw new Error('Target role not found');
    }

    // Normalize arrays for comparison (lowercase, trim spaces)
    const normalizedUserSkills = userSkills.map(skill => skill.toLowerCase().trim());
    const normalizedRequiredSkills = requiredSkills.map(skill => skill.toLowerCase().trim());

    // Find matches and missing
    const matchedSkills = requiredSkills.filter(skill =>
        normalizedUserSkills.includes(skill.toLowerCase().trim())
    );

    const missingSkills = requiredSkills.filter(skill =>
        !normalizedUserSkills.includes(skill.toLowerCase().trim())
    );

    // Calculate score (matched / required * 100)
    const matchScore = Math.round((matchedSkills.length / requiredSkills.length) * 100);

    // Generate basic learning suggestions
    const learningSuggestions = missingSkills.map(skill => `Focus on learning the fundamentals of ${skill} and build a small project using it.`);

    return {
        targetRole,
        matchedSkills,
        missingSkills,
        matchScore,
        learningSuggestions
    };
};