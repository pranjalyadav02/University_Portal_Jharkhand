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
  Edit3,
  Save,
  Send,
  Building2,
  UserCheck,
  Check,
  Percent,
} from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';
import { Project, TRLStage, TRLEvidence, BudgetItem, ProjectScopeReport } from '../../types';
import { LessonsLearnedModule } from '../lessons/LessonsLearnedModule';

export const ProjectWorkspace: React.FC = () => {
  const {
    assignedProjects,
    selectedProjectId,
    setSelectedProjectId,
    advanceProjectTRL,
    toggleTaskStatus,
    currentUserRole,
    currentUserName,
    updateProjectScopeAndBudget,
    dispatchToIndustryPlatform,
    activeTab: globalActiveTab,
  } = useUniversity();

  const [activeTab, setActiveTab] = useState<
    | 'report'
    | 'budget'
    | 'industry'
    | 'tasks'
    | 'trl_tracker'
    | 'field_pilot'
    | 'lessons_learned'
  >(() => {
    if (globalActiveTab === 'lessons_learned') return 'lessons_learned';
    if (globalActiveTab === 'field_pilots') return 'field_pilot';
    if (globalActiveTab === 'trl_tracker') return 'trl_tracker';
    if (globalActiveTab === 'collaboration_industry') return 'industry';
    return 'report';
  });

  useEffect(() => {
    if (globalActiveTab === 'lessons_learned') {
      setActiveTab('lessons_learned');
    } else if (globalActiveTab === 'field_pilots') {
      setActiveTab('field_pilot');
    } else if (globalActiveTab === 'trl_tracker') {
      setActiveTab('trl_tracker');
    } else if (globalActiveTab === 'collaboration_industry') {
      setActiveTab('industry');
    }
  }, [globalActiveTab]);

  const [isAdvanceTRLModalOpen, setIsAdvanceTRLModalOpen] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [evidenceDocRef, setEvidenceDocRef] = useState('');
  const [approverName, setApproverName] = useState(currentUserName);
  const [targetTRLToAdvance, setTargetTRLToAdvance] = useState<number>(3);

  // Scope Report Edit State
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [editDiagnosis, setEditDiagnosis] = useState('');
  const [editScope, setEditScope] = useState('');
  const [editMethodology, setEditMethodology] = useState('');
  const [editBeneficiaries, setEditBeneficiaries] = useState('');

  // Add Budget Item State
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState<BudgetItem['category']>('Capital Equipment');
  const [newBudgetItem, setNewBudgetItem] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [newBudgetJustification, setNewBudgetJustification] = useState('');

  // Toast / Status banner
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const project = assignedProjects.find((p) => p.id === selectedProjectId) || assignedProjects[0];

  // Sync form inputs when project changes
  useEffect(() => {
    if (project) {
      setEditDiagnosis(project.scopeReport?.problemDiagnosis || '');
      setEditScope(project.scopeReport?.scopeOfWork || '');
      setEditMethodology(project.scopeReport?.technicalMethodology || '');
      setEditBeneficiaries(project.scopeReport?.targetBeneficiaries || '');
    }
  }, [project]);

  if (!project) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-2xl mx-auto my-12 space-y-4">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
          📂
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          No Assigned Projects Found
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {currentUserRole === 'leadership'
            ? 'No research projects are currently registered. Go to "Identify Problems" to adopt a civic challenge and assign it to a faculty mentor.'
            : currentUserRole === 'faculty'
            ? `You (${currentUserName}) do not have any projects assigned yet. Deans / Vice Deans officially assign challenges to faculty mentors.`
            : `You (${currentUserName}) are not currently assigned to an active student research team. Please consult your Dean or Faculty Mentor.`}
        </p>
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
      showToast(`Successfully advanced Project ${project.id} to TRL ${targetTRLToAdvance}!`);
    }
  };

  const handleSaveScopeReport = () => {
    const updatedScope: ProjectScopeReport = {
      problemDiagnosis: editDiagnosis,
      objectives: project.scopeReport?.objectives || [
        'Develop reliable, low-cost community prototype',
        'Validate performance under real district field conditions',
        'Prepare detailed itemized budget & proposal for industry co-funding',
      ],
      scopeOfWork: editScope,
      technicalMethodology: editMethodology,
      deliverables: project.scopeReport?.deliverables || [
        'Calibrated Sensor / Hardware Prototype',
        'NABL Laboratory Benchmark Certification',
        'District Field Deployment Telemetry',
      ],
      targetBeneficiaries: editBeneficiaries,
      status: currentUserRole === 'leadership' ? 'Approved by Dean' : 'Finalized',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    updateProjectScopeAndBudget(project.id, updatedScope, project.itemizedBudget || []);
    setIsEditingReport(false);
    showToast('Project Scope & Technical Report saved successfully!');
  };

  const handleAddBudgetItem = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(newBudgetAmount.replace(/[^0-9]/g, '')) || 0;
    if (!newBudgetItem || amountNum <= 0) return;

    const newItem: BudgetItem = {
      id: `b-${Date.now()}`,
      category: newBudgetCategory,
      item: newBudgetItem,
      amount: amountNum,
      justification: newBudgetJustification || 'Required for research and prototype validation.',
    };

    const currentItems = project.itemizedBudget || [];
    const updatedItems = [...currentItems, newItem];

    const currentScope = project.scopeReport || {
      problemDiagnosis: project.title,
      objectives: ['Complete prototype development', 'Conduct field testing'],
      scopeOfWork: 'Lab and field experimentation.',
      technicalMethodology: 'Standard engineering prototyping.',
      deliverables: ['Prototype model', 'Test data'],
      targetBeneficiaries: 'Community residents',
      status: 'Draft',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    updateProjectScopeAndBudget(project.id, currentScope, updatedItems);
    setIsAddingBudget(false);
    setNewBudgetItem('');
    setNewBudgetAmount('');
    setNewBudgetJustification('');
    showToast(`Added ₹${amountNum.toLocaleString('en-IN')} line item to project budget.`);
  };

  const handleRemoveBudgetItem = (id: string) => {
    const currentItems = project.itemizedBudget || [];
    const updatedItems = currentItems.filter((item) => item.id !== id);
    if (project.scopeReport) {
      updateProjectScopeAndBudget(project.id, project.scopeReport, updatedItems);
      showToast('Budget item removed.');
    }
  };

  const handleDispatchIndustry = () => {
    dispatchToIndustryPlatform(project.id);
    showToast('🚀 Detailed Project Report & Budget submitted to Industry Platform!');
  };

  // Calculations
  const itemizedSum = (project.itemizedBudget || []).reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalBudgetVal = itemizedSum > 0 ? itemizedSum : parseInt(project.funding.totalBudget.replace(/[^0-9]/g, '')) || 1450000;
  const universityInKind = 250000;
  const corporateTarget = Math.max(0, totalBudgetVal - universityInKind);

  // EOIs
  const eois = project.industryProposal?.expressionsOfInterest || [];
  const totalPledged = eois.reduce((s, e) => s + (e.pledgedAmount || 0), 0);
  const fundingProgress = corporateTarget > 0 ? Math.min(100, Math.round((totalPledged / corporateTarget) * 100)) : 0;

  return (
    <div className="space-y-5 pb-16">
      {/* Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Project Switcher Bar (Filtered strictly to Assigned Projects) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-bold shrink-0 flex items-center gap-1">
          <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
          <span>My Assigned Projects ({assignedProjects.length}):</span>
        </span>
        {assignedProjects.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProjectId(p.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
              p.id === project.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="font-mono">{p.id}</span>
            <span>•</span>
            <span className="truncate max-w-[200px]">{p.title.split(':')[0]}</span>
          </button>
        ))}
      </div>

      {/* Project Header Banner with Role Persona & TRL */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-blue-700 font-mono px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200">
                {project.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-200">
                {project.domain}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 font-medium">Challenge Ref: {project.challengeId}</span>
              <span className="text-slate-400">•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-600" />
                <span>
                  {currentUserRole === 'leadership'
                    ? 'Dean Oversight'
                    : currentUserRole === 'faculty'
                    ? `PI: ${project.leadFaculty}`
                    : `Assigned Student: ${currentUserName}`}
                </span>
              </span>
            </div>

            <h1 className="text-lg md:text-2xl font-bold text-slate-900 font-heading">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span><strong>Lead Faculty:</strong> {project.leadFaculty}</span>
              <span>•</span>
              <span><strong>Total Budget:</strong> ₹{totalBudgetVal.toLocaleString('en-IN')}</span>
              <span>•</span>
              <span><strong>Team:</strong> {project.teamSize} Researchers ({project.teamId})</span>
              {project.industryProposal?.status === 'Sent to Industry Platform' && (
                <>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Dispatched to Industry Platform</span>
                  </span>
                </>
              )}
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

            {project.currentTRL < 9 && currentUserRole !== 'student' && (
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

        {/* Linear Workflow Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'report', label: '1. Problem Scope & Report', icon: FileText },
            { id: 'budget', label: '2. Itemized Budget Estimation', icon: DollarSign },
            { id: 'industry', label: '3. Send to Industry (EOIs)', icon: Handshake, badge: eois.length > 0 ? `${eois.length} Interested` : undefined },
            { id: 'tasks', label: '4. Tasks & Execution', icon: CheckSquare },
            { id: 'trl_tracker', label: '5. TRL Progression Ladder', icon: GitCommit },
            { id: 'field_pilot', label: '6. Field Pilot Telemetry', icon: Radio },
            { id: 'lessons_learned', label: '7. Lessons Learned', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: PROBLEM SCOPE & DETAILED PROJECT REPORT
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'report' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    Document Ref: REP-{project.id}-v1.4
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-medium">
                    Status: <strong className="text-slate-800">{project.scopeReport?.status || 'Approved by Dean'}</strong>
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">
                    Updated: {project.scopeReport?.lastUpdated || '2026-09-08'}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  Comprehensive Project Scope & Technical Proposal Dossier
                </h2>
                <p className="text-xs text-slate-500">
                  Formulated for government compliance, institutional review, and corporate CSR/R&D evaluation.
                </p>
              </div>

              {currentUserRole !== 'student' && (
                <div className="flex items-center gap-2">
                  {isEditingReport ? (
                    <>
                      <button
                        onClick={() => setIsEditingReport(false)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveScopeReport}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Scope Report</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditingReport(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Scope Report</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Section 1: Identified Problem Context */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>1. Problem Diagnosis & Verified Ground Baseline</span>
              </div>
              {isEditingReport ? (
                <textarea
                  value={editDiagnosis}
                  onChange={(e) => setEditDiagnosis(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-blue-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
                  rows={3}
                  placeholder="Describe the diagnosed problem, location, water chemistry/ground truth, and severity..."
                />
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-800 leading-relaxed">
                  {project.scopeReport?.problemDiagnosis ||
                    'Groundwater in pilot district exhibits severe contamination with periodic manual testing latency exceeding 3 weeks. An automated, telemetry-enabled in-situ sensing solution is required to protect rural habitations.'}
                </div>
              )}
            </div>

            {/* Section 2: Objectives & Deliverables */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>2. Specific Research Objectives</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                  {(project.scopeReport?.objectives || [
                    'Develop low-cost, rugged hardware node suitable for rural conditions',
                    'Implement edge anomaly detection and automated SMS alerting',
                    'Validate accuracy against NABL laboratory spectrometry benchmarks',
                    'Conduct live village demonstration across vulnerable panchayats',
                  ]).map((obj, i) => (
                    <li key={i} className="leading-snug">{obj}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3. Tangible Deliverables</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                  {(project.scopeReport?.deliverables || [
                    'Calibrated sensor node hardware prototype',
                    'Embedded firmware codebase and edge ML regression model',
                    'NABL certified laboratory validation report',
                    'Field trial telemetry dashboard and citizen notification gateway',
                  ]).map((del, i) => (
                    <li key={i} className="leading-snug">{del}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Section 3: Scope of Work */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>4. Detailed Scope of Work</span>
              </div>
              {isEditingReport ? (
                <textarea
                  value={editScope}
                  onChange={(e) => setEditScope(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-blue-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
                  rows={3}
                  placeholder="Detail the work packages: lab prototyping, calibration, field deployment, and government integration..."
                />
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-800 leading-relaxed">
                  {project.scopeReport?.scopeOfWork ||
                    'Phase 1: Lab prototyping and mathematical modeling. Phase 2: Flow-loop bench testing. Phase 3: Village field trials in pilot district and integration with District Control Room.'}
                </div>
              )}
            </div>

            {/* Section 4: Technical Methodology */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-blue-500" />
                <span>5. Technical Methodology & System Architecture</span>
              </div>
              {isEditingReport ? (
                <textarea
                  value={editMethodology}
                  onChange={(e) => setEditMethodology(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-blue-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
                  rows={3}
                  placeholder="Detail the sensors, microcontrollers, communication protocols, and energy harvesting methods..."
                />
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-800 leading-relaxed font-mono">
                  {project.scopeReport?.technicalMethodology ||
                    'Electrochemical potentiometry with automated temperature compensation, dual-core MCU, LoRaWAN telemetry with GSM fallback, and hybrid solar-kinetic energy harvester.'}
                </div>
              )}
            </div>

            {/* Section 5: Target Beneficiaries & Impact */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Target Beneficiaries & District Impact
                </div>
                <div className="text-xs text-amber-800 mt-0.5">
                  {project.scopeReport?.targetBeneficiaries || '18,400+ citizens, local schools, and healthcare centers.'}
                </div>
              </div>
              <button
                onClick={() => setActiveTab('budget')}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <span>Proceed to Budget Estimation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: ITEMIZED BUDGET ESTIMATION & FINANCIAL BREAKDOWN
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'budget' && (
        <div className="space-y-4">
          {/* Top KPI Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Proposed Budget</span>
              <div className="text-xl font-bold text-slate-900 font-heading">₹{totalBudgetVal.toLocaleString('en-IN')}</div>
              <p className="text-[10px] text-slate-500">Calculated from itemized work packages</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">University In-Kind Contribution</span>
              <div className="text-xl font-bold text-blue-700 font-heading">₹{universityInKind.toLocaleString('en-IN')}</div>
              <p className="text-[10px] text-slate-500">Lab equipment, test rigs & mentoring</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CSR / Industry Grant Sought</span>
              <div className="text-xl font-bold text-amber-600 font-heading">₹{corporateTarget.toLocaleString('en-IN')}</div>
              <p className="text-[10px] text-slate-500">Requested from corporate CSR & partners</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pledged Co-Funding (EOIs)</span>
              <div className="text-xl font-bold text-emerald-600 font-heading">₹{totalPledged.toLocaleString('en-IN')}</div>
              <p className="text-[10px] text-slate-500">{fundingProgress}% of target pledged by industry</p>
            </div>
          </div>

          {/* Itemized Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Itemized Work Package & Financial Allocation
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Clear itemization gives corporate partners full transparency before expressing financial interest.
                </p>
              </div>

              {currentUserRole !== 'student' && (
                <button
                  onClick={() => setIsAddingBudget(!isAddingBudget)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Budget Item</span>
                </button>
              )}
            </div>

            {/* Inline Add Budget Item Form */}
            {isAddingBudget && (
              <form onSubmit={handleAddBudgetItem} className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-blue-900">Add New Itemized Budget Line:</div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Category</label>
                    <select
                      value={newBudgetCategory}
                      onChange={(e) => setNewBudgetCategory(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-lg border border-blue-200 bg-white mt-1"
                    >
                      <option value="Capital Equipment">Capital Equipment</option>
                      <option value="Consumables & Hardware">Consumables & Hardware</option>
                      <option value="Field Trials & Testing">Field Trials & Testing</option>
                      <option value="Researcher Stipends & Manpower">Researcher Stipends & Manpower</option>
                      <option value="Institutional Overhead & Contingency">Institutional Overhead & Contingency</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Item Description</label>
                    <input
                      type="text"
                      value={newBudgetItem}
                      onChange={(e) => setNewBudgetItem(e.target.value)}
                      placeholder="E.g. ICP-MS Spectrometer Testing Access"
                      className="w-full text-xs p-2 rounded-lg border border-blue-200 bg-white mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Amount (₹ INR)</label>
                    <input
                      type="number"
                      value={newBudgetAmount}
                      onChange={(e) => setNewBudgetAmount(e.target.value)}
                      placeholder="E.g. 250000"
                      className="w-full text-xs p-2 rounded-lg border border-blue-200 bg-white mt-1"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Technical Justification</label>
                  <input
                    type="text"
                    value={newBudgetJustification}
                    onChange={(e) => setNewBudgetJustification(e.target.value)}
                    placeholder="Why this item is essential for the research and field pilot..."
                    className="w-full text-xs p-2 rounded-lg border border-blue-200 bg-white mt-1"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingBudget(false)}
                    className="px-3 py-1 text-xs text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs"
                  >
                    Save Line Item
                  </button>
                </div>
              </form>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Item & Technical Specification</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                    <th className="py-2.5 px-3">Justification & Relevance</th>
                    {currentUserRole !== 'student' && <th className="py-2.5 px-3 text-center">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(project.itemizedBudget || []).map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200 whitespace-nowrap">
                          {b.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {b.item}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                        ₹{b.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-slate-600 text-[11px]">
                        {b.justification}
                      </td>
                      {currentUserRole !== 'student' && (
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleRemoveBudgetItem(b.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove line item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold">
                    <td className="py-3 px-3 text-slate-900" colSpan={2}>
                      Total Estimated Project Budget
                    </td>
                    <td className="py-3 px-3 text-right text-blue-700 font-mono text-sm">
                      ₹{totalBudgetVal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]" colSpan={currentUserRole !== 'student' ? 2 : 1}>
                      100% itemized & audited against university research standards
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom Proceed CTA */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Next: Submit this scope & budget to the Industry Platform so companies can pledge CSR funds.
              </span>
              <button
                onClick={() => setActiveTab('industry')}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <span>Proceed to Industry Platform</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: SEND TO INDUSTRY PLATFORM & CORPORATE SPONSORSHIP (EOIs)
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'industry' && (
        <div className="space-y-5">
          {/* Informational Guidance Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow-md space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-xl">
                🏭
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold tracking-tight text-blue-100 uppercase">
                  Industry Platform & Corporate CSR Pipeline
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed max-w-3xl">
                  Corporations, PSUs, and CSR foundations do not commit funding by project name alone.
                  Once you submit your <strong>Project Scope Report</strong> and <strong>Itemized Budget</strong>,
                  it appears directly on the <strong>Industry Platform</strong> (http://localhost:3004) where company CSR heads evaluate and pledge matching funds.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-300">Platform Status:</span>
                {project.industryProposal?.status === 'Sent to Industry Platform' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Dispatched to Industry Platform ({project.industryProposal.dispatchedAt})</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold">
                    Draft Proposal — Ready for Submission
                  </span>
                )}
              </div>

              {currentUserRole !== 'student' && (
                <button
                  onClick={handleDispatchIndustry}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {project.industryProposal?.status === 'Sent to Industry Platform'
                      ? 'Re-Sync Project Proposal to Industry Platform'
                      : '🚀 Submit Project Report & Budget to Industry Platform'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Co-Funding Status Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-bold text-slate-900 text-sm">Industry Sponsorship Progress</span>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Target CSR Co-Funding: <strong>₹{corporateTarget.toLocaleString('en-IN')}</strong> • Pledged So Far: <strong>₹{totalPledged.toLocaleString('en-IN')}</strong>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-emerald-600 font-heading">{fundingProgress}%</span>
                <span className="text-slate-400 text-xs ml-1">funded</span>
              </div>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${fundingProgress}%` }}
              />
            </div>
          </div>

          {/* Expressions of Interest (EOIs) Received from Companies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Handshake className="w-4 h-4 text-blue-600" />
                <span>Industry Expressions of Interest (EOIs) Received ({eois.length})</span>
              </h3>
              <span className="text-xs text-slate-500">
                Direct inquiries from corporate CSR & R&D leaders
              </span>
            </div>

            {eois.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="text-xs font-bold text-slate-700">No Expressions of Interest Yet</div>
                <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                  Click the "Submit Project Report & Budget to Industry Platform" button above to publish your proposal dossier to industry partners.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {eois.map((eoi) => (
                  <div
                    key={eoi.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                          {eoi.mode}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">{eoi.companyName}</h4>
                        <div className="text-[11px] text-slate-500">{eoi.contactPerson} • {eoi.contactEmail}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-700 font-mono">
                          ₹{eoi.pledgedAmount.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-slate-400">Pledged Sponsorship</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs text-slate-700 italic leading-relaxed">
                      "{eoi.message}"
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[10px] text-slate-400">Received on: {eoi.date}</span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {eoi.status}
                        </span>
                        {currentUserRole !== 'student' && (
                          <button
                            onClick={() => showToast(`Meeting invite sent to ${eoi.contactPerson} (${eoi.companyName})!`)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg shadow-2xs"
                          >
                            Schedule Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: TASKS & KANBAN EXECUTION
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Research Tasks & Kanban Board</h3>
                <p className="text-xs text-slate-500">
                  Assigned researchers can update execution status and submit deliverables.
                </p>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                {project.tasks.filter((t) => t.status === 'done').length} of {project.tasks.length} Completed
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(['todo', 'in_progress', 'review', 'done'] as const).map((colStatus) => {
                const colLabels = {
                  todo: { title: 'To Do', color: 'border-slate-300 bg-slate-50' },
                  in_progress: { title: 'In Progress', color: 'border-blue-300 bg-blue-50/50' },
                  review: { title: 'Under Review', color: 'border-amber-300 bg-amber-50/50' },
                  done: { title: 'Completed', color: 'border-emerald-300 bg-emerald-50/50' },
                };
                const colTasks = project.tasks.filter((t) => t.status === colStatus);

                return (
                  <div key={colStatus} className={`p-3 rounded-xl border ${colLabels[colStatus].color} space-y-2.5`}>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{colLabels[colStatus].title}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white border border-slate-200 font-mono">
                        {colTasks.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {colTasks.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => toggleTaskStatus(project.id, t.id)}
                          className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-all space-y-2"
                        >
                          <div className="text-xs font-semibold text-slate-900 leading-snug">
                            {t.title}
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                            <span>👤 {t.assignee}</span>
                            <span className="font-semibold text-blue-600">Due: {t.dueDate}</span>
                          </div>
                        </div>
                      ))}
                      {colTasks.length === 0 && (
                        <div className="text-[11px] text-slate-400 italic text-center py-4">
                          No tasks in this lane
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 5: TRL PROGRESSION LADDER & EVIDENCE
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'trl_tracker' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Technology Readiness Level (TRL 1–9) Certification Ladder
              </h3>
              <p className="text-xs text-slate-500">
                State Innovation Council & NABL verified milestones.
              </p>
            </div>
            <div className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-lg border border-purple-200">
              Current: TRL {project.currentTRL} / 9
            </div>
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => {
              const stageNum = lvl as TRLStage;
              const evidence = project.trlHistory.find((h) => h.trlLevel === stageNum);
              const isAchieved = project.currentTRL >= lvl;
              const isCurrent = project.currentTRL === lvl;

              return (
                <div
                  key={lvl}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isCurrent
                      ? 'border-purple-300 bg-purple-50/50 shadow-xs ring-1 ring-purple-200'
                      : isAchieved
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : 'border-slate-200 bg-slate-50/50 opacity-60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isAchieved ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        {lvl}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        TRL {lvl}: {trlDefinitions[stageNum].title}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white">
                          Current Stage
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 pl-8">
                      {evidence?.description || trlDefinitions[stageNum].desc}
                    </p>
                    {evidence && (
                      <div className="text-[10px] text-slate-400 pl-8 flex items-center gap-2">
                        <span>Approved by: {evidence.approvedBy} ({evidence.approvalDate})</span>
                        <span>•</span>
                        <span className="font-mono text-blue-600 font-semibold">{evidence.documentRef}</span>
                      </div>
                    )}
                  </div>

                  {isAchieved && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 6: FIELD PILOT & COMMUNITY FEEDBACK
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'field_pilot' && (
        <div className="space-y-4">
          {project.fieldPilot ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Active Field Pilot ({project.fieldPilot.id})
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {project.fieldPilot.location}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Liaison: {project.fieldPilot.govtLiaisonOfficer} • Community Lead: {project.fieldPilot.communityContact}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-emerald-700 font-heading">
                    {project.fieldPilot.actualBeneficiariesSoFar.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    of {project.fieldPilot.targetBeneficiaries.toLocaleString()} Citizens Covered
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {project.fieldPilot.metrics.map((m, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.name}</span>
                    <div className="text-lg font-bold text-slate-900 font-mono">{m.currentResult}</div>
                    <div className="text-[10px] text-slate-500">Target: {m.target} (Baseline: {m.baseline})</div>
                  </div>
                ))}
              </div>

              {/* Citizen Testimonials */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Community Stakeholder Testimonials
                </h4>
                <div className="grid md:grid-cols-3 gap-3">
                  {project.fieldPilot.citizenFeedbackSummary.keyQuotes.map((q, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                      <p className="text-slate-700 italic">"{q.quote}"</p>
                      <div className="font-bold text-slate-900 text-[11px] pt-1 border-t border-slate-200/60">
                        {q.citizenName} — <span className="text-slate-500 font-normal">{q.role}, {q.village}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
              <Radio className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700">No Field Pilot Active Yet</div>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                Field pilots are initiated once the project reaches TRL 6 through lab validation.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 7: LESSONS LEARNED ARCHIVE
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'lessons_learned' && (
        <LessonsLearnedModule projectId={project.id} />
      )}

      {/* Advance TRL Modal */}
      {isAdvanceTRLModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-purple-600" />
                <span>Advance to TRL Level {targetTRLToAdvance}</span>
              </h3>
              <button
                onClick={() => setIsAdvanceTRLModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdvanceTRL} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Milestone Evidence Title</label>
                <input
                  type="text"
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  placeholder="E.g. Benchtop Flow-loop Endurance Validation"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Document / Benchmark Reference</label>
                <input
                  type="text"
                  value={evidenceDocRef}
                  onChange={(e) => setEvidenceDocRef(e.target.value)}
                  placeholder="E.g. DOC-TRL4-BENCH-CERT.pdf"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 mt-1 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Experimental Findings & Notes</label>
                <textarea
                  value={evidenceDesc}
                  onChange={(e) => setEvidenceDesc(e.target.value)}
                  placeholder="Summarize lab data, error rates, sample sizes..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 mt-1"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Approving Reviewer Name</label>
                <input
                  type="text"
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 mt-1"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdvanceTRLModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs"
                >
                  Confirm & Certify TRL {targetTRLToAdvance}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
