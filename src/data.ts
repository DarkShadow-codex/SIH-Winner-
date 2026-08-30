import { ClassInfo, StudentRequest, RadarNode, ConceptNode, SyllabusItem, FeedPost, Assessment, TeacherMember, StudentMember, PersonDirectoryUser, GeneratedInviteLink } from './types';

export const initialTeachers: TeacherMember[] = [
  {
    id: 't-1',
    name: 'Prof. Arthur Miller',
    username: 'arthur_miller',
    email: 'a.miller@school.edu',
    role: 'Class Lead',
    subject: 'Physics',
    department: 'Science & STEM',
    sections: ['Section 9-A', 'Section 10-A', 'Lab Cohort 302'],
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    joinedDate: 'Aug 2024'
  },
  {
    id: 't-2',
    name: 'Dr. Marcus Pierce',
    username: 'marcus_p',
    email: 'm.pierce@school.edu',
    role: 'Co-Teacher',
    subject: 'Applied Mechanics',
    department: 'Physics',
    sections: ['Section 9-A', 'Section 9-B'],
    status: 'active',
    initials: 'MP',
    joinedDate: 'Sep 2025'
  },
  {
    id: 't-3',
    name: 'Dr. Rachel Kapoor',
    username: 'r_kapoor',
    email: 'r.kapoor@school.edu',
    role: 'Subject Specialist',
    subject: 'Mathematics & Vectors',
    department: 'Mathematics',
    sections: ['Section 9-A', 'Section 10-A'],
    status: 'in_lab',
    initials: 'RK',
    joinedDate: 'Jan 2026'
  },
  {
    id: 't-4',
    name: 'Claire Sterling',
    username: 'claire_s',
    email: 'c.sterling@school.edu',
    role: 'Lab Assistant',
    subject: 'Physics Lab 302',
    department: 'Physics',
    sections: ['Lab Cohort 302'],
    status: 'in_lab',
    initials: 'CS',
    joinedDate: 'Feb 2026'
  }
];

export const initialStudents: StudentMember[] = [
  {
    id: 's-1',
    name: 'Alex Mercer',
    username: 'alex_m',
    email: 'alex.m@student.edu',
    section: 'Section 9-A',
    rollNumber: 'SEC9A-01',
    status: 'on_task',
    workstationId: 'LAB-PC 01',
    attendance: '98%',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPOjiU14tOgS2jpo3upnRKq1lcpfAl6j_4aw0HQOW0O6h4p9tnqdnlIACxwrSBj3O8JjWW5zVPCO6Ud71Ch-LlpeqXX2UcVeJEr4tkj7zXxymbyRuDzya0r6X2uPiR5ClRmJcloUAiZ80UfyI47RMFSCQU55X309z3gZKNlVDAdZEQCzN0If4hYJGkYyswcFqvvXxTZFOQrXA8D8MBO8fKyGWh3N3l6G80t0TM5kdy2NftnteLtAku',
    joinedDate: 'Aug 2025'
  },
  {
    id: 's-2',
    name: 'Sarah Jenkins',
    username: 'sarah_j',
    email: 's.jenkins@student.edu',
    section: 'Section 9-A',
    rollNumber: 'SEC9A-02',
    status: 'on_task',
    workstationId: 'LAB-PC 02',
    attendance: '100%',
    initials: 'SJ',
    joinedDate: 'Aug 2025'
  },
  {
    id: 's-3',
    name: 'Michael Brown',
    username: 'michael_b',
    email: 'm.brown@student.edu',
    section: 'Section 9-A',
    rollNumber: 'SEC9A-03',
    status: 'on_task',
    workstationId: 'LAB-PC 03',
    attendance: '95%',
    initials: 'MB',
    joinedDate: 'Aug 2025'
  },
  {
    id: 's-4',
    name: 'Johnathan Cole',
    username: 'john_cole',
    email: 'j.cole@student.edu',
    section: 'Section 9-A',
    rollNumber: 'SEC9A-04',
    status: 'on_task',
    workstationId: 'LAB-PC 04',
    attendance: '92%',
    initials: 'JC',
    joinedDate: 'Aug 2025'
  },
  {
    id: 's-5',
    name: 'Elena Rodriguez',
    username: 'elena_r',
    email: 'e.rodriguez@student.edu',
    section: 'Section 9-A',
    rollNumber: 'SEC9A-05',
    status: 'on_task',
    workstationId: 'LAB-PC 05',
    attendance: '97%',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-kQSlCd97Tlg8QSDHhUG7XdHnFSRLr9Rgy--F06lAWqZTzvKM5976QW0YicB2t5mkTGpg_vViRnNGqD7CImDAUgLvcUB2lEyqxNOBvAo8J9RKlH8-DFWA2y5ZFDGU5oY3Cze0nWYZtw8B9TJ7U_VvrM3PAwhJzPPh56y8g28K1KNJIYyWxiCVF_yK3KDpQCSLGhr5fyYyCYDs-q0AArE6izZ4PgyD4AedItmTPuSZ2b0jDzqTrlRq',
    joinedDate: 'Aug 2025'
  },
  {
    id: 's-6',
    name: 'Chloe Vance',
    username: 'chloe_v',
    email: 'c.vance@student.edu',
    section: 'Section 9-A',
    rollNumber: 'SEC9A-06',
    status: 'on_task',
    workstationId: 'LAB-PC 06',
    attendance: '94%',
    initials: 'CV',
    joinedDate: 'Aug 2025'
  },
  {
    id: 's-7',
    name: 'David Kim',
    username: 'david_k',
    email: 'd.kim@student.edu',
    section: 'Section 9-B',
    rollNumber: 'SEC9B-01',
    status: 'on_task',
    workstationId: 'LAB-PC 07',
    attendance: '96%',
    initials: 'DK',
    joinedDate: 'Sep 2025'
  },
  {
    id: 's-8',
    name: 'Liam Davis',
    username: 'liam_d',
    email: 'l.davis@student.edu',
    section: 'Section 9-B',
    rollNumber: 'SEC9B-02',
    status: 'active',
    workstationId: 'LAB-PC 08',
    attendance: '91%',
    initials: 'LD',
    joinedDate: 'Sep 2025'
  },
  {
    id: 's-9',
    name: 'Sophia Taylor',
    username: 'sophia_t',
    email: 's.taylor@student.edu',
    section: 'Section 9-B',
    rollNumber: 'SEC9B-03',
    status: 'idle',
    workstationId: 'LAB-PC 09',
    attendance: '89%',
    initials: 'ST',
    joinedDate: 'Sep 2025'
  },
  {
    id: 's-10',
    name: 'Ethan Wright',
    username: 'ethan_w',
    email: 'e.wright@student.edu',
    section: 'Section 10-A',
    rollNumber: 'SEC10A-01',
    status: 'on_task',
    workstationId: 'LAB-PC 10',
    attendance: '99%',
    initials: 'EW',
    joinedDate: 'Oct 2025'
  },
  {
    id: 's-11',
    name: 'Olivia Martinez',
    username: 'olivia_m',
    email: 'o.martinez@student.edu',
    section: 'Section 10-A',
    rollNumber: 'SEC10A-02',
    status: 'on_task',
    workstationId: 'LAB-PC 11',
    attendance: '95%',
    initials: 'OM',
    joinedDate: 'Oct 2025'
  },
  {
    id: 's-12',
    name: 'Lucas Vance',
    username: 'lucas_v',
    email: 'l.vance@student.edu',
    section: 'Lab Cohort 302',
    rollNumber: 'LAB302-01',
    status: 'on_task',
    workstationId: 'LAB-PC 12',
    attendance: '98%',
    initials: 'LV',
    joinedDate: 'Jan 2026'
  }
];

export const initialDirectoryUsers: PersonDirectoryUser[] = [
  {
    id: 'dir-1',
    name: 'Prof. Helen Zhang',
    username: 'prof_zhang',
    email: 'h.zhang@school.edu',
    defaultRole: 'teacher',
    subject: 'Quantum Physics',
    department: 'Physics',
    suggestedSection: 'Section 10-A',
    initials: 'HZ'
  },
  {
    id: 'dir-2',
    name: 'Dr. Bryan Foster',
    username: 'dr_foster',
    email: 'b.foster@school.edu',
    defaultRole: 'teacher',
    subject: 'Mechanics & Robotics',
    department: 'Engineering',
    suggestedSection: 'Lab Cohort 302',
    initials: 'BF'
  },
  {
    id: 'dir-3',
    name: 'Alyson Lee',
    username: 'alyson_lee',
    email: 'a.lee@school.edu',
    defaultRole: 'teacher',
    subject: 'Calculus & Vectors',
    department: 'Mathematics',
    suggestedSection: 'Section 9-A',
    initials: 'AL'
  },
  {
    id: 'dir-4',
    name: 'Noah Clark',
    username: 'noah_clark',
    email: 'n.clark@student.edu',
    defaultRole: 'student',
    suggestedSection: 'Section 9-A',
    initials: 'NC'
  },
  {
    id: 'dir-5',
    name: 'Emma Watson',
    username: 'emma_w',
    email: 'e.watson@student.edu',
    defaultRole: 'student',
    suggestedSection: 'Section 9-B',
    initials: 'EW'
  },
  {
    id: 'dir-6',
    name: 'Daniel Lee',
    username: 'daniel_lee',
    email: 'd.lee@student.edu',
    defaultRole: 'student',
    suggestedSection: 'Section 10-A',
    initials: 'DL'
  },
  {
    id: 'dir-7',
    name: 'Zoe Patel',
    username: 'zoe_patel',
    email: 'z.patel@student.edu',
    defaultRole: 'student',
    suggestedSection: 'Section 9-A',
    initials: 'ZP'
  },
  {
    id: 'dir-8',
    name: 'Kevin Hart',
    username: 'kevin_h',
    email: 'k.hart@student.edu',
    defaultRole: 'student',
    suggestedSection: 'Section 9-B',
    initials: 'KH'
  },
  {
    id: 'dir-9',
    name: 'Maya Lin',
    username: 'maya_lin',
    email: 'm.lin@student.edu',
    defaultRole: 'student',
    suggestedSection: 'Lab Cohort 302',
    initials: 'ML'
  },
  {
    id: 'dir-10',
    name: 'Samuel Green',
    username: 'samuel_g',
    email: 's.green@student.edu',
    defaultRole: 'student',
    suggestedSection: 'Section 10-A',
    initials: 'SG'
  }
];

export const initialInviteLinks: GeneratedInviteLink[] = [
  {
    id: 'link-sec9a',
    title: 'Student Enrollment Link - Section 9-A',
    targetRole: 'student',
    section: 'Section 9-A',
    code: 'SEC9A-JOIN',
    url: 'https://smartclass.edu/join/sec9a-physics-spring',
    createdAt: 'Aug 2026',
    expiresIn: 'Never (Active)',
    autoApprove: true,
    usesCount: 14,
    maxUses: 40
  },
  {
    id: 'link-teacher',
    title: 'Faculty Co-Teacher Invite Link',
    targetRole: 'teacher',
    teacherRole: 'Co-Teacher',
    subject: 'Physics & STEM Labs',
    code: 'TEACH-STEM9',
    url: 'https://smartclass.edu/join/faculty-invite-phys9',
    createdAt: 'Aug 2026',
    expiresIn: '30 Days',
    autoApprove: false,
    usesCount: 2,
    maxUses: 5
  },
  {
    id: 'link-cohort302',
    title: 'Lab Cohort 302 Student & Assistant Link',
    targetRole: 'student',
    section: 'Lab Cohort 302',
    code: 'LAB302-PASS',
    url: 'https://smartclass.edu/join/lab302-experiments',
    createdAt: 'Aug 2026',
    expiresIn: '14 Days',
    autoApprove: true,
    usesCount: 8,
    maxUses: 25
  }
];

export const initialClasses: ClassInfo[] = [
  {
    id: 'class-9a',
    name: 'Class 9-A',
    code: 'ABC-123',
    shareLink: 'https://smartclass.edu/join/abc-123-xkyz',
    subject: 'Physics',
    cohort: 'Cohort A',
    studentsCount: 32,
    pendingCount: 4,
    description: 'Advanced Physics & Mathematics Core Module.'
  },
  {
    id: 'physics-101',
    name: 'Physics 101',
    code: 'PHY-101',
    shareLink: 'https://smartclass.edu/join/phy-101-zwt',
    subject: 'Physics',
    cohort: 'Cohort B',
    studentsCount: 28,
    pendingCount: 0,
    description: 'Introductory Newtonian Mechanics and Kinematics.'
  }
];

export const initialRequests: StudentRequest[] = [
  {
    id: 'req-1',
    name: 'Alex Mercer',
    email: 'alex.m@student.edu',
    role: 'Student',
    requestTime: '10 mins ago',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPOjiU14tOgS2jpo3upnRKq1lcpfAl6j_4aw0HQOW0O6h4p9tnqdnlIACxwrSBj3O8JjWW5zVPCO6Ud71Ch-LlpeqXX2UcVeJEr4tkj7zXxymbyRuDzya0r6X2uPiR5ClRmJcloUAiZ80UfyI47RMFSCQU55X309z3gZKNlVDAdZEQCzN0If4hYJGkYyswcFqvvXxTZFOQrXA8D8MBO8fKyGWh3N3l6G80t0TM5kdy2NftnteLtAku'
  },
  {
    id: 'req-2',
    name: 'Sarah Jenkins',
    email: 's.jenkins@student.edu',
    role: 'Student',
    requestTime: '1 hour ago',
    initials: 'SJ'
  },
  {
    id: 'req-3',
    name: 'Marcus Pierce',
    email: 'm.pierce@school.edu',
    role: 'Co-Teacher',
    requestTime: '2 hours ago',
    initials: 'MP'
  },
  {
    id: 'req-4',
    name: 'Elena Rodriguez',
    email: 'e.rodriguez@student.edu',
    role: 'Student',
    requestTime: 'Yesterday',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-kQSlCd97Tlg8QSDHhUG7XdHnFSRLr9Rgy--F06lAWqZTzvKM5976QW0YicB2t5mkTGpg_vViRnNGqD7CImDAUgLvcUB2lEyqxNOBvAo8J9RKlH8-DFWA2y5ZFDGU5oY3Cze0nWYZtw8B9TJ7U_VvrM3PAwhJzPPh56y8g28K1KNJIYyWxiCVF_yK3KDpQCSLGhr5fyYyCYDs-q0AArE6izZ4PgyD4AedItmTPuSZ2b0jDzqTrlRq'
  }
];

export const initialRadarNodes: RadarNode[] = [
  {
    id: 'node-1',
    name: 'Sarah Jenkins',
    x: 25,
    y: 25,
    status: 'mastered',
    topic: 'Motion Vectors',
    masteryPercentage: 92
  },
  {
    id: 'node-2',
    name: 'Alex Mercer',
    x: 25,
    y: 66,
    status: 'intervention',
    topic: 'Denominator Force Rules',
    masteryPercentage: 35
  },
  {
    id: 'node-3',
    name: 'Michael B.',
    x: 50,
    y: 50,
    status: 'review',
    topic: 'Newtonian Force Laws',
    masteryPercentage: 62
  },
  {
    id: 'node-4',
    name: 'Johnathan Cole',
    x: 65,
    y: 33,
    status: 'mastered',
    topic: 'Projectile Angles',
    masteryPercentage: 88
  },
  {
    id: 'node-5',
    name: 'Chloe V.',
    x: 75,
    y: 68,
    status: 'mastered',
    topic: 'Frictional Forces',
    masteryPercentage: 95
  },
  {
    id: 'node-6',
    name: 'David K.',
    x: 55,
    y: 75,
    status: 'mastered',
    topic: 'Uniform Tension',
    masteryPercentage: 90
  }
];

export const initialConceptNodes: ConceptNode[] = [
  {
    id: 'concept-1',
    name: 'Position (x)',
    description: 'The location of an object relative to a chosen reference frame, mathematically modeled on a coordinate axis.',
    x: 100,
    y: 120,
    masteryStatus: 'high',
    masteryPercentage: 85,
    outputs: ['concept-2']
  },
  {
    id: 'concept-2',
    name: 'Velocity (v)',
    description: 'The rate of change of position with respect to time. Represented as a vector indicating speed and direction.',
    x: 400,
    y: 270,
    masteryStatus: 'low',
    masteryPercentage: 35,
    inputs: ['concept-1'],
    outputs: ['concept-3']
  },
  {
    id: 'concept-3',
    name: 'Acceleration (a)',
    description: 'The rate of change of velocity with respect to time. Occurs when speed changes, direction changes, or both.',
    x: 700,
    y: 120,
    masteryStatus: 'medium',
    masteryPercentage: 55,
    inputs: ['concept-2']
  }
];

export const initialSyllabusItems: SyllabusItem[] = [
  {
    id: 'syll-root',
    name: 'Physics C: Mechanics',
    type: 'folder',
    children: [
      {
        id: 'syll-1',
        name: '1. Kinematics',
        type: 'folder',
        children: [
          {
            id: 'syll-1-1',
            name: '1.1 Motion in One Dimension',
            type: 'file',
            masteryTrend: 'up'
          },
          {
            id: 'syll-1-2',
            name: '1.2 Motion in Two Dimensions',
            type: 'file',
            masteryTrend: 'stable'
          }
        ]
      },
      {
        id: 'syll-2',
        name: "2. Newton's Laws",
        type: 'folder',
        children: [
          {
            id: 'syll-2-1',
            name: '2.1 Force and Motion Vectors',
            type: 'file',
            masteryTrend: 'down'
          },
          {
            id: 'syll-2-2',
            name: '2.2 Friction and Tension',
            type: 'file',
            masteryTrend: 'stable'
          }
        ]
      }
    ]
  }
];

export const initialFeedPosts: FeedPost[] = [
  {
    id: 'feed-1',
    authorName: 'Sarah M.',
    authorInitials: 'SM',
    authorRole: 'Student',
    timeAgo: '2h ago',
    content: 'Found a great trick for remembering right-hand rule for magnetic fields. Attached my sketch! The thumb points in the direction of the current, and fingers curl in the magnetic field direction.',
    likes: 12,
    hasLiked: false,
    type: 'note',
    replies: 2
  },
  {
    id: 'feed-2',
    authorName: 'James D.',
    authorInitials: 'JD',
    authorRole: 'Student',
    timeAgo: '5h ago',
    content: 'Does anyone understand why the tension is uniform in an ideal string? I keep getting stuck on prob 4.',
    likes: 5,
    hasLiked: false,
    type: 'question',
    replies: 3
  }
];

export const initialAssessments: Assessment[] = [
  {
    id: 'ass-1',
    title: 'Physics Midterm Exam',
    dueDate: 'Oct 14',
    daysRemaining: 2,
    subject: 'Physics'
  },
  {
    id: 'ass-2',
    title: 'Kinematics Lab Report',
    dueDate: 'Oct 18',
    daysRemaining: 6,
    subject: 'Physics'
  }
];
