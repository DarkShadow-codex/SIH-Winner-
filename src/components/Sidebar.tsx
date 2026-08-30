import { Role, UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: Role;
  userEmail: string;
  userProfile?: UserProfile | null;
  onLogout: () => void;
  onRoleSwitch?: (role: Role) => void;
  className?: string;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  userRole,
  userEmail,
  userProfile,
  onLogout,
  onRoleSwitch,
  className
}: SidebarProps) {
  
  // Tabs that are common for all
  const mainTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'live_monitor', label: userRole === 'student' ? 'Screen Share Code' : 'Live Screen Monitor', icon: 'desktop_windows' },
    ...(userRole !== 'student' ? [{ id: 'security_hub', label: 'Security Hub', icon: 'security' }] : []),
    { id: 'classroom_radar', label: 'Classroom Radar', icon: 'grid_view' },
    { id: 'concept_graphs', label: 'Concept Graphs', icon: 'hub' },
    { id: 'teach_next', label: 'Teach Next', icon: 'psychology' },
    { id: 'knowledge_hub', label: 'Knowledge Hub', icon: 'diversity_3' },
    { id: 'people', label: 'People & Chat', icon: 'group' },
    { id: 'assessment', label: 'Assignment', icon: 'assignment' }
  ];

  return (
    <aside className={className || "hidden lg:flex flex-col w-[280px] h-[calc(100vh-64px)] fixed left-0 top-16 bg-white border-r border-slate-200 p-4 gap-2 z-40 overflow-y-auto text-slate-900 shadow-sm"}>
      
      {/* Platform Branding Info */}
      <div className="p-3 mb-2 border border-slate-200 bg-white shadow-sm rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-sm">
            <span className="material-symbols-outlined text-white">school</span>
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 leading-tight tracking-tight">Smart Classroom</h2>
            <p className="text-[10px] text-emerald-800 font-bold tracking-wide uppercase">AI-Powered Education</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1">
        {mainTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 translate-x-1 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                {tab.icon}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}

        {/* Management Category for Teachers */}
        {(userRole === 'teacher' || userRole === 'subject_teacher') && (
          <div className="pt-4 pb-2">
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Management
            </h3>
            <button
              onClick={() => onTabChange('teacher_management')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeTab === 'teacher_management'
                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-lg text-emerald-700">link</span>
              <span className="text-xs font-bold">Invite Links & People</span>
            </button>
            <button
              onClick={() => onTabChange('class_analytics')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeTab === 'class_analytics'
                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-lg text-slate-500">analytics</span>
              <span className="text-xs">Class Analytics</span>
            </button>
          </div>
        )}
      </nav>

      {/* Footer Area with actions */}
      <div className="mt-auto pt-4 border-t border-slate-200 space-y-3">
        
        {/* Quick Check Class Button */}
        <button
          onClick={() => onTabChange('classroom_radar')}
          className="check-class-btn w-full !bg-emerald-700 hover:!bg-emerald-800 !text-white py-3 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer scale-100 active:scale-95 border border-emerald-600"
        >
          <span className="material-symbols-outlined text-base !text-white">fact_check</span>
          <span className="!text-white font-bold tracking-wide">Check Class</span>
        </button>

        <div className="space-y-1">
          <button
            onClick={() => onTabChange('help')}
            className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-xl transition-all cursor-pointer ${
              activeTab === 'help' ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-lg text-slate-500">help</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Help</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-xl text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
