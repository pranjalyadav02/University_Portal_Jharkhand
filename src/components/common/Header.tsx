import React, { useState } from 'react';
import {
  Building2,
  Search,
  Bell,
  ChevronDown,
  Languages,
} from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';
import { UserRole, University } from '../../types';

export const Header: React.FC = () => {
  const {
    selectedUniversity,
    setSelectedUniversity,
    universities,
    currentUserRole,
    setCurrentUserRole,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationAsRead,
    setActiveTab,
  } = useUniversity();

  const [isUniDropdownOpen, setIsUniDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isHindi, setIsHindi] = useState(false);

  const t = (en: string, hi: string) => isHindi ? hi : en;

  const unreadNotifs = notifications.filter((n) => !n.read);

  const roleLabels: Record<UserRole, { label: string; badge: string; desc: string }> = {
    leadership: {
      label: 'Vice Chancellor / Leadership',
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      desc: 'Institutional oversight, approvals & impact metrics',
    },
    faculty: {
      label: 'Faculty Mentor / PI',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      desc: 'Challenge evaluation, team mentorship & TRL review',
    },
    student: {
      label: 'Student Researcher',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      desc: 'Task execution, prototyping & lab testing',
    },
    innovation: {
      label: 'Incubation & IPR Head',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      desc: 'Startup incubation, patent filings & labs booking',
    },
    industry: {
      label: 'Industry / CSR Partner',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      desc: 'Co-funding, technical mentorship & field access',
    },
    government: {
      label: 'Govt Liaison Officer',
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
      desc: 'District requirements, pilot clearance & deployment',
    },
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 lg:px-8 flex items-center justify-between shrink-0 select-none z-30">
      {/* Title & Institutional Context */}
      <div className="flex items-center space-x-4 min-w-0">
        <div>
          <h1 className="text-lg lg:text-xl font-bold text-slate-900 leading-snug">
            {t('University Innovation Hub', 'विश्वविद्यालय नवाचार केंद्र')}
          </h1>
          <p className="text-xs text-slate-500 truncate">
            {selectedUniversity.name} • {t('Innovation Hub', 'नवाचार केंद्र')}
          </p>
        </div>

        {/* Institutional Switcher Pill */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => {
              setIsUniDropdownOpen(!isUniDropdownOpen);
              setIsNotifDropdownOpen(false);
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-700 text-xs font-medium transition-all"
            title="Switch Participating Institution"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold">{selectedUniversity.shortName}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isUniDropdownOpen && (
            <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Select Higher Education Institution (HEI)
              </div>
              <div className="max-h-80 overflow-y-auto py-1">
                {universities.map((uni) => (
                  <button
                    key={uni.id}
                    onClick={() => {
                      setSelectedUniversity(uni);
                      setIsUniDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-blue-50/70 flex items-start space-x-2.5 transition-colors ${
                      uni.id === selectedUniversity.id ? 'bg-blue-50/90 text-blue-900 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5"
                      style={{ backgroundColor: uni.logoColor }}
                    >
                      {uni.shortName.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold leading-tight">{uni.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {uni.type} • {uni.district} • {uni.activeProjectsCount} Projects
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="max-w-xs w-full hidden md:block mx-4">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search problems, labs, faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-hidden transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right Controls: Avatars Stack + Role Switcher + Primary Action */}
      <div className="flex items-center space-x-4 lg:space-x-6">
        {/* Avatars Stack from Design */}
        <div className="hidden sm:flex -space-x-2 items-center">
          <div
            className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-800 shadow-2xs cursor-pointer"
            title="Dr. Arjan Mehta (Lead PI)"
          >
            AM
          </div>
          <div
            className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-800 shadow-2xs cursor-pointer"
            title="Sarah Chen (ML Eng)"
          >
            SC
          </div>
          <div
            className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-purple-800 shadow-2xs cursor-pointer"
            title="Vijay Kumar (IoT Arch)"
          >
            VK
          </div>
          <div
            className="w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-amber-800 shadow-2xs cursor-pointer"
            title="+4 Researchers"
          >
            +4
          </div>
        </div>        {/* Signed-in role; permissions come from login and cannot be changed here. */}
        <div className={`hidden lg:flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${roleLabels[currentUserRole].badge}`} title="Role assigned at sign-in">
          <span>{roleLabels[currentUserRole].label}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
            )}
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Notifications & Alerts</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {unreadNotifs.length} new
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                      !notif.read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="text-xs font-semibold text-slate-900 leading-snug">{notif.title}</div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 inline-block">{notif.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hindi Language Toggle */}
        <button
          onClick={() => setIsHindi(!isHindi)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors shrink-0"
          title={isHindi ? 'Switch to English' : 'हिंदी में देखें'}
        >
          <Languages className="w-3.5 h-3.5" />
          {isHindi ? 'EN' : 'हि'}
        </button>

        {/* Primary CTA Button from Design */}
        <button
          onClick={() => setActiveTab('challenges_marketplace')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors shrink-0"
        >
          {t('Browse Challenges', 'चुनौतियाँ देखें')}
        </button>
      </div>
    </header>
  );
};
