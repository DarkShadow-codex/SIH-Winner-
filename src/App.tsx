import React, { useState, useEffect } from 'react';
import { Role, UserProfile, ClassInfo, StudentRequest, RadarNode, ConceptNode, SyllabusItem, FeedPost, Assessment, TeacherMember, StudentMember, PersonDirectoryUser, GeneratedInviteLink } from './types';
import {
  initialClasses,
  initialRequests,
  initialRadarNodes,
  initialConceptNodes,
  initialSyllabusItems,
  initialFeedPosts,
  initialAssessments,
  initialTeachers,
  initialStudents,
  initialDirectoryUsers,
  initialInviteLinks
} from './data';

// Component Imports
import Login from './components/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TeacherDashboard from './components/TeacherDashboard';
import ClassroomRadar from './components/ClassroomRadar';
import ConceptGraphs from './components/ConceptGraphs';
import StudentDashboard from './components/StudentDashboard';
import TeachNext from './components/TeachNext';
import KnowledgeHub from './components/KnowledgeHub';
import AssessmentView from './components/AssessmentView';
import ClassroomMonitor from './components/ClassroomMonitor';
import SecurityHub from './components/SecurityHub';
import TeacherManagement from './components/TeacherManagement';
import PeopleHub from './components/PeopleHub';

export default function App() {
  // Authentication & Role State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<Role>('teacher');
  const [userEmail, setUserEmail] = useState<string>('');
  
  // User Profile State from Onboarding Questionnaire
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [shortcutToast, setShortcutToast] = useState<string | null>(null);

  // Global Keyboard Shortcuts (Ctrl+K or Cmd+K) for switching tabs
  useEffect(() => {
    const tabs = ['dashboard', 'live_monitor', 'classroom_radar', 'concept_graphs', 'teach_next', 'knowledge_hub', 'assessments', 'security_hub'];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keybindings if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveTab(prev => {
          const currentIndex = tabs.indexOf(prev);
          const nextIndex = (currentIndex + 1) % tabs.length;
          const nextTab = tabs[nextIndex];
          const labels: Record<string, string> = {
            dashboard: 'Dashboard',
            live_monitor: 'Live Monitor',
            classroom_radar: 'Classroom Radar',
            concept_graphs: 'Concept Graphs',
            teach_next: 'TeachNext Recommendations',
            knowledge_hub: 'Knowledge Hub',
            assessments: 'Assessments',
            security_hub: 'Security Hub'
          };
          setShortcutToast(`Switched to: ${labels[nextTab] || nextTab} (Ctrl+K)`);
          setTimeout(() => setShortcutToast(null), 2500);
          return nextTab;
        });
      }

      // Quick numbers 1-8 with Ctrl or Cmd
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '8') {
        e.preventDefault();
        const index = parseInt(e.key, 10) - 1;
        if (index >= 0 && index < tabs.length) {
          const nextTab = tabs[index];
          const labels: Record<string, string> = {
            dashboard: 'Dashboard',
            live_monitor: 'Live Monitor',
            classroom_radar: 'Classroom Radar',
            concept_graphs: 'Concept Graphs',
            teach_next: 'TeachNext Recommendations',
            knowledge_hub: 'Knowledge Hub',
            assessments: 'Assessments',
            security_hub: 'Security Hub'
          };
          setActiveTab(nextTab);
          setShortcutToast(`Shortcut Ctrl+${e.key} → ${labels[nextTab]}`);
          setTimeout(() => setShortcutToast(null), 2500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Core Data States
  const [classes, setClasses] = useState<ClassInfo[]>(initialClasses);
  const [requests, setRequests] = useState<StudentRequest[]>(initialRequests);
  const [radarNodes, setRadarNodes] = useState<RadarNode[]>(initialRadarNodes);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(initialFeedPosts);
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments);
  
  // Teachers, Students and Invite Links States
  const [teachers, setTeachers] = useState<TeacherMember[]>(initialTeachers);
  const [students, setStudents] = useState<StudentMember[]>(initialStudents);
  const [directoryUsers, setDirectoryUsers] = useState<PersonDirectoryUser[]>(initialDirectoryUsers);
  const [inviteLinks, setInviteLinks] = useState<GeneratedInviteLink[]>(initialInviteLinks);

  // Live Class Simulator State
  const [showLiveClassSim, setShowLiveClassSim] = useState<boolean>(false);
  const [pollVoted, setPollVoted] = useState<boolean>(false);
  const [pollResultA, setPollResultA] = useState<number>(75);
  const [pollResultB, setPollResultB] = useState<number>(25);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Sarah Jenkins', text: 'Mr. Davis, is the midterm covering friction coefficients?', time: '11:02' },
    { sender: 'Johnathan Cole', text: 'I am practicing the denominator vectors right now.', time: '11:03' },
    { sender: 'Michael B.', text: 'The live whiteboard helps a lot!', time: '11:04' }
  ]);
  const [newChatText, setNewChatText] = useState<string>('');

  // Mobile Drawer State
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Teacher & Student Directory Handlers
  const handleAddTeacher = (newTeacher: TeacherMember) => {
    setTeachers(prev => [newTeacher, ...prev]);
  };

  const handleAddStudent = (newStudent: StudentMember) => {
    setStudents(prev => [newStudent, ...prev]);
    // Also increase student count in corresponding class
    setClasses(prev => prev.map((c, i) => {
      if (i === 0) {
        return { ...c, studentsCount: c.studentsCount + 1 };
      }
      return c;
    }));
  };

  const handleCreateInviteLink = (newLink: GeneratedInviteLink) => {
    setInviteLinks(prev => [newLink, ...prev]);
  };

  const handleDeleteInviteLink = (linkId: string) => {
    setInviteLinks(prev => prev.filter(l => l.id !== linkId));
  };

  const handleRemoveTeacher = (teacherId: string) => {
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
  };

  const handleRemoveStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  const handleMoveStudentSection = (studentId: string, newSection: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, section: newSection } : s));
  };

  // Admission Actions handlers
  const handleApproveRequest = (id: string, targetSection: string = 'Section 9-A', targetClassId?: string) => {
    const approvedRequest = requests.find(r => r.id === id);
    if (!approvedRequest) return;

    if (approvedRequest.role === 'Co-Teacher') {
      const newTeacher: TeacherMember = {
        id: `t-${Date.now()}`,
        name: approvedRequest.name,
        username: approvedRequest.name.toLowerCase().replace(/\s+/g, '_'),
        email: approvedRequest.email,
        role: 'Co-Teacher',
        subject: 'Physics & STEM',
        department: 'Science',
        sections: [targetSection],
        status: 'active',
        avatarUrl: approvedRequest.avatarUrl,
        initials: approvedRequest.initials || approvedRequest.name.slice(0, 2).toUpperCase(),
        joinedDate: 'Today'
      };
      setTeachers(prev => [newTeacher, ...prev]);
    } else {
      const newStudent: StudentMember = {
        id: `s-${Date.now()}`,
        name: approvedRequest.name,
        username: approvedRequest.name.toLowerCase().replace(/\s+/g, '_'),
        email: approvedRequest.email,
        section: targetSection,
        rollNumber: `SEC-${Math.floor(100 + Math.random() * 900)}`,
        status: 'on_task',
        workstationId: `LAB-PC ${String(students.length + 1).padStart(2, '0')}`,
        attendance: '100%',
        avatarUrl: approvedRequest.avatarUrl,
        initials: approvedRequest.initials || approvedRequest.name.slice(0, 2).toUpperCase(),
        joinedDate: 'Today'
      };
      setStudents(prev => [newStudent, ...prev]);
    }

    // Update target class student count and decrement pending count
    setClasses(prev => prev.map(c => {
      const isTarget = targetClassId ? c.id === targetClassId : c.id === prev[0]?.id;
      if (isTarget) {
        return {
          ...c,
          studentsCount: c.studentsCount + 1,
          pendingCount: Math.max(0, c.pendingCount - 1)
        };
      }
      return c;
    }));

    // Add to live radar simulation nodes
    const newNode: RadarNode = {
      id: `node-${Date.now()}`,
      name: approvedRequest.name,
      x: 15 + Math.random() * 60,
      y: 15 + Math.random() * 60,
      status: 'review',
      topic: 'Kinematics Introduction',
      masteryPercentage: 50
    };
    setRadarNodes(prev => [...prev, newNode]);

    // Remove from requests list
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleRejectRequest = (id: string) => {
    // Update active class count
    setClasses(prev => prev.map((c, i) => {
      if (i === 0) {
        return {
          ...c,
          pendingCount: Math.max(0, c.pendingCount - 1)
        };
      }
      return c;
    }));

    setRequests(prev => prev.filter(r => r.id !== id));
  };

  // Create Class Handler
  const handleCreateClass = (newClass: Omit<ClassInfo, 'id' | 'studentsCount' | 'pendingCount'>) => {
    const fullClass: ClassInfo = {
      ...newClass,
      id: `class-${Date.now()}`,
      studentsCount: 0,
      pendingCount: 0
    };
    setClasses(prev => [...prev, fullClass]);
  };

  // Student Feed Add Post Handler
  const handleAddFeedPost = (content: string, type: 'note' | 'question') => {
    const initials = userRole === 'student' ? 'AM' : 'AD';
    const name = userRole === 'student' ? 'Alex Mercer' : 'Alex Davis';
    const role = userRole === 'student' ? 'Student' : 'Class Teacher';

    const newPost: FeedPost = {
      id: `feed-${Date.now()}`,
      authorName: name,
      authorInitials: initials,
      authorRole: role,
      timeAgo: 'Just now',
      content,
      likes: 0,
      hasLiked: false,
      type,
      replies: 0
    };

    setFeedPosts(prev => [newPost, ...prev]);
  };

  // Student Feed Like Handler
  const handleLikeFeedPost = (id: string) => {
    setFeedPosts(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !post.hasLiked
        };
      }
      return post;
    }));
  };

  // Role Switching simulator
  const handleRoleSwitch = (role: Role) => {
    setUserRole(role);
    setUserEmail(role === 'student' ? 'sam.wilson@student.edu' : `${role}@smartclass.edu`);
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        role: role,
        name: role === 'student' ? 'Sam Wilson' : 'Alex Davis',
        username: role === 'student' ? '@student_sam' : '@prof_alex',
        schoolName: role === 'student' ? 'St. Jude Higher Secondary School' : 'Oakridge International Academy'
      });
    }
    setActiveTab('dashboard');
  };

  // Full Onboarding Login Handler
  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setUserRole(profile.role);
    setUserEmail(profile.email);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  // Edit Profile Handler (re-opens onboarding form)
  const handleEditProfile = () => {
    setIsLoggedIn(false);
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Live Class Chat send
  const handleSendLiveChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    const sender = userRole === 'student' ? 'Alex Mercer' : 'Alex Davis (Teacher)';
    setChatMessages(prev => [...prev, {
      sender,
      text: newChatText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewChatText('');

    // Simulate quick automated response after 1.5 seconds for incredible realism
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: 'AI Teaching Companion',
        text: 'That input is correct! Notice how angle θ relative to the horizontal plane scales velocity vectors.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  // Live Class poll selection
  const handleVotePoll = (option: 'A' | 'B') => {
    setPollVoted(true);
    if (option === 'A') {
      setPollResultA(prev => prev + 5);
    } else {
      setPollResultB(prev => prev + 5);
    }
  };

  // Render current tab content dynamically
  const renderTabContent = () => {
    if (userRole === 'student' && activeTab === 'dashboard') {
      return (
        <StudentDashboard
          feedPosts={feedPosts}
          assessments={assessments}
          onAddPost={handleAddFeedPost}
          onLikePost={handleLikeFeedPost}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <TeacherDashboard
            classes={classes}
            requests={requests}
            students={students}
            teachers={teachers}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onCreateClass={handleCreateClass}
            onNavigateToPeople={() => setActiveTab('teacher_management')}
          />
        );
      case 'live_monitor':
        return <ClassroomMonitor userRole={userRole} userEmail={userEmail} />;
      case 'security_hub':
        if (userRole === 'student') {
          return (
            <StudentDashboard
              feedPosts={feedPosts}
              assessments={assessments}
              onAddPost={handleAddFeedPost}
              onLikePost={handleLikeFeedPost}
            />
          );
        }
        return <SecurityHub />;
      case 'classroom_radar':
        return (
          <ClassroomRadar
            radarNodes={radarNodes}
            onSelectTeachNext={() => setActiveTab('teach_next')}
          />
        );
      case 'concept_graphs':
        return (
          <ConceptGraphs
            initialNodes={initialConceptNodes}
            syllabusItems={initialSyllabusItems}
          />
        );
      case 'teach_next':
        return <TeachNext />;
      case 'knowledge_hub':
        return <KnowledgeHub />;
      case 'assessment':
        return <AssessmentView userRole={userRole} userEmail={userEmail} />;
      case 'people':
        return (
          <PeopleHub userRole={userRole} students={students} teachers={teachers} directoryUsers={directoryUsers} />
        );
      case 'teacher_management':
        return (
          <TeacherManagement
            teachers={teachers}
            students={students}
            requests={requests}
            directoryUsers={directoryUsers}
            inviteLinks={inviteLinks}
            onAddTeacher={handleAddTeacher}
            onAddStudent={handleAddStudent}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onRemoveTeacher={handleRemoveTeacher}
            onRemoveStudent={handleRemoveStudent}
            onMoveStudentSection={handleMoveStudentSection}
            onCreateInviteLink={handleCreateInviteLink}
            onDeleteInviteLink={handleDeleteInviteLink}
            userRole={userRole}
          />
        );
      case 'class_analytics':
        return (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Comprehensive Analytics</h2>
              <p className="text-sm text-slate-600">Analyze overall classroom masteries, response rates, and study document downloads.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-center">
                <span className="text-2xl font-extrabold text-[#142175]">88%</span>
                <p className="text-xs text-slate-600 mt-1">Average Response Rate</p>
              </div>
              <div className="p-4 bg-cyan-50/50 border border-cyan-100 rounded-xl text-center">
                <span className="text-2xl font-extrabold text-cyan-800">12</span>
                <p className="text-xs text-slate-600 mt-1">Syllabus Chapters Completed</p>
              </div>
              <div className="p-4 bg-green-50/50 border border-green-100 rounded-xl text-center">
                <span className="text-2xl font-extrabold text-emerald-800">4.8h</span>
                <p className="text-xs text-slate-600 mt-1">Avg Study Time per Student / Week</p>
              </div>
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900">Support & Help Documents</h2>
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              Smart Classroom matches real-time visual coordinate maps and intelligent AI syllabus extraction. Need to change views immediately? Use the **Demo Role Simulator** in the left sidebar to test both Teacher and Student environments instantly without logging out.
            </p>
            <div className="pt-4 border-t border-slate-100 space-y-3 text-xs font-semibold text-slate-700">
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#142175]">help_center</span>
                <span>How to use Live Class Polling? Launch "Live Class" in header, cast answers and view live stats updating.</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#142175]">school</span>
                <span>How to upload Syllabus? Select "Concept Graphs", upload any document and watch AI parsing nodes.</span>
              </p>
            </div>
          </div>
        );
      default:
        return <div className="p-12 text-center text-slate-500">Under Construction.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans relative overflow-x-hidden">
      
      {/* Background canvas for clean light academic theme */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none bg-slate-50"
      ></div>

      <div className="relative z-10">
        {!isLoggedIn ? (
          // Multi-Step Onboarding Login Authenticator view
          <Login onLogin={handleLoginSuccess} initialProfile={userProfile} />
        ) : (
          // Shell workspace layout
          <div className="pt-16 lg:pl-[280px]">
            
            {/* Main Top Header Navigation */}
            <Header
              userRole={userRole}
              userEmail={userEmail}
              userProfile={userProfile}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onLaunchLiveClass={() => setShowLiveClassSim(true)}
              onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              onLogout={handleLogout}
              onEditProfile={handleEditProfile}
            />

            {/* Sidebar Menu Drawer for Desktops */}
            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
              userRole={userRole}
              userEmail={userEmail}
              userProfile={userProfile}
              onLogout={handleLogout}
              onRoleSwitch={handleRoleSwitch}
            />

            {/* Sidebar Menu Drawer for Mobiles */}
            {mobileSidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div 
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                  onClick={() => setMobileSidebarOpen(false)}
                ></div>
                <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white border-r border-slate-200 p-4 shadow-xl z-50 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-800 uppercase font-sans tracking-wider">Navigation Menu</span>
                    <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-500 hover:text-slate-900 cursor-pointer">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <Sidebar
                    className="flex flex-col w-full h-[calc(100vh-80px)] bg-transparent gap-2 text-slate-900"
                    activeTab={activeTab}
                    onTabChange={(tab) => {
                      setActiveTab(tab);
                      setMobileSidebarOpen(false);
                    }}
                    userRole={userRole}
                    userEmail={userEmail}
                    onLogout={handleLogout}
                    onRoleSwitch={handleRoleSwitch}
                  />
                </div>
              </div>
            )}

            {/* Main Screen Content Stage */}
            <main className="p-4 md:p-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)] pb-16">
              {/* Horizontal Quick Navigation Tab Slider */}
              <div className="mb-6 -mx-2 px-2 overflow-x-auto flex items-center gap-2.5 pb-2 scrollbar-none">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
                  { id: 'live_monitor', label: userRole === 'student' ? 'Screen Share Code' : 'Live Monitor', icon: 'desktop_windows' },
                  ...(userRole !== 'student' ? [{ id: 'security_hub', label: 'Security Hub', icon: 'security' }] : []),
                  { id: 'classroom_radar', label: 'Classroom Radar', icon: 'grid_view' },
                  { id: 'concept_graphs', label: 'Concept Graphs', icon: 'hub' },
                  { id: 'teach_next', label: 'Teach Next', icon: 'psychology' },
                  { id: 'knowledge_hub', label: 'Knowledge Hub', icon: 'diversity_3' },
                  { id: 'people', label: 'People & Chat', icon: 'group' },
                  { id: 'assessment', label: 'Assignment', icon: 'assignment' },
                  ...(userRole === 'teacher' || userRole === 'subject_teacher' ? [
                    { id: 'teacher_management', label: 'Teachers', icon: 'manage_accounts' },
                    { id: 'class_analytics', label: 'Analytics', icon: 'analytics' }
                  ] : []),
                  { id: 'help', label: 'Help', icon: 'help' }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer shrink-0 shadow-sm ${
                        isActive
                          ? 'bg-[#00875A] border-[#006B47] text-white shadow-emerald-900/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {renderTabContent()}
            </main>

          </div>
        )}
      </div>

      {/* Interactive Fullscreen Live Virtual Classroom Simulator */}
      {showLiveClassSim && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel-heavy rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col md:flex-row overflow-hidden animate-scale-up border border-white/20">
            
            {/* Left side: Whiteboard & Polling Question */}
            <div className="flex-1 bg-slate-950/40 text-white p-6 flex flex-col justify-between overflow-y-auto">
              
              {/* Header bar */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Interactive Lecture Live Room</h3>
                </div>
                <button
                  onClick={() => setShowLiveClassSim(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Whiteboard / Parabolic trajectory vectors */}
              <div className="bg-slate-950/60 rounded-xl border border-white/10 p-4 flex-1 flex flex-col justify-between min-h-[200px] mb-6 relative">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #ffffff 1.5px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                
                <div className="relative z-10">
                  <p className="text-[10px] text-indigo-300 font-mono">WHITEBOARD_STAGE_01 // VECTOR ANALYSIS</p>
                  <h4 className="text-sm font-bold mt-1 text-slate-100">Uniform 2D Projectile Components</h4>
                </div>

                {/* Drawn Parabolic Curve vectors */}
                <div className="h-28 flex items-end justify-center relative">
                  <svg className="w-full h-full">
                    <path d="M 20 100 Q 180 15, 340 100" fill="none" stroke="#6366f1" strokeWidth="2.5" />
                    {/* Vectors arrows */}
                    <line x1="20" y1="100" x2="60" y2="100" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)" />
                    <line x1="20" y1="100" x2="20" y2="60" stroke="#3b82f6" strokeWidth="2" />
                    
                    <text x="75" y="95" fill="#10b981" className="text-[9px] font-mono">Vx = V * cos(θ)</text>
                    <text x="25" y="55" fill="#3b82f6" className="text-[9px] font-mono">Vy = V * sin(θ)</text>
                  </svg>
                </div>

                <div className="text-[9px] text-slate-400 text-center font-semibold">
                  💡 Drag mouse or tap endpoints on the whiteboard curves to align trajectories.
                </div>
              </div>

              {/* Polling Question */}
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-indigo-300 text-lg">ballot</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Live Polling Question</span>
                </div>
                <p className="text-xs font-bold text-white mb-4">
                  Which component represents the horizontal projectile velocity (Vx) relative to flat terrain?
                </p>

                {/* Poll Options */}
                {!pollVoted ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <button
                      onClick={() => handleVotePoll('A')}
                      className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400 rounded-lg text-left transition-all cursor-pointer font-semibold"
                    >
                      A) V * cos(θ) (Cosine Rule)
                    </button>
                    <button
                      onClick={() => handleVotePoll('B')}
                      className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400 rounded-lg text-left transition-all cursor-pointer font-semibold"
                    >
                      B) V * sin(θ) (Sine Rule)
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-900/60 rounded-lg border border-white/5 space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>A) V * cos(θ)</span>
                        <span>{pollResultA}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${pollResultA}%` }}></div>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900/60 rounded-lg border border-white/5 space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>B) V * sin(θ)</span>
                        <span>{pollResultB}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${pollResultB}%` }}></div>
                      </div>
                    </div>
                    <p className="text-[10px] text-emerald-400 font-bold text-center mt-2">✓ Vote submitted successfully! Thank you for participating.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Right side: Live Student Interaction Chat Feed */}
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-between h-full bg-[#0d121f]/90 backdrop-blur-md">
              
              {/* Header title */}
              <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center shrink-0">
                <span className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">Live Interaction Chat</span>
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] px-2 py-0.5 rounded-full font-bold">
                  24 active
                </span>
              </div>

              {/* Chat log */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {chatMessages.map((msg, i) => (
                  <div key={i} className="space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                    <div className="flex justify-between text-[9px] text-indigo-300 font-bold uppercase">
                      <span>{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-slate-200 font-sans leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Input sender */}
              <form onSubmit={handleSendLiveChat} className="p-4 border-t border-white/10 bg-white/5 flex gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Type a response to live room..."
                  className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-indigo-400 text-white"
                  value={newChatText}
                  onChange={(e) => setNewChatText(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/35 text-white px-4 py-2 rounded text-xs font-bold cursor-pointer transition-colors"
                >
                  Send
                </button>
              </form>

            </div>

          </div>
        </div>
      )}

      {/* Global Shortcut Keyboard Toast */}
      {shortcutToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500/50 animate-bounce">
          <span className="material-symbols-outlined text-emerald-400">keyboard</span>
          <span className="text-xs font-bold text-white">{shortcutToast}</span>
        </div>
      )}

    </div>
  );
}
