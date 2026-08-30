import React, { useState } from 'react';
import { ClassInfo, StudentRequest, StudentMember, TeacherMember } from '../types';

interface TeacherDashboardProps {
  classes: ClassInfo[];
  requests: StudentRequest[];
  students?: StudentMember[];
  teachers?: TeacherMember[];
  onApproveRequest: (id: string, targetSection?: string, targetClassId?: string) => void;
  onRejectRequest: (id: string) => void;
  onCreateClass: (newClass: Omit<ClassInfo, 'id' | 'studentsCount' | 'pendingCount'>) => void;
  onNavigateToPeople?: () => void;
}

export default function TeacherDashboard({
  classes,
  requests,
  students = [],
  teachers = [],
  onApproveRequest,
  onRejectRequest,
  onCreateClass,
  onNavigateToPeople
}: TeacherDashboardProps) {
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showClassListModal, setShowClassListModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Approval with Class Assignment Modal State
  const [approvingRequest, setApprovingRequest] = useState<StudentRequest | null>(null);
  const [targetClassId, setTargetClassId] = useState<string>(classes[0]?.id || '');
  const [targetSection, setTargetSection] = useState<string>('Section 9-A');

  // Class creator state
  const [newClassName, setNewClassName] = useState('');
  const [newClassCode, setNewClassCode] = useState('');
  const [newClassSubject, setNewClassSubject] = useState('Physics');
  const [newClassDesc, setNewClassDesc] = useState('');

  const activeClass = classes[selectedClassIndex] || classes[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyCode = () => {
    if (!activeClass) return;
    navigator.clipboard.writeText(activeClass.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    if (!activeClass) return;
    navigator.clipboard.writeText(activeClass.shareLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const generatedCode = `CLS-${Math.floor(100 + Math.random() * 900)}`;
    
    onCreateClass({
      name: newClassName.trim(),
      code: newClassCode.trim() || generatedCode,
      shareLink: `https://smartclass.edu/join/${(newClassCode || generatedCode).toLowerCase()}-xyz`,
      subject: newClassSubject || 'General',
      cohort: 'Cohort A',
      description: newClassDesc || 'Core academic syllabus module.'
    });

    // Reset and close
    setNewClassName('');
    setNewClassCode('');
    setNewClassDesc('');
    setShowCreateModal(false);
    showToast(`Created class "${newClassName.trim()}"!`);
  };

  // Trigger Approval Modal
  const handleOpenApproveModal = (req: StudentRequest) => {
    setApprovingRequest(req);
    setTargetClassId(activeClass?.id || classes[0]?.id || '');
    setTargetSection('Section 9-A');
  };

  // Submit Approval and Assign to Selected Class
  const handleConfirmApproval = () => {
    if (!approvingRequest) return;
    
    const chosenClass = classes.find(c => c.id === targetClassId) || activeClass;
    onApproveRequest(approvingRequest.id, targetSection, targetClassId);
    
    showToast(`Approved ${approvingRequest.name} into ${chosenClass?.name || 'Class'} (${targetSection})!`);
    
    setApprovingRequest(null);
    // Show List of Classes view so teacher sees the updated classes
    setShowClassListModal(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce">
          <span className="material-symbols-outlined">check_circle</span>
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Dashboard Section Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Classroom Management</h2>
          <p className="text-sm text-slate-600 mt-1">Manage enrollments, approve student admissions, and view active classes.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {onNavigateToPeople && (
            <>
              <button
                type="button"
                onClick={onNavigateToPeople}
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 border border-emerald-600"
              >
                <span className="material-symbols-outlined text-base">link</span>
                <span>Invite Link Generator</span>
              </button>

              <button
                type="button"
                onClick={onNavigateToPeople}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-900 hover:bg-slate-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 border border-slate-300"
              >
                <span className="material-symbols-outlined text-base">person_search</span>
                <span>Search People</span>
              </button>
            </>
          )}

          {/* Create Class trigger button */}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm scale-100 active:scale-95"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Create Class</span>
          </button>
        </div>
      </header>

      {/* Select Active Class Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Classroom:</span>
          <select
            className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600"
            value={selectedClassIndex}
            onChange={(e) => setSelectedClassIndex(Number(e.target.value))}
          >
            {classes.map((c, i) => (
              <option key={c.id} value={i} className="bg-white text-slate-900">
                {c.name} • {c.subject} ({c.studentsCount} Students)
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setShowClassListModal(true)}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">apps</span>
          <span>Show Full List of Classes ({classes.length})</span>
        </button>
      </div>

      {/* Main Grid: Overview Card & Pending Requests Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Class Overview Card */}
        <div className="xl:col-span-1 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm">
          <div className="bg-slate-50 p-6 border-b border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded text-[10px] font-bold uppercase tracking-wider mb-2">
                  Active Class
                </span>
                <h3 className="text-xl font-bold text-slate-900">{activeClass?.name}</h3>
                <p className="text-xs text-slate-600 font-medium">{activeClass?.subject} • {activeClass?.cohort}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowClassListModal(true)}
                className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                title="View in Class List"
              >
                <span className="material-symbols-outlined text-sm">visibility</span>
                <span>All Classes</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{activeClass?.description}</p>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Class Code Row */}
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block mb-2">
                  Class Join Code
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-2.5 px-3 flex justify-between items-center">
                    <span className="font-mono text-sm font-bold text-slate-900">{activeClass?.code}</span>
                    <span className="text-[10px] text-slate-500 font-medium">Alpha-numeric</span>
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="p-2.5 border border-slate-300 bg-white rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors text-slate-600 cursor-pointer relative shadow-sm"
                      title="Copy Class Code"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {copiedCode ? 'check' : 'content_copy'}
                      </span>
                    </button>
                    {copiedCode && (
                      <span className="absolute -top-7 right-3 bg-emerald-700 text-white text-[10px] px-2 py-0.5 rounded shadow animate-bounce">
                        Copied!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Shareable Link Row */}
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block mb-2">
                  Shareable Link
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-2.5 px-3 overflow-hidden text-ellipsis">
                    <p className="text-xs text-slate-700 truncate font-mono">{activeClass?.shareLink}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="p-2.5 border border-slate-300 bg-white rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors text-slate-600 cursor-pointer relative shadow-sm"
                    title="Share Link"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {copiedLink ? 'check_circle' : 'share'}
                    </span>
                    {copiedLink && (
                      <span className="absolute -top-7 right-0 bg-emerald-700 text-white text-[10px] px-2 py-0.5 rounded shadow animate-bounce">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Counts Row */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Students Joined</p>
                <p className="text-3xl font-extrabold text-slate-900">{activeClass?.studentsCount}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Pending Invites</p>
                <p className={`text-3xl font-extrabold ${activeClass?.pendingCount > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                  {activeClass?.pendingCount}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Pending Requests Table Panel */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm">
          <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pending Admission Requests</h3>
              <p className="text-xs text-slate-500 mt-0.5">Click Approve to select target class and enroll student/teacher.</p>
            </div>
            <span className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-bold border border-rose-200">
              {requests.length} Needs Action
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            {requests.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-2 text-emerald-600">verified</span>
                <p className="text-sm font-semibold text-slate-800">No pending requests!</p>
                <p className="text-xs text-slate-500 mt-1">All student enrollments are currently up to date.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      Student / Teacher Name
                    </th>
                    <th className="p-4 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="p-4 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      Request Time
                    </th>
                    <th className="p-4 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {req.avatarUrl ? (
                            <img
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                              src={req.avatarUrl}
                              alt={req.name}
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                              {req.initials || req.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-bold text-slate-900">{req.name}</p>
                            <p className="text-[10px] text-slate-500">{req.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          req.role === 'Co-Teacher' 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {req.role}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-600">{req.requestTime}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onRejectRequest(req.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Reject"
                          >
                            <span className="material-symbols-outlined text-lg">close</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenApproveModal(req)}
                            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1 active:scale-95"
                          >
                            <span className="material-symbols-outlined text-sm">check</span>
                            <span>Approve</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
            <span className="text-xs text-slate-500">Approved members join their selected class and section roster.</span>
            <button
              type="button"
              onClick={() => setShowClassListModal(true)}
              className="text-emerald-800 hover:text-emerald-900 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View List of Classes</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

      </div>

      {/* MODAL 1: APPROVE & ASSIGN TO CLASS MODAL */}
      {approvingRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-6 animate-scale-up">
            
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Admission Approval Workflow
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  Select Class to Add {approvingRequest.name}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Choose which class and section to enroll this {approvingRequest.role.toLowerCase()} into.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setApprovingRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Candidate Card */}
            <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
              {approvingRequest.avatarUrl ? (
                <img
                  src={approvingRequest.avatarUrl}
                  alt={approvingRequest.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-600"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-sm">
                  {approvingRequest.initials || approvingRequest.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{approvingRequest.name}</p>
                <p className="text-xs text-slate-500 truncate">{approvingRequest.email}</p>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full">
                {approvingRequest.role}
              </span>
            </div>

            {/* STEP 1: Select Target Class */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center justify-between">
                <span>1. Select Class to Add In ({classes.length} Available):</span>
                <span className="text-[10px] text-emerald-700 font-normal">Click to choose</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-52 overflow-y-auto pr-1">
                {classes.map((cls) => {
                  const isSelected = targetClassId === cls.id;
                  return (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => setTargetClassId(cls.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className={`text-xs font-bold ${isSelected ? 'text-emerald-950' : 'text-slate-900'}`}>
                          {cls.name}
                        </h4>
                        {isSelected && (
                          <span className="material-symbols-outlined text-emerald-700 text-base">check_circle</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 font-medium">{cls.subject} • {cls.cohort}</p>
                      <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-200/60 text-[10px]">
                        <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700">{cls.code}</code>
                        <span className="font-bold text-slate-700">{cls.studentsCount} Students</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Assign Section */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                2. Assign Section / Cohort:
              </label>
              <select
                value={targetSection}
                onChange={(e) => setTargetSection(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
              >
                <option value="Section 9-A">Section 9-A (Physics & Mechanics)</option>
                <option value="Section 9-B">Section 9-B (Advanced STEM)</option>
                <option value="Section 10-A">Section 10-A (Quantum Physics)</option>
                <option value="Lab Cohort 302">Lab Cohort 302 (Experimental Science)</option>
              </select>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setApprovingRequest(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-base">person_add</span>
                <span>Confirm & Add to Class</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: LIST OF CLASSES / ALL CLASSES DIRECTORY */}
      {showClassListModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 animate-scale-up">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow">
                  <span className="material-symbols-outlined text-2xl">format_list_bulleted</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">List of All Classes ({classes.length})</h3>
                  <p className="text-xs text-slate-600">Explore class rosters, join codes, enrolled students, and manage classroom sections.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowClassListModal(false);
                    setShowCreateModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>+ Create Class</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowClassListModal(false)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 cursor-pointer rounded-lg"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>
            </div>

            {/* List of Classes Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map((cls, idx) => {
                const isCurrentActive = cls.id === activeClass?.id;
                // Students belonging to this class section
                const classStudents = students.filter(s => 
                  s.section.toLowerCase().includes(cls.cohort.toLowerCase()) || 
                  (cls.name.includes('9-A') && s.section === 'Section 9-A') ||
                  (cls.name.includes('101') && (s.section === 'Section 9-B' || s.section === 'Section 10-A'))
                );

                return (
                  <div
                    key={cls.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-sm ${
                      isCurrentActive
                        ? 'bg-emerald-50/50 border-emerald-500 shadow-md ring-1 ring-emerald-400/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-900">{cls.name}</h4>
                            {isCurrentActive && (
                              <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 font-medium">{cls.subject} • {cls.cohort}</p>
                        </div>
                        <span className="bg-slate-100 text-slate-700 font-mono text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                          {cls.code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">{cls.description}</p>
                    </div>

                    {/* Class Stats & Share */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">Enrolled Students:</span>
                        <strong className="text-slate-900 font-bold">{cls.studentsCount} Students</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">Pending Requests:</span>
                        <span className={`font-bold ${cls.pendingCount > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                          {cls.pendingCount} Pending
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 truncate max-w-[200px] font-mono">{cls.shareLink}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(cls.shareLink);
                            showToast(`Copied ${cls.name} share link!`);
                          }}
                          className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span className="material-symbols-outlined text-xs">content_copy</span>
                          <span>Copy Link</span>
                        </button>
                      </div>
                    </div>

                    {/* Roster preview if students exist */}
                    {classStudents.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Sample Enrolled Roster ({classStudents.length} Students):
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {classStudents.slice(0, 4).map(st => (
                            <span key={st.id} className="bg-white border border-slate-200 text-slate-800 text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                              <span>{st.name}</span>
                              <span className="text-emerald-700 font-mono text-[9px]">@{st.username}</span>
                            </span>
                          ))}
                          {classStudents.length > 4 && (
                            <span className="text-[10px] text-slate-500 font-bold self-center">
                              +{classStudents.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedClassIndex(idx);
                          setShowClassListModal(false);
                          showToast(`Switched active view to ${cls.name}`);
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isCurrentActive
                            ? 'bg-slate-200 text-slate-700 cursor-default'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {isCurrentActive ? 'check' : 'visibility'}
                        </span>
                        <span>{isCurrentActive ? 'Currently Selected' : 'Set as Active Class'}</span>
                      </button>

                      {onNavigateToPeople && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowClassListModal(false);
                            onNavigateToPeople();
                          }}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 cursor-pointer transition-colors"
                          title="Open People Directory"
                        >
                          <span className="material-symbols-outlined text-base">group</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowClassListModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow"
              >
                Done Viewing Classes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CREATE CLASS MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 animate-scale-up">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Create New Class</h3>
                <p className="text-xs text-slate-600 mt-0.5">Initialize a new classroom syllabus and section.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Class Name Title</label>
                <input
                  type="text"
                  placeholder="e.g. Advanced Physics & Mechanics"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Description Overview</label>
                <textarea
                  placeholder="Briefly describe the syllabus, prerequisites, and learning objectives..."
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl p-2.5 text-xs h-24 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
                  value={newClassDesc}
                  onChange={(e) => setNewClassDesc(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-bold transition-colors shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <span className="material-symbols-outlined text-base">check</span>
                  <span>Create Class</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
