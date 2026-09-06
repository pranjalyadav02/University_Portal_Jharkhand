import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  ShieldCheck,
  Tag,
  MapPin,
  Layers,
  Award,
} from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';
import {
  LessonLearned,
  LessonLearnedCategory,
  LessonLearnedAuthorRole,
  ChallengeDomain,
} from '../../types';

export const DocumentLessonModal: React.FC = () => {
  const {
    isLessonModalOpen,
    setIsLessonModalOpen,
    lessonModalContext,
    setLessonModalContext,
    projects,
    addLessonLearned,
    currentUserRole,
  } = useUniversity();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');
  const [authorRole, setAuthorRole] = useState<LessonLearnedAuthorRole>('Faculty Mentor');
  const [category, setCategory] = useState<LessonLearnedCategory>('Field & Community Adoption');
  const [title, setTitle] = useState<string>('');
  const [challengeEncountered, setChallengeEncountered] = useState<string>('');
  const [resolutionStrategy, setResolutionStrategy] = useState<string>('');
  const [keyInsights, setKeyInsights] = useState<string>('');
  const [preventativeAdvice, setPreventativeAdvice] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [reusabilityRating, setReusabilityRating] = useState<number>(5);
  const [isPilotSpecific, setIsPilotSpecific] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isLessonModalOpen) {
      setSubmittedSuccess(false);
      const targetProjectId = lessonModalContext?.projectId || projects[0]?.id || '';
      setSelectedProjectId(targetProjectId);

      const proj = projects.find((p) => p.id === targetProjectId);
      if (proj) {
        setAuthorName(proj.leadFaculty || 'Prof. (Dr.) Anurag Bhattacharya');
        setDistrict(proj.fieldPilot?.district || 'Gumla');
      } else {
        setAuthorName(
          currentUserRole === 'faculty'
            ? 'Prof. (Dr.) Anurag Bhattacharya'
            : currentUserRole === 'student'
            ? 'Aakash Verma'
            : 'Project Lead'
        );
      }

      if (currentUserRole === 'faculty') {
        setAuthorRole('Faculty Mentor');
      } else if (currentUserRole === 'student') {
        setAuthorRole('Student Lead');
      } else {
        setAuthorRole('Team Lead');
      }

      if (lessonModalContext?.defaultCategory) {
        setCategory(lessonModalContext.defaultCategory as LessonLearnedCategory);
      } else if (lessonModalContext?.isPilotSpecific) {
        setCategory('Field & Community Adoption');
      } else {
        setCategory('Technical & Engineering');
      }

      setIsPilotSpecific(Boolean(lessonModalContext?.isPilotSpecific));

      // Reset text inputs unless populated
      setTitle('');
      setChallengeEncountered('');
      setResolutionStrategy('');
      setKeyInsights('');
      setPreventativeAdvice('');
      setTagsInput('');
    }
  }, [isLessonModalOpen, lessonModalContext, projects, currentUserRole]);

  if (!isLessonModalOpen) return null;

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleFillSample = () => {
    if (isPilotSpecific || lessonModalContext?.stage === 'Field Pilot') {
      setTitle('Panchayat Jal Sahiya Engagement for Rural Optical Sensor Cleaning');
      setCategory('Field & Community Adoption');
      setChallengeEncountered(
        'Severe mineral siltation in Gumla borewells caused optical flow-cells to occlude within 10 days. Field visits revealed that without local community ownership, sensors remained uncleaned despite automated telemetry alerts.'
      );
      setResolutionStrategy(
        'Trained 18 Jal Sahiyas across Bakhratoli and Raidih to perform weekly 1-minute twist-lock cartridge washdowns, accompanied by an SMS notification protocol and a nominal ₹150 monthly honorarium backed by the village water committee.'
      );
      setKeyInsights(
        'Engineering durability in rural India is fundamentally a socio-technical symbiosis: automated telemetry fails without a designated, trusted village human anchor.'
      );
      setPreventativeAdvice(
        'For future rural deployments in Chota Nagpur, never deploy automated telemetry without co-budgeting community caretaker training and a tool-free cartridge swap interface.'
      );
      setTagsInput('Jal Sahiya, Community Ownership, Gumla, Sensor Maintenance, Rural Water');
      setDistrict('Gumla');
      setReusabilityRating(5);
    } else {
      setTitle('Microcontroller Cold-Temperature Clock Oscillator Drift & Battery Undervoltage');
      setCategory('Technical & Engineering');
      setChallengeEncountered(
        'During winter overnight field testing where plateau temperatures dropped to 3°C, internal crystal oscillators experienced clock skew exceeding 140 ppm, leading to LoRaWAN sync packet dropouts.'
      );
      setResolutionStrategy(
        'Upgraded to temperature-compensated crystal oscillators (TCXO) and tuned the power-saving deep sleep wake-up timers with calibrated internal RC trimming routines in firmware.'
      );
      setKeyInsights(
        'Low-cost ceramic resonators are unreliable under Chota Nagpur winter diurnal swings (35°C swing between day and night). TCXO components are non-negotiable for unattended telemetry nodes.'
      );
      setPreventativeAdvice(
        'Mandate environmental chamber thermal cycling testing (-5°C to +50°C) during TRL 4 component validation before freezing hardware PCB gerbers.'
      );
      setTagsInput('Hardware, TCXO, Firmware, Thermal Cycling, LoRaWAN, Low Temperature');
      setDistrict('Ranchi / Dhanbad');
      setReusabilityRating(5);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !challengeEncountered.trim() || !resolutionStrategy.trim()) {
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newLesson = addLessonLearned({
      projectId: currentProject?.id || 'PR-2026-0019',
      projectTitle: currentProject?.title || 'Jal-Drishti: Rural Water Telemetry',
      pilotId: isPilotSpecific && currentProject?.fieldPilot ? currentProject.fieldPilot.id : undefined,
      pilotLocation: isPilotSpecific && currentProject?.fieldPilot ? currentProject.fieldPilot.location : undefined,
      district: district || currentProject?.fieldPilot?.district || 'Dhanbad',
      domain: currentProject?.domain || ('Water & Sanitation' as ChallengeDomain),
      lifecycleStage: currentProject?.lifecycleStage || 'Field Pilot',
      trlStage: currentProject?.currentTRL,
      authorName: authorName.trim() || 'Principal Investigator',
      authorRole,
      category,
      title: title.trim(),
      challengeEncountered: challengeEncountered.trim(),
      resolutionStrategy: resolutionStrategy.trim(),
      keyInsights: keyInsights.trim() || 'Thorough field validation is essential for sustainable scale.',
      preventativeAdvice:
        preventativeAdvice.trim() ||
        'Document and review environmental requirements early in milestone planning.',
      tags: tags.length > 0 ? tags : ['Innovation', 'Field Experience'],
      reusabilityRating,
      verifiedBy: 'Dean R&D / Institutional Reviewer',
      isPilotSpecific,
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setIsLessonModalOpen(false);
      setLessonModalContext(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        id="document-lesson-modal"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-white/10 rounded-lg backdrop-blur-xs">
                <BookOpen className="w-5 h-5 text-blue-200" />
              </span>
              <h2 className="text-lg font-bold font-heading">
                {isPilotSpecific
                  ? 'Field Pilot Lessons Learned & Knowledge Capture'
                  : 'Document Project Lifecycle Lessons Learned'}
              </h2>
            </div>
            <p className="text-xs text-blue-100 max-w-xl">
              Prompting Team Leads and Faculty Mentors to capture significant engineering, community,
              and regulatory challenges, how they were overcome, and key insights for future project
              planning.
            </p>
          </div>
          <button
            onClick={() => {
              setIsLessonModalOpen(false);
              setLessonModalContext(null);
            }}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Lesson Learned Archived Successfully!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your insight has been published to the Statewide Institutional Knowledge Base and linked
              to future project planning recommendations.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Quick Auto-Fill Demo Banner */}
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-blue-800">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Prompt for Mentors & Leads:</strong> Capture institutional memory to avoid
                  future teams repeating identical failure modes.
                </span>
              </div>
              <button
                type="button"
                onClick={handleFillSample}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shrink-0 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Fill Realistic Sample</span>
              </button>
            </div>

            {/* Project & Role Info Grid */}
            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id}: {p.title.slice(0, 38)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Author Name</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                  placeholder="e.g. Prof. (Dr.) Anurag Bhattacharya"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Author Role</label>
                <select
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value as LessonLearnedAuthorRole)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Faculty Mentor">Faculty Mentor</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Student Lead">Student Lead</option>
                  <option value="Govt Liaison">Govt Liaison Officer</option>
                  <option value="Field Researcher">Field Researcher</option>
                </select>
              </div>
            </div>

            {/* Category, District, Scope */}
            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Challenge Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as LessonLearnedCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Field & Community Adoption">Field & Community Adoption</option>
                  <option value="Technical & Engineering">Technical & Engineering</option>
                  <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                  <option value="Regulatory & Governance">Regulatory & Governance</option>
                  <option value="Environmental & Durability">Environmental & Durability</option>
                  <option value="Sensor & Hardware Deployment">Sensor & Hardware Deployment</option>
                  <option value="Data & Connectivity">Data & Connectivity</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  District / Location Context
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Gumla, Raidih Block"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reusability Rating (For Future Teams)
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReusabilityRating(star)}
                      className={`text-base transition-transform ${
                        star <= reusabilityRating ? 'text-amber-500 scale-110' : 'text-slate-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-[11px] text-slate-500 font-medium ml-1">
                    {reusabilityRating === 5
                      ? 'Critical'
                      : reusabilityRating >= 4
                      ? 'High Value'
                      : 'Moderate'}
                  </span>
                </div>
              </div>
            </div>

            {/* Title / Summary */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lesson Title / Core Challenge Headline *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Biofouling & Mineral Silt Occlusion on Optical Sensor Flow Cells"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Core 3 Requirements: Challenge Encountered, How Overcome, Key Insights */}
            <div className="space-y-4">
              {/* Challenge Encountered */}
              <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4 space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>1. Significant Challenge Encountered *</span>
                </label>
                <p className="text-[11px] text-rose-700">
                  Describe what unexpectedly failed, bottlenecks faced in laboratory, field pilot,
                  regulatory approval, or community pushback.
                </p>
                <textarea
                  value={challengeEncountered}
                  onChange={(e) => setChallengeEncountered(e.target.value)}
                  required
                  rows={3}
                  placeholder="Detail the failure mode, drift, delays, or environmental constraints encountered..."
                  className="w-full p-3 bg-white border border-rose-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-rose-400 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* How Overcome / Resolution Strategy */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>2. How It Was Overcome (Resolution Strategy) *</span>
                </label>
                <p className="text-[11px] text-emerald-700">
                  Explain the technical redesign, firmware mitigation, stakeholder consultation, or
                  process adjustment implemented.
                </p>
                <textarea
                  value={resolutionStrategy}
                  onChange={(e) => setResolutionStrategy(e.target.value)}
                  required
                  rows={3}
                  placeholder="Detail the step-by-step fix, architectural modification, or community protocol established..."
                  className="w-full p-3 bg-white border border-emerald-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Key Insights Gained */}
              <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-4 space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  <span>3. Key Insights Gained *</span>
                </label>
                <p className="text-[11px] text-indigo-700">
                  What fundamental truths or principles were discovered through this experience?
                </p>
                <textarea
                  value={keyInsights}
                  onChange={(e) => setKeyInsights(e.target.value)}
                  required
                  rows={2}
                  placeholder="Summarize the core institutional takeaways..."
                  className="w-full p-3 bg-white border border-indigo-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Preventative Advice for Future Project Planning */}
              <div className="bg-sky-50/50 border border-sky-200 rounded-xl p-4 space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold text-sky-900">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>4. Preventative Advice for Future Project Planning</span>
                </label>
                <p className="text-[11px] text-sky-700">
                  What actionable guidance should future university teams factor into their budget,
                  schedule, or system design?
                </p>
                <textarea
                  value={preventativeAdvice}
                  onChange={(e) => setPreventativeAdvice(e.target.value)}
                  rows={2}
                  placeholder="e.g. Allocate 15% budget buffer for anti-fouling coatings; mandate NABL split-sample testing in TRL 3..."
                  className="w-full p-3 bg-white border border-sky-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-sky-400 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Searchable Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>Searchable Tags & Keywords (Comma separated)</span>
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Water Sensing, Biofouling, Jal Sahiya, IP68, NABL, Gumla"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setIsLessonModalOpen(false);
                  setLessonModalContext(null);
                }}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Publish Lesson Learned & Archive</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
