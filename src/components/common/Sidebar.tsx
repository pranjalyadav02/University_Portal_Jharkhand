import React from 'react';
import {
  LayoutDashboard,
  Store,
  Sparkles,
  Bookmark,
  CheckCircle2,
  FolderKanban,
  Library,
  GraduationCap,
  Users,
  Building,
  Handshake,
  GitCommit,
  Radio,
  FileBadge,
  ShieldCheck,
  Award,
  BookOpen,
  Calendar,
  LogOut,
} from 'lucide-react';
import { useUniversity, NavigationTab } from '../../context/UniversityContext';
import { handlePortalLogout } from '../../utils/navigation';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, challenges, assignedProjects, currentUserRole, lessonsLearned } = useUniversity();

  const activeChallengesCount = challenges.filter((c) => c.status !== 'rejected').length;
  const activeProjectsCount = assignedProjects.length;

  const sections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        { id: 'command_center', label: 'Command Center', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Innovation Pipeline',
      items: [
        {
          id: 'challenges_marketplace',
          label: currentUserRole === 'leadership' ? '1. Identify Problems (Assign)' : '1. Identify Civic Problems',
          icon: Store,
          badge: activeChallengesCount,
        },
        {
          id: 'research_projects',
          label: currentUserRole === 'leadership' ? '2. University Projects' : '2. My Assigned Projects',
          icon: FolderKanban,
          badge: activeProjectsCount,
        },
        {
          id: 'collaboration_industry',
          label: '3. Industry & CSR Platform',
          icon: Handshake,
        },
      ],
    },
    {
      title: 'Talent & Knowledge',
      items: [
        { id: 'faculty_mentors', label: 'Talent Roster', icon: GraduationCap },
        { id: 'lessons_learned', label: 'Lessons Learned Archive', icon: BookOpen, badge: lessonsLearned.length },
        { id: 'audit_logs', label: 'Audit & Governance', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 flex flex-col border-r border-slate-800 shrink-0 select-none h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('command_center')}>
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xl shadow-xs">
            U
          </div>
          <div>
            <div className="text-white font-semibold text-lg tracking-tight leading-tight">UniNexus Pro</div>
            <div className="text-[10px] text-slate-400 font-medium">JanaSamadhan HEI</div>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-blue-600/10 text-blue-400 font-medium'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {isActive ? (
                      <div className="w-4 h-4 rounded-full border-2 border-blue-400 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      </div>
                    ) : (
                      <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className="text-sm truncate">{item.label}</span>

                    {item.badge && (
                      <span className="ml-auto bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Institutional Capacity Footer Card */}
      <div className="p-4 mt-auto border-t border-slate-800/80">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/50">
          <div className="text-xs text-slate-400 mb-1 font-semibold">Institutional Capacity</div>
          <div className="h-2 bg-slate-700 rounded-full mb-3 overflow-hidden">
            <div className="w-3/4 h-full bg-emerald-500 rounded-full transition-all duration-500" />
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between font-medium">
            <span>14 Labs Active</span>
            <span className="text-emerald-400 font-semibold">82% Load</span>
          </div>
        </div>

        <button
          onClick={handlePortalLogout}
          className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 border border-slate-700/80 hover:border-rose-700/80 text-slate-300 hover:text-rose-200 text-xs font-semibold transition-all cursor-pointer shadow-xs"
          title="Sign Out to JanaSamadhan Login Portal"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit to Login</span>
        </button>
      </div>
    </aside>
  );
};
