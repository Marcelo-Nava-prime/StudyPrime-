export type EducationalLevel = 'Secundaria' | 'Bachillerato' | 'Universidad';

export type Subject = 
  | 'Matemáticas'
  | 'Historia'
  | 'Biología'
  | 'Física'
  | 'Química'
  | 'Lengua y Literatura'
  | 'Inglés'
  | 'Informática'
  | 'Filosofía'
  | 'Economía';

export type Region = 
  | 'España'
  | 'México'
  | 'Colombia'
  | 'Argentina'
  | 'Chile'
  | 'Perú'
  | 'Internacional';

export type MaterialType = 
  | 'apunte' 
  | 'resumen' 
  | 'flashcards' 
  | 'presentacion' 
  | 'guia' 
  | 'ejercicio';

export type UserRole = 'Estudiante' | 'Knower' | 'Moderador' | 'Admin';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
  difficulty?: 'fácil' | 'medio' | 'difícil';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  level: EducationalLevel;
  subject: Subject;
  topic: string;
  region: Region;
  type: MaterialType;
  likesCount: number;
  commentsCount: number;
  rating: number; // 1-5
  views: number;
  createdAt: string;
  fileUrl?: string;
  contentText: string;
  tags: string[];
  flashcardSet?: Flashcard[];
  quizSet?: QuizQuestion[];
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Comment {
  id: string;
  materialId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  text: string;
  date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  bio: string;
  level: EducationalLevel;
  mainSubjects: Subject[];
  followersCount: number;
  followingCount: number;
  points: number;
  badges: Badge[];
  itemsPublished: number;
  streakDays: number;
  plan: 'free' | 'premium';
  dailyQueriesLeft: number;
  isFollowing?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'creador' | 'estudio' | 'social' | 'ia';
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: Subject;
  level: EducationalLevel;
  membersCount: number;
  isPrivate: boolean;
  createdBy: string;
  groupAvatar: string;
  tags: string[];
  members: { name: string; avatar: string; role: string }[];
  recentMessages: GroupMessage[];
  isJoined?: boolean;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  fileAttachment?: {
    name: string;
    url?: string;
    type: string;
  };
}

export interface NotificationItem {
  id: string;
  type: 'follower' | 'like' | 'comment' | 'ai_reply' | 'badge';
  title: string;
  message: string;
  read: boolean;
  date: string;
  link?: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
  codeOrMath?: string;
  stepByStep?: string[];
}

export type Language = 'es' | 'en';
