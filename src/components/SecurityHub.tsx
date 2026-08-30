import React, { useState } from 'react';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  deviceOrUser: string;
  ipAddress: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
  category: 'Cheating Prevention' | 'Authentication' | 'Network' | 'Proctoring';
  description: string;
  actionTaken: string;
  status: 'active' | 'resolved' | 'acknowledged';
}

export default function SecurityHub() {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'kiosk' | 'proctoring' | 'access' | 'audit'>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Security Policies State
  const [policies, setPolicies] = useState({
    blockCopyPaste: true,
    tabSwitchDetection: true,
    maxTabSwitches: 2,
    blockDevTools: true,
    blockUSB: true,
    ipSubnetRestriction: true,
    labSubnet: '192.168.10.0/24',
    aiProctoring: true,
    faceDetection: true,
    audioWhisperDetect: true,
    twoFactorAuth: true,
    sessionTimeoutMins: 15,
    masterOverridePin: '4921',
    screenWatermark: true,
  });

  // Mock Security Audit Trail
  const [auditLogs, setAuditLogs] = useState<SecurityEvent[]>([
    {
      id: 'sec-101',
      timestamp: '05:38:12 AM',
      deviceOrUser: 'Alex Mercer (LAB-PC 01)',
      ipAddress: '192.168.10.101',
      severity: 'critical',
      category: 'Cheating Prevention',
      description: 'Attempted to open Chrome DevTools (F12) during active kinematics test',
      actionTaken: 'Blocked by Kiosk Shield & Flagged for Teacher',
      status: 'active'
    },
    {
      id: 'sec-102',
      timestamp: '05:35:40 AM',
      deviceOrUser: 'David Kim (LAB-PC 06)',
      ipAddress: '192.168.10.106',
      severity: 'high',
      category: 'Cheating Prevention',
      description: 'Tab-Switch Violation: Switched browser context to Discord Web (Count 2/2)',
      actionTaken: 'Screen Remotely Locked & Tab Terminated',
      status: 'active'
    },
    {
      id: 'sec-103',
      timestamp: '05:28:15 AM',
      deviceOrUser: 'External IP (45.33.12.8)',
      ipAddress: '45.33.12.8',
      severity: 'high',
      category: 'Network',
      description: 'Unauthorized access attempt from outside white-listed Lab Subnet (192.168.10.0/24)',
      actionTaken: 'Access Denied & IP Blacklisted',
      status: 'resolved'
    },
    {
      id: 'sec-104',
      timestamp: '05:15:02 AM',
      deviceOrUser: 'Sarah Jenkins (LAB-PC 02)',
      ipAddress: '192.168.10.102',
      severity: 'medium',
      category: 'Proctoring',
      description: 'AI Proctor Alert: Secondary face detected in webcam frame for 8 seconds',
      actionTaken: 'Warning Notice Pushed to Student Screen',
      status: 'acknowledged'
    },
    {
      id: 'sec-105',
      timestamp: '04:55:22 AM',
      deviceOrUser: 'Teacher Portal (prof.smith@edu)',
      ipAddress: '192.168.10.2',
      severity: 'info',
      category: 'Authentication',
      description: 'Successful 2FA Authenticated Login via Authenticator App',
      actionTaken: 'Granted Full Administrative Privileges',
      status: 'resolved'
    },
    {
      id: 'sec-106',
      timestamp: '04:30:10 AM',
      deviceOrUser: 'Ryan Howard (LAB-PC 08)',
      ipAddress: '192.168.10.108',
      severity: 'medium',
      category: 'Cheating Prevention',
      description: 'Clipboard Paste Attempt: Tried pasting external solution snippet',
      actionTaken: 'Paste Action Blocked & Logged',
      status: 'resolved'
    }
  ]);

  const [pinInput, setPinInput] = useState(policies.masterOverridePin);
  const [newSubnetInput, setNewSubnetInput] = useState(policies.labSubnet);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const togglePolicy = (key: keyof typeof policies) => {
    setPolicies(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast(`Security Policy "${String(key)}" updated successfully!`);
      return updated;
    });
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length < 4) {
      showToast('Master PIN must be at least 4 digits!');
      return;
    }
    setPolicies(prev => ({ ...prev, masterOverridePin: pinInput }));
    showToast('Master Override PIN updated!');
  };

  const handleSaveSubnet = (e: React.FormEvent) => {
    e.preventDefault();
    setPolicies(prev => ({ ...prev, labSubnet: newSubnetInput }));
    showToast(`Lab Subnet Whitelist set to ${newSubnetInput}`);
  };

  const handleResolveAlert = (id: string) => {
    setAuditLogs(prev =>
      prev.map(item => item.id === id ? { ...item, status: 'resolved' } : item)
    );
    showToast('Security Alert marked as resolved!');
  };

  const activeAlertsCount = auditLogs.filter(l => l.status === 'active').length;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-600 animate-bounce">
          <span className="material-symbols-outlined">shield</span>
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Security Hub Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-3xl shadow-sm">
              <span className="material-symbols-outlined">security</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">Institutional Security & Protection Hub</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  SHIELD ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Comprehensive anti-cheating, AI proctoring, network whitelisting, and role access security controls.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-right">
              <span className="text-xs text-slate-500 block font-semibold">Security Health Score</span>
              <span className="text-xl font-black text-emerald-800">98% SECURE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'overview'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-base">dashboard</span>
          <span>Security Overview</span>
        </button>

        <button
          onClick={() => setActiveSubTab('kiosk')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'kiosk'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-base">lock</span>
          <span>Exam Kiosk & Anti-Cheating</span>
        </button>

        <button
          onClick={() => setActiveSubTab('proctoring')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'proctoring'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-base">videocam</span>
          <span>AI Proctoring & Biometrics</span>
        </button>

        <button
          onClick={() => setActiveSubTab('access')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'access'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-base">key</span>
          <span>2FA & Access Credentials</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap relative ${
            activeSubTab === 'audit'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-base">receipt_long</span>
          <span>Security Audit Trail</span>
          {activeAlertsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
              {activeAlertsCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Kiosk Shield</span>
                <span className="material-symbols-outlined text-emerald-700">verified_user</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">PROTECTED</span>
              <p className="text-[11px] text-emerald-700 mt-1 font-semibold">Copy-Paste & DevTools locked</p>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider font-sans">Subnet Firewall</span>
                <span className="material-symbols-outlined text-indigo-700">router</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">ENFORCED</span>
              <p className="text-[11px] text-indigo-700 mt-1 font-mono font-medium">{policies.labSubnet}</p>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">AI Proctoring</span>
                <span className="material-symbols-outlined text-emerald-700">visibility</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">ACTIVE</span>
              <p className="text-[11px] text-slate-600 mt-1 font-semibold">Face & Audio Gaze Tracking</p>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Security Logs</span>
                <span className="material-symbols-outlined text-amber-600">warning</span>
              </div>
              <span className="text-2xl font-bold text-amber-700">{activeAlertsCount} ALERTS</span>
              <p className="text-[11px] text-amber-700 mt-1 font-semibold">Requires teacher review</p>
            </div>
          </div>

          {/* Core Security Controls Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Real-time Threat Defense Matrix */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="material-symbols-outlined text-emerald-700">shield_lock</span>
                Active Defense Toggles
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Prevent Copy / Paste / Cut</span>
                    <span className="text-[11px] text-slate-500 font-medium">Disables clipboard snippet copying during tests</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePolicy('blockCopyPaste')}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      policies.blockCopyPaste ? 'bg-emerald-700' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-transform ${
                      policies.blockCopyPaste ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Browser Tab-Switch Shield</span>
                    <span className="text-[11px] text-slate-500 font-medium">Detects and locks screen if student leaves test tab</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePolicy('tabSwitchDetection')}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      policies.tabSwitchDetection ? 'bg-emerald-700' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-transform ${
                      policies.tabSwitchDetection ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Block F12 & Developer Inspection</span>
                    <span className="text-[11px] text-slate-500 font-medium">Shields browser source inspect tools and console</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePolicy('blockDevTools')}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      policies.blockDevTools ? 'bg-emerald-700' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-transform ${
                      policies.blockDevTools ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Two-Factor Auth (2FA) Mandatory</span>
                    <span className="text-[11px] text-slate-500 font-medium">Requires OTP code verification for teacher portal</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePolicy('twoFactorAuth')}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      policies.twoFactorAuth ? 'bg-emerald-700' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-transform ${
                      policies.twoFactorAuth ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Master PIN & Lab Subnet Config */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="material-symbols-outlined text-indigo-700">admin_panel_settings</span>
                Master Override & Subnet Config
              </h3>

              {/* Master PIN Form */}
              <form onSubmit={handleSavePin} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Master Teacher Override PIN (for unlocking PCs):</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono tracking-widest focus:outline-none focus:border-emerald-600 font-bold"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-sm"
                  >
                    Update PIN
                  </button>
                </div>
              </form>

              {/* Subnet Form */}
              <form onSubmit={handleSaveSubnet} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Whitelisted Computer Lab IP Range:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubnetInput}
                    onChange={(e) => setNewSubnetInput(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600 font-bold"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-sm"
                  >
                    Save Subnet
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: EXAM KIOSK & ANTI-CHEATING */}
      {activeSubTab === 'kiosk' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-700">phonelink_lock</span>
              Exam Kiosk Lockout Engine Settings
            </h2>
            <p className="text-xs text-slate-500">
              Configure strict browser lockdown policies to guarantee exam integrity during online tests & lab assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Disable Copy & Paste</h4>
                  <p className="text-[11px] text-slate-500">Prevents students from copying questions or pasting external answers.</p>
                </div>
                <button
                  type="button"
                  onClick={() => togglePolicy('blockCopyPaste')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    policies.blockCopyPaste ? 'bg-emerald-700' : 'bg-slate-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-transform ${
                    policies.blockCopyPaste ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Tab Switch & Window Focus Shield</h4>
                  <p className="text-[11px] text-slate-500">Flags student when browser window loses focus.</p>
                </div>
                <button
                  type="button"
                  onClick={() => togglePolicy('tabSwitchDetection')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    policies.tabSwitchDetection ? 'bg-emerald-700' : 'bg-slate-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-transform ${
                    policies.tabSwitchDetection ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Block F12 / DevTools Inspection</h4>
                  <p className="text-[11px] text-slate-500">Shields developer console, right-click menu, and key shortcuts.</p>
                </div>
                <button
                  type="button"
                  onClick={() => togglePolicy('blockDevTools')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    policies.blockDevTools ? 'bg-emerald-700' : 'bg-slate-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-transform ${
                    policies.blockDevTools ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">USB Drive Detection & Lockout</h4>
                  <p className="text-[11px] text-slate-500">Blocks external USB drives during lab computer sessions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => togglePolicy('blockUSB')}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    policies.blockUSB ? 'bg-emerald-700' : 'bg-slate-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-transform ${
                    policies.blockUSB ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI PROCTORING */}
      {activeSubTab === 'proctoring' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-700">center_focus_strong</span>
              AI Webcam Proctoring & Eye-Gaze Tracking
            </h2>
            <p className="text-xs text-slate-500">
              Automated computer vision tracking for detecting suspicious movement, secondary faces, and audio whispers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">face</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Face Detection AI</h4>
              <p className="text-[11px] text-slate-500">Ensures candidate stays in camera frame & flags secondary faces.</p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">visibility</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Eye Gaze & Head Orientation</h4>
              <p className="text-[11px] text-slate-500">Monitors off-screen gaze patterns during exams.</p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">mic</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Audio Whisper & Voice Detection</h4>
              <p className="text-[11px] text-slate-500">Analyzes background noise & speech frequency during tests.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ACCESS & CREDENTIALS */}
      {activeSubTab === 'access' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-700">badge</span>
              Session Security & Access Controls
            </h2>
            <p className="text-xs text-slate-500">
              Manage multi-factor authentication requirements, session timeouts, and administrator override keys.
            </p>
          </div>

          <div className="space-y-4 max-w-xl">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Enforce Two-Factor Auth (2FA)</h4>
                <p className="text-[11px] text-slate-500">Require TOTP authenticator code for teacher accounts</p>
              </div>
              <button
                type="button"
                onClick={() => togglePolicy('twoFactorAuth')}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  policies.twoFactorAuth ? 'bg-emerald-700' : 'bg-slate-300'
                }`}
              >
                <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-transform ${
                  policies.twoFactorAuth ? 'right-0.5' : 'left-0.5'
                }`} />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="text-xs font-bold text-slate-800 block">Idle Session Auto-Timeout (Minutes):</label>
              <select
                value={policies.sessionTimeoutMins}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPolicies(prev => ({ ...prev, sessionTimeoutMins: val }));
                  showToast(`Auto-logout timeout set to ${val} minutes`);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium"
              >
                <option value={5}>5 Minutes (Maximum Security)</option>
                <option value={15}>15 Minutes (Standard Classroom)</option>
                <option value={30}>30 Minutes (Extended Lab)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeSubTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700">receipt_long</span>
                Security Incident & Audit Trail
              </h2>
              <p className="text-xs text-slate-500">
                Immutable event stream of security alerts, network access attempts, and kiosk violations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => showToast('Security Audit Exported to PDF/CSV!')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer border border-slate-200 flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Export Security Report</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">User / Device</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-3 font-bold text-slate-900 whitespace-nowrap">{log.deviceOrUser}</td>
                    <td className="p-3 font-mono text-[11px] text-indigo-700 font-medium whitespace-nowrap">{log.ipAddress}</td>
                    <td className="p-3 whitespace-nowrap">
                      {log.severity === 'critical' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200">CRITICAL</span>
                      ) : log.severity === 'high' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">HIGH</span>
                      ) : log.severity === 'medium' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">MEDIUM</span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">INFO</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-700">{log.description}</td>
                    <td className="p-3 text-right whitespace-nowrap">
                      {log.status === 'active' ? (
                        <button
                          type="button"
                          onClick={() => handleResolveAlert(log.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 text-[10px] font-bold cursor-pointer shadow-xs"
                        >
                          Resolve Alert
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[10px] font-bold">RESOLVED</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
