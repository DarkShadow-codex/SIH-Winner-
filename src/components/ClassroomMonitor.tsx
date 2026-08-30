import React, { useState, useEffect } from 'react';
import { Role } from '../types';

export interface StudentScreen {
  id: string;
  pcName: string;
  studentName: string;
  studentEmail: string;
  avatarUrl?: string;
  initials?: string;
  status: 'on_task' | 'off_task' | 'hand_raised' | 'locked';
  currentApp: string;
  activeTabTitle: string;
  category: 'Physics Simulator' | 'Smart Classroom Quiz' | 'Python IDE' | 'YouTube / Gaming' | 'Discord Chat' | 'Locked Screen';
  timeOnTab: string;
  keystrokesPerMin: number;
  openTabs: string[];
  lastScreenshotTime: string;
  alertMessage?: string;
}

interface ClassroomMonitorProps {
  userRole?: Role;
  userEmail?: string;
}

export default function ClassroomMonitor({ userRole = 'teacher', userEmail }: ClassroomMonitorProps) {
  const [sessionMode, setSessionMode] = useState<'lab' | 'online'>('lab');
  const [filter, setFilter] = useState<'all' | 'on_task' | 'off_task' | 'hand_raised' | 'locked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [globalLock, setGlobalLock] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [webRestricted, setWebRestricted] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentScreen | null>(null);
  const [nudgeMessage, setNudgeMessage] = useState('');
  const [sentNudgeToast, setSentNudgeToast] = useState<string | null>(null);

  // Screen Share, QR Scanner, Pair Code, Link Generator & Timer States
  const [pairCodeInput, setPairCodeInput] = useState('');
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [generatedShareLink, setGeneratedShareLink] = useState<string | null>(null);
  const [activeScreenShare, setActiveScreenShare] = useState<{
    studentName: string;
    pcName: string;
    code: string;
  } | null>(null);

  // Assessment Upload & Push to Workstations State
  const [isUploadAssessmentModalOpen, setIsUploadAssessmentModalOpen] = useState(false);
  const [assessmentTitle, setAssessmentTitle] = useState('Physics 101: Kinematics & Projectile Vectors Midterm Exam');
  const [assessmentSubject, setAssessmentSubject] = useState('Physics 101');
  const [assessmentDurationMinutes, setAssessmentDurationMinutes] = useState(15);
  const [assessmentTarget, setAssessmentTarget] = useState<'all' | 'off_task' | 'selected'>('all');
  const [lockWorkstationsToAssessment, setLockWorkstationsToAssessment] = useState(true);
  const [uploadedAssessmentFile, setUploadedAssessmentFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>({
    name: 'Kinematics_Midterm_Assessment_Paper_2026.pdf',
    size: '1.8 MB',
    type: 'application/pdf'
  });
  const [assessmentQuestions, setAssessmentQuestions] = useState([
    {
      id: 1,
      q: 'A projectile is launched from ground level with speed 20 m/s at an elevation angle of 30°. What is its vertical velocity component (Vy)?',
      a: '10 m/s',
      b: '17.32 m/s',
      c: '20 m/s',
      d: '5 m/s',
      correct: 'a'
    },
    {
      id: 2,
      q: 'Which launch angle produces the maximum horizontal range for projectile motion over level ground?',
      a: '30°',
      b: '45°',
      c: '60°',
      d: '90°',
      correct: 'b'
    },
    {
      id: 3,
      q: 'What is the acceleration along the horizontal axis (Ax) for a projectile in vacuum neglecting air resistance?',
      a: '9.8 m/s²',
      b: '-9.8 m/s²',
      c: '0 m/s²',
      d: '4.9 m/s²',
      correct: 'c'
    },
    {
      id: 4,
      q: 'If the initial velocity of a projectile is doubled while keeping the angle constant, the maximum range becomes:',
      a: 'Double',
      b: 'Three times',
      c: 'Four times',
      d: 'Remains unchanged',
      correct: 'c'
    }
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [activePushedAssessment, setActivePushedAssessment] = useState<{
    title: string;
    subject: string;
    questionsCount: number;
    durationMinutes: number;
    startTime: string;
    completedCount: number;
    totalAssigned: number;
    avgScore: number;
  } | null>(null);

  // Timer state for teacher screen share session
  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState<number>(5);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Countdown timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timerActive && timerSecondsRemaining !== null && timerSecondsRemaining > 0) {
      interval = setInterval(() => {
        setTimerSecondsRemaining((prev) => {
          if (prev === null || prev <= 1) {
            setTimerActive(false);
            setBroadcasting(false);
            setActiveScreenShare(null);
            setSentNudgeToast('Screen share duration timer expired.');
            setTimeout(() => setSentNudgeToast(null), 3500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSecondsRemaining]);

  // Initial Mock Student Workstation Screens
  const [students, setStudents] = useState<StudentScreen[]>([
    {
      id: 'pc-1',
      pcName: 'LAB-PC 01',
      studentName: 'Alex Mercer',
      studentEmail: 'alex.m@student.edu',
      initials: 'AM',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPOjiU14tOgS2jpo3upnRKq1lcpfAl6j_4aw0HQOW0O6h4p9tnqdnlIACxwrSBj3O8JjWW5zVPCO6Ud71Ch-LlpeqXX2UcVeJEr4tkj7zXxymbyRuDzya0r6X2uPiR5ClRmJcloUAiZ80UfyI47RMFSCQU55X309z3gZKNlVDAdZEQCzN0If4hYJGkYyswcFqvvXxTZFOQrXA8D8MBO8fKyGWh3N3l6G80t0TM5kdy2NftnteLtAku',
      status: 'off_task',
      currentApp: 'Google Chrome',
      activeTabTitle: 'YouTube - Top 10 Gaming Clips 2026',
      category: 'YouTube / Gaming',
      timeOnTab: '4m 12s',
      keystrokesPerMin: 12,
      openTabs: ['Smart Classroom - Kinematics', 'YouTube - Gaming Clips', 'Discord Web'],
      lastScreenshotTime: 'Just now',
      alertMessage: 'Off-task video streaming detected on Lab PC 01'
    },
    {
      id: 'pc-2',
      pcName: 'LAB-PC 02',
      studentName: 'Sarah Jenkins',
      studentEmail: 's.jenkins@student.edu',
      initials: 'SJ',
      status: 'hand_raised',
      currentApp: 'Smart Classroom App',
      activeTabTitle: 'Kinematics Lab Module - Q4 Force Vectors',
      category: 'Smart Classroom Quiz',
      timeOnTab: '12m 45s',
      keystrokesPerMin: 58,
      openTabs: ['Smart Classroom - Kinematics', 'Physics Textbook Ch.3 PDF'],
      lastScreenshotTime: '1m ago',
      alertMessage: 'Raised hand: "Need clarification on vector sum calculation"'
    },
    {
      id: 'pc-3',
      pcName: 'LAB-PC 03',
      studentName: 'Michael Brown',
      studentEmail: 'm.brown@student.edu',
      initials: 'MB',
      status: 'on_task',
      currentApp: 'VS Code - Python',
      activeTabTitle: 'physics_simulation.py - Line 42',
      category: 'Python IDE',
      timeOnTab: '18m 02s',
      keystrokesPerMin: 84,
      openTabs: ['VS Code', 'Smart Classroom - Assessment', 'Python Docs - Math'],
      lastScreenshotTime: '2m ago'
    },
    {
      id: 'pc-4',
      pcName: 'LAB-PC 04',
      studentName: 'Johnathan Cole',
      studentEmail: 'j.cole@student.edu',
      initials: 'JC',
      status: 'on_task',
      currentApp: 'Interactive Simulator',
      activeTabTitle: 'Projectile Angle Calculator & Trajectory Sandbox',
      category: 'Physics Simulator',
      timeOnTab: '8m 30s',
      keystrokesPerMin: 42,
      openTabs: ['Smart Classroom - Concept Graphs', 'PhET Physics Simulator'],
      lastScreenshotTime: '3m ago'
    },
    {
      id: 'pc-5',
      pcName: 'LAB-PC 05',
      studentName: 'Elena Rodriguez',
      studentEmail: 'e.rodriguez@student.edu',
      initials: 'ER',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-kQSlCd97Tlg8QSDHhUG7XdHnFSRLr9Rgy--F06lAWqZTzvKM5976QW0YicB2t5mkTGpg_vViRnNGqD7CImDAUgLvcUB2lEyqxNOBvAo8J9RKlH8-DFWA2y5ZFDGU5oY3Cze0nWYZtw8B9TJ7U_VvrM3PAwhJzPPh56y8g28K1KNJIYyWxiCVF_yK3KDpQCSLGhr5fyYyCYDs-q0AArE6izZ4PgyD4AedItmTPuSZ2b0jDzqTrlRq',
      status: 'on_task',
      currentApp: 'Smart Classroom App',
      activeTabTitle: 'Midterm Assessment - Question 8/10',
      category: 'Smart Classroom Quiz',
      timeOnTab: '22m 10s',
      keystrokesPerMin: 62,
      openTabs: ['Smart Classroom - Assessment'],
      lastScreenshotTime: 'Just now'
    },
    {
      id: 'pc-6',
      pcName: 'LAB-PC 06',
      studentName: 'David Kim',
      studentEmail: 'd.kim@student.edu',
      initials: 'DK',
      status: 'off_task',
      currentApp: 'Discord Desktop',
      activeTabTitle: '#general-chat - Gaming Lounge',
      category: 'Discord Chat',
      timeOnTab: '7m 15s',
      keystrokesPerMin: 95,
      openTabs: ['Discord', 'Smart Classroom - Dashboard'],
      lastScreenshotTime: '1m ago',
      alertMessage: 'Unauthorized chat application active'
    },
    {
      id: 'pc-7',
      pcName: 'LAB-PC 07',
      studentName: 'Chloe Vance',
      studentEmail: 'c.vance@student.edu',
      initials: 'CV',
      status: 'on_task',
      currentApp: 'VS Code - Python',
      activeTabTitle: 'newton_laws.py - Output Console',
      category: 'Python IDE',
      timeOnTab: '15m 40s',
      keystrokesPerMin: 78,
      openTabs: ['VS Code', 'Smart Classroom - Knowledge Hub'],
      lastScreenshotTime: '4m ago'
    },
    {
      id: 'pc-8',
      pcName: 'LAB-PC 08',
      studentName: 'Ryan Howard',
      studentEmail: 'r.howard@student.edu',
      initials: 'RH',
      status: 'locked',
      currentApp: 'Smart Classroom Lockscreen',
      activeTabTitle: 'Workstation Locked by Teacher - Eyes on Board',
      category: 'Locked Screen',
      timeOnTab: '5m 00s',
      keystrokesPerMin: 0,
      openTabs: ['Locked Screen'],
      lastScreenshotTime: 'Just now'
    },
    {
      id: 'pc-9',
      pcName: 'LAB-PC 09',
      studentName: 'Emma Watson',
      studentEmail: 'e.watson@student.edu',
      initials: 'EW',
      status: 'on_task',
      currentApp: 'Smart Classroom App',
      activeTabTitle: 'Concept Graph - Motion Vectors & Forces',
      category: 'Smart Classroom Quiz',
      timeOnTab: '11m 20s',
      keystrokesPerMin: 50,
      openTabs: ['Smart Classroom - Concept Graphs'],
      lastScreenshotTime: '2m ago'
    },
    {
      id: 'pc-10',
      pcName: 'LAB-PC 10',
      studentName: 'Lucas Vance',
      studentEmail: 'l.vance@student.edu',
      initials: 'LV',
      status: 'on_task',
      currentApp: 'Interactive Simulator',
      activeTabTitle: 'Friction Coefficient Live Sandbox',
      category: 'Physics Simulator',
      timeOnTab: '14m 05s',
      keystrokesPerMin: 45,
      openTabs: ['Smart Classroom', 'PhET Simulator'],
      lastScreenshotTime: '3m ago'
    },
    {
      id: 'pc-11',
      pcName: 'LAB-PC 11',
      studentName: 'Sophia Patel',
      studentEmail: 's.patel@student.edu',
      initials: 'SP',
      status: 'on_task',
      currentApp: 'VS Code - Python',
      activeTabTitle: 'vector_addition.py',
      category: 'Python IDE',
      timeOnTab: '9m 50s',
      keystrokesPerMin: 68,
      openTabs: ['VS Code'],
      lastScreenshotTime: '1m ago'
    },
    {
      id: 'pc-12',
      pcName: 'LAB-PC 12',
      studentName: 'Oliver Smith',
      studentEmail: 'o.smith@student.edu',
      initials: 'OS',
      status: 'on_task',
      currentApp: 'Smart Classroom App',
      activeTabTitle: 'Teach Next - AI Diagnostic Exercise',
      category: 'Smart Classroom Quiz',
      timeOnTab: '16m 30s',
      keystrokesPerMin: 52,
      openTabs: ['Smart Classroom - Teach Next'],
      lastScreenshotTime: 'Just now'
    }
  ]);

  // Activity log timeline
  const [activityLogs, setActivityLogs] = useState([
    { id: '1', time: '02:01 PM', student: 'Alex Mercer (PC 01)', type: 'alert', text: 'Opened YouTube (Gaming Clips) - Off-task warning triggered' },
    { id: '2', time: '01:58 PM', student: 'Sarah Jenkins (PC 02)', type: 'hand', text: 'Raised hand: "Need help with Question 4 vector breakdown"' },
    { id: '3', time: '01:55 PM', student: 'David Kim (PC 06)', type: 'alert', text: 'Discord app brought to foreground' },
    { id: '4', time: '01:50 PM', student: 'Teacher Action', type: 'system', text: 'Locked LAB-PC 08 (Ryan Howard) due to inactivity' },
    { id: '5', time: '01:45 PM', student: 'Elena Rodriguez (PC 05)', type: 'success', text: 'Completed Assessment Q7 with 100% accuracy' }
  ]);

  // Handler functions
  const handleToggleGlobalLock = () => {
    const nextState = !globalLock;
    setGlobalLock(nextState);
    setStudents(prev =>
      prev.map(s => ({
        ...s,
        status: nextState ? 'locked' : (s.category === 'YouTube / Gaming' || s.category === 'Discord Chat' ? 'off_task' : 'on_task'),
        currentApp: nextState ? 'Smart Classroom Lockscreen' : s.currentApp,
        activeTabTitle: nextState ? 'Locked by Teacher - Eyes on Presentation' : s.activeTabTitle
      }))
    );
    addLog('Teacher Action', 'system', nextState ? 'Locked all 12 student screens in Lab 302' : 'Unlocked all student workstation screens');
  };

  const handleToggleBroadcast = () => {
    setBroadcasting(!broadcasting);
    addLog('Teacher Action', 'system', !broadcasting ? 'Started live teacher screen broadcast to all student PCs' : 'Ended teacher screen broadcast');
  };

  const handleToggleWebRestrict = () => {
    setWebRestricted(!webRestricted);
    addLog('Teacher Action', 'system', !webRestricted ? 'Enforced web domain restriction (Smart Classroom & PhET only)' : 'Disabled domain restriction');
  };

  const formatTimerDisplay = (seconds: number | null) => {
    if (seconds === null) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConnectPairCode = (codeToConnect?: string) => {
    const code = (codeToConnect || pairCodeInput || 'PAIR-8492').trim().toUpperCase();
    const studentMatch = students.find(s => s.id === 'pc-1') || students[0];

    setActiveScreenShare({
      studentName: studentMatch.studentName,
      pcName: studentMatch.pcName,
      code: code
    });
    setBroadcasting(true);
    setTimerSecondsRemaining(selectedDurationMinutes * 60);
    setTimerActive(true);
    setPairCodeInput('');
    setIsScanningQR(false);

    addLog('Teacher Action', 'success', `Connected screen share with ${studentMatch.studentName} (${code}) for ${selectedDurationMinutes} minutes`);
    setSentNudgeToast(`Screen share connected to ${studentMatch.studentName}! Timer: ${selectedDurationMinutes} min`);
    setTimeout(() => setSentNudgeToast(null), 3500);
  };

  const handleGenerateShareLink = () => {
    const link = `https://smartclassroom.edu/share?session=LIVE-${Math.floor(1000 + Math.random() * 9000)}&code=PAIR-8492`;
    setGeneratedShareLink(link);
    navigator.clipboard?.writeText(link);
    setSentNudgeToast('Start Share Link generated & copied to clipboard!');
    setTimeout(() => setSentNudgeToast(null), 3500);
  };

  const handleEndScreenShare = () => {
    setActiveScreenShare(null);
    setBroadcasting(false);
    setTimerActive(false);
    setTimerSecondsRemaining(null);

    addLog('Teacher Action', 'system', 'Ended screen share session in 1 click');
    setSentNudgeToast('Screen share session ended.');
    setTimeout(() => setSentNudgeToast(null), 3000);
  };

  const handleLockSingleStudent = (id: string) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === id) {
          const isCurrentlyLocked = s.status === 'locked';
          return {
            ...s,
            status: isCurrentlyLocked ? 'on_task' : 'locked',
            currentApp: isCurrentlyLocked ? 'Smart Classroom App' : 'Smart Classroom Lockscreen',
            activeTabTitle: isCurrentlyLocked ? 'Kinematics Module' : 'Workstation Locked by Teacher'
          };
        }
        return s;
      })
    );
    const st = students.find(s => s.id === id);
    if (st) {
      addLog('Teacher Action', 'system', `Toggled lock state for ${st.studentName} (${st.pcName})`);
    }
  };

  const handleCloseOffTaskTab = (id: string) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            status: 'on_task',
            currentApp: 'Smart Classroom App',
            activeTabTitle: 'Kinematics Lab Module',
            category: 'Smart Classroom Quiz',
            openTabs: s.openTabs.filter(t => !t.toLowerCase().includes('youtube') && !t.toLowerCase().includes('discord')),
            alertMessage: undefined
          };
        }
        return s;
      })
    );
    const st = students.find(s => s.id === id);
    if (st) {
      addLog('Teacher Action', 'success', `Remotely closed unauthorized tab for ${st.studentName} (${st.pcName})`);
      if (selectedStudent?.id === id) {
        setSelectedStudent(prev => prev ? {
          ...prev,
          status: 'on_task',
          currentApp: 'Smart Classroom App',
          activeTabTitle: 'Kinematics Lab Module',
          category: 'Smart Classroom Quiz',
          openTabs: prev.openTabs.filter(t => !t.toLowerCase().includes('youtube') && !t.toLowerCase().includes('discord')),
          alertMessage: undefined
        } : null);
      }
    }
  };

  const handleSendNudge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nudgeMessage.trim()) return;
    const msg = nudgeMessage.trim();
    setNudgeMessage('');
    if (selectedStudent) {
      addLog('Teacher Message', 'system', `Sent nudge to ${selectedStudent.studentName}: "${msg}"`);
      setSentNudgeToast(`Message sent to ${selectedStudent.studentName}!`);
      setTimeout(() => setSentNudgeToast(null), 3000);
    } else {
      addLog('Teacher Broadcast', 'system', `Broadcast nudge to class: "${msg}"`);
      setSentNudgeToast(`Class broadcast sent!`);
      setTimeout(() => setSentNudgeToast(null), 3000);
    }
  };

  // Push & Upload Assessment to Student Workstations
  const handlePushAssessmentToClass = () => {
    if (!assessmentTitle.trim()) {
      setSentNudgeToast('Please provide an assessment title.');
      setTimeout(() => setSentNudgeToast(null), 2500);
      return;
    }

    const assignedCount = assessmentTarget === 'off_task'
      ? students.filter(s => s.status === 'off_task').length || 1
      : students.length;

    setActivePushedAssessment({
      title: assessmentTitle,
      subject: assessmentSubject,
      questionsCount: assessmentQuestions.length,
      durationMinutes: assessmentDurationMinutes,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completedCount: 0,
      totalAssigned: assignedCount,
      avgScore: 0
    });

    // Update students workstations to be focused on the assessment
    setStudents(prev =>
      prev.map(s => {
        if (assessmentTarget === 'off_task' && s.status !== 'off_task') return s;
        return {
          ...s,
          status: 'on_task',
          currentApp: 'Smart Assessment Engine',
          activeTabTitle: `${assessmentTitle} — Question 1/${assessmentQuestions.length}`,
          category: 'Smart Classroom Quiz',
          timeOnTab: '0m 05s',
          keystrokesPerMin: 54,
          openTabs: [`Assessment: ${assessmentTitle}`, 'Formula Reference Sheet'],
          alertMessage: undefined
        };
      })
    );

    addLog(
      'Assessment Uploaded',
      'success',
      `Teacher uploaded & pushed assessment "${assessmentTitle}" (${assessmentQuestions.length} questions, ${assessmentDurationMinutes}m) to ${assignedCount} workstations.`
    );
    setSentNudgeToast(`Assessment "${assessmentTitle}" successfully uploaded & pushed to ${assignedCount} workstations!`);
    setTimeout(() => setSentNudgeToast(null), 4000);
    setIsUploadAssessmentModalOpen(false);
  };

  const handleEndPushedAssessment = () => {
    setActivePushedAssessment(null);
    addLog('Teacher Action', 'system', `Concluded live assessment session and collected all student response sheets.`);
    setSentNudgeToast('Assessment session concluded. All student submissions collected!');
    setTimeout(() => setSentNudgeToast(null), 3500);
  };

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;
    const newQ = {
      id: assessmentQuestions.length + 1,
      q: newQuestionText.trim(),
      a: 'Option A',
      b: 'Option B',
      c: 'Option C',
      d: 'Option D',
      correct: 'a'
    };
    setAssessmentQuestions(prev => [...prev, newQ]);
    setNewQuestionText('');
  };

  const addLog = (student: string, type: string, text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityLogs(prev => [{ id: String(Date.now()), time, student, type, text }, ...prev]);
  };

  // Filtered students
  const filteredStudents = students.filter(s => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'on_task'
        ? s.status === 'on_task'
        : filter === 'off_task'
        ? s.status === 'off_task'
        : filter === 'hand_raised'
        ? s.status === 'hand_raised'
        : s.status === 'locked';

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      s.studentName.toLowerCase().includes(query) ||
      s.pcName.toLowerCase().includes(query) ||
      s.activeTabTitle.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const countOnTask = students.filter(s => s.status === 'on_task').length;
  const countOffTask = students.filter(s => s.status === 'off_task').length;
  const countHand = students.filter(s => s.status === 'hand_raised').length;
  const countLocked = students.filter(s => s.status === 'locked').length;

  // Student view: ONLY pair code & QR code screen share interface
  if (userRole === 'student') {
    return (
      <div className="max-w-xl mx-auto space-y-6 animate-fade-in font-sans py-4">
        {sentNudgeToast && (
          <div className="fixed top-20 right-6 z-50 bg-slate-800 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-600">
            <span className="material-symbols-outlined">check_circle</span>
            <span className="text-sm font-bold">{sentNudgeToast}</span>
          </div>
        )}

        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6 relative overflow-hidden">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-extrabold tracking-wide uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600 animate-pulse"></span>
            <span>Screen Live & Ready for Pairing</span>
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">Workstation Screen Share</h2>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto font-medium">
              Share your pair code or QR code with your teacher to allow live screen monitoring during lab sessions.
            </p>
          </div>

          {/* Pairing Code Box */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 max-w-md mx-auto space-y-2">
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest block">
              Student Pair Code
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-slate-900 bg-white px-4 py-2 rounded-xl border-2 border-slate-300 shadow-sm">
                PAIR-8492
              </span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText('PAIR-8492');
                  setSentNudgeToast('Pair Code copied to clipboard!');
                  setTimeout(() => setSentNudgeToast(null), 3000);
                }}
                className="bg-white hover:bg-slate-100 text-slate-800 p-2.5 rounded-xl border-2 border-slate-300 transition-all cursor-pointer shadow-sm"
                title="Copy Pair Code"
              >
                <span className="material-symbols-outlined text-lg">content_copy</span>
              </button>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-xs mx-auto space-y-3 flex flex-col items-center">
            <span className="text-xs font-bold text-slate-700">Scan QR Code to Connect</span>
            <div className="w-48 h-48 bg-white p-3 rounded-xl border-2 border-slate-400 flex items-center justify-center shadow-sm relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" fill="#ffffff" />
                <rect x="5" y="5" width="25" height="25" fill="#0f172a" />
                <rect x="9" y="9" width="17" height="17" fill="#ffffff" />
                <rect x="13" y="13" width="9" height="9" fill="#334155" />
                <rect x="70" y="5" width="25" height="25" fill="#0f172a" />
                <rect x="74" y="9" width="17" height="17" fill="#ffffff" />
                <rect x="78" y="13" width="9" height="9" fill="#334155" />
                <rect x="5" y="70" width="25" height="25" fill="#0f172a" />
                <rect x="9" y="74" width="17" height="17" fill="#ffffff" />
                <rect x="13" y="78" width="9" height="9" fill="#334155" />
                <rect x="35" y="5" width="8" height="8" fill="#0f172a" />
                <rect x="45" y="5" width="16" height="8" fill="#334155" />
                <rect x="35" y="18" width="12" height="12" fill="#0f172a" />
                <rect x="52" y="18" width="12" height="8" fill="#334155" />
                <rect x="5" y="35" width="8" height="15" fill="#334155" />
                <rect x="18" y="35" width="12" height="8" fill="#0f172a" />
                <rect x="35" y="35" width="30" height="30" fill="#0f172a" />
                <rect x="42" y="42" width="16" height="16" fill="#334155" />
                <rect x="70" y="35" width="15" height="8" fill="#0f172a" />
                <rect x="85" y="35" width="10" height="15" fill="#334155" />
                <rect x="70" y="48" width="8" height="18" fill="#334155" />
                <rect x="82" y="55" width="13" height="10" fill="#0f172a" />
                <rect x="35" y="70" width="12" height="12" fill="#334155" />
                <rect x="52" y="70" width="14" height="8" fill="#0f172a" />
                <rect x="70" y="70" width="25" height="8" fill="#334155" />
                <rect x="70" y="82" width="10" height="13" fill="#0f172a" />
                <rect x="85" y="82" width="10" height="13" fill="#334155" />
                <rect x="40" y="85" width="20" height="10" fill="#0f172a" />
              </svg>
            </div>
            <span className="text-[11px] text-slate-800 font-mono font-bold">LAB-PC-01 • 192.168.10.101</span>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-left text-xs">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Assigned Workstation</span>
              <span className="text-slate-900 font-bold font-mono">LAB-PC 01</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Session Class</span>
              <span className="text-slate-900 font-bold truncate block">Physics 101 - Lab 302</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setSentNudgeToast('Hand raised! Teacher notified.');
                setTimeout(() => setSentNudgeToast(null), 3500);
              }}
              className="w-full max-w-md bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl shadow-md border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg text-slate-300">front_hand</span>
              <span>Raise Hand / Request Teacher Help</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 italic max-w-xs mx-auto">
            Student screens do not display teacher administration tools or other student devices.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Toast Banner for Nudge */}
      {sentNudgeToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#00875A] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce">
          <span className="material-symbols-outlined">check_circle</span>
          <span className="text-sm font-bold">{sentNudgeToast}</span>
        </div>
      )}

      {/* Main Control Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden text-slate-900">
        <div className="space-y-4 pb-4 border-b border-slate-100 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
              <span className="material-symbols-outlined text-2xl text-white">desktop_windows</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5 tracking-tight">
                <span>Live Classroom & Lab Screen Monitor</span>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
              </h1>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Real-time screen viewing, workstation control, and anti-distraction management for teachers.
              </p>
            </div>
          </div>

          {/* Session Mode Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSessionMode('lab')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                sessionMode === 'lab'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-base">computer</span>
              <span>Computer Lab 302</span>
            </button>
            <button
              type="button"
              onClick={() => setSessionMode('online')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                sessionMode === 'online'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-base">video_camera_front</span>
              <span>Online Class (Zoom/Meet Sync)</span>
            </button>
          </div>
        </div>

        {/* Active Screen Share Status Banner with Timer & 1-Click End Share */}
        {(activeScreenShare || broadcasting || timerActive) && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border-2 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-2xl animate-spin">sync</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-xs font-bold uppercase text-amber-900 tracking-wider">Screen Share Active</span>
                </div>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {activeScreenShare ? `Connected Student: ${activeScreenShare.studentName} (${activeScreenShare.code})` : 'Teacher Screen Broadcast Active'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-amber-200">
              {/* Countdown Timer Display */}
              <div className="bg-white border border-amber-300 px-4 py-2 rounded-xl flex items-center gap-2.5 shadow-sm">
                <span className="material-symbols-outlined text-amber-600 text-xl">timer</span>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block leading-none">Remaining</span>
                  <span className="text-xl font-bold font-mono text-slate-900 tracking-wider">
                    {formatTimerDisplay(timerSecondsRemaining)}
                  </span>
                </div>
              </div>

              {/* One-Click End Share Button */}
              <button
                onClick={handleEndScreenShare}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-sm border border-rose-500 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0"
                title="Immediately stop screen share session"
              >
                <span className="material-symbols-outlined text-lg text-white">stop_circle</span>
                <span className="text-white font-bold">End Share</span>
              </button>
            </div>
          </div>
        )}

        {/* Active Pushed Assessment Status Banner */}
        {activePushedAssessment && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50 border-2 border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-2xl text-white">assignment_turned_in</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase text-blue-900 tracking-wider">Live Assessment Pushed</span>
                  <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">
                    {activePushedAssessment.durationMinutes} min limit
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {activePushedAssessment.title}
                </p>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  Assigned to <span className="text-slate-900 font-bold">{activePushedAssessment.totalAssigned} Workstations</span> • {activePushedAssessment.questionsCount} Questions • Strict Focus Lock Active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-blue-200">
              <button
                type="button"
                onClick={() => setIsUploadAssessmentModalOpen(true)}
                className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">edit_document</span>
                <span>Edit / Re-Push</span>
              </button>

              <button
                type="button"
                onClick={handleEndPushedAssessment}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm border border-amber-500 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0"
              >
                <span className="material-symbols-outlined text-sm text-white">archive</span>
                <span>Collect Submissions</span>
              </button>
            </div>
          </div>
        )}

        {/* Global Action Toolbar & Screen Sharing Control Hub */}
        <div className="pt-4 space-y-3">
          
          {/* Row 1: Full-Width Student Code Enter & QR Scanner Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConnectPairCode();
            }}
            className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-2 rounded-xl shadow-sm"
          >
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-base">pin</span>
              <input
                type="text"
                placeholder="Enter Student Code (e.g. PAIR-8492)"
                value={pairCodeInput}
                onChange={(e) => setPairCodeInput(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 uppercase font-mono font-bold"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">phonelink</span>
              <span>Connect</span>
            </button>
            <button
              type="button"
              onClick={() => setIsScanningQR(true)}
              className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-sm"
              title="Scan QR code from student screen"
            >
              <span className="material-symbols-outlined text-base text-white">qr_code_scanner</span>
              <span>Scan QR</span>
            </button>
          </form>

          {/* Row 2: Full-Width Start Link / Link Generator */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-xl shadow-sm">
            <button
              type="button"
              onClick={handleGenerateShareLink}
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-base text-emerald-700">link</span>
              <span>Generate Start Link for Student</span>
            </button>
            {generatedShareLink && (
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(generatedShareLink);
                  setSentNudgeToast('Link copied to clipboard!');
                  setTimeout(() => setSentNudgeToast(null), 2500);
                }}
                className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 px-2.5 py-2 rounded-lg text-xs font-bold shrink-0 cursor-pointer shadow-sm"
                title="Copy direct share link"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
              </button>
            )}
          </div>

          {/* Row 3: Full-Width TIMER Bar */}
          <div className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <span className="material-symbols-outlined text-lg text-slate-500">timer</span>
              <span>TIMER:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 5, 10, 15, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    setSelectedDurationMinutes(mins);
                    if (timerActive) {
                      setTimerSecondsRemaining(mins * 60);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    selectedDurationMinutes === mins
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: Action Buttons (Lock All, Broadcast, Web Restrict) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleToggleGlobalLock}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                  globalLock
                    ? 'bg-rose-600 border-rose-600 text-white'
                    : 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100'
                }`}
              >
                <span className="material-symbols-outlined text-base">{globalLock ? 'lock_open' : 'lock'}</span>
                <span>{globalLock ? 'Unlock All Screens' : 'Lock All Screens'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleBroadcast}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                  broadcasting
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <span className="material-symbols-outlined text-base">{broadcasting ? 'cancel_presentation' : 'present_to_all'}</span>
                <span>{broadcasting ? 'Stop Broadcast' : 'Broadcast My Screen'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleWebRestrict}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                  webRestricted
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-base">{webRestricted ? 'shield' : 'shield_moon'}</span>
                <span>Web Restrict: {webRestricted ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsUploadAssessmentModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm bg-slate-900 border-slate-800 text-white hover:bg-slate-800"
                title="Upload assessment paper or quiz and push to connected student workstations"
              >
                <span className="material-symbols-outlined text-base text-white">upload_file</span>
                <span>Upload & Push Assessment</span>
              </button>
            </div>

            {/* Quick Nudge Input */}
            <form onSubmit={handleSendNudge} className="flex items-center gap-1.5 w-full lg:w-auto">
              <input
                type="text"
                placeholder="Send popup message to class..."
                value={nudgeMessage}
                onChange={(e) => setNudgeMessage(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium w-full lg:w-60"
              />
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer shrink-0 transition-all flex items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm font-bold">send</span>
                <span>Nudge</span>
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Class On-Task Metrics Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm text-slate-900 relative overflow-hidden transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl border border-emerald-200 shadow-sm shrink-0">
            <span className="material-symbols-outlined text-2xl font-bold text-emerald-700">task_alt</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{countOnTask} / {students.length}</span>
            <p className="text-xs text-slate-500 font-semibold uppercase mt-1">On-Task ({Math.round((countOnTask/students.length)*100)}%)</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm text-slate-900">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl border border-amber-200 shadow-sm">
            <span className="material-symbols-outlined text-amber-700">warning</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-amber-700">{countOffTask}</span>
            <p className="text-xs text-slate-500 font-semibold">Off-Task Alerts</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm text-slate-900">
          <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl border border-indigo-200 shadow-sm">
            <span className="material-symbols-outlined text-indigo-700">front_hand</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-indigo-700">{countHand}</span>
            <p className="text-xs text-slate-500 font-semibold">Hands Raised</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm text-slate-900">
          <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl border border-rose-200 shadow-sm">
            <span className="material-symbols-outlined text-rose-700">screen_lock_portrait</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-rose-700">{countLocked}</span>
            <p className="text-xs text-slate-500 font-semibold">Locked Workstations</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Tabs Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm text-slate-900">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              filter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Workstations ({students.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('on_task')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
              filter === 'on_task'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'text-emerald-800 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>On-Task ({countOnTask})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('off_task')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
              filter === 'off_task'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'text-amber-800 bg-amber-50 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>Off-Task ({countOffTask})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('hand_raised')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
              filter === 'hand_raised'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'text-indigo-800 bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            <span className="material-symbols-outlined text-sm font-bold text-indigo-700">front_hand</span>
            <span>Hands Raised ({countHand})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('locked')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              filter === 'locked'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'text-rose-800 bg-rose-50 border-rose-200 hover:bg-rose-100'
            }`}
          >
            Locked ({countLocked})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Search student or PC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Main Student Screen Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStudents.map((student) => {
          const isOffTask = student.status === 'off_task';
          const isHand = student.status === 'hand_raised';
          const isLocked = student.status === 'locked';

          return (
            <div
              key={student.id}
              className={`group bg-white rounded-2xl border transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg relative flex flex-col overflow-hidden text-slate-900 ${
                isOffTask
                  ? 'border-amber-300 shadow-amber-100/50'
                  : isHand
                  ? 'border-indigo-300 shadow-indigo-100/50'
                  : isLocked
                  ? 'border-rose-200 shadow-rose-100/50'
                  : 'border-slate-200'
              }`}
            >
              {/* Card Top Header Bar */}
              <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2.5 min-w-0">
                  {student.avatarUrl ? (
                    <img src={student.avatarUrl} alt={student.studentName} className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      {student.initials}
                    </div>
                  )}
                  <div className="truncate">
                    <h3 className="text-xs font-bold text-slate-900 truncate leading-tight">{student.studentName}</h3>
                    <p className="text-[10px] text-slate-500 font-mono font-semibold">{student.pcName}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {isOffTask ? (
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      OFF-TASK
                    </span>
                  ) : isHand ? (
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] font-bold text-indigo-700">front_hand</span>
                      HAND RAISED
                    </span>
                  ) : isLocked ? (
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">lock</span>
                      LOCKED
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      ON-TASK
                    </span>
                  )}
                </div>
              </div>

              {/* Simulated Live Screen Thumbnail Window */}
              <div
                onClick={() => setSelectedStudent(student)}
                className="relative h-40 bg-slate-950 p-2 overflow-hidden cursor-pointer group-hover:brightness-105 transition-all border-b border-slate-200 select-none"
              >
                {/* Simulated Application Screen Interface Graphic */}
                {isLocked ? (
                  /* Locked Workstation Viewport */
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-3 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-lg text-slate-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-1.5 shadow-sm z-10">
                      <span className="material-symbols-outlined text-2xl">lock</span>
                    </div>
                    <span className="text-xs font-bold text-white z-10">Workstation Locked</span>
                    <span className="text-[10px] text-slate-400 font-medium z-10">Eyes on Teacher Presentation</span>
                  </div>
                ) : isOffTask ? (
                  /* Off-Task Alert Screen Viewport (High-Contrast & Distinct) */
                  <div className="w-full h-full bg-slate-900 border border-rose-500/70 rounded-lg p-2.5 flex flex-col justify-between relative overflow-hidden shadow-inner">
                    {/* Top Alert Bar */}
                    <div className="flex items-center justify-between text-[10px] pb-1.5 border-b border-slate-800 font-sans">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0"></span>
                        <span className="truncate max-w-[130px] font-bold text-rose-300">
                          {student.currentApp}
                        </span>
                      </div>
                      <span className="text-white text-[9px] bg-rose-600 px-1.5 py-0.5 rounded font-black tracking-wide shrink-0 shadow-xs">
                        UNAPPROVED
                      </span>
                    </div>

                    {/* Middle Content Simulation */}
                    <div className="my-auto space-y-1 py-1">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-rose-400 text-sm shrink-0">
                          {student.currentApp.toLowerCase().includes('youtube') ? 'play_circle' : 'chat'}
                        </span>
                        <p className="text-xs font-bold text-white leading-tight line-clamp-1">
                          {student.activeTabTitle}
                        </p>
                      </div>
                      <p className="text-[10px] text-amber-300 font-semibold line-clamp-1 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/30">
                        ⚠️ {student.alertMessage || 'Off-task activity detected'}
                      </p>
                    </div>

                    {/* Bottom Telemetry Bar */}
                    <div className="text-[10px] text-slate-300 font-sans flex justify-between items-center pt-1 border-t border-slate-800 font-medium">
                      <span className="text-slate-300">Spent: <strong className="text-white">{student.timeOnTab}</strong></span>
                      <span className="text-amber-300 font-bold">{student.keystrokesPerMin} keys/m</span>
                    </div>
                  </div>
                ) : student.category.toLowerCase().includes('python') || student.currentApp.toLowerCase().includes('code') ? (
                  /* VS Code / Python Screen Simulation */
                  <div className="w-full h-full bg-[#0d1117] border border-slate-800 rounded-lg p-2 flex flex-col justify-between font-mono text-[10px]">
                    {/* Window Titlebar */}
                    <div className="flex items-center justify-between text-slate-300 border-b border-slate-800 pb-1 font-sans">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                        <span className="truncate max-w-[130px] font-bold text-white">
                          {student.currentApp}
                        </span>
                      </div>
                      <span className="text-emerald-400 font-bold text-[9px] bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                        98% ON-TASK
                      </span>
                    </div>

                    {/* IDE Code Snippet Preview */}
                    <div className="my-1 space-y-0.5 text-[9px] text-slate-300 leading-tight">
                      <div className="flex gap-1.5">
                        <span className="text-slate-600 select-none">41</span>
                        <span className="text-purple-400 font-bold">def</span>
                        <span className="text-blue-300">calc_motion</span>
                        <span className="text-slate-400">(v0, a, t):</span>
                      </div>
                      <div className="flex gap-1.5 pl-3">
                        <span className="text-slate-600 select-none">42</span>
                        <span className="text-emerald-300 font-bold">return</span>
                        <span className="text-amber-200">v0 + (a * t)</span>
                      </div>
                      <div className="flex gap-1.5 text-slate-500 text-[8px] pl-3">
                        <span># {student.activeTabTitle.split('-')[0]}</span>
                      </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="text-[10px] text-slate-400 font-sans flex justify-between items-center pt-1 border-t border-slate-800 font-medium">
                      <span>Active: <strong className="text-slate-200">{student.timeOnTab}</strong></span>
                      <span className="text-emerald-400 font-bold">{student.keystrokesPerMin} WPM</span>
                    </div>
                  </div>
                ) : student.category.toLowerCase().includes('simulator') ? (
                  /* Physics Simulator Screen Simulation */
                  <div className="w-full h-full bg-[#0a1128] border border-slate-800 rounded-lg p-2 flex flex-col justify-between font-sans text-[10px]">
                    {/* Window Titlebar */}
                    <div className="flex items-center justify-between text-slate-300 border-b border-slate-800 pb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                        <span className="truncate max-w-[130px] font-bold text-white">
                          Physics Simulator
                        </span>
                      </div>
                      <span className="text-emerald-400 font-bold text-[9px] bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                        ACTIVE
                      </span>
                    </div>

                    {/* Trajectory Sandbox Curve Graphic */}
                    <div className="my-1 flex items-center justify-between px-1">
                      <div className="space-y-0.5">
                        <p className="text-slate-200 font-bold text-[10px] truncate max-w-[120px]">
                          {student.activeTabTitle}
                        </p>
                        <span className="text-cyan-300 text-[9px] font-mono font-semibold">θ = 45° | v = 24.8 m/s</span>
                      </div>
                      {/* Mini Canvas Trajectory Wave */}
                      <svg className="w-12 h-6 text-cyan-400 shrink-0" viewBox="0 0 48 24" fill="none">
                        <path d="M 2 22 Q 24 2 46 22" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
                        <circle cx="24" cy="7" r="2.5" fill="#38bdf8" />
                      </svg>
                    </div>

                    {/* Footer Stats */}
                    <div className="text-[10px] text-slate-400 flex justify-between items-center pt-1 border-t border-slate-800 font-medium">
                      <span>Active: <strong className="text-slate-200">{student.timeOnTab}</strong></span>
                      <span className="text-emerald-400 font-bold">{student.keystrokesPerMin} WPM</span>
                    </div>
                  </div>
                ) : (
                  /* Standard Quiz / Smart Classroom Assessment Screen Simulation */
                  <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-lg p-2 flex flex-col justify-between font-sans text-[10px]">
                    {/* Window Titlebar */}
                    <div className="flex items-center justify-between text-slate-300 border-b border-slate-800 pb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                        <span className="truncate max-w-[130px] font-bold text-white">
                          {student.currentApp}
                        </span>
                      </div>
                      <span className="text-emerald-400 font-bold text-[9px] bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                        100% FOCUS
                      </span>
                    </div>

                    {/* Assessment Question & Progress Content Preview */}
                    <div className="my-1 space-y-1">
                      <p className="text-slate-100 font-bold truncate text-[10px]">
                        {student.activeTabTitle}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[75%] rounded-full"></div>
                        </div>
                        <span className="text-emerald-400 font-bold text-[9px] shrink-0 font-mono">Q4/10</span>
                      </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="text-[10px] text-slate-400 flex justify-between items-center pt-1 border-t border-slate-800 font-medium">
                      <span>Time: <strong className="text-slate-200">{student.timeOnTab}</strong></span>
                      <span className="text-emerald-400 font-bold">{student.keystrokesPerMin} WPM</span>
                    </div>
                  </div>
                )}

                {/* Hover Overlay Prompt */}
                <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(student)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shadow-lg"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">visibility</span>
                    <span>Watch Screen</span>
                  </button>
                </div>
              </div>

              {/* Card Action Controls Footer */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
                <div className="truncate text-slate-600 text-[10px]">
                  <span>App: </span>
                  <span className="text-slate-900 font-bold">{student.category}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isOffTask && (
                    <button
                      type="button"
                      onClick={() => handleCloseOffTaskTab(student.id)}
                      title="Remote Close Off-Task Tab"
                      className="p-1.5 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleLockSingleStudent(student.id)}
                    title={isLocked ? 'Unlock PC' : 'Lock PC'}
                    className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
                      isLocked
                        ? 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{isLocked ? 'lock_open' : 'lock'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStudent(student)}
                    title="Open Detailed Monitor"
                    className="p-1.5 rounded-lg bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer shadow-sm font-bold"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">open_in_full</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live System Activity Log Feed */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-slate-900">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-700 text-lg">history_toggle_off</span>
          <span>Live Workstation Activity & Alert Log</span>
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {activityLogs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 font-medium ${
                log.type === 'alert'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : log.type === 'hand'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                  : log.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[10px] font-mono text-slate-500 font-bold shrink-0">{log.time}</span>
                <span className="font-bold text-slate-900 shrink-0">{log.student}:</span>
                <span className="truncate text-slate-700">{log.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Enlarged Student Watch Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-slate-900">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-base shadow-sm">
                  {selectedStudent.initials}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    {selectedStudent.studentName} ({selectedStudent.pcName})
                    {selectedStudent.status === 'off_task' && (
                      <span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                        OFF-TASK ALERT
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500">{selectedStudent.studentEmail}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Simulated HD Live Screen Frame */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-mono text-slate-300 font-bold ml-2">
                      {selectedStudent.currentApp} — {selectedStudent.activeTabTitle}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">● LIVE STREAM</span>
                </div>

                {/* Simulated HD Content Box */}
                <div className="min-h-[220px] bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-200 space-y-3 border border-slate-800">
                  <div className="flex justify-between items-center text-slate-400 text-[11px] border-b border-slate-800 pb-2">
                    <span>Active Domain: {selectedStudent.category}</span>
                    <span>Keystrokes: {selectedStudent.keystrokesPerMin} WPM</span>
                  </div>

                  {selectedStudent.status === 'off_task' ? (
                    <div className="p-4 bg-red-950/50 border border-red-500/50 rounded-xl space-y-2">
                      <p className="text-red-400 font-bold text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined">warning</span>
                        Unauthorized App/Tab Detected!
                      </p>
                      <p className="text-slate-200">
                        Student is currently viewing: <span className="text-white font-bold">{selectedStudent.activeTabTitle}</span>
                      </p>
                      <p className="text-slate-400 text-xs">Time elapsed on unapproved domain: {selectedStudent.timeOnTab}</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-2">
                      <p className="text-emerald-300 font-bold text-sm">
                        Working on: {selectedStudent.activeTabTitle}
                      </p>
                      <p className="text-slate-400 text-xs">
                        Student is actively engaged with lesson content. Keyboard input rate is consistent with problem solving.
                      </p>
                    </div>
                  )}

                  {/* Open Tabs List */}
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Open Background Tabs:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.openTabs.map((tab, idx) => (
                        <span key={idx} className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-[11px] border border-slate-700">
                          {tab}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Interactive Actions for Teacher */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selectedStudent.status === 'off_task' && (
                  <button
                    onClick={() => handleCloseOffTaskTab(selectedStudent.id)}
                    className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                    <span>Close Off-Task Tab</span>
                  </button>
                )}

                <button
                  onClick={() => handleLockSingleStudent(selectedStudent.id)}
                  className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border shadow-sm ${
                    selectedStudent.status === 'locked'
                      ? 'bg-emerald-700 border-emerald-700 text-white hover:bg-emerald-800'
                      : 'bg-rose-600 hover:bg-rose-700 border-rose-600 text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {selectedStudent.status === 'locked' ? 'lock_open' : 'lock'}
                  </span>
                  <span>{selectedStudent.status === 'locked' ? 'Unlock Workstation' : 'Lock Workstation'}</span>
                </button>

                <button
                  onClick={() => {
                    addLog('Teacher Action', 'success', `Captured screenshot for ${selectedStudent.studentName}`);
                    setSentNudgeToast(`Screenshot captured for ${selectedStudent.studentName}!`);
                    setTimeout(() => setSentNudgeToast(null), 3000);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
                >
                  <span className="material-symbols-outlined text-base text-slate-700">photo_camera</span>
                  <span>Take Screenshot</span>
                </button>
              </div>

              {/* Direct Message Input */}
              <form onSubmit={handleSendNudge} className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">Send Direct Nudge / Message to {selectedStudent.studentName}:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Please focus on Question 4..."
                    value={nudgeMessage}
                    onChange={(e) => setNudgeMessage(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer shadow-sm"
                  >
                    Send
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* Interactive Camera QR Scanner Modal */}
      {isScanningQR && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center relative overflow-hidden text-slate-900">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700">qr_code_scanner</span>
                <h3 className="text-sm font-bold text-slate-900">Student QR Code Scanner</h3>
              </div>
              <button
                onClick={() => setIsScanningQR(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Simulated Live Camera Viewfinder with Scanning Line */}
            <div className="relative w-64 h-64 mx-auto bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner flex flex-col items-center justify-center p-4 group">
              {/* Laser animation */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-bounce z-10"></div>
              
              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-400"></div>
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400"></div>
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400"></div>
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-400"></div>

              {/* Center QR target */}
              <div className="w-36 h-36 border border-slate-700 rounded-xl bg-slate-900 flex flex-col items-center justify-center p-2 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-300 animate-pulse mb-1">qr_code_2</span>
                <span className="text-[10px] text-slate-400 font-medium">Align Student Screen QR</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Point camera at student's workstation screen QR code to instantly pair and start timer.
            </p>

            {/* Quick Simulate Scan Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-left">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Detected Student QRs Nearby:</span>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleConnectPairCode('PAIR-8492')}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between cursor-pointer transition-all"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Alex Mercer (LAB-PC 01)
                  </span>
                  <span className="font-mono text-emerald-700 text-[11px] font-semibold">PAIR-8492 ● Scan</span>
                </button>

                <button
                  onClick={() => handleConnectPairCode('PAIR-3104')}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between cursor-pointer transition-all"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    Sarah Jenkins (LAB-PC 02)
                  </span>
                  <span className="font-mono text-slate-500 text-[11px]">PAIR-3104 ● Scan</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Teacher Upload & Push Assessment Modal */}
      {isUploadAssessmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-slate-900">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-xl shadow-sm">
                  <span className="material-symbols-outlined text-2xl text-emerald-800">upload_file</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    Teacher Upload & Distribute Assessment
                  </h2>
                  <p className="text-xs text-slate-500">
                    Upload assessment paper, configure exam duration, and push directly to student workstation screens.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsUploadAssessmentModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* File Upload Drop Area */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  1. Upload Assessment Paper / Quiz File:
                </label>
                
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/20 rounded-2xl p-5 text-center transition-all cursor-pointer relative group">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.json,.csv"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setUploadedAssessmentFile({
                          name: file.name,
                          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                          type: file.type || 'Document'
                        });
                        setSentNudgeToast(`Uploaded: ${file.name}`);
                        setTimeout(() => setSentNudgeToast(null), 3000);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-2xl text-emerald-800">cloud_upload</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Drag and drop your Assessment PDF, Word DOCX, or JSON here
                      </p>
                      <p className="text-xs text-slate-500">or click to browse local files from your device</p>
                    </div>
                  </div>
                </div>

                {/* Uploaded File Badge */}
                {uploadedAssessmentFile && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-emerald-700">description</span>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{uploadedAssessmentFile.name}</p>
                        <p className="text-[10px] text-emerald-700 font-medium">{uploadedAssessmentFile.size} • Ready for Distribution</p>
                      </div>
                    </div>
                    <span className="bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      Verified
                    </span>
                  </div>
                )}
              </div>

              {/* Assessment Details & Target Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Assessment Title:</label>
                  <input
                    type="text"
                    value={assessmentTitle}
                    onChange={(e) => setAssessmentTitle(e.target.value)}
                    placeholder="e.g. Kinematics Midterm Assessment"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Subject / Module:</label>
                  <input
                    type="text"
                    value={assessmentSubject}
                    onChange={(e) => setAssessmentSubject(e.target.value)}
                    placeholder="e.g. Physics 101"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Exam Duration:</label>
                  <div className="flex gap-2">
                    {[10, 15, 30, 45].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setAssessmentDurationMinutes(mins)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          assessmentDurationMinutes === mins
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Target Distribution:</label>
                  <select
                    value={assessmentTarget}
                    onChange={(e) => setAssessmentTarget(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium cursor-pointer"
                  >
                    <option value="all">All 12 Lab Workstations</option>
                    <option value="off_task">Only Off-Task Workstations ({countOffTask} PCs)</option>
                  </select>
                </div>
              </div>

              {/* Strict Exam Mode Option */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-700 text-lg">lock</span>
                    <span className="text-xs font-bold text-slate-900">Enforce Strict Screen Focus</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Automatically closes background gaming/social tabs and locks student workstations to the exam screen.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={lockWorkstationsToAssessment}
                  onChange={(e) => setLockWorkstationsToAssessment(e.target.checked)}
                  className="w-5 h-5 accent-emerald-700 cursor-pointer rounded"
                />
              </div>

              {/* Questions Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    2. Parsed / Configured Questions ({assessmentQuestions.length}):
                  </label>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {assessmentQuestions.map((q, idx) => (
                    <div key={q.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900">Q{idx + 1}. {q.q}</span>
                        <button
                          type="button"
                          onClick={() => setAssessmentQuestions(prev => prev.filter(item => item.id !== q.id))}
                          className="text-rose-500 hover:text-rose-700 cursor-pointer shrink-0"
                          title="Remove question"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                        <span className={q.correct === 'a' ? 'font-bold text-emerald-700' : ''}>A: {q.a}</span>
                        <span className={q.correct === 'b' ? 'font-bold text-emerald-700' : ''}>B: {q.b}</span>
                        <span className={q.correct === 'c' ? 'font-bold text-emerald-700' : ''}>C: {q.c}</span>
                        <span className={q.correct === 'd' ? 'font-bold text-emerald-700' : ''}>D: {q.d}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Add Custom Question Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a new question and click Add..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all"
                  >
                    Add Q
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer / Action Button */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between rounded-b-3xl gap-3">
              <button
                type="button"
                onClick={() => setIsUploadAssessmentModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold cursor-pointer transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePushAssessmentToClass}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">rocket_launch</span>
                <span>Upload & Push Assessment to Student Screens</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}