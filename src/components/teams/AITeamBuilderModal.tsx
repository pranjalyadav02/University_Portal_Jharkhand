import React, { useState, useMemo } from 'react';
import {
  X,
  Users,
  Sparkles,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
} from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';
import { FacultyMember, Student } from '../../types';

interface MemberAssignment {
  id: string;
  name: string;
  type: 'faculty' | 'student';
  department: string;
  role: string;
  matchScore: number;
  rationale: string;
  expertiseOrSkill: string;
  hoursPerWeek?: number;
}

export const AITeamBuilderModal: React.FC = () => {
  const {
    isTeamBuilderModalOpen,
    setIsTeamBuilderModalOpen,
    selectedChallengeId,
    challenges,
    selectedUniversity,
    facultyMembers,
    students,
    createProjectFromChallenge,
    addAuditLog,
    setActiveTab,
  } = useUniversity();

  const challenge = challenges.find((c) => c.id === selectedChallengeId) || challenges[0];

  // Initial AI generated team recommendations based on the challenge disciplines
  const [teamMembers, setTeamMembers] = useState<MemberAssignment[]>([
    {
      id: 'fac-01',
      name: 'Prof. (Dr.) Anurag Bhattacharya',
      type: 'faculty',
      department: 'Environmental Science & Engineering',
      role: 'Principal Investigator / Lead Faculty',
      matchScore: 96,
      rationale: '74 publications; Lead inventor on fluoride sorption kinetics in Chota Nagpur aquifers.',
      expertiseOrSkill: 'Water Quality, Sorption Kinetics',
    },
    {
      id: 'fac-02',
      name: 'Dr. Shalini Mukhopadhyay',
      type: 'faculty',
      department: 'Computer Science & Engineering',
      role: 'Co-Mentor (IoT Firmware & TinyML)',
      matchScore: 93,
      rationale: 'Active DST project in low-power mesh sensor networks and embedded edge anomaly detection.',
      expertiseOrSkill: 'TinyML, Edge Computing, LoRaWAN',
    },
    {
      id: 'fac-03',
      name: 'Dr. Rajeshwar Soren',
      type: 'faculty',
      department: 'Civil Engineering',
      role: 'Co-Mentor (Hydro-geology & Field Logistics)',
      matchScore: 89,
      rationale: 'Extensive field research in Gumla & Simdega fracture aquifers and handpump hydraulics.',
      expertiseOrSkill: 'Aquifer Hydro-geology, Hydraulics',
    },
    {
      id: 'stu-01',
      name: 'Aakash Verma',
      type: 'student',
      department: 'Computer Science & Engineering (M.Tech)',
      role: 'Student Lead (TinyML Firmware & Edge AI)',
      matchScore: 95,
      rationale: 'ARM Cortex embedded specialist; completed 5 IoT hardware telemetry projects.',
      expertiseOrSkill: 'FreeRTOS, C/C++, TinyML',
      hoursPerWeek: 20,
    },
    {
      id: 'stu-02',
      name: 'Pooja Murmu',
      type: 'student',
      department: 'Environmental Science & Engineering (Ph.D.)',
      role: 'Researcher (Water Chemistry & Calibration)',
      matchScore: 94,
      rationale: 'NABL accredited assessor; extensive field titration dataset in Gumla district.',
      expertiseOrSkill: 'Spectrophotometry, GIS, R Stats',
      hoursPerWeek: 25,
    },
    {
      id: 'stu-03',
      name: 'Rohan Gupta',
      type: 'student',
      department: 'Electronics & Communication (B.Tech)',
      role: 'Hardware Engineer (Custom PCB & Solar MPPT)',
      matchScore: 91,
      rationale: 'PCB fabrication lead at IIT FabLab; designed 4-layer ruggedized sensor enclosure.',
      expertiseOrSkill: 'KiCAD, RF LoRa, Solar Harvest',
      hoursPerWeek: 15,
    },
    {
      id: 'stu-05',
      name: 'Deepak Tirkey',
      type: 'student',
      department: 'Computer Science & Engineering (B.Tech)',
      role: 'Mobile Engineer (Vernacular App for Jal Sahiyas)',
      matchScore: 88,
      rationale: 'Developed offline-first Sadri/Hindi mobile interfaces for grassroots healthcare workers.',
      expertiseOrSkill: 'Flutter, SQLite, SMS Gateway',
      hoursPerWeek: 18,
    },
  ]);

  const [isAddingMember, setIsAddingMember] = useState(false);
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState('');
  const [roleForNewStudent, setRoleForNewStudent] = useState('Assistant Researcher');

  if (!isTeamBuilderModalOpen) return null;

  // Multidisciplinary coverage check
  const disciplinesCovered = [
    { name: 'Environmental Science & Chemistry', covered: true },
    { name: 'Computer Science & TinyML', covered: true },
    { name: 'Civil Engineering & Hydraulics', covered: true },
    { name: 'Electronics & Hardware PCB', covered: true },
    { name: 'Vernacular Citizen UI', covered: true },
  ];

  const handleRemoveMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddStudent = () => {
    const student = students.find((s) => s.id === selectedStudentToAdd);
    if (student) {
      const newMember: MemberAssignment = {
        id: student.id,
        name: student.name,
        type: 'student',
        department: `${student.department} (${student.year})`,
        role: roleForNewStudent,
        matchScore: 86,
        rationale: `Selected based on skills: ${student.skills.slice(0, 3).join(', ')}.`,
        expertiseOrSkill: student.skills.slice(0, 3).join(', '),
        hoursPerWeek: student.availabilityHoursPerWeek,
      };
      setTeamMembers((prev) => [...prev, newMember]);
      setIsAddingMember(false);
      setSelectedStudentToAdd('');
    }
  };

  const handleApproveAndCreateProject = () => {
    const facultyMentors = teamMembers.filter((m) => m.type === 'faculty');
    const studentResearchers = teamMembers.filter((m) => m.type === 'student');

    const teamData = {
      leadFaculty: facultyMentors[0]?.name || 'Prof. (Dr.) Anurag Bhattacharya',
      coMentors: facultyMentors.slice(1).map((m) => m.name),
      studentLeads: studentResearchers.map((s) => s.name),
    };

    const newProjectId = createProjectFromChallenge(challenge.id, teamData);
    addAuditLog(
      'APPROVED_AI_TEAM',
      challenge.id,
      `Multidisciplinary team of ${teamMembers.length} members locked and authorized for Project ${newProjectId}.`
    );
    setIsTeamBuilderModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-200 flex items-start justify-between bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Multidisciplinary Team Builder (Hero Feature)</span>
            </div>
            <h2 className="text-lg md:text-xl font-bold font-heading">
              Team Recommendation: {challenge.title}
            </h2>
            <p className="text-xs text-slate-300">
              Matching challenge requirements in {challenge.location.district} with {selectedUniversity.shortName}&apos;s
              faculty research track records and student talent pool.
            </p>
          </div>

          <button
            onClick={() => setIsTeamBuilderModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multidisciplinary Coverage Bar & Requirement Mapping */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between text-xs gap-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Multidisciplinary Coverage (100% Target Met):</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Human-in-the-Loop Governance: Faculty mentor has final approval authority
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {disciplinesCovered.map((disc, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{disc.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Team Members List (Scrollable) */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Faculty Mentors Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Recommended Faculty Mentors ({teamMembers.filter((m) => m.type === 'faculty').length})</span>
              </h3>
              <span className="text-[11px] text-slate-400">Principal Investigator & Domain Co-Mentors</span>
            </div>

            <div className="space-y-2">
              {teamMembers
                .filter((m) => m.type === 'faculty')
                .map((member) => (
                  <div
                    key={member.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {member.name.split(' ')[1]?.slice(0, 2) || 'DR'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">{member.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                            {member.matchScore}% Match
                          </span>
                        </div>
                        <div className="text-[11px] text-blue-600 font-semibold">{member.role}</div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{member.rationale}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 sm:self-center">
                      <span className="text-[10px] text-slate-400 font-medium px-2 py-1 rounded bg-slate-50">
                        {member.department}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Student Researchers Section */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>Recommended Student Researchers ({teamMembers.filter((m) => m.type === 'student').length})</span>
              </h3>
              <button
                onClick={() => setIsAddingMember(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Student from Talent Pool</span>
              </button>
            </div>

            <div className="space-y-2">
              {teamMembers
                .filter((m) => m.type === 'student')
                .map((member) => (
                  <div
                    key={member.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {member.name.split(' ')[0]?.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">{member.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            {member.matchScore}% Match
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{member.hoursPerWeek}h / week</span>
                        </div>
                        <div className="text-[11px] text-emerald-700 font-semibold">{member.role}</div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{member.rationale}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-600 px-2 py-1 rounded bg-slate-100 font-medium">
                        {member.expertiseOrSkill}
                      </span>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Add Student Sub-form */}
            {isAddingMember && (
              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2 animate-in fade-in">
                <div className="text-xs font-bold text-blue-900">Select Available Student from Talent Pool:</div>
                <div className="grid sm:grid-cols-2 gap-2">
                  <select
                    value={selectedStudentToAdd}
                    onChange={(e) => setSelectedStudentToAdd(e.target.value)}
                    className="text-xs p-2 rounded-lg border border-blue-200 bg-white"
                  >
                    <option value="">-- Choose Candidate --</option>
                    {students
                      .filter((s) => !teamMembers.some((m) => m.id === s.id))
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.department} • {s.skills.slice(0, 2).join(', ')})
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    value={roleForNewStudent}
                    onChange={(e) => setRoleForNewStudent(e.target.value)}
                    placeholder="Assigned Role in Project"
                    className="text-xs p-2 rounded-lg border border-blue-200 bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setIsAddingMember(false)}
                    className="px-3 py-1 text-xs text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddStudent}
                    disabled={!selectedStudentToAdd}
                    className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-lg disabled:opacity-50"
                  >
                    Confirm Add Member
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Approving locks the team roster and provisions a new project workspace at <strong>TRL 2</strong>.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTeamBuilderModalOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleApproveAndCreateProject}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Approve Team & Initialize Project Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
