export type Role = 'teacher' | 'subject_teacher' | 'student';

export interface UserProfile {
  name: string;
  email: string;
  phoneNumber?: string;
  username: string;
  role: Role;
  schoolName: string;
  // Role specific fields
  subject?: string;       // for teachers
  department?: string;    // for teachers
  className?: string;     // for students
  stream?: string;        // for students
  rollNumber?: string;    // for students
  avatarUrl?: string;
  initials?: string;
  isFirstTime?: boolean;
}

export interface TeacherMember {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'Class Lead' | 'Co-Teacher' | 'Subject Specialist' | 'Lab Assistant';
  subject: string;
  department: string;
  sections: string[];
  status: 'active' | 'in_lab' | 'offline';
  avatarUrl?: string;
  initials?: string;
  joinedDate: string;
}

export interface StudentMember {
  id: string;
  name: string;
  username: string;
  email: string;
  section: string; // e.g. "Section 9-A", "Section 9-B", "Section 10-A", "Lab Cohort 302"
  rollNumber: string;
  status: 'on_task' | 'active' | 'idle' | 'offline';
  workstationId?: string;
  attendance: string;
  avatarUrl?: string;
  initials?: string;
  joinedDate: string;
}

export interface PersonDirectoryUser {
  id: string;
  name: string;
  username: string;
  email: string;
  defaultRole: 'teacher' | 'student';
  subject?: string;
  department?: string;
  suggestedSection?: string;
  avatarUrl?: string;
  initials?: string;
}

export interface GeneratedInviteLink {
  id: string;
  title: string;
  targetRole: 'student' | 'teacher';
  section?: string;
  subject?: string;
  teacherRole?: 'Co-Teacher' | 'Subject Specialist' | 'Lab Assistant';
  code: string;
  url: string;
  createdAt: string;
  expiresIn: string;
  autoApprove: boolean;
  usesCount: number;
  maxUses?: number;
}

export interface ClassInfo {
  id: string;
  name: string;
  code: string;
  shareLink: string;
  subject: string;
  cohort: string;
  studentsCount: number;
  pendingCount: number;
  description: string;
}

export interface StudentRequest {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Co-Teacher';
  requestTime: string;
  avatarUrl?: string;
  initials?: string;
}

export interface RadarNode {
  id: string;
  name: string;
  x: number; // percentage coordinate on canvas (e.g., 25 for 25%)
  y: number; // percentage coordinate
  status: 'mastered' | 'review' | 'intervention';
  topic: string;
  masteryPercentage: number;
}

export interface ConceptNode {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  masteryStatus: 'low' | 'medium' | 'high';
  masteryPercentage: number;
  inputs?: string[];
  outputs?: string[];
}

export interface SyllabusItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: SyllabusItem[];
  masteryTrend?: 'up' | 'down' | 'stable';
}

export interface FeedPost {
  id: string;
  authorName: string;
  authorInitials: string;
  authorRole: string;
  timeAgo: string;
  content: string;
  likes: number;
  hasLiked?: boolean;
  type: 'note' | 'question';
  replies?: number;
}

export interface Assessment {
  id: string;
  title: string;
  dueDate: string;
  daysRemaining: number;
  subject: string;
}
