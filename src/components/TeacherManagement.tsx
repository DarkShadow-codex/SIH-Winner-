import React, { useState } from 'react';
import { TeacherMember, StudentMember, PersonDirectoryUser, StudentRequest, Role, GeneratedInviteLink } from '../types';

interface TeacherManagementProps {
  teachers: TeacherMember[];
  students: StudentMember[];
  requests: StudentRequest[];
  directoryUsers: PersonDirectoryUser[];
  inviteLinks: GeneratedInviteLink[];
  onAddTeacher: (teacher: TeacherMember) => void;
  onAddStudent: (student: StudentMember) => void;
  onApproveRequest: (requestId: string, targetSection?: string) => void;
  onRejectRequest: (requestId: string) => void;
  onRemoveTeacher?: (teacherId: string) => void;
  onRemoveStudent?: (studentId: string) => void;
  onMoveStudentSection?: (studentId: string, newSection: string) => void;
  onCreateInviteLink?: (link: GeneratedInviteLink) => void;
  onDeleteInviteLink?: (linkId: string) => void;
  userRole?: Role;
}

export default function TeacherManagement({
  teachers,
  students,
  requests,
  directoryUsers,
  inviteLinks = [],
  onAddTeacher,
  onAddStudent,
  onApproveRequest,
  onRejectRequest,
  onRemoveTeacher,
  onRemoveStudent,
  onMoveStudentSection,
  onCreateInviteLink,
  onDeleteInviteLink,
  userRole = 'teacher'
}: TeacherManagementProps) {
  const [activeTab, setActiveTab] = useState<'link_generator' | 'search_add' | 'requests' | 'teachers' | 'students'>('link_generator');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Link Generator States
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [genTargetRole, setGenTargetRole] = useState<'student' | 'teacher'>('student');
  const [genTitle, setGenTitle] = useState('');
  const [genSection, setGenSection] = useState('Section 9-A');
  const [genTeacherRole, setGenTeacherRole] = useState<'Co-Teacher' | 'Subject Specialist' | 'Lab Assistant'>('Co-Teacher');
  const [genSubject, setGenSubject] = useState('Physics');
  const [genAutoApprove, setGenAutoApprove] = useState(true);
  const [genExpiresIn, setGenExpiresIn] = useState('Never (Active)');
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Simulated Recipient Join Modal (When someone opens a share link)
  const [simulatedLink, setSimulatedLink] = useState<GeneratedInviteLink | null>(null);
  const [simJoinName, setSimJoinName] = useState('');
  const [simJoinUsername, setSimJoinUsername] = useState('');
  const [simJoinEmail, setSimJoinEmail] = useState('');
  const [simJoinSection, setSimJoinSection] = useState('Section 9-A');
  const [simJoinSubject, setSimJoinSubject] = useState('Physics');

  // Direct Add Modal / State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addMode, setAddMode] = useState<'teacher' | 'student'>('student');

  // Form States for Direct Add
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<'Class Lead' | 'Co-Teacher' | 'Subject Specialist' | 'Lab Assistant'>('Co-Teacher');
  const [formSubject, setFormSubject] = useState('Physics');
  const [formDepartment, setFormDepartment] = useState('Science & STEM');
  const [formSection, setFormSection] = useState('Section 9-A');
  const [formSectionsTeacher, setFormSectionsTeacher] = useState<string[]>(['Section 9-A']);
  const [formRollNumber, setFormRollNumber] = useState('');
  const [formWorkstation, setFormWorkstation] = useState('');

  // Available sections list
  const availableSections = Array.from(
    new Set([
      'Section 9-A',
      'Section 9-B',
      'Section 10-A',
      'Lab Cohort 302',
      ...students.map(s => s.section)
    ])
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyText = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLinkId(id);
    showToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedLinkId(null), 2500);
  };

  // Submit Link Generator
  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = genTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || (genTargetRole === 'student' ? `${genSection.toLowerCase().replace(/\s+/g, '')}-join` : 'faculty-invite');
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const code = genTargetRole === 'student' ? `${genSection.replace(/[^0-9A-Z]/gi, '').toUpperCase()}-${randomSuffix.toUpperCase()}` : `TEACH-${randomSuffix.toUpperCase()}`;
    const url = `https://smartclass.edu/join/${slug}-${randomSuffix}`;

    const newLink: GeneratedInviteLink = {
      id: `link-${Date.now()}`,
      title: genTitle.trim() || (genTargetRole === 'student' ? `Student Enrollment Link (${genSection})` : `Faculty Invite (${genTeacherRole} - ${genSubject})`),
      targetRole: genTargetRole,
      section: genTargetRole === 'student' ? genSection : undefined,
      teacherRole: genTargetRole === 'teacher' ? genTeacherRole : undefined,
      subject: genTargetRole === 'teacher' ? genSubject : undefined,
      code: code,
      url: url,
      createdAt: 'Just Now',
      expiresIn: genExpiresIn,
      autoApprove: genAutoApprove,
      usesCount: 0,
      maxUses: genTargetRole === 'student' ? 45 : 10
    };

    if (onCreateInviteLink) {
      onCreateInviteLink(newLink);
    }
    showToast(`Generated new share link for ${genTargetRole === 'student' ? genSection : 'Teachers'}!`);
    setIsGenerateModalOpen(false);
    setGenTitle('');
  };

  // Open simulated join form for a link
  const handleOpenSimulatedLink = (link: GeneratedInviteLink) => {
    setSimulatedLink(link);
    setSimJoinName('');
    setSimJoinUsername('');
    setSimJoinEmail('');
    setSimJoinSection(link.section || 'Section 9-A');
    setSimJoinSubject(link.subject || 'Physics');
  };

  // Submit simulated join as recipient
  const handleExecuteSimulatedJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedLink || !simJoinName.trim() || !simJoinUsername.trim()) return;

    const cleanUsername = simJoinUsername.replace('@', '').trim().toLowerCase();

    if (simulatedLink.targetRole === 'teacher') {
      if (simulatedLink.autoApprove) {
        const newTeacher: TeacherMember = {
          id: `t-${Date.now()}`,
          name: simJoinName.trim(),
          username: cleanUsername,
          email: simJoinEmail.trim() || `${cleanUsername}@school.edu`,
          role: simulatedLink.teacherRole || 'Co-Teacher',
          subject: simulatedLink.subject || 'Physics & STEM',
          department: 'Science & STEM',
          sections: ['Section 9-A', 'Section 9-B'],
          status: 'active',
          initials: simJoinName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
          joinedDate: 'Just Now'
        };
        onAddTeacher(newTeacher);
        showToast(`Welcome ${simJoinName}! You joined as ${simulatedLink.teacherRole || 'Teacher'}.`);
        setActiveTab('teachers');
      } else {
        showToast(`Request sent! The Class Lead will approve your admission shortly.`);
        setActiveTab('requests');
      }
    } else {
      if (simulatedLink.autoApprove) {
        const targetSec = simulatedLink.section || simJoinSection;
        const newStudent: StudentMember = {
          id: `s-${Date.now()}`,
          name: simJoinName.trim(),
          username: cleanUsername,
          email: simJoinEmail.trim() || `${cleanUsername}@student.edu`,
          section: targetSec,
          rollNumber: `SEC-${Math.floor(100 + Math.random() * 900)}`,
          status: 'on_task',
          workstationId: `LAB-PC ${String(students.length + 1).padStart(2, '0')}`,
          attendance: '100%',
          initials: simJoinName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
          joinedDate: 'Just Now'
        };
        onAddStudent(newStudent);
        showToast(`Welcome ${simJoinName}! You enrolled directly into ${targetSec}.`);
        setActiveTab('students');
        setSelectedSection(targetSec);
      } else {
        showToast(`Enrollment request submitted to Class Lead for approval.`);
        setActiveTab('requests');
      }
    }

    setSimulatedLink(null);
  };

  // Filtered Directory & Lists
  const q = searchQuery.toLowerCase().trim();

  const filteredDirectory = directoryUsers.filter(u => {
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.subject && u.subject.toLowerCase().includes(q)) ||
      (u.suggestedSection && u.suggestedSection.toLowerCase().includes(q))
    );
  });

  const filteredTeachers = teachers.filter(t => {
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.username.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      t.role.toLowerCase().includes(q) ||
      t.sections.some(s => s.toLowerCase().includes(q))
    );
  });

  const filteredStudents = students.filter(s => {
    const matchesSection = selectedSection === 'all' || s.section === selectedSection;
    if (!matchesSection) return false;
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.username.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      (s.workstationId && s.workstationId.toLowerCase().includes(q)) ||
      s.section.toLowerCase().includes(q)
    );
  });

  const handleSelectDirectoryUser = (user: PersonDirectoryUser) => {
    setFormName(user.name);
    setFormUsername(user.username);
    setFormEmail(user.email);
    if (user.defaultRole === 'teacher') {
      setAddMode('teacher');
      setFormSubject(user.subject || 'Physics');
      setFormDepartment(user.department || 'Science');
      if (user.suggestedSection) setFormSectionsTeacher([user.suggestedSection]);
    } else {
      setAddMode('student');
      setFormSection(user.suggestedSection || 'Section 9-A');
      setFormRollNumber(`SEC-${Math.floor(100 + Math.random() * 900)}`);
      setFormWorkstation(`LAB-PC ${String(students.length + 1).padStart(2, '0')}`);
    }
    setIsAddModalOpen(true);
  };

  const handleOpenAddModal = (mode: 'teacher' | 'student') => {
    setAddMode(mode);
    setFormName('');
    setFormUsername('');
    setFormEmail('');
    if (mode === 'teacher') {
      setFormRole('Co-Teacher');
      setFormSubject('Physics');
      setFormDepartment('Science & STEM');
      setFormSectionsTeacher(['Section 9-A']);
    } else {
      setFormSection('Section 9-A');
      setFormRollNumber(`SEC9A-${String(students.length + 1).padStart(2, '0')}`);
      setFormWorkstation(`LAB-PC ${String(students.length + 1).padStart(2, '0')}`);
    }
    setIsAddModalOpen(true);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formUsername.trim()) {
      showToast('Please provide a full name and username.');
      return;
    }

    const cleanUsername = formUsername.replace('@', '').trim().toLowerCase();

    if (addMode === 'teacher') {
      const newTeacher: TeacherMember = {
        id: `t-${Date.now()}`,
        name: formName.trim(),
        username: cleanUsername,
        email: formEmail.trim() || `${cleanUsername}@school.edu`,
        role: formRole,
        subject: formSubject,
        department: formDepartment,
        sections: formSectionsTeacher.length > 0 ? formSectionsTeacher : ['Section 9-A'],
        status: 'active',
        initials: formName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
        joinedDate: 'Just Now'
      };
      onAddTeacher(newTeacher);
      showToast(`Teacher @${cleanUsername} (${formName}) added to Teacher Section!`);
      setActiveTab('teachers');
    } else {
      const newStudent: StudentMember = {
        id: `s-${Date.now()}`,
        name: formName.trim(),
        username: cleanUsername,
        email: formEmail.trim() || `${cleanUsername}@student.edu`,
        section: formSection,
        rollNumber: formRollNumber.trim() || `SEC-${Math.floor(100 + Math.random() * 900)}`,
        status: 'on_task',
        workstationId: formWorkstation.trim() || `LAB-PC ${String(students.length + 1).padStart(2, '0')}`,
        attendance: '100%',
        initials: formName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
        joinedDate: 'Just Now'
      };
      onAddStudent(newStudent);
      showToast(`Student @${cleanUsername} added directly to ${formSection}!`);
      setActiveTab('students');
      setSelectedSection(formSection);
    }

    setIsAddModalOpen(false);
  };

  const handleApproveWithSection = (req: StudentRequest, section: string = 'Section 9-A') => {
    if (req.role === 'Co-Teacher') {
      const newTeacher: TeacherMember = {
        id: `t-${Date.now()}`,
        name: req.name,
        username: req.name.toLowerCase().replace(/\s+/g, '_'),
        email: req.email,
        role: 'Co-Teacher',
        subject: 'Physics & STEM',
        department: 'Science',
        sections: [section],
        status: 'active',
        avatarUrl: req.avatarUrl,
        initials: req.initials || req.name.slice(0, 2).toUpperCase(),
        joinedDate: 'Today'
      };
      onAddTeacher(newTeacher);
      onApproveRequest(req.id, section);
      showToast(`Approved ${req.name} as Co-Teacher in Teacher Section!`);
    } else {
      const newStudent: StudentMember = {
        id: `s-${Date.now()}`,
        name: req.name,
        username: req.name.toLowerCase().replace(/\s+/g, '_'),
        email: req.email,
        section: section,
        rollNumber: `SEC-${Math.floor(100 + Math.random() * 900)}`,
        status: 'on_task',
        workstationId: `LAB-PC ${String(students.length + 1).padStart(2, '0')}`,
        attendance: '100%',
        avatarUrl: req.avatarUrl,
        initials: req.initials || req.name.slice(0, 2).toUpperCase(),
        joinedDate: 'Today'
      };
      onAddStudent(newStudent);
      onApproveRequest(req.id, section);
      showToast(`Approved ${req.name} and assigned to ${section}!`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-fade-in">
          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Header / People Management Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-slate-900 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-2xl shadow-xs shrink-0">
              <span className="material-symbols-outlined text-2xl">link</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5 tracking-tight">
                <span>Classroom Invite Links & People Hub</span>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Generate shareable invitation links for students & co-teachers, search by username, review admission requests, and organize rosters.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsGenerateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-base">add_link</span>
              <span>Generate Share Link</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenAddModal('teacher')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-base text-emerald-700">person_add</span>
              <span>Add Teacher</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenAddModal('student')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-base text-emerald-700">group_add</span>
              <span>Add Student</span>
            </button>
          </div>
        </div>

        {/* Dynamic Navigation Tabs & Overview Metrics */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('link_generator')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'link_generator'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">share</span>
              <span>Link Generator ({inviteLinks.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('search_add')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'search_add'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">person_search</span>
              <span>Search People & Directory</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('teachers')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'teachers'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">school</span>
              <span>Teacher List ({teachers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('students')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'students'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">groups</span>
              <span>Student List ({students.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'requests'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">inbox</span>
              <span>Request Box</span>
              {requests.length > 0 && (
                <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                  {requests.length}
                </span>
              )}
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs text-slate-600 font-medium">
            <span><strong className="text-slate-900 font-bold">{inviteLinks.length}</strong> Active Links</span>
            <span className="text-slate-300">•</span>
            <span><strong className="text-slate-900 font-bold">{teachers.length}</strong> Teachers</span>
            <span className="text-slate-300">•</span>
            <span><strong className="text-slate-900 font-bold">{students.length}</strong> Students</span>
          </div>
        </div>
      </div>

      {/* Global Live Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by @username, full name, email, subject, roll number, or section (e.g. @alex_m, Physics, Section 9-A)..."
            className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder-slate-400 font-medium transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {activeTab === 'students' && (
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-600 uppercase whitespace-nowrap">Filter Section:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="all">All Sections ({students.length})</option>
              {availableSections.map(sec => {
                const count = students.filter(s => s.section === sec).length;
                return (
                  <option key={sec} value={sec}>{sec} ({count})</option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {/* VIEW 1: LINK GENERATOR & SHARE HUB */}
      {activeTab === 'link_generator' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-700 text-xl">share_location</span>
                  <h3 className="text-base font-bold text-slate-900">Shareable Invite Links for Teachers & Students</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Share these direct URLs or class codes with students and colleagues. When they click the link, they can instantly join their assigned section or faculty role.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsGenerateModalOpen(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 self-start md:self-auto"
              >
                <span className="material-symbols-outlined text-base">add_link</span>
                <span>Create New Custom Link</span>
              </button>
            </div>

            {/* Links List Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {inviteLinks.map((link) => {
                const isStudentLink = link.targetRole === 'student';
                const isCopied = copiedLinkId === link.id;

                return (
                  <div
                    key={link.id}
                    className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border font-bold text-xl shrink-0 shadow-xs ${
                          isStudentLink ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          <span className="material-symbols-outlined text-xl">
                            {isStudentLink ? 'groups' : 'school'}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900">{link.title}</h4>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                              isStudentLink
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              {isStudentLink ? 'Student Link' : 'Teacher Link'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 font-medium mt-1">
                            {isStudentLink ? (
                              <span>Target Section: <strong className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold">{link.section || 'Section 9-A'}</strong></span>
                            ) : (
                              <span>Faculty Role: <strong className="text-slate-900 font-bold">{link.teacherRole || 'Co-Teacher'}</strong> ({link.subject || 'Physics'})</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {onDeleteInviteLink && (
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteInviteLink(link.id);
                            showToast('Invite link deactivated.');
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                          title="Deactivate Link"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      )}
                    </div>

                    {/* URL and Code Box */}
                    <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          <span>Shareable URL</span>
                          <span className="text-slate-400 font-normal">Expires: {link.expiresIn}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2">
                          <p className="text-xs text-slate-700 font-mono truncate flex-1">{link.url}</p>
                          <button
                            type="button"
                            onClick={() => handleCopyText(link.url, link.id, 'Share Link')}
                            className="text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[11px] font-bold cursor-pointer transition-colors shrink-0 flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs">
                              {isCopied ? 'check' : 'content_copy'}
                            </span>
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase font-bold text-slate-500">Join Code:</span>
                          <code className="bg-slate-900 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold text-xs">
                            {link.code}
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-medium">
                            {link.autoApprove ? '⚡ Instant Join' : '🛡️ Requires Approval'}
                          </span>
                          <span className="text-[10px] text-slate-700 font-bold">
                            {link.usesCount} / {link.maxUses || 50} Used
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar for this link */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenSimulatedLink(link)}
                        className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                        <span>Test Join Form As Recipient</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyText(link.url, link.id, 'Share Link')}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer transition-colors"
                        title="Copy direct share URL"
                      >
                        <span className="material-symbols-outlined text-sm">share</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SEARCH DIRECTORY & ADD PEOPLE */}
      {activeTab === 'search_add' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700">travel_explore</span>
                <h3 className="text-base font-bold text-slate-900">
                  Global School User Directory ({filteredDirectory.length} Found)
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Search teachers or students by username (@username) to add them to class or send invite.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDirectory.map((user) => {
                const isAlreadyTeacher = teachers.some(t => t.username === user.username);
                const isAlreadyStudent = students.some(s => s.username === user.username);

                return (
                  <div
                    key={user.id}
                    className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all shadow-xs group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
                        {user.initials || user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{user.name}</h4>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                            user.defaultRole === 'teacher'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}>
                            {user.defaultRole}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-700 font-mono font-semibold truncate">@{user.username}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        {user.subject && (
                          <p className="text-[10px] text-slate-600 mt-1">
                            Subject: <strong className="text-slate-900">{user.subject}</strong>
                          </p>
                        )}
                        {user.suggestedSection && (
                          <p className="text-[10px] text-teal-700">
                            Suggested Section: <strong>{user.suggestedSection}</strong>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      {isAlreadyTeacher ? (
                        <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">check</span>
                          In Teacher List
                        </span>
                      ) : isAlreadyStudent ? (
                        <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">check</span>
                          In Student List
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelectDirectoryUser(user)}
                          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                        >
                          <span className="material-symbols-outlined text-sm">person_add</span>
                          <span>Add to Class / Section</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: TEACHER LIST */}
      {activeTab === 'teachers' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700">school</span>
                <h3 className="text-base font-bold text-slate-900">Faculty & Teacher Roster ({filteredTeachers.length})</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                All academic instructors, co-teachers, and lab assistants added by the class teacher.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenAddModal('teacher')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">person_add</span>
              <span>+ Add New Teacher</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  {teacher.avatarUrl ? (
                    <img
                      src={teacher.avatarUrl}
                      alt={teacher.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-xs"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center justify-center shadow-xs">
                      {teacher.initials || teacher.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{teacher.name}</h4>
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {teacher.role}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 font-mono font-semibold">@{teacher.username}</p>
                    <p className="text-[11px] text-slate-500 truncate">{teacher.email}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Subject:</span>
                    <strong className="text-slate-900">{teacher.subject}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Department:</span>
                    <span className="text-slate-700 font-medium">{teacher.department}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Assigned Sections:</span>
                    <div className="flex flex-wrap gap-1">
                      {teacher.sections.map((sec) => (
                        <span key={sec} className="bg-white text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Joined: {teacher.joinedDate}</span>
                  {onRemoveTeacher && teacher.role !== 'Class Lead' && (
                    <button
                      type="button"
                      onClick={() => {
                        onRemoveTeacher(teacher.id);
                        showToast(`Removed teacher ${teacher.name}`);
                      }}
                      className="text-rose-600 hover:text-rose-700 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: STUDENT LIST (ORGANIZED BY SECTION) */}
      {activeTab === 'students' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700">groups</span>
                <h3 className="text-base font-bold text-slate-900">
                  Student Classroom Roster ({filteredStudents.length} Students)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Students enrolled by the class teacher, organized by section and workstation assignments.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenAddModal('student')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">group_add</span>
              <span>+ Add Student to Section</span>
            </button>
          </div>

          {/* Section Selector Quick Pills */}
          <div className="flex flex-wrap gap-2 pb-2">
            <button
              type="button"
              onClick={() => setSelectedSection('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                selectedSection === 'all'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              All Sections ({students.length})
            </button>

            {availableSections.map((sec) => {
              const secCount = students.filter(s => s.section === sec).length;
              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSelectedSection(sec)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                    selectedSection === sec
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {sec} ({secCount})
                </button>
              );
            })}
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-800 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">Username</th>
                  <th className="p-3.5">Assigned Section</th>
                  <th className="p-3.5">Roll No</th>
                  <th className="p-3.5">Workstation</th>
                  <th className="p-3.5">Attendance</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        {s.avatarUrl ? (
                          <img
                            src={s.avatarUrl}
                            alt={s.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
                            {s.initials || s.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <p className="text-[10px] text-slate-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-emerald-700 font-semibold">@{s.username}</td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-slate-200">
                        {s.section}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">{s.rollNumber}</td>
                    <td className="p-3.5 font-mono text-slate-900 font-bold">{s.workstationId || 'Unassigned'}</td>
                    <td className="p-3.5 font-bold text-slate-900">{s.attendance}</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        On-Task
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onMoveStudentSection && (
                          <select
                            value={s.section}
                            onChange={(e) => {
                              onMoveStudentSection(s.id, e.target.value);
                              showToast(`Moved ${s.name} to ${e.target.value}`);
                            }}
                            className="bg-white border border-slate-300 text-slate-800 rounded-lg px-2 py-1 text-[10px] font-semibold cursor-pointer"
                          >
                            {availableSections.map(sec => (
                              <option key={sec} value={sec}>{sec}</option>
                            ))}
                          </select>
                        )}
                        {onRemoveStudent && (
                          <button
                            type="button"
                            onClick={() => {
                              onRemoveStudent(s.id);
                              showToast(`Removed student ${s.name}`);
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                            title="Remove student"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 5: ADMISSION REQUEST BOX */}
      {activeTab === 'requests' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700">mark_email_unread</span>
                <h3 className="text-base font-bold text-slate-900">Pending Requests & Admission Box</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Review and approve incoming requests from students and teachers wanting to join your classroom.
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 self-start">
              {requests.length} Requests Pending
            </span>
          </div>

          {requests.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="material-symbols-outlined text-4xl text-emerald-600 mb-2">task_alt</span>
              <p className="text-sm font-bold text-slate-800">All requests reviewed!</p>
              <p className="text-xs text-slate-500 mt-1">There are no pending student or teacher requests.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    {req.avatarUrl ? (
                      <img
                        src={req.avatarUrl}
                        alt={req.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center">
                        {req.initials || req.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900">{req.name}</p>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          req.role === 'Co-Teacher'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {req.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">{req.email}</p>
                      <p className="text-[10px] text-slate-400">Requested: {req.requestTime}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {req.role === 'Student' ? (
                      <div className="flex items-center gap-2">
                        <select
                          id={`select-sec-${req.id}`}
                          defaultValue="Section 9-A"
                          className="bg-slate-50 border border-slate-300 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
                        >
                          {availableSections.map(sec => (
                            <option key={sec} value={sec}>{sec}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const sel = document.getElementById(`select-sec-${req.id}`) as HTMLSelectElement;
                            handleApproveWithSection(req, sel ? sel.value : 'Section 9-A');
                          }}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95"
                        >
                          Approve to Section
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApproveWithSection(req, 'Section 9-A')}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95"
                      >
                        Approve as Teacher
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        onRejectRequest(req.id);
                        showToast(`Declined request from ${req.name}`);
                      }}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: GENERATE CUSTOM SHARE LINK */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-slate-900 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl">add_link</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Generate Classroom Share Link</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Create a customized join link for students or fellow teachers.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGenerateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Target Role Selector */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setGenTargetRole('student')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  genTargetRole === 'student'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Link for Students
              </button>
              <button
                type="button"
                onClick={() => setGenTargetRole('teacher')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  genTargetRole === 'teacher'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Link for Teachers
              </button>
            </div>

            <form onSubmit={handleGenerateLink} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Link Name / Purpose</label>
                <input
                  type="text"
                  value={genTitle}
                  onChange={(e) => setGenTitle(e.target.value)}
                  placeholder={genTargetRole === 'student' ? 'e.g. Physics 9-A Spring Enrollment' : 'e.g. Mechanics Faculty Co-Teacher Link'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              {genTargetRole === 'student' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Pre-Assign Section</label>
                    <select
                      value={genSection}
                      onChange={(e) => setGenSection(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none"
                    >
                      {availableSections.map(sec => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Link Expiration</label>
                    <select
                      value={genExpiresIn}
                      onChange={(e) => setGenExpiresIn(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none"
                    >
                      <option value="Never (Active)">Never (Active)</option>
                      <option value="7 Days">7 Days</option>
                      <option value="14 Days">14 Days</option>
                      <option value="30 Days">30 Days</option>
                      <option value="24 Hours">24 Hours</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Teacher Role</label>
                    <select
                      value={genTeacherRole}
                      onChange={(e) => setGenTeacherRole(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none"
                    >
                      <option value="Co-Teacher">Co-Teacher</option>
                      <option value="Subject Specialist">Subject Specialist</option>
                      <option value="Lab Assistant">Lab Assistant</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Subject Theme</label>
                    <input
                      type="text"
                      value={genSubject}
                      onChange={(e) => setGenSubject(e.target.value)}
                      placeholder="e.g. Physics"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Admission Toggle */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <p className="text-xs font-bold text-slate-900">Instant Auto-Enroll</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {genAutoApprove ? 'Anyone with the link joins immediately without waiting.' : 'Submits a request to your Request Box for approval first.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setGenAutoApprove(!genAutoApprove)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    genAutoApprove ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      genAutoApprove ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">link</span>
                  <span>Create & Copy Share Link</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SIMULATE OPENING SHARE LINK AS RECIPIENT */}
      {simulatedLink && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl text-slate-900 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl">person</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-700 block tracking-wider">
                    Join Link Recipient Portal
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{simulatedLink.title}</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSimulatedLink(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="text-slate-600 font-medium">
                You are joining as: <strong className="text-slate-900 uppercase font-bold">{simulatedLink.targetRole}</strong>
              </p>
              {simulatedLink.targetRole === 'student' ? (
                <p className="text-slate-500 font-medium">
                  Target Classroom Section: <strong className="text-emerald-700 font-bold">{simulatedLink.section || 'Section 9-A'}</strong>
                </p>
              ) : (
                <p className="text-slate-500 font-medium">
                  Faculty Role: <strong className="text-emerald-700 font-bold">{simulatedLink.teacherRole || 'Co-Teacher'}</strong> ({simulatedLink.subject || 'Physics'})
                </p>
              )}
            </div>

            <form onSubmit={handleExecuteSimulatedJoin} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Your Full Name</label>
                <input
                  type="text"
                  value={simJoinName}
                  onChange={(e) => setSimJoinName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Create Username (@)</label>
                <input
                  type="text"
                  value={simJoinUsername}
                  onChange={(e) => setSimJoinUsername(e.target.value)}
                  placeholder="e.g. jordan_l"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={simJoinEmail}
                  onChange={(e) => setSimJoinEmail(e.target.value)}
                  placeholder="e.g. jordan.l@student.edu"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              {simulatedLink.targetRole === 'student' && !simulatedLink.section && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Choose Section</label>
                  <select
                    value={simJoinSection}
                    onChange={(e) => setSimJoinSection(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none"
                  >
                    {availableSections.map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSimulatedLink(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">login</span>
                  <span>Confirm & Join Classroom</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DIRECT ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-slate-900 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl">
                    {addMode === 'teacher' ? 'person_add' : 'group_add'}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {addMode === 'teacher' ? 'Add Teacher to Faculty List' : 'Add Student to Section List'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {addMode === 'teacher'
                      ? 'Appoint co-teacher or subject instructor'
                      : 'Enroll student directly into specific class section'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setAddMode('student')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  addMode === 'student'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Add as Student
              </button>
              <button
                type="button"
                onClick={() => setAddMode('teacher')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  addMode === 'teacher'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Add as Teacher
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Alyson Lee"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Username (@)</label>
                  <input
                    type="text"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="e.g. alyson_lee"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="e.g. a.lee@school.edu"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              {addMode === 'teacher' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Teacher Role</label>
                      <select
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none"
                      >
                        <option value="Co-Teacher">Co-Teacher</option>
                        <option value="Subject Specialist">Subject Specialist</option>
                        <option value="Lab Assistant">Lab Assistant</option>
                        <option value="Class Lead">Class Lead</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Subject</label>
                      <input
                        type="text"
                        value={formSubject}
                        onChange={(e) => setFormSubject(e.target.value)}
                        placeholder="e.g. Physics"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Assign Sections</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {availableSections.map(sec => {
                        const isChecked = formSectionsTeacher.includes(sec);
                        return (
                          <button
                            key={sec}
                            type="button"
                            onClick={() => {
                              if (isChecked) {
                                setFormSectionsTeacher(prev => prev.filter(s => s !== sec));
                              } else {
                                setFormSectionsTeacher(prev => [...prev, sec]);
                              }
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-emerald-700 text-white border-emerald-700'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {sec}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Enroll in Section</label>
                    <select
                      value={formSection}
                      onChange={(e) => setFormSection(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none"
                    >
                      {availableSections.map(sec => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">Workstation ID</label>
                    <input
                      type="text"
                      value={formWorkstation}
                      onChange={(e) => setFormWorkstation(e.target.value)}
                      placeholder="e.g. LAB-PC 04"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">check</span>
                  <span>{addMode === 'teacher' ? 'Add Teacher' : 'Add Student'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
