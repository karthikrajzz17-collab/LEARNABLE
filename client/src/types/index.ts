export type Role = 'administrator' | 'child';

export type AccessibilityProfile = 'dyslexia' | 'adhd' | 'autism' | 'slow_learning' | 'default';

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  textToSpeech: boolean;
  audioInstructions: boolean;
  reducedAnimation: boolean;
  calmMode: boolean;
  fontFamily: 'sans' | 'lexend';
  readingRuler: boolean;
  largeButtons: boolean;
}

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
  createdAt?: string;
}

export interface Child {
  id: string;
  userId: string;
  displayName: string;
  ageGroup: string;
  learningLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  accessibilityProfile: AccessibilityProfile;
  accessibilitySettings: AccessibilitySettings;
  xp: number;
  level: number;
  streak: number;
  avatar: string;
  preferredLearningFormat?: string;
  favoriteSubjects?: string[];
}

export interface LessonSlide {
  title: string;
  text: string;
  tip?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  order: number;
  icon: string;
  color?: string;
  estimatedMinutes: number;
  status?: string;
  summary?: string;
  slides: LessonSlide[];
  completionPercentage?: number;
  isUnlocked?: boolean;
  activityCount?: number;
}

export type ActivityType = 
  | 'multiple_choice' 
  | 'match_pairs' 
  | 'drag_drop' 
  | 'image_id' 
  | 'story_choice' 
  | 'memory_game' 
  | 'puzzle';

export interface ActivityOption {
  id: string;
  text?: string;
  label?: string;
  emoji?: string;
  isCorrect?: boolean;
  audio?: string;
  description?: string;
}

export interface ActivityPair {
  id: string;
  left: string;
  right: string;
  matchId: string;
}

export interface ActivityCategory {
  id: string;
  title: string;
}

export interface ActivityItem {
  id: string;
  text: string;
  targetCategory: string;
}

export interface ActivityCard {
  id: string;
  pairKey: string;
  display: string;
}

export interface Activity {
  id: string;
  lessonId: string;
  type: ActivityType;
  title: string;
  question: string;
  promptAudio?: string;
  options?: ActivityOption[];
  pairs?: ActivityPair[];
  categories?: ActivityCategory[];
  items?: ActivityItem[];
  cards?: ActivityCard[];
  story?: string;
  correctAnswer?: string;
  hint: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
}

export interface Progress {
  id: string;
  childId: string;
  lessonId: string;
  completionPercentage: number;
  accuracy: number;
  timeSpent: number;
  lastAccessed: string | null;
  status: 'locked' | 'in_progress' | 'completed';
  lessonTitle?: string;
  lessonSubject?: string;
  lessonIcon?: string;
  lessonDifficulty?: string;
}

export interface Achievement {
  id: string;
  childId: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  earnedAt: string | null;
  xpReward: number;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  assignedChildren: number;
  status: string;
}
