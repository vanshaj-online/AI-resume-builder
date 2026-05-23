// src/routes/ai.routes.ts

import { Router, Request, Response } from 'express';
import { generateResumeSummary, improveResumeBullet, getSkillsByRole } from '../services/ai.service';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// POST /api/ai/generate-summary
router.post('/generate-summary', protect, async (req: Request, res: Response) => {
  try {
    const { targetRole, skills, projects, education, experience } = req.body;

    if (!targetRole) {
      return res.status(400).json({ success: false, message: "Target role is required" });
    }

    const summary = await generateResumeSummary(
      targetRole,
      skills || [],
      projects || [],
      education || [],
      experience || []
    );

    res.status(200).json({ success: true, data: summary });

  } catch (error: any) {

    res.status(500).json({ success: false, message: error.message || "Internal server error" });

  }

});

//POST /api/ai/analyze-skills
router.post('/analyze-skills', protect, async (req: Request, res: Response) => {

  try {

    const { role } = req.body;

    const standardSkills = await getSkillsByRole(role);

    res.json({ success: true, skills: standardSkills });

  } catch (error) {

    res.status(500).json({ success: false, message: "AI Skill Analysis failed" });

  }

})

// POST /api/ai/improve-bullet
router.post('/improve-bullet', protect, async (req: Request, res: Response) => {
  try {
    const { text, targetRole, skills } = req.body;

    if (!text || !targetRole) {
      return res.status(400).json({ success: false, message: "Text and target role are required" });
    }

    const improvedText = await improveResumeBullet(text, targetRole, skills || []);

    res.status(200).json({ success: true, data: improvedText });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
});

export default router;