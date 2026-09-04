import React, { useState } from 'react';
import { Role, UserProfile } from '../types';

interface LoginProps {
  onLogin: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
}

// Preset taken usernames for availability check simulation
const TAKEN_USERNAMES = ['admin', 'administrator', 'root', 'support', 'system', 'smartclass_official'];

export default function Login({ onLogin, initialProfile }: LoginProps) {
  // Onboarding Step State: 'auth' | 'profession' | 'questionnaire'
  const [step, setStep] = useState<'auth' | 'profession' | 'questionnaire'>('auth');
  
  // Auth Tab: 'email' | 'phone'
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [isSignUp, setIsSignUp] = useState<boolean>(true);

  // Form Fields - Credentials
  const [fullName, setFullName] = useState<string>(initialProfile?.name || '');
  const [email, setEmail] = useState<string>(initialProfile?.email || 'alex.davis@smartclass.edu');
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [phoneNumber, setPhoneNumber] = useState<string>(initialProfile?.phoneNumber || '');
  const [password, setPassword] = useState<string>('••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Forgot Password Modal State
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [resetSent, setResetSent] = useState<boolean>(false);

  // Profession & Profile State
  const [selectedRole, setSelectedRole] = useState<Role>(initialProfile?.role || 'teacher');
  const [username, setUsername] = useState<string>(initialProfile?.username || '');
  const [schoolName, setSchoolName] = useState<string>(initialProfile?.schoolName || '');
  
  // Teacher Questionnaire
  const [teacherSubject, setTeacherSubject] = useState<string>(
    initialProfile?.subject || 'Physics & Science'
  );
  const [teacherDept, setTeacherDept] = useState<string>(
    initialProfile?.department || 'Senior High School (10-12)'
  );

  // Student Questionnaire
  const [studentClass, setStudentClass] = useState<string>(
    initialProfile?.className || 'Class 10-A'
  );
  const [studentStream, setStudentStream] = useState<string>(
    initialProfile?.stream || 'Science & Mathematics'
  );
  const [studentRollNo, setStudentRollNo] = useState<string>(
    initialProfile?.rollNumber || 'STU-2026-104'
  );

  // Username validation state
  const [usernameError, setUsernameError] = useState<string>('');
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true);

  // Auto generate default username when name or email changes if empty
  const handleNameChange = (val: string) => {
    setFullName(val);

    if (!username || username === 'alex_teacher' || username === 'sam_student') {
      const slug = val
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .substring(0, 15);

      if (slug.length >= 3) {
        setUsername(slug);
        checkUsernameAvailability(slug);
      }
    }
  };

  const checkUsernameAvailability = (uname: string) => {
    const clean = uname.trim().toLowerCase().replace(/^@/, '');

    if (clean.length < 3) {
      setUsernameError('Username must be at least 3 characters long');
      setIsUsernameValid(false);
      return false;
    }

    if (TAKEN_USERNAMES.includes(clean)) {
      setUsernameError(
        'This username is already taken. Try adding numbers or underscore.'
      );
      setIsUsernameValid(false);
      return false;
    }

    setUsernameError('');
    setIsUsernameValid(true);
    return true;
  };

  const handleUsernameInput = (val: string) => {
    const clean = val.replace(/[^a-zA-Z0-9_]/g, '');
    setUsername(clean);
    checkUsernameAvailability(clean);
  };

  // Step 1: Handle Auth Submit
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName) {
      setFullName(
        authMethod === 'email'
          ? email.split('@')[0]
          : 'User ' + phoneNumber.slice(-4)
      );
    }

    if (!isSignUp) {
      const isStudent = email.toLowerCase().includes('student');
      const role: Role = selectedRole || (isStudent ? 'student' : 'teacher');
      const finalName = fullName || (role === 'student' ? 'Sam Wilson' : 'Alex Davis');
      const handle = username || (role === 'student' ? 'student_sam' : 'prof_alex');
      const cleanHandle = handle.startsWith('@') ? handle : `@${handle}`;

      onLogin({
        name: finalName,
        email: authMethod === 'email' ? email : `${handle}@smartclass.edu`,
        phoneNumber: authMethod === 'phone' ? phoneNumber : undefined,
        role: role,
        username: cleanHandle,
        schoolName: role === 'student' ? 'St. Jude Higher Secondary School' : 'Oakridge International Academy',
        avatarUrl: role === 'teacher'
          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPOjiU14tOgS2jpo3upnRKq1lcpfAl6j_4aw0HQOW0O6h4p9tnqdnlIACxwrSBj3O8JjWW5zVPCO6Ud71Ch-LlpeqXX2UcVeJEr4tkj7zXxymbyRuDzya0r6X2uPiR5ClRmJcloUAiZ80UfyI47RMFSCQU55X309z3gZKNlVDAdZEQCzN0If4hYJGkYyswcFqvvXxTZFOQrXA8D8MBO8fKyGWh3N3l6G80t0TM5kdy2NftnteLtAku'
          : 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-kQSlCd97Tlg8QSDHhUG7XdHnFSRLr9Rgy--F06lAWqZTzvKM5976QW0YicB2t5mkTGpg_vViRnNGqD7CImDAUgLvcUB2lEyqxNOBvAo8J9RKlH8-DFWA2y5ZFDGU5oY3Cze0nWYZtw8B9TJ7U_VvrM3PAwhJzPPh56y8g28K1KNJIYyWxiCVF_yK3KDpQCSLGhr5fyYyCYDs-q0AArE6izZ4PgyD4AedItmTPuSZ2b0jDzqTrlRq',
        subject: role === 'teacher' ? (teacherSubject || 'Physics & Science') : undefined,
        department: role === 'teacher' ? (teacherDept || 'Senior High School (10-12)') : undefined,
        className: role === 'student' ? (studentClass || 'Class 10-A') : undefined,
        stream: role === 'student' ? (studentStream || 'Science & Mathematics') : undefined,
        rollNumber: role === 'student' ? (studentRollNo || 'STU-2026-104') : undefined
      });
      return;
    }

    setStep('profession');
  };

  // Social Login Handler
  const handleSocialLogin = (
    provider: 'google' | 'microsoft' | 'apple'
  ) => {
    if (provider === 'google') {
      setFullName('Alex Davis');
      setEmail('alex.davis@gmail.com');

      if (!username) {
        setUsername('alex_davis');
      }
    } else if (provider === 'microsoft') {
      setFullName('Jordan Smith');
      setEmail('jordan.smith@outlook.com');

      if (!username) {
        setUsername('jordan_smith');
      }
    } else {
      setFullName('Sam Taylor');
      setEmail('sam.taylor@icloud.com');

      if (!username) {
        setUsername('sam_taylor');
      }
    }

    setStep('profession');
  };

  // Step 2: Handle Profession Selection
  const handleSelectProfession = (role: Role) => {
    setSelectedRole(role);

    if (role === 'teacher') {
      if (!schoolName) {
        setSchoolName('Oakridge International Academy');
      }

      if (!username) {
        const u = fullName
          ? fullName.toLowerCase().replace(/[^a-z0-9_]/g, '_')
          : 'prof_alex';

        setUsername(u);
        checkUsernameAvailability(u);
      }
    } else {
      if (!schoolName) {
        setSchoolName('St. Jude Higher Secondary School');
      }

      if (!username) {
        const u = fullName
          ? fullName.toLowerCase().replace(/[^a-z0-9_]/g, '_')
          : 'student_sam';

        setUsername(u);
        checkUsernameAvailability(u);
      }
    }

    setStep('questionnaire');
  };

  // Step 3: Final Onboarding Submission
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalUsername =
      username.trim().toLowerCase().replace(/^@/, '') ||
      (selectedRole === 'teacher' ? 'teacher_user' : 'student_user');

    if (!checkUsernameAvailability(finalUsername)) {
      return;
    }

    const userProfile: UserProfile = {
      name:
        fullName ||
        (selectedRole === 'teacher' ? 'Alex Davis' : 'Sam Wilson'),

      email:
        authMethod === 'email'
          ? email
          : `${phoneNumber.replace(/\D/g, '')}@phone.smartclass.edu`,

      phoneNumber:
        authMethod === 'phone'
          ? `${countryCode} ${phoneNumber}`
          : undefined,

      username: `@${finalUsername}`,

      role: selectedRole,

      schoolName:
        schoolName || 'Smart Classroom Institute',

      subject:
        selectedRole === 'teacher'
          ? teacherSubject
          : undefined,

      department:
        selectedRole === 'teacher'
          ? teacherDept
          : undefined,

      className:
        selectedRole === 'student'
          ? studentClass
          : undefined,

      stream:
        selectedRole === 'student'
          ? studentStream
          : undefined,

      rollNumber:
        selectedRole === 'student'
          ? studentRollNo
          : undefined,

      avatarUrl:
        selectedRole === 'teacher'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',

      initials: (fullName || 'User')
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2),

      isFirstTime: false
    };

    onLogin(userProfile);
  };

  // Forgot Password Action
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setResetSent(true);

    setTimeout(() => {
      setResetSent(false);
      setIsForgotPasswordOpen(false);
      setResetEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">

        {/* =====================================================
            LEFT BRANDING PANEL
            ===================================================== */}

        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">

          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-8">

            {/* Header Brand Badge */}
            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-lg shadow-emerald-600/30">
                <span className="material-symbols-outlined text-4xl">
                  school
                </span>
              </div>

              <div>
                {/* CHANGED TO WHITE */}
                <h1 className="text-3xl font-black tracking-tight !text-white drop-shadow-md">
                  Smart Classroom
                </h1>

                <p className="text-sm text-white font-extrabold tracking-widest uppercase mt-1">
                  Next-Gen Education
                </p>
              </div>

            </div>

            {/* Dynamic Intro based on step */}
            <div className="space-y-4 pt-8">

              {/* AUTH */}
              {step === 'auth' && (
                <>
                  {/* CHANGED TO WHITE */}
                  <h2 className="text-4xl font-extrabold !text-white leading-snug drop-shadow-md">
                    Welcome to Your Digital Learning Hub
                  </h2>

                  <p className="text-base text-white leading-relaxed font-medium">
                    Access real-time analytics, concept graphs, live classroom
                    monitors, and seamless teacher-student collaboration.
                  </p>
                </>
              )}

              {/* PROFESSION */}
              {step === 'profession' && (
                <>
                  {/* CHANGED TO WHITE */}
                  <h2 className="text-4xl font-extrabold !text-white leading-snug drop-shadow-md">
                    Select Your Academic Role
                  </h2>

                  <p className="text-base text-white leading-relaxed font-medium">
                    Customized tools and dashboards tailored specifically for
                    educators or students.
                  </p>
                </>
              )}

              {/* QUESTIONNAIRE */}
              {step === 'questionnaire' && (
                <>
                  {/* CHANGED TO WHITE */}
                  <h2 className="text-4xl font-extrabold !text-white leading-snug drop-shadow-md">
                    Complete Your Profile & Handle
                  </h2>

                  <p className="text-base text-white leading-relaxed font-medium">
                    Create your unique username handle (@username) and link
                    your institutional details for class identification.
                  </p>
                </>
              )}

            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="relative z-10 pt-10 border-t border-slate-700/60">

            <div className="flex items-center justify-between text-sm font-bold text-slate-300 mb-3">

              <span
                className={
                  step === 'auth'
                    ? 'text-emerald-300 font-extrabold drop-shadow'
                    : 'text-slate-200'
                }
              >
                1. Account
              </span>

              <span
                className={
                  step === 'profession'
                    ? 'text-emerald-300 font-extrabold drop-shadow'
                    : 'text-slate-200'
                }
              >
                2. Role
              </span>

              <span
                className={
                  step === 'questionnaire'
                    ? 'text-emerald-300 font-extrabold drop-shadow'
                    : 'text-slate-200'
                }
              >
                3. Details
              </span>

            </div>

            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden flex">

              <div
                className={`h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] ${
                  step === 'auth'
                    ? 'w-1/3'
                    : step === 'profession'
                    ? 'w-2/3'
                    : 'w-full'
                }`}
              ></div>

            </div>

          </div>

        </div>

        {/* =====================================================
            RIGHT INTERACTIVE FORM AREA
            ===================================================== */}

        <div className="lg:col-span-7 p-6 md:p-10 flex flex-col justify-center bg-white">

          {/* ===================================================
              STEP 1: AUTHENTICATION
              =================================================== */}

          {step === 'auth' && (
            <div className="space-y-6 animate-fade-in max-w-md mx-auto w-full">

              <div className="flex justify-between items-center border-b border-slate-200 pb-4">

                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {isSignUp
                      ? 'Create New Account'
                      : 'Sign In to Smart Classroom'}
                  </h2>

                  <p className="text-xs text-slate-600 mt-0.5">
                    Enter your details or continue with social login.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 cursor-pointer"
                >
                  {isSignUp
                    ? 'Already have an account? Sign In'
                    : 'New here? Sign Up'}
                </button>

              </div>

              {/* Social Login Buttons */}
              <div className="space-y-2.5">

                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
                  Fast One-Click Sign In
                </span>

                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 py-2.5 px-4 rounded-xl text-xs font-bold shadow-sm transition-all hover:bg-slate-50 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>

                  <span>Continue with Google</span>
                </button>

                <div className="grid grid-cols-2 gap-2">

                  {/* Microsoft */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('microsoft')}
                    className="flex items-center justify-center gap-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 py-2 px-3 rounded-xl text-xs font-semibold shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z" />
                      <path fill="#81bc06" d="M12 1h10v10H12z" />
                      <path fill="#05a6f0" d="M1 12h10v10H1z" />
                      <path fill="#ffba08" d="M12 12h10v10H12z" />
                    </svg>

                    <span>Microsoft</span>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('apple')}
                    className="flex items-center justify-center gap-2 bg-slate-900 text-white py-2 px-3 rounded-xl text-xs font-semibold shadow-sm hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      apple
                    </span>

                    <span>Apple ID</span>
                  </button>

                </div>

              </div>

              {/* OR Divider */}
              <div className="relative flex items-center justify-center my-4">

                <div className="border-t border-slate-200 w-full"></div>

                <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest absolute">
                  OR USE CREDENTIALS
                </span>

              </div>

              {/* Method Switcher */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">

                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authMethod === 'email'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    mail
                  </span>

                  <span>Email Address</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authMethod === 'phone'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    smartphone
                  </span>

                  <span>Phone Number</span>
                </button>

              </div>

              {/* Main Auth Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">

                {isSignUp && (
                  <div className="space-y-1">

                    <label className="text-xs font-bold text-slate-700 block">
                      Full Name
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Alex Davis"
                      value={fullName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      required
                    />

                  </div>
                )}

                {authMethod === 'email' ? (
                  <div className="space-y-1">

                    <label className="text-xs font-bold text-slate-700 block">
                      Gmail / School Email
                    </label>

                    <input
                      type="email"
                      placeholder="name@school.edu or gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      required
                    />

                  </div>
                ) : (
                  <div className="space-y-1">

                    <label className="text-xs font-bold text-slate-700 block">
                      Mobile Phone Number
                    </label>

                    <div className="flex gap-2">

                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                      >
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+61">🇦🇺 +61</option>
                        <option value="+81">🇯🇵 +81</option>
                      </select>

                      <input
                        type="tel"
                        placeholder="(555) 000-1234"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                        required
                      />

                    </div>

                  </div>
                )}

                {/* Password */}
                <div className="space-y-1">

                  <div className="flex justify-between items-center">

                    <label className="text-xs font-bold text-slate-700">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(true)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>

                  </div>

                  <div className="relative">

                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 pr-10 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword
                          ? 'visibility'
                          : 'visibility_off'}
                      </span>
                    </button>

                  </div>

                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>
                    {isSignUp
                      ? 'Continue to Profession Selection'
                      : 'Sign In & Enter'}
                  </span>

                  <span className="material-symbols-outlined text-base">
                    arrow_forward
                  </span>
                </button>

                {/* Quick 1-Click Demo Logins */}
                <div className="pt-3 border-t border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                    Quick Demo Access
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onLogin({
                        name: 'Alex Davis',
                        email: 'alex.davis@smartclass.edu',
                        role: 'teacher',
                        username: '@prof_alex',
                        schoolName: 'Oakridge International Academy',
                        subject: 'Physics & Science',
                        department: 'Senior High School (10-12)',
                        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPOjiU14tOgS2jpo3upnRKq1lcpfAl6j_4aw0HQOW0O6h4p9tnqdnlIACxwrSBj3O8JjWW5zVPCO6Ud71Ch-LlpeqXX2UcVeJEr4tkj7zXxymbyRuDzya0r6X2uPiR5ClRmJcloUAiZ80UfyI47RMFSCQU55X309z3gZKNlVDAdZEQCzN0If4hYJGkYyswcFqvvXxTZFOQrXA8D8MBO8fKyGWh3N3l6G80t0TM5kdy2NftnteLtAku'
                      })}
                      className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">local_library</span>
                      <span>Teacher Demo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onLogin({
                        name: 'Sam Wilson',
                        email: 'sam.wilson@student.edu',
                        role: 'student',
                        username: '@student_sam',
                        schoolName: 'St. Jude Higher Secondary School',
                        className: 'Class 10-A',
                        stream: 'Science & Mathematics',
                        rollNumber: 'STU-2026-104',
                        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-kQSlCd97Tlg8QSDHhUG7XdHnFSRLr9Rgy--F06lAWqZTzvKM5976QW0YicB2t5mkTGpg_vViRnNGqD7CImDAUgLvcUB2lEyqxNOBvAo8J9RKlH8-DFWA2y5ZFDGU5oY3Cze0nWYZtw8B9TJ7U_VvrM3PAwhJzPPh56y8g28K1KNJIYyWxiCVF_yK3KDpQCSLGhr5fyYyCYDs-q0AArE6izZ4PgyD4AedItmTPuSZ2b0jDzqTrlRq'
                      })}
                      className="py-2 px-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-indigo-800 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">school</span>
                      <span>Student Demo</span>
                    </button>
                  </div>
                </div>

              </form>

            </div>
          )}

          {/* ===================================================
              STEP 2: PROFESSION / ROLE SELECTION
              =================================================== */}

          {step === 'profession' && (
            <div className="space-y-6 animate-fade-in max-w-md mx-auto w-full">

              <div className="border-b border-slate-200 pb-3">

                <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest block mb-1">
                  Step 2 of 3
                </span>

                <h2 className="text-xl font-extrabold text-slate-900">
                  Select Your Academic Profession
                </h2>

                <p className="text-xs text-slate-600">
                  Choose how you will be using Smart Classroom.
                </p>

              </div>

              <div className="grid grid-cols-1 gap-4">

                {/* Teacher Option */}
                <button
                  type="button"
                  onClick={() => handleSelectProfession('teacher')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-4 ${
                    selectedRole === 'teacher'
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-md'
                      : 'border-slate-200 hover:border-emerald-500 hover:bg-slate-50'
                  }`}
                >

                  <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">

                    <span className="material-symbols-outlined text-2xl">
                      local_library
                    </span>

                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <h3 className="text-base font-extrabold text-slate-900">
                        Teacher / Educator
                      </h3>

                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Full Control
                      </span>

                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Manage cohorts, create syllabus modules, monitor live
                      student engagement, and review diagnostic radars.
                    </p>

                  </div>

                </button>

                {/* Student Option */}
                <button
                  type="button"
                  onClick={() => handleSelectProfession('student')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-4 ${
                    selectedRole === 'student'
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-md'
                      : 'border-slate-200 hover:border-emerald-500 hover:bg-slate-50'
                  }`}
                >

                  <div className="w-12 h-12 rounded-xl bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-sm">

                    <span className="material-symbols-outlined text-2xl">
                      school
                    </span>

                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <h3 className="text-base font-extrabold text-slate-900">
                        Student / Learner
                      </h3>

                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Interactive
                      </span>

                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Join classes, submit assignments, track topic mastery,
                      view concept graphs, and post to feed.
                    </p>

                  </div>

                </button>

              </div>

              <div className="flex justify-between items-center pt-4">

                <button
                  type="button"
                  onClick={() => setStep('auth')}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    arrow_back
                  </span>

                  <span>Back to Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectProfession(selectedRole)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all shadow flex items-center gap-1 cursor-pointer"
                >
                  <span>Continue</span>

                  <span className="material-symbols-outlined text-base">
                    arrow_forward
                  </span>
                </button>

              </div>

            </div>
          )}

          {/* ===================================================
              STEP 3: QUESTIONNAIRE & UNIQUE USERNAME
              =================================================== */}

          {step === 'questionnaire' && (
            <div className="space-y-5 animate-fade-in max-w-md mx-auto w-full">

              <div className="border-b border-slate-200 pb-3">

                <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest block mb-1">
                  Step 3 of 3 •{' '}
                  {selectedRole === 'teacher'
                    ? 'Teacher Setup'
                    : 'Student Setup'}
                </span>

                <h2 className="text-xl font-extrabold text-slate-900">
                  Personalize Your Profile
                </h2>

                <p className="text-xs text-slate-600">
                  Choose your unique handle and institution details.
                </p>

              </div>

              <form
                onSubmit={handleFinalSubmit}
                className="space-y-4"
              >

                {/* Unique Username Input */}
                <div className="space-y-1">

                  <label className="text-xs font-bold text-slate-800 flex justify-between items-center">

                    <span>Create Unique Username</span>

                    <span className="text-[10px] text-slate-500">
                      Visible across classes
                    </span>

                  </label>

                  <div className="relative">

                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-emerald-700 text-sm">
                      @
                    </span>

                    <input
                      type="text"
                      value={username}
                      onChange={(e) =>
                        handleUsernameInput(e.target.value)
                      }
                      placeholder="e.g. alex_davis"
                      className={`w-full bg-slate-50 border ${
                        usernameError
                          ? 'border-rose-500'
                          : 'border-slate-300'
                      } rounded-xl p-2.5 pl-8 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600 focus:bg-white`}
                      required
                    />

                  </div>

                  {usernameError ? (
                    <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">

                      <span className="material-symbols-outlined text-sm">
                        error
                      </span>

                      <span>{usernameError}</span>

                    </p>
                  ) : (
                    <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">

                      <span className="material-symbols-outlined text-sm">
                        check_circle
                      </span>

                      <span>
                        Username available: @{username || 'username'}
                      </span>

                    </p>
                  )}

                </div>

                {/* School Name */}
                <div className="space-y-1">

                  <label className="text-xs font-bold text-slate-800 block">
                    School / Institution Name
                  </label>

                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Oakridge Academy"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    required
                  />

                </div>

                {/* Role Specific Fields */}
                {selectedRole === 'teacher' ? (
                  <>
                    <div className="space-y-1">

                      <label className="text-xs font-bold text-slate-800 block">
                        Primary Subject Taught
                      </label>

                      <select
                        value={teacherSubject}
                        onChange={(e) =>
                          setTeacherSubject(e.target.value)
                        }
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                      >
                        <option value="Physics & Science">
                          Physics & Natural Science
                        </option>

                        <option value="Mathematics & Calculus">
                          Mathematics & Calculus
                        </option>

                        <option value="Chemistry & Materials">
                          Chemistry & Biochemistry
                        </option>

                        <option value="Computer Science & AI">
                          Computer Science & AI
                        </option>

                        <option value="Engineering & Design">
                          Engineering & Robotics
                        </option>
                      </select>

                    </div>

                    <div className="space-y-1">

                      <label className="text-xs font-bold text-slate-800 block">
                        Grade Level / Department
                      </label>

                      <input
                        type="text"
                        value={teacherDept}
                        onChange={(e) =>
                          setTeacherDept(e.target.value)
                        }
                        placeholder="e.g. Senior High School (Grades 10-12)"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />

                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">

                      <div className="space-y-1">

                        <label className="text-xs font-bold text-slate-800 block">
                          Current Class / Grade
                        </label>

                        <input
                          type="text"
                          value={studentClass}
                          onChange={(e) =>
                            setStudentClass(e.target.value)
                          }
                          placeholder="e.g. Class 10-A"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                          required
                        />

                      </div>

                      <div className="space-y-1">

                        <label className="text-xs font-bold text-slate-800 block">
                          Roll / Student ID
                        </label>

                        <input
                          type="text"
                          value={studentRollNo}
                          onChange={(e) =>
                            setStudentRollNo(e.target.value)
                          }
                          placeholder="e.g. STU-2026-104"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                        />

                      </div>

                    </div>

                    <div className="space-y-1">

                      <label className="text-xs font-bold text-slate-800 block">
                        Stream / Major
                      </label>

                      <select
                        value={studentStream}
                        onChange={(e) =>
                          setStudentStream(e.target.value)
                        }
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                      >
                        <option value="Science & Mathematics">
                          Science & Mathematics
                        </option>

                        <option value="Computer Science & Tech">
                          Computer Science & Technology
                        </option>

                        <option value="Commerce & Economics">
                          Commerce & Economics
                        </option>

                        <option value="Humanities & Arts">
                          Humanities & Social Sciences
                        </option>
                      </select>

                    </div>
                  </>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-slate-200">

                  <button
                    type="button"
                    onClick={() => setStep('profession')}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">
                      arrow_back
                    </span>

                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={!isUsernameValid}
                    className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>Finish Setup & Enter</span>

                    <span className="material-symbols-outlined text-base">
                      check
                    </span>
                  </button>

                </div>

              </form>

            </div>
          )}

        </div>
      </div>

      {/* =======================================================
          FORGOT PASSWORD MODAL
          ======================================================= */}

      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">

          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">

            <div className="flex justify-between items-start">

              <div>

                <h3 className="text-base font-extrabold text-slate-900">
                  Reset Password
                </h3>

                <p className="text-xs text-slate-600 mt-1">
                  Enter your email or phone number to receive a secure
                  password recovery code.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">
                  close
                </span>
              </button>

            </div>

            {resetSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">

                <span className="material-symbols-outlined text-emerald-700 text-3xl">
                  mark_email_read
                </span>

                <p className="text-xs font-bold text-emerald-900">
                  Reset Link Sent Successfully!
                </p>

                <p className="text-[11px] text-emerald-800">
                  Check your inbox for further instructions.
                </p>

              </div>
            ) : (
              <form
                onSubmit={handleForgotPasswordSubmit}
                className="space-y-3"
              >

                <div className="space-y-1">

                  <label className="text-xs font-bold text-slate-700 block">
                    Registered Email / Phone
                  </label>

                  <input
                    type="text"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@gmail.com or +1 555-0192"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />

                </div>

                <div className="flex justify-end gap-2 pt-2">

                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm"
                  >
                    Send Recovery Link
                  </button>

                </div>

              </form>
            )}

          </div>

        </div>
      )}

    </div>
  );
}