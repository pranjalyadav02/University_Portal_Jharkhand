import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Briefcase,
  Search,
  BookOpen,
  Award,
  Sparkles,
  Building,
  CheckCircle2,
  Clock,
  Cpu,
  BadgeAlert,
} from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';

export const FacultyTalentRoster: React.FC = () => {
  const { facultyMembers, students, labs, equipment, selectedUniversity, searchQuery } = useUniversity();
  const [subTab, setSubTab] = useState<'faculty' | 'students' | 'labs'>('faculty');

  const filteredFaculty = (facultyMembers || []).filter((f) => {
    if (f.universityId !== selectedUniversity.id) return false;
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q) ||
        (f.expertise || []).some((e) => e.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const filteredStudents = (students || []).filter((s) => {
    if (s.universityId !== selectedUniversity.id) return false;
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        (s.skills || []).some((sk) => sk.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const uniLabs = (labs || []).filter((l) => l.universityId === selectedUniversity.id);
  const displayLabs = uniLabs.length > 0 ? uniLabs : (labs || []);

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-heading">
              Faculty Mentors & Student Talent Pool
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {selectedUniversity.shortName}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Multidisciplinary human capital, lab inventory, and academic publications powering societal problem solving.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setSubTab('faculty')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'faculty' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Faculty Mentors ({filteredFaculty.length})
          </button>
          <button
            onClick={() => setSubTab('students')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'students' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Student Researchers ({filteredStudents.length})
          </button>
          <button
            onClick={() => setSubTab('labs')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'labs' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Laboratories & Equipment ({displayLabs.length})
          </button>
        </div>
      </div>

      {/* Faculty Sub-tab */}
      {subTab === 'faculty' && (
        <div className="grid md:grid-cols-3 gap-4">
          {filteredFaculty.map((faculty) => (
            <div
              key={faculty.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                    {faculty.name.split(' ')[1]?.slice(0, 2) || 'DR'}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {faculty.activeProjects || 0} Active Projects
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-heading">{faculty.name}</h3>
                  <div className="text-xs text-blue-600 font-medium">{faculty.designation}</div>
                  <div className="text-[11px] text-slate-500">{faculty.department}</div>
                </div>

                <div className="space-y-1 pt-1 text-xs">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Domain Expertise:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(faculty.expertise || []).map((exp) => (
                      <span key={exp} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{faculty.publicationsCount} Publications</span>
                <span className="text-xs font-semibold text-emerald-700">
                  {faculty.mentorshipCapacity} Mentorship
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Students Sub-tab */}
      {subTab === 'students' && (
        <div className="grid md:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                    {student.name.split(' ')[0]?.slice(0, 2)}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {student.availabilityHoursPerWeek} hrs/week free
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-heading">{student.name}</h3>
                  <div className="text-xs text-emerald-700 font-medium">{student.year}</div>
                  <div className="text-[11px] text-slate-500">{student.department}</div>
                </div>

                <div className="space-y-1 pt-1 text-xs">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Verified Skills:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(student.skills || []).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{student.projectsCompleted || 0} Completed Projects</span>
                <span className="font-semibold text-emerald-700">Eligible for AI Team</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Labs Sub-tab */}
      {subTab === 'labs' && (
        <div className="grid md:grid-cols-2 gap-4">
          {displayLabs.map((lab) => (
            <div key={lab.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-heading">{lab.name}</h3>
                      <span className="text-xs text-slate-500 font-medium">{lab.department}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      lab.status === 'Operational & Bookable'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {lab.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Facility Manager: <strong className="text-slate-800">{lab.facilityManager}</strong> • Capacity: <strong className="text-slate-800">{lab.capacity}</strong>
                </p>

                <div className="space-y-1 pt-1 text-xs">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Key Laboratory Equipment ({lab.equipmentCount}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(lab.keyEquipment || []).map((eq) => (
                      <span
                        key={eq}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Active Bookings: <strong className="text-slate-800">{lab.activeBookings}</strong>
                </span>
                <span className="text-xs font-semibold text-emerald-700">
                  ✓ Available for Cross-Disciplinary Pilots
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
