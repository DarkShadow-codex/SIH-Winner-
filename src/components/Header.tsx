import React, { useState } from 'react';
import { Role, UserProfile } from '../types';

interface HeaderProps {
  userRole: Role;
  userEmail: string;
  userProfile?: UserProfile | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLaunchLiveClass: () => void;
  onToggleSidebar?: () => void;
  onLogout?: () => void;
  onEditProfile?: () => void;
}

export default function Header({
  userRole,
  userEmail,
  userProfile,
  activeTab,
  onTabChange,
  onLaunchLiveClass,
  onToggleSidebar,
  onLogout,
  onEditProfile
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Define avatar images matching the visual mocks
  const defaultAvatars = {
    teacher: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subject_teacher: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    student: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  };

  const currentAvatar = userProfile?.avatarUrl || defaultAvatars[userRole];

  const getProfileName = () => {
    if (userProfile?.name) return userProfile.name;
    if (userRole === 'teacher') return 'Alex Davis';
    if (userRole === 'subject_teacher') return 'Prof. Miller';
    return 'Sam Wilson';
  };

  const getUsernameHandle = () => {
    if (userProfile?.username) return userProfile.username;
    return userRole === 'teacher' ? '@alex_davisyj' : '@student_sam';
  };

  interface DemoNotification {
    id: number;
    text: string;
    time: string;
    type: 'pending' | 'alert' | 'info';
    targetTab: string;
    targetLabel: string;
  }

  const demoNotifications: DemoNotification[] = [
    {
      id: 1,
      text: 'Alex Mercer requested to join Class 10-A',
      time: '10 mins ago',
      type: 'pending',
      targetTab: 'teachers',
      targetLabel: 'Open Request in People Hub'
    },
    {
      id: 2,
      text: 'New critical misconception on Kinematics detected',
      time: '1 hour ago',
      type: 'alert',
      targetTab: 'classroom_radar',
      targetLabel: 'Open Classroom Radar'
    },
    {
      id: 3,
      text: 'Sarah Jenkins submitted Midterm Assignment',
      time: 'Yesterday',
      type: 'info',
      targetTab: 'assignment',
      targetLabel: 'Review in Assignment Studio'
    }
  ];

  const handleNotificationClick = (notif: DemoNotification) => {
    setShowNotifications(false);
    onTabChange(notif.targetTab);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-10 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-sm">
      
      {/* Left Brand and Hamburger */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div 
          onClick={() => onTabChange('dashboard')}
          className="text-xl font-black text-slate-900 cursor-pointer hover:text-emerald-700 transition-colors tracking-tight font-sans flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-emerald-700 text-2xl">school</span>
          <span>Smart Classroom</span>
        </div>
      </div>

      {/* Right Utilities */}
      <div className="flex items-center gap-2 md:gap-4">
        
        {/* Search Bar (Hidden on tiny screens) */}
        <div className="relative hidden sm:block max-w-xs md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            className="w-full bg-slate-100 border border-slate-300 text-slate-900 rounded-full py-1.5 pl-10 pr-4 text-xs focus:outline-none focus:bg-white focus:border-emerald-600 placeholder-slate-400"
            placeholder={userRole === 'student' ? 'Search resources...' : 'Search concepts...'}
            type="text"
          />
        </div>

        {/* Live Class Simulator Trigger */}
        <button
          onClick={onLaunchLiveClass}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 md:px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer scale-100 active:scale-95"
        >
          <span className="material-symbols-outlined text-base">videocam</span>
          <span className="hidden md:inline">Live Class</span>
        </button>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-full p-2 cursor-pointer relative transition-colors"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full"></span>
          </button>

          {/* Interactive Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900">Live School Alerts</span>
                <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">3 alerts</span>
              </div>
              <div className="divide-y divide-slate-100">
                {demoNotifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-xs">
                    <p className="text-slate-800 font-medium">{n.text}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">{n.time}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-slate-100 bg-slate-50">
                <button 
                  onClick={() => {
                    setShowNotifications(false);
                    onTabChange('dashboard');
                  }}
                  className="text-emerald-700 hover:text-emerald-800 font-bold text-[11px] hover:underline cursor-pointer"
                >
                  View All Activity
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 focus:outline-none cursor-pointer border border-slate-200 hover:border-emerald-500 rounded-full p-1 pl-2 transition-all bg-slate-50 hover:bg-white"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-tight">{getProfileName()}</p>
              <p className="text-[10px] font-mono text-emerald-800 font-bold">{getUsernameHandle()}</p>
            </div>
            <img
              alt="User Profile"
              className="w-8 h-8 rounded-full border border-slate-300 object-cover"
              src={currentAvatar}
              referrerPolicy="no-referrer"
            />
          </button>

          {/* Profile Quick Panel */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in">
              <div className="p-4 bg-slate-50 border-b border-slate-200 text-center">
                <img
                  alt="Avatar Larger"
                  className="w-16 h-16 rounded-full border-2 border-emerald-600 object-cover mx-auto mb-2 shadow-sm"
                  src={currentAvatar}
                  referrerPolicy="no-referrer"
                />
                <h4 className="text-sm font-extrabold text-slate-900">{getProfileName()}</h4>
                <p className="text-xs font-mono font-bold text-emerald-800">{getUsernameHandle()}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">{userProfile?.schoolName || 'Smart Classroom Institute'}</p>
                <div className="mt-2 inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[10px] font-bold uppercase tracking-wider">
                  {userRole === 'teacher' ? 'Educator Role' : 'Student Role'}
                </div>
              </div>

              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onTabChange('dashboard');
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg cursor-pointer transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base text-slate-500">dashboard</span>
                  <span>My Workspace Dashboard</span>
                </button>

                {onEditProfile && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onEditProfile();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg cursor-pointer transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base text-emerald-700">manage_accounts</span>
                    <span>Edit Profile & Onboarding</span>
                  </button>
                )}

                <div className="border-t border-slate-100 my-1"></div>

                {onLogout && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
