export type AchievementType =
  | 'INTERNSHIP'
  | 'COURSE'
  | 'HACKATHON'
  | 'PROJECT'
  | 'CERTIFICATION'
  | 'COMPETITION'
  | 'WORKSHOP'
  | 'VOLUNTEER';

export type SkillCategory =
  | 'PROGRAMMING'
  | 'FRAMEWORK'
  | 'DATABASE'
  | 'TOOLS'
  | 'SOFT_SKILL'
  | 'LANGUAGE'
  | 'DESIGN'
  | 'OTHER';

export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImage?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  userId: string;
  type: AchievementType;
  title: string;
  description: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  duration?: string;
  certificateUrl?: string;
  verificationUrl?: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  skills: string[];
  highlights: string[];
  grade?: string;
  position?: string;
  projectUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  userId: string;
  name: string;
  category: SkillCategory;
  proficiency: SkillLevel;
  yearsOfExp?: number;
  isEndorsed: boolean;
  endorsedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  summary?: string;
  objective?: string;
  experience?: {
    positions: Array<{
      title: string;
      company: string;
      location?: string;
      startDate: string;
      endDate?: string;
      duration?: string;
      responsibilities: string[];
      skills: string[];
      verified: boolean;
    }>;
  };
  education?: {
    degrees: Array<{
      degree: string;
      institution: string;
      startDate: string;
      endDate?: string;
      grade?: string;
      skills: string[];
      certificateUrl?: string;
      verified: boolean;
    }>;
  };
  templateStyle: string;
  isPublic: boolean;
  lastGeneratedAt: string;
  createdAt: string;
  updatedAt: string;
  user?: User & {
    achievements: Achievement[];
    skills: Skill[];
  };
}

export interface CompleteProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImage?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  resume?: Resume;
  achievements: Achievement[];
  skills: Skill[];
}

