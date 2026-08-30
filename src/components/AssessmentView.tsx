import React, { useState } from 'react';
import { Role } from '../types';

interface Question {
  id: number;
  q: string;
  a: string;
  b: string;
  c: string;
  d: string;
  correct: string;
  explanation?: string;
  points?: number;
}

interface AssessmentItem {
  id: string;
  title: string;
  subject: string;
  cohort: string;
  durationMinutes: number;
  dueDate: string;
  questionsCount: number;
  status: 'published' | 'live' | 'draft';
  submissionsCount: number;
  avgScore: number;
  questions: Question[];
}

interface AssessmentViewProps {
  userRole?: Role;
  userEmail?: string;
}

export default function AssessmentView({ userRole = 'teacher', userEmail }: AssessmentViewProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'library' | 'submissions'>('create');
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Teacher Upload & Create State
  const [newTitle, setNewTitle] = useState('Physics 101 - Kinematics & Projectile Vectors Exam');
  const [newSubject, setNewSubject] = useState('Physics 101');
  const [newCohort, setNewCohort] = useState('Cohort A (Class 9-A)');
  const [newDuration, setNewDuration] = useState(15);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>({
    name: 'Physics_Midterm_Paper_Kinematics_2026.pdf',
    size: '1.4 MB'
  });

  const [questionsList, setQuestionsList] = useState<Question[]>([
    {
      id: 1,
      q: 'A projectile is launched from horizontal ground with angle 30° at initial speed 20 m/s. What is the vertical velocity component (Vy)?',
      a: '10 m/s',
      b: '17.32 m/s',
      c: '20 m/s',
      d: '5 m/s',
      correct: 'a',
      explanation: 'Vy = V0 * sin(30°) = 20 * 0.5 = 10 m/s.',
      points: 5
    },
    {
      id: 2,
      q: 'Which launch angle produces the maximum horizontal range for projectile motion over level ground in vacuum?',
      a: '30°',
      b: '45°',
      c: '60°',
      d: '90°',
      correct: 'b',
      explanation: 'Horizontal range R = (v² * sin(2θ)) / g. The term sin(2θ) is maximized at θ = 45° where sin(90°) = 1.',
      points: 5
    },
    {
      id: 3,
      q: 'What is the horizontal acceleration (Ax) of a projectile when air resistance is neglected?',
      a: '9.8 m/s²',
      b: '-9.8 m/s²',
      c: '0 m/s²',
      d: '4.9 m/s²',
      correct: 'c',
      explanation: 'In the absence of air drag, no horizontal force acts on the body, so Ax = 0.',
      points: 5
    }
  ]);

  // New question form state
  const [customQuestionText, setCustomQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOpt, setCorrectOpt] = useState('a');

  // Existing assessments repository
  const [assessments, setAssessments] = useState<AssessmentItem[]>([
    {
      id: 'kin_midterm',
      title: 'Physics 101 - Kinematics & Projectile Vectors Exam',
      subject: 'Physics 101',
      cohort: 'Class 9-A & Lab 302',
      durationMinutes: 15,
      dueDate: 'Today at 03:00 PM',
      questionsCount: 3,
      status: 'live',
      submissionsCount: 24,
      avgScore: 86,
      questions: questionsList
    },
    {
      id: 'newton_laws',
      title: 'Newtonian Dynamics & Tension Forces Checkpoint',
      subject: 'Physics 101',
      cohort: 'Class 9-A',
      durationMinutes: 20,
      dueDate: 'Tomorrow',
      questionsCount: 5,
      status: 'published',
      submissionsCount: 18,
      avgScore: 91,
      questions: [
        {
          id: 1,
          q: 'According to Newton’s First Law, an object in motion will continue with constant velocity unless acted upon by:',
          a: 'Internal torque',
          b: 'Net external force',
          c: 'Gravitational radiation',
          d: 'Equilibrium normal force',
          correct: 'b',
          points: 5
        }
      ]
    },
    {
      id: 'thermo_quiz',
      title: 'Thermodynamics & Heat Transfer Pop Quiz',
      subject: 'Physics 102',
      cohort: 'Cohort B',
      durationMinutes: 10,
      dueDate: 'In 3 Days',
      questionsCount: 4,
      status: 'draft',
      submissionsCount: 0,
      avgScore: 0,
      questions: []
    }
  ]);

  // Student Submissions Log
  const [studentSubmissions, setStudentSubmissions] = useState([
    { id: 'sub-1', name: 'Alex Mercer', pc: 'LAB-PC 01', exam: 'Kinematics Midterm', score: '10/15 (67%)', timeSpent: '12m 30s', submittedAt: '02:04 PM', status: 'Reviewed' },
    { id: 'sub-2', name: 'Sarah Jenkins', pc: 'LAB-PC 02', exam: 'Kinematics Midterm', score: '15/15 (100%)', timeSpent: '09m 15s', submittedAt: '01:58 PM', status: 'Graded A+' },
    { id: 'sub-3', name: 'Michael Brown', pc: 'LAB-PC 03', exam: 'Kinematics Midterm', score: '15/15 (100%)', timeSpent: '11m 40s', submittedAt: '01:52 PM', status: 'Graded A+' },
    { id: 'sub-4', name: 'Johnathan Cole', pc: 'LAB-PC 04', exam: 'Kinematics Midterm', score: '10/15 (67%)', timeSpent: '14m 10s', submittedAt: '01:45 PM', status: 'Reviewed' },
    { id: 'sub-5', name: 'Elena Rodriguez', pc: 'LAB-PC 05', exam: 'Kinematics Midterm', score: '15/15 (100%)', timeSpent: '08m 50s', submittedAt: '01:40 PM', status: 'Graded A+' }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
      showToast(`Uploaded assessment document: ${file.name}`);
    }
  };

  const handleAddCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestionText.trim() || !optA.trim() || !optB.trim()) {
      showToast('Please provide question text and at least options A & B');
      return;
    }

    const newQ: Question = {
      id: questionsList.length + 1,
      q: customQuestionText.trim(),
      a: optA.trim(),
      b: optB.trim(),
      c: optC.trim() || 'None of the above',
      d: optD.trim() || 'All of the above',
      correct: correctOpt,
      points: 5
    };

    setQuestionsList(prev => [...prev, newQ]);
    setCustomQuestionText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    showToast('Question successfully added to assessment paper!');
  };

  const handlePublishAssessment = () => {
    if (!newTitle.trim()) {
      showToast('Please enter an assessment title.');
      return;
    }

    const createdItem: AssessmentItem = {
      id: `exam-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      cohort: newCohort,
      durationMinutes: newDuration,
      dueDate: 'Today (Live Exam)',
      questionsCount: questionsList.length,
      status: 'live',
      submissionsCount: 0,
      avgScore: 0,
      questions: questionsList
    };

    setAssessments(prev => [createdItem, ...prev]);
    showToast(`Assessment "${newTitle}" published & distributed to ${newCohort}!`);
    setActiveTab('library');
  };

  const handleSelectAnswer = (qId: number, option: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Assessment submitted successfully! Score calculated.');
  };

  // If a specific exam is selected for solving / previewing
  const currentExamObj = assessments.find(a => a.id === selectedExam) || assessments[0];
  const activeQuestions = currentExamObj.questions.length > 0 ? currentExamObj.questions : questionsList;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-600 animate-bounce">
          <span className="material-symbols-outlined">check_circle</span>
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Container Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-slate-900 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
              <span className="material-symbols-outlined text-3xl">assignment_turned_in</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 tracking-tight">
                <span>Teacher Assessment & Exam Upload Studio</span>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs"></span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Upload question papers (PDF/DOCX), build interactive quizzes with automated grading, and push live exams to student workstations.
              </p>
            </div>
          </div>

          {userRole !== 'student' && !selectedExam && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'create'
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-base">cloud_upload</span>
                <span>Upload / Create</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'library'
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-base">folder_open</span>
                <span>Assessments Library ({assessments.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('submissions')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'submissions'
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-base">analytics</span>
                <span>Submissions & Gradebook</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Analytics Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-700 text-2xl">quiz</span>
            <div>
              <span className="text-xl font-bold text-slate-900">{assessments.length}</span>
              <p className="text-[10px] uppercase font-bold text-slate-500">Total Exams</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-600 text-2xl">timelapse</span>
            <div>
              <span className="text-xl font-bold text-slate-900">1 Live</span>
              <p className="text-[10px] uppercase font-bold text-slate-500">Active Test</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-indigo-700 text-2xl">how_to_reg</span>
            <div>
              <span className="text-xl font-bold text-slate-900">42 / 48</span>
              <p className="text-[10px] uppercase font-bold text-slate-500">Submissions</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-teal-700 text-2xl">military_tech</span>
            <div>
              <span className="text-xl font-bold text-slate-900">88.5%</span>
              <p className="text-[10px] uppercase font-bold text-slate-500">Class Average</p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Exam Solver / Preview Mode */}
      {selectedExam ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-slate-900 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-emerald-300">
                Interactive Exam Mode
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1.5">{currentExamObj.title}</h2>
              <p className="text-xs text-slate-500 font-medium">{currentExamObj.subject} • {activeQuestions.length} Questions • {currentExamObj.durationMinutes} Minutes</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedExam(null);
                setSubmitted(false);
                setAnswers({});
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold cursor-pointer transition-all shadow-xs"
            >
              Exit Exam View
            </button>
          </div>

          <form onSubmit={handleExamSubmit} className="space-y-5">
            {activeQuestions.map((q, idx) => (
              <div key={q.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Question {idx + 1} of {activeQuestions.length}</span>
                  <span className="text-xs font-bold text-slate-500">{q.points || 5} Points</span>
                </div>
                <p className="text-sm font-bold text-slate-900 leading-snug">{q.q}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
                  {[
                    { key: 'a', val: q.a },
                    { key: 'b', val: q.b },
                    { key: 'c', val: q.c },
                    { key: 'd', val: q.d }
                  ].map((opt) => {
                    const isChecked = answers[q.id] === opt.key;
                    const isCorrect = q.correct === opt.key;

                    let btnStyle = 'border-slate-200 bg-white hover:bg-slate-100 text-slate-800';
                    if (isChecked) btnStyle = 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold shadow-xs';
                    if (submitted) {
                      if (isCorrect) btnStyle = 'border-emerald-500 bg-emerald-100 text-emerald-900 font-bold';
                      else if (isChecked) btnStyle = 'border-rose-300 bg-rose-50 text-rose-800 font-bold';
                    }

                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, opt.key)}
                        className={`w-full text-left p-3.5 rounded-xl border cursor-pointer transition-all ${btnStyle}`}
                      >
                        <span className="font-bold mr-2 uppercase">{opt.key})</span>
                        <span>{opt.val}</span>
                      </button>
                    );
                  })}
                </div>

                {submitted && q.explanation && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 mt-2">
                    <span className="font-bold text-emerald-950">Explanation: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                {submitted && (
                  <span className="text-sm font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-4 py-2 rounded-xl shadow-xs">
                    Score: {Object.keys(answers).filter(k => answers[Number(k)] === activeQuestions[Number(k) - 1]?.correct).length * 5} / {activeQuestions.length * 5} Points ({Math.round((Object.keys(answers).filter(k => answers[Number(k)] === activeQuestions[Number(k) - 1]?.correct).length / activeQuestions.length) * 100)}%)
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                {submitted ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedExam(null);
                      setSubmitted(false);
                      setAnswers({});
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 border border-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer shadow-sm transition-all"
                  >
                    Back to Assessment Studio
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-800 border border-emerald-800 text-white px-6 py-3 rounded-xl text-xs font-bold cursor-pointer shadow-sm transition-all active:scale-95"
                  >
                    Submit Completed Exam
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* TAB 1: Upload & Create Assessment Workspace */}
          {activeTab === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Upload Document & Configure Exam */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Document Upload Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-slate-900 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <span className="material-symbols-outlined text-emerald-700">upload_file</span>
                    <h3 className="text-sm font-bold uppercase text-slate-800">1. Upload Assessment Paper / File</h3>
                  </div>

                  <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl p-6 text-center transition-all cursor-pointer relative group">
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.json,.csv"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">Drag & drop assessment file here</p>
                      <p className="text-xs text-slate-500 font-medium">Supports PDF question papers, Word DOCX, JSON</p>
                    </div>
                  </div>

                  {uploadedFile && (
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-emerald-700">picture_as_pdf</span>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{uploadedFile.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{uploadedFile.size} • Ready for Distribution</p>
                        </div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                        Uploaded
                      </span>
                    </div>
                  )}
                </div>

                {/* Exam Settings Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-slate-900 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <span className="material-symbols-outlined text-emerald-700">settings</span>
                    <h3 className="text-sm font-bold uppercase text-slate-800">2. Assessment Parameters</h3>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-700 block mb-1">Assessment Title:</label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Physics 101 - Kinematics Exam"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-bold focus:outline-none focus:border-emerald-600 shadow-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold uppercase text-slate-700 block mb-1">Subject:</label>
                        <input
                          type="text"
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-600 shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase text-slate-700 block mb-1">Class / Cohort:</label>
                        <input
                          type="text"
                          value={newCohort}
                          onChange={(e) => setNewCohort(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-600 shadow-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-slate-700 block mb-1">Time Limit:</label>
                      <div className="flex gap-2">
                        {[10, 15, 30, 45, 60].map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => setNewDuration(mins)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              newDuration === mins
                                ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handlePublishAssessment}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3.5 rounded-2xl border border-emerald-800 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 mt-2"
                    >
                      <span className="material-symbols-outlined text-lg">publish</span>
                      <span>Publish & Distribute Assessment</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Question Paper Builder & Preview */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Active Questions Preview */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-slate-900 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-700">checklist</span>
                      <h3 className="text-sm font-bold uppercase text-slate-800">Questions in Paper ({questionsList.length})</h3>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                      Total: {questionsList.length * 5} Marks
                    </span>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {questionsList.map((q, idx) => (
                      <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-900 leading-snug">Q{idx + 1}. {q.q}</span>
                          <button
                            type="button"
                            onClick={() => setQuestionsList(prev => prev.filter(item => item.id !== q.id))}
                            className="text-rose-600 hover:text-rose-700 cursor-pointer shrink-0 p-1 rounded hover:bg-rose-50"
                            title="Delete question"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                          <span className={q.correct === 'a' ? 'font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300' : 'px-2 py-0.5'}>A: {q.a}</span>
                          <span className={q.correct === 'b' ? 'font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300' : 'px-2 py-0.5'}>B: {q.b}</span>
                          <span className={q.correct === 'c' ? 'font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300' : 'px-2 py-0.5'}>C: {q.c}</span>
                          <span className={q.correct === 'd' ? 'font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300' : 'px-2 py-0.5'}>D: {q.d}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Custom Question Form */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-slate-900 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <span className="material-symbols-outlined text-emerald-700">add_circle</span>
                    <h3 className="text-sm font-bold uppercase text-slate-800">Add Question Manually</h3>
                  </div>

                  <form onSubmit={handleAddCustomQuestion} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Enter question text..."
                        value={customQuestionText}
                        onChange={(e) => setCustomQuestionText(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 font-bold focus:outline-none focus:border-emerald-600 shadow-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Option A"
                        value={optA}
                        onChange={(e) => setOptA(e.target.value)}
                        className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Option B"
                        value={optB}
                        onChange={(e) => setOptB(e.target.value)}
                        className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Option C"
                        value={optC}
                        onChange={(e) => setOptC(e.target.value)}
                        className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Option D"
                        value={optD}
                        onChange={(e) => setOptD(e.target.value)}
                        className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-700 font-bold">Correct Key:</span>
                        <select
                          value={correctOpt}
                          onChange={(e) => setCorrectOpt(e.target.value)}
                          className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 uppercase font-bold"
                        >
                          <option value="a">A</option>
                          <option value="b">B</option>
                          <option value="c">C</option>
                          <option value="d">D</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold border border-emerald-800 cursor-pointer transition-all shadow-sm"
                      >
                        + Insert Question
                      </button>
                    </div>
                  </form>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: Assessments Library */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {assessments.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-slate-900 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                          exam.status === 'live'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}>
                          {exam.status === 'live' ? '● Live Exam' : 'Published'}
                        </span>
                        <span className="text-xs text-slate-500 font-mono font-bold">{exam.durationMinutes} Mins</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug">{exam.title}</h3>
                      <p className="text-xs text-slate-500">{exam.subject} • {exam.cohort}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Questions: <strong className="text-slate-900">{exam.questionsCount}</strong></span>
                        <span>Submissions: <strong className="text-slate-900">{exam.submissionsCount}</strong></span>
                        <span>Avg: <strong className="text-emerald-700">{exam.avgScore}%</strong></span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedExam(exam.id);
                            setAnswers({});
                            setSubmitted(false);
                          }}
                          className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-xl text-xs font-bold border border-emerald-800 shadow-sm cursor-pointer transition-all"
                        >
                          Preview / Solve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Student Submissions Log & Gradebook */}
          {activeTab === 'submissions' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-slate-900 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Live Student Submissions Gradebook</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time response logs and automated grading for pushed assessments.</p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Submissions exported to CSV gradebook!')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>Export Gradebook</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Student</th>
                      <th className="p-3">Workstation</th>
                      <th className="p-3">Assessment</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">Time Spent</th>
                      <th className="p-3">Submitted At</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{sub.name}</td>
                        <td className="p-3 font-mono text-indigo-700 font-medium">{sub.pc}</td>
                        <td className="p-3 text-slate-700">{sub.exam}</td>
                        <td className="p-3 font-bold text-emerald-800">{sub.score}</td>
                        <td className="p-3 text-slate-600">{sub.timeSpent}</td>
                        <td className="p-3 text-slate-500">{sub.submittedAt}</td>
                        <td className="p-3">
                          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-300">
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
