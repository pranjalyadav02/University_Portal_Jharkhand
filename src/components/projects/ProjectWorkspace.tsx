import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  GitCommit,
  CheckSquare,
  FileCode,
  Radio,
  Handshake,
  DollarSign,
  AlertTriangle,
  Award,
  Rocket,
  Building,
  CheckCircle2,
  Clock,
  Upload,
  Plus,
  ArrowRight,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  FileText,
  FileBadge,
  TrendingUp,
  MapPin,
  MessageSquareHeart,
  ChevronRight,
  X,
  BookOpen,
  Calendar,
  Layers,
  Flag,
} from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';
import { Project, TRLStage, TRLEvidence } from '../../types';
import { LessonsLearnedModule } from '../lessons/LessonsLearnedModule';
import { ProjectGanttChart } from './ProjectGanttChart';

export const ProjectWorkspace: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    advanceProjectTRL,
    toggleTaskStatus,
    currentUserRole,
    activeTab: globalActiveTab,
  } = useUniversity();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'gantt'
    | 'trl_tracker'
    | 'tasks'
    | 'prototypes'
    | 'field_pilot'
    | 'lessons_learned'
    | 'industry'
    | 'funding'
    | 'risks'
    | 'ipr_startup'
    | 'govt_liaison'
  >(() => {
    if (globalActiveTab === 'project_gantt') return 'gantt';
    if (globalActiveTab === 'lessons_learned') return 'lessons_learned';
    if (globalActiveTab === 'field_pilots') return 'field_pilot';
    if (globalActiveTab === 'trl_tracker') return 'trl_tracker';
    return 'overview';
  });

  const [milestoneViewMode, setMilestoneViewMode] = useState<'cards' | 'gantt'>('gantt');

  useEffect(() => {
    if (globalActiveTab === 'project_gantt') {
      setActiveTab('gantt');
    } else if (globalActiveTab === 'lessons_learned') {
      setActiveTab('lessons_learned');
    } else if (globalActiveTab === 'field_pilots') {
      setActiveTab('field_pilot');
    } else if (globalActiveTab === 'trl_tracker') {
      setActiveTab('trl_tracker');
    }
  }, [globalActiveTab]);

  const [isAdvanceTRLModalOpen, setIsAdvanceTRLModalOpen] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [evidenceDocRef, setEvidenceDocRef] = useState('');
  const [approverName, setApproverName] = useState('Prof. (Dr.) Anurag Bhattacharya');
  const [targetTRLToAdvance, setTargetTRLToAdvance] = useState<number>(3);

  const project = projects.find((p) => p.id === selectedProjectId) || projects[0];
  if (!project) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
        <FolderKanban className="w-8 h-8 text-slate-400 mx-auto" />
        <div className="text-sm font-bold text-slate-800 mt-2">No active projects found</div>
      </div>
    );
  }

  const trlDefinitions: Record<TRLStage, { title: string; desc: string }> = {
    1: { title: 'Basic Principles Observed', desc: 'Scientific literature review & theoretical formulation' },
    2: { title: 'Technology Concept Formulated', desc: 'System architecture, block diagram & multidisciplinary plan' },
    3: { title: 'Experimental Proof of Concept', desc: 'Benchtop lab validation with synthetic/controlled samples' },
    4: { title: 'Lab Component Validation', desc: 'Integrated PCB & components tested in flow-loop test bench' },
    5: { title: 'Relevant Environment Validation', desc: 'Campus borewell / simulated real-world conditions for 30+ days' },
    6: { title: 'High-Risk Prototype Demonstration', desc: 'Rugged engineering model deployed on live village infrastructure' },
    7: { title: 'Operational Prototype Demonstrated', desc: 'Full field pilot across multiple panchayats with citizen telemetry' },
    8: { title: 'System Complete & Qualified', desc: 'Passed all NABL/government compliance & environmental durability checks' },
    9: { title: 'Proven in Real Community Environment', desc: 'Turnkey statewide adoption, commercialization or open public utility' },
  };

  const handleAdvanceTRL = (e: React.FormEvent) => {
    e.preventDefault();
    if (evidenceTitle && evidenceDocRef) {
      advanceProjectTRL(project.id, targetTRLToAdvance, {
        title: evidenceTitle,
        description: evidenceDesc || 'Verified supporting experimental documentation and lab validation.',
        approvedBy: approverName,
        approvalRole: currentUserRole === 'faculty' ? 'Lead Faculty Mentor' : 'Institutional Review Authority',
        approvalDate: new Date().toISOString().split('T')[0],
        documentRef: evidenceDocRef,
      });
      setIsAdvanceTRLModalOpen(false);
      setEvidenceTitle('');
      setEvidenceDesc('');
      setEvidenceDocRef('');
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Project Switcher Bar if multiple projects */}
      {projects.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold shrink-0">Switch Project:</span>
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all ${
                p.id === project.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {p.id}: {p.title.split(':')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Project Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-blue-700 font-mono">{project.id}</span>
              <span className="text-slate-400">•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                {project.domain}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 font-medium">Challenge Ref: {project.challengeId}</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Team: {project.teamId} ({project.teamSize} Members)</span>
              </span>
            </div>

            <h1 className="text-lg md:text-2xl font-bold text-slate-900 font-heading">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span><strong>Lead Faculty:</strong> {project.leadFaculty}</span>
              <span>•</span>
              <span><strong>Budget:</strong> {project.funding.totalBudget} ({project.funding.source.split('(')[0]})</span>
            </div>
          </div>

          {/* Current TRL Level Badge & Advance Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 shrink-0">
            <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-2 text-left lg:text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                Technology Readiness Level
              </div>
              <div className="text-xl font-bold text-purple-900 font-heading">
                TRL {project.currentTRL} / 9
              </div>
              <div className="text-[11px] text-purple-700 font-medium">
                {trlDefinitions[project.currentTRL]?.title}
              </div>
            </div>

            {project.currentTRL < 9 && (
              <button
                onClick={() => {
                  setTargetTRLToAdvance(project.currentTRL + 1);
                  setIsAdvanceTRLModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <GitCommit className="w-3.5 h-3.5" />
                <span>Advance to TRL {project.currentTRL + 1}</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex justify-between text-xs text-slate-600">
            <span className="font-semibold">Project Stage: {project.lifecycleStage}</span>
            <span>Overall Readiness: {project.progressPercentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${project.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview & Milestones', icon: FolderKanban },
            { id: 'gantt', label: 'GANTT & Pacing Timeline', icon: Calendar },
            { id: 'trl_tracker', label: 'TRL 1–9 Progression Ladder', icon: GitCommit },
            { id: 'tasks', label: 'Tasks & Kanban', icon: CheckSquare },
            { id: 'prototypes', label: 'Prototypes & Models', icon: FileCode },
            { id: 'field_pilot', label: 'Field Pilot & Community', icon: Radio },
            { id: 'lessons_learned', label: 'Lessons Learned Archive', icon: BookOpen },
            { id: 'industry', label: 'Industry / CSR', icon: Handshake },
            { id: 'funding', label: 'Milestone Funding', icon: DollarSign },
            { id: 'risks', label: 'AI Risk Engine', icon: AlertTriangle },
            { id: 'ipr_startup', label: 'IPR & Incubation', icon: Rocket },
            { id: 'govt_liaison', label: 'Govt Liaison', icon: Building },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview & Milestones */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Team Roster Card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>Multidisciplinary Roster</span>
                <span className="text-blue-600">{project.teamSize} Members</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium">Principal Investigator:</span>
                  <div className="font-bold text-slate-900">{project.leadFaculty}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-medium">Faculty Co-Mentors:</span>
                  {project.coMentors.map((c, i) => (
                    <div key={i} className="text-slate-700 font-medium">{c}</div>
                  ))}
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-medium">Student Leads:</span>
                  {project.studentLeads.map((s, i) => (
                    <div key={i} className="text-slate-700 font-medium">{s}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Funding Status Card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>Funding Status</span>
                <span className="text-emerald-700 font-bold">{project.funding.totalBudget}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Sanctioned:</span>
                  <span className="font-bold text-slate-800">{project.funding.sanctioned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Received (Tranches 1-3):</span>
                  <span className="font-bold text-emerald-700">{project.funding.received}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expended so far:</span>
                  <span className="font-bold text-slate-700">{project.funding.expended}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Remaining Balance:</span>
                  <span className="font-bold text-blue-700">{project.funding.remaining}</span>
                </div>
              </div>
            </div>

            {/* Community Impact Preview Card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>Field Pilot Summary</span>
                <span className="text-sky-700 font-bold">Gumla District</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500">Community Validation Score:</span>
                  <div className="text-lg font-bold text-emerald-700 font-heading">
                    {project.communityValidationScore} / 100
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 leading-snug">
                  5 telemetry nodes deployed on community handpumps in Bakhratoli. 91% satisfaction among Jal Sahiyas.
                </div>
              </div>
            </div>
          </div>

          {/* Milestones Progression Timeline & GANTT */}
          <div className="space-y-4">
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                    <Flag className="w-4 h-4 text-blue-600" />
                    <span>Project Milestones, TRL Gates & Funding Tranches</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time execution schedule tracking research milestones, TRL checkpoints, and task pacing.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                    <button
                      onClick={() => setMilestoneViewMode('gantt')}
                      className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                        milestoneViewMode === 'gantt'
                          ? 'bg-white text-blue-700 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Visual GANTT Timeline</span>
                    </button>
                    <button
                      onClick={() => setMilestoneViewMode('cards')}
                      className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                        milestoneViewMode === 'cards'
                          ? 'bg-white text-blue-700 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      <span>Cards List</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* GANTT Timeline or Cards Switch */}
              {milestoneViewMode === 'gantt' ? (
                <div className="pt-2">
                  <ProjectGanttChart
                    project={project}
                    onAdvanceTRLClick={() => {
                      setTargetTRLToAdvance(project.currentTRL + 1);
                      setIsAdvanceTRLModalOpen(true);
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {project.milestones.map((m, idx) => (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        m.status === 'Completed'
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : m.status === 'In Progress'
                          ? 'bg-blue-50/50 border-blue-200'
                          : 'bg-slate-50/50 border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                              m.status === 'Completed'
                                ? 'bg-emerald-600 text-white'
                                : m.status === 'In Progress'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-300 text-slate-700'
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                              <span>{m.title}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-purple-100 text-purple-800">
                                TRL {m.trlTarget}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                              <span>Target: {m.targetDate}</span>
                              <span>•</span>
                              <span>{m.fundingTranche} ({m.fundingPercentage}%)</span>
                              <span>•</span>
                              <span
                                className={`font-semibold ${
                                  m.isUnlocked ? 'text-emerald-700' : 'text-slate-400'
                                }`}
                              >
                                {m.isUnlocked ? '✓ Tranche Released' : '🔒 Locked'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full self-start sm:self-center ${
                            m.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap gap-2 text-xs">
                        <span className="text-slate-500 font-medium">Deliverables:</span>
                        {m.deliverables.map((d, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 text-[11px]">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Project Lifecycle Management: Lessons Learned & Knowledge Capture */}
          <div className="pt-2">
            <LessonsLearnedModule project={project} variant="lifecycle" />
          </div>
        </div>
      )}

      {/* Dedicated Tab: GANTT & Pacing Timeline */}
      {activeTab === 'gantt' && (
        <div className="space-y-4">
          <ProjectGanttChart
            project={project}
            onAdvanceTRLClick={() => {
              setTargetTRLToAdvance(project.currentTRL + 1);
              setIsAdvanceTRLModalOpen(true);
            }}
          />
        </div>
      )}

      {/* Tab 2: TRL 1–9 Tracker (HERO FEATURE) */}
      {activeTab === 'trl_tracker' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading">
                  Technology Readiness Level (TRL 1–9) Verification Ladder
                </h3>
                <p className="text-xs text-slate-500">
                  Each progression requires authorized approval, supporting evidence document, and experimental verification.
                </p>
              </div>

              {project.currentTRL < 9 && (
                <button
                  onClick={() => {
                    setTargetTRLToAdvance(project.currentTRL + 1);
                    setIsAdvanceTRLModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Submit Evidence for TRL {project.currentTRL + 1}</span>
                </button>
              )}
            </div>

            {/* Visual TRL Ladder Grid */}
            <div className="grid gap-2.5 pt-2">
              {([1, 2, 3, 4, 5, 6, 7, 8, 9] as TRLStage[]).map((lvl) => {
                const isPassed = lvl <= project.currentTRL;
                const isCurrent = lvl === project.currentTRL;
                const isNext = lvl === project.currentTRL + 1;
                const evidence = project.trlHistory.find((h) => h.trlLevel === lvl);

                return (
                  <div
                    key={lvl}
                    className={`p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-purple-50/90 border-purple-300 ring-2 ring-purple-400 shadow-xs'
                        : isPassed
                        ? 'bg-white border-slate-200'
                        : isNext
                        ? 'bg-slate-50 border-dashed border-purple-300'
                        : 'bg-slate-50/50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isCurrent
                              ? 'bg-purple-600 text-white'
                              : isPassed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {lvl}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <span>TRL {lvl}: {trlDefinitions[lvl].title}</span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 animate-pulse">
                                Active Current Stage
                              </span>
                            )}
                            {isPassed && !isCurrent && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                ✓ Certified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{trlDefinitions[lvl].desc}</p>

                          {/* Evidence Citation if passed */}
                          {evidence && (
                            <div className="mt-2 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-0.5">
                              <div className="font-semibold text-slate-800">Evidence: {evidence.title}</div>
                              <div className="text-slate-500">{evidence.description}</div>
                              <div className="flex items-center gap-3 text-slate-400 pt-0.5">
                                <span>Ref: <strong className="font-mono text-blue-600">{evidence.documentRef}</strong></span>
                                <span>•</span>
                                <span>Approved by: {evidence.approvedBy} ({evidence.approvalRole})</span>
                                <span>•</span>
                                <span>Date: {evidence.approvalDate}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {isNext && (
                        <button
                          onClick={() => {
                            setTargetTRLToAdvance(lvl);
                            setIsAdvanceTRLModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shrink-0 self-start sm:self-center"
                        >
                          Submit Evidence
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Tasks & Kanban */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Project Execution Kanban Board
            </h3>
            <span className="text-xs text-slate-500 font-medium">Click any card to cycle status</span>
          </div>

          <div className="grid md:grid-cols-4 gap-3 text-xs">
            {(['todo', 'in_progress', 'review', 'done'] as const).map((col) => {
              const colTasks = (project.tasks || []).filter((t) => t.status === col);
              const colTitles: Record<string, { label: string; color: string }> = {
                todo: { label: 'To Do', color: 'border-slate-300 bg-slate-100 text-slate-700' },
                in_progress: { label: 'In Progress', color: 'border-blue-300 bg-blue-50 text-blue-800' },
                review: { label: 'In Review', color: 'border-purple-300 bg-purple-50 text-purple-800' },
                done: { label: 'Completed', color: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
              };

              return (
                <div key={col} className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${colTitles[col].color}`}>
                      {colTitles[col].label}
                    </span>
                    <span className="text-slate-400">{colTasks.length}</span>
                  </div>

                  <div className="space-y-2">
                    {colTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTaskStatus(project.id, task.id)}
                        className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-all space-y-2"
                      >
                        <div className="font-bold text-slate-900 leading-snug">{task.title}</div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{task.assignee.split('&')[0]}</span>
                          <span
                            className={`font-semibold ${
                              task.priority === 'High' ? 'text-rose-600' : 'text-slate-600'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map((tag) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.2 bg-slate-100 rounded text-slate-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Prototypes & Versions */}
      {activeTab === 'prototypes' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading">
                  Prototype Versions, CAD, Models & Test Logs
                </h3>
                <p className="text-xs text-slate-500">
                  Maintained repository of hardware revisions, embedded firmware and TinyML models
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {project.prototypes.map((proto) => (
                <div
                  key={proto.version}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs font-heading">{proto.name}</span>
                        <span className="text-[11px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                          {proto.version}
                        </span>
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {proto.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{proto.notes}</p>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        proto.status === 'Field Ready'
                          ? 'bg-emerald-100 text-emerald-800'
                          : proto.status === 'Lab Testing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {proto.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>Release Date: {proto.releaseDate}</span>
                    <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                      Download CAD / Firmware Bin
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Field Pilot & Community Validation */}
      {activeTab === 'field_pilot' && (
        project.fieldPilot ? (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                  Community Field Pilot ({project.fieldPilot.id})
                </span>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  {project.fieldPilot.location}
                </h3>
              </div>
              <span className="px-3 py-1 bg-sky-100 text-sky-900 rounded-full font-bold text-xs self-start sm:self-auto">
                {project.fieldPilot.status}
              </span>
            </div>

            {/* Pilot Contacts & Duration */}
            <div className="grid sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl text-xs">
              <div>
                <span className="text-slate-500 block">District Liaison:</span>
                <strong className="text-slate-900">{project.fieldPilot.govtLiaisonOfficer}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Community Custodian:</span>
                <strong className="text-slate-900">{project.fieldPilot.communityContact}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Beneficiaries So Far:</span>
                <strong className="text-emerald-700">
                  {project.fieldPilot.actualBeneficiariesSoFar.toLocaleString()} / {project.fieldPilot.targetBeneficiaries.toLocaleString()}
                </strong>
              </div>
            </div>

            {/* Metrics Baseline vs Current */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Measurable Field Pilot Outcomes
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {project.fieldPilot.metrics.map((m, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 text-xs">
                    <div className="font-bold text-slate-800">{m.name}</div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Baseline: {m.baseline}</span>
                      <span className="text-slate-500">Target: {m.target}</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-700 bg-emerald-50 p-1.5 rounded text-center mt-1">
                      Current Outcome: {m.currentResult}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Citizen Testimonials */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Citizen & Jal Sahiya Validation ({project.fieldPilot.citizenFeedbackSummary.satisfactionRate}% Satisfaction)
                </span>
                <span className="text-xs text-slate-500">
                  {project.fieldPilot.citizenFeedbackSummary.totalResponses} Survey Responses
                </span>
              </div>

              <div className="space-y-2">
                {project.fieldPilot.citizenFeedbackSummary.keyQuotes.map((q, i) => (
                  <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-xs">
                    <p className="italic text-slate-800">&ldquo;{q.quote}&rdquo;</p>
                    <div className="text-[11px] text-slate-600 font-semibold">
                      — {q.citizenName}, {q.role} ({q.village})
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Field Pilot Lessons Learned Module */}
            <div className="pt-3 border-t border-slate-200">
              <LessonsLearnedModule project={project} variant="field_pilot" />
            </div>
          </div>
        </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Field Pilot Site Selection Pending</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Field pilot validation unlocks upon completing Lab Prototype Testing (TRL 4). District administration will assign local panchayat testing sites once benchtop metrics are verified.
              </p>
            </div>
            {/* Still allow teams to review and document field lessons from past pilots */}
            <LessonsLearnedModule project={project} variant="field_pilot" />
          </div>
        )
      )}

      {/* Tab: Lessons Learned Archive & Future Project Planning */}
      {activeTab === 'lessons_learned' && (
        <div className="space-y-4">
          <LessonsLearnedModule
            project={project}
            variant="standalone_planning"
            title="Lessons Learned Archive & Future Project Planning Knowledge Base"
            subtitle="Searchable repository of past technical failures, community adoption hurdles, and proven resolution strategies from completed projects and field pilots across Jharkhand universities."
          />
        </div>
      )}

      {/* Tab 6: Industry & CSR */}
      {activeTab === 'industry' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading">
                  Industry & CSR Partnerships
                </h3>
                <p className="text-xs text-slate-500">
                  Corporate partners providing matching grants, testing bays and commercialization pathways
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {project.industryPartners.map((partner) => (
                <div key={partner.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900 font-heading">{partner.name}</div>
                      <span className="text-[11px] text-blue-700 font-semibold">{partner.type} • Contact: {partner.contactPerson}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      {partner.status} ({partner.matchScore}% Match)
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="font-semibold text-slate-700">Committed Contributions:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      {partner.contributionOffered.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Milestone Funding */}
      {activeTab === 'funding' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Milestone-Based Grant Tranches & Expenditure Audit
            </h3>

            <div className="grid sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-slate-500">Total Sanctioned</span>
                <div className="text-lg font-bold text-blue-900 font-heading">{project.funding.sanctioned}</div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-slate-500">Disbursed (Tranches 1-3)</span>
                <div className="text-lg font-bold text-emerald-900 font-heading">{project.funding.received}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500">Expended to Date</span>
                <div className="text-lg font-bold text-slate-800 font-heading">{project.funding.expended}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-slate-500">Remaining Balance</span>
                <div className="text-lg font-bold text-purple-900 font-heading">{project.funding.remaining}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: AI Risk Engine */}
      {activeTab === 'risks' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading">
                  AI Project Risk & Bottleneck Engine
                </h3>
                <p className="text-xs text-slate-500">
                  Continuous AI monitoring of milestone pacing, equipment availability and field blockages
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {project.risks.length === 0 ? (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-semibold">
                  ✓ No critical risks detected. Pacing is nominal.
                </div>
              ) : (
                project.risks.map((risk) => (
                  <div key={risk.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-slate-900">{risk.title}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          risk.severity === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {risk.severity} Severity
                      </span>
                    </div>

                    <p className="text-slate-600">{risk.description}</p>

                    <div className="p-2.5 bg-blue-50/70 rounded-lg border border-blue-200">
                      <span className="font-bold text-blue-900">AI Recommended Mitigation: </span>
                      <span className="text-blue-950">{risk.suggestedResolution}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 9: IPR & Startup Incubation */}
      {activeTab === 'ipr_startup' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            {/* IPR Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold font-heading">
                <FileBadge className="w-4 h-4 text-purple-600" />
                <span>Intellectual Property & Patents</span>
              </div>

              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 space-y-1">
                <div className="font-bold text-purple-900">{project.iprStatus.type}</div>
                <div className="text-slate-700 font-medium">{project.iprStatus.title}</div>
                {project.iprStatus.applicationNumber && (
                  <div className="text-[11px] text-slate-500 font-mono">
                    App No: {project.iprStatus.applicationNumber} (Filed: {project.iprStatus.filingDate})
                  </div>
                )}
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="font-bold text-slate-800">Associated Publications:</div>
                {project.publications.map((pub, i) => (
                  <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                    <div className="font-semibold text-slate-900">{pub.title}</div>
                    <div className="text-slate-500">{pub.venue} ({pub.year}) — <span className="text-blue-600">{pub.status}</span></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Incubation Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold font-heading">
                <Rocket className="w-4 h-4 text-amber-600" />
                <span>Startup Spin-off & Incubation (CIIE)</span>
              </div>

              {project.startupIncubation ? (
                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-900">{project.startupIncubation.ventureName}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
                      {project.startupIncubation.stage}
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11px]">{project.startupIncubation.potentialMarket}</p>
                  <div className="text-[10px] text-slate-500">
                    Host Incubator: {project.startupIncubation.incubatorName}
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 p-4 text-center">Incubation candidate identification in progress.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 10: Government Liaison */}
      {activeTab === 'govt_liaison' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Government Line Department Coordination Portal
            </h3>
            <p className="text-slate-500">
              Official requests, field clearances and deployment certifications from DWSD Jharkhand.
            </p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-800">State Nodal Officer</div>
              <div className="text-slate-700">Shri Rakesh Kumar Sinha, IAS (Special Secretary & Mission Director JJM)</div>
              <div className="text-slate-500">Official Channel: missiondirector.jjm@jharkhand.gov.in</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Advance TRL with Evidence Gate */}
      {isAdvanceTRLModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 space-y-4 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-bold text-purple-700 uppercase tracking-wider text-[11px]">
                  Authorized TRL Gate Review
                </span>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Advance to TRL {targetTRLToAdvance}: {trlDefinitions[targetTRLToAdvance as TRLStage]?.title}
                </h3>
              </div>
              <button onClick={() => setIsAdvanceTRLModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdvanceTRL} className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-950 leading-relaxed text-[11px]">
                <strong>Statutory Rule:</strong> TRL progression requires uploaded test documentation, verified experimental evidence, and authorized mentor signature.
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Evidence Title:</label>
                <input
                  type="text"
                  required
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  placeholder="E.g., 45-Day Continuous Borewell Telemetry Validation"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Reference / Link:</label>
                <input
                  type="text"
                  required
                  value={evidenceDocRef}
                  onChange={(e) => setEvidenceDocRef(e.target.value)}
                  placeholder="E.g., DOC-TRL-VAL-GUMLA-2026.pdf"
                  className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Approving Faculty / Officer:</label>
                <input
                  type="text"
                  required
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdvanceTRLModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Authorize & Advance TRL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
