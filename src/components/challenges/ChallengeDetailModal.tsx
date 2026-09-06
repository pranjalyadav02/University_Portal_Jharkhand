import React, { useState } from 'react';
import {
  X,
  MapPin,
  Sparkles,
  Building,
  UserCheck,
  CheckCircle2,
  FileText,
  HelpCircle,
  Clock,
  Layers,
  Award,
  Database,
  ShieldAlert,
  Send,
  ExternalLink,
  ChevronRight,
  Handshake,
} from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';

export const ChallengeDetailModal: React.FC = () => {
  const {
    selectedChallengeId,
    setSelectedChallengeId,
    challenges,
    selectedUniversity,
    setIsEvaluationModalOpen,
    setIsTeamBuilderModalOpen,
    acceptChallenge,
    toggleSaveChallenge,
    getUniversityMatchScore,
    addAuditLog,
  } = useUniversity();

  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'ai_intel' | 'govt' | 'research' | 'collab'>(
    'overview'
  );
  const [clarificationText, setClarificationText] = useState('');
  const [clarificationSent, setClarificationSent] = useState(false);

  if (!selectedChallengeId) return null;

  const challenge = challenges.find((c) => c.id === selectedChallengeId);
  if (!challenge) return null;

  const matchScore = getUniversityMatchScore(challenge);
  const match = challenge.matchBreakdown[selectedUniversity.id];

  const handleSendClarification = () => {
    if (clarificationText.trim()) {
      addAuditLog(
        'REQUESTED_CLARIFICATION',
        challenge.id,
        `University submitted technical query to ${challenge.assignedOfficer.name}: "${clarificationText}"`
      );
      setClarificationSent(true);
      setClarificationText('');
      setTimeout(() => setClarificationSent(false), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 md:p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/70 gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                {challenge.domain}
              </span>
              <span className="font-mono text-slate-500 font-semibold">{challenge.id}</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified by Jharkhand Govt</span>
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 font-heading leading-snug">
              {challenge.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {challenge.location.district} District • {challenge.location.block} Block • {challenge.location.villagesCount} Villages
              </span>
              <span>•</span>
              <span>Citizen Ref: {challenge.citizenReportId}</span>
            </div>
          </div>

          <button
            onClick={() => setSelectedChallengeId(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Bar */}
        <div className="px-5 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto text-xs font-semibold shrink-0">
          {[
            { id: 'overview', label: 'Problem & Context' },
            { id: 'ai_intel', label: 'AI Intelligence & Explainability' },
            { id: 'govt', label: 'Government Mandate' },
            { id: 'research', label: 'Research & R&D Blueprint' },
            { id: 'collab', label: 'Industry & CSR Interest' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDetailTab(tab.id as any)}
              className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
                activeDetailTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 overflow-y-auto flex-1 text-xs space-y-5">
          {/* Tab 1: Overview */}
          {activeDetailTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Citizen & Community Problem Statement
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{challenge.description}</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Affected Population
                  </span>
                  <span className="text-base font-bold text-slate-900 mt-0.5 block">
                    {challenge.affectedPopulation.toLocaleString()} Citizens
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Est. Beneficiaries: {challenge.estimatedBeneficiaries.toLocaleString()}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Available State Grant
                  </span>
                  <span className="text-base font-bold text-emerald-700 mt-0.5 block">
                    {challenge.fundingAvailable.split('(')[0]}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {challenge.fundingAvailable.split('(')[1]?.replace(')', '') || 'State Innovation Council'}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Target Deployment Window
                  </span>
                  <span className="text-base font-bold text-purple-700 mt-0.5 block">
                    Deadline: {challenge.targetDeadline}
                  </span>
                  <span className="text-[11px] text-slate-500">Submitted: {challenge.submissionDate}</span>
                </div>
              </div>

              {/* Geographic Cluster Context */}
              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-1">
                <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-700" />
                  <span>District Cluster Intelligence</span>
                </div>
                <p className="text-xs text-blue-950">
                  Cluster Tag: <strong className="font-mono">{challenge.clusterTag}</strong>. Government command has
                  identified <strong>{challenge.similarReportsCount} similar reports</strong> from adjacent panchayats.
                  Developing a turnkey solution for this challenge directly enables immediate replication across the entire
                  cluster.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: AI Intelligence & Explainability */}
          {activeDetailTab === 'ai_intel' && (
            <div className="space-y-4">
              {/* Mandatory Disclaimer from prompt */}
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-950">
                  <strong className="font-bold">AI Suggestion — Requires Expert Validation:</strong> AI match calculations
                  and research recommendations are syntheses generated from institutional publications, equipment rosters, and
                  department faculties. Authorized faculty mentors must review and calibrate prior to field deployment.
                </div>
              </div>

              {/* Match Breakdown Card */}
              {match && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 font-heading">
                        Institutional Suitability Breakdown: {selectedUniversity.shortName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Synthesized by JanaSamadhan Academic Matching Engine
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-purple-700 font-heading">
                      {match.overallScore}%
                    </div>
                  </div>

                  {/* Criteria Progress Bars */}
                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                        <span>Department Alignment</span>
                        <span className="font-bold">{match.departmentFit}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${match.departmentFit}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                        <span>Faculty Publication & Research Fit</span>
                        <span className="font-bold">{match.facultyExpertiseFit}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${match.facultyExpertiseFit}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                        <span>Lab Equipment & Instruments Availability</span>
                        <span className="font-bold">{match.labEquipmentFit}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${match.labEquipmentFit}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                        <span>Student Talent Pool Availability</span>
                        <span className="font-bold">{match.studentSkillsFit}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-600 rounded-full" style={{ width: `${match.studentSkillsFit}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Why this university was matched */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-800">
                      Why {selectedUniversity.shortName} was specifically matched:
                    </div>
                    <ul className="space-y-1.5">
                      {match.reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Government Information */}
          {activeDetailTab === 'govt' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>Responsible State Department</span>
                </div>
                <div className="text-xs font-bold text-slate-900">{challenge.govtDepartment}</div>
                <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Assigned Nodal Officer:</span>
                    <strong className="text-slate-900">{challenge.assignedOfficer.name}</strong>
                    <div className="text-slate-600">{challenge.assignedOfficer.designation}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Official Contact:</span>
                    <div className="text-blue-600">{challenge.assignedOfficer.email}</div>
                    <div className="text-slate-600">{challenge.assignedOfficer.phone}</div>
                  </div>
                </div>
              </div>

              {/* Clarification Request Form */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Request Official Information or Baseline Clarification from Government Officer</span>
                </div>
                <p className="text-xs text-slate-500">
                  Ask the line department for technical constraints, geological surveys, or village access permissions.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={clarificationText}
                    onChange={(e) => setClarificationText(e.target.value)}
                    placeholder="E.g., Please provide GPS coordinates of handpumps #1 through #12 in Raidih block..."
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendClarification}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Query</span>
                  </button>
                </div>
                {clarificationSent && (
                  <div className="text-xs text-emerald-700 font-semibold animate-in fade-in">
                    ✓ Official query logged and transmitted to {challenge.assignedOfficer.name}. Recorded in audit trail.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Research Opportunity */}
          {activeDetailTab === 'research' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Suggested Research Questions
                </div>
                <ul className="space-y-1.5">
                  {challenge.researchQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Possible Methodologies & Technologies
                </div>
                <ul className="space-y-1.5">
                  {challenge.possibleMethodologies.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Available Government Datasets</span>
                </div>
                <ul className="space-y-1.5">
                  {challenge.availableDatasets.map((d, i) => (
                    <li key={i} className="p-2 rounded-lg bg-slate-50 text-xs text-slate-700 border border-slate-200">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 5: Collaboration */}
          {activeDetailTab === 'collab' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Handshake className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">Interested Industry & CSR Partners</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Co-funding Available
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {challenge.industryInterest} have expressed intent to provide matching CSR funds, field trial sites,
                  and corporate technical mentors.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Action Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => toggleSaveChallenge(challenge.id)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
          >
            {challenge.savedByUniversity ? 'Remove Bookmark' : 'Save for Later'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEvaluationModalOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              Fill Evaluation Form
            </button>
            <button
              onClick={() => {
                acceptChallenge(challenge.id);
                setSelectedChallengeId(null);
              }}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Accept & Build Multidisciplinary Team</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
