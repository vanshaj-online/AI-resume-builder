import mongoose from 'mongoose';

const skillCacheSchema = new mongoose.Schema({
  role: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  skills: [{ 
    type: String, 
    trim: true 
  }],
  updatedAt: { 
    type: Date, 
    default: Date.now, 
    expires: 604800 // 7 days in seconds
  }
});

export const SkillCache = mongoose.model('SkillCache', skillCacheSchema);