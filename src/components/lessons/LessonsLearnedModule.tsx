import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  ShieldCheck,
  Tag,
  MapPin,
  Calendar,
  User,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  Radio,
  ExternalLink,
  Award,
  RefreshCw,
  FolderKanban,
} from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';
import { LessonLearned, LessonLearnedCategory, Project } from '../../types';

interface LessonsLearnedModuleProps {
  /** Current project if embedded within Project Workspace */
  project?: Project;
  /** Section context: 'lifecycle', 'field_pilot', or 'standalone_planning' */
  variant: 'lifecycle' | 'field_pilot' | 'standalone_planning';
  /** Optional title override */
  title?: string;
  /** Optional subtitle override */
  subtitle?: string;
}

export const LessonsLearnedModule: React.FC<LessonsLearnedModuleProps> = ({
  project,
  variant,
  title,
  subtitle,
}) => {
  const {
    lessonsLearned,
    setIsLessonModalOpen,
    setLessonModalContext,
    completeFieldPilot,
    completeProject,
    currentUserRole,
  } = useUniversity();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showOnlyCurrentProject, setShowOnlyCurrentProject] = useState<boolean>(
    variant !== 'standalone_planning'
  );

  // Categories list
  const categories: string[] = [
    'All',
    'Field & Community Adoption',
    'Technical & Engineering',
    'Environmental & Durability',
    'Regulatory & Governance',
    'Logistics & Supply Chain',
    'Data & Connectivity',
  ];

  // Unique domains
  const domains = useMemo(() => {
    const list = new Set<string>();
    lessonsLearned.forEach((l) => list.add(l.domain));
    return ['All', ...Array.from(list)];
  }, [lessonsLearned]);

  // Unique districts
  const districts = useMemo(() => {
    const list = new Set<string>();
    lessonsLearned.forEach((l) => {
      if (l.district) list.add(l.district);
    });
    return ['All', ...Array.from(list)];
  }, [lessonsLearned]);

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return lessonsLearned.filter((lesson) => {
      // If variant is field_pilot and filtered to current, match pilot
      if (variant === 'field_pilot' && showOnlyCurrentProject && project) {
        if (lesson.projectId !== project.id && !lesson.isPilotSpecific) {
          return false;
        }
      } else if (showOnlyCurrentProject && project) {
        if (lesson.projectId !== project.id) {
          return false;
        }
      }

      // Domain filter
      if (selectedDomain !== 'All' && lesson.domain !== selectedDomain) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && lesson.category !== selectedCategory) {
        return false;
      }

      // District filter
      if (selectedDistrict !== 'All' && lesson.district !== selectedDistrict) {
        return false;
      }

      // Text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = lesson.title.toLowerCase().includes(q);
        const matchesChallenge = lesson.challengeEncountered.toLowerCase().includes(q);
        const matchesResolution = lesson.resolutionStrategy.toLowerCase().includes(q);
        const matchesInsights = lesson.keyInsights.toLowerCase().includes(q);
        const matchesAdvice = lesson.preventativeAdvice.toLowerCase().includes(q);
        const matchesAuthor = lesson.authorName.toLowerCase().includes(q);
        const matchesProject = lesson.projectTitle.toLowerCase().includes(q);
        const matchesTags = lesson.tags.some((t) => t.toLowerCase().includes(q));
        const matchesDistrict = lesson.district?.toLowerCase().includes(q);

        return (
          matchesTitle ||
          matchesChallenge ||
          matchesResolution ||
          matchesInsights ||
          matchesAdvice ||
          matchesAuthor ||
          matchesProject ||
          matchesTags ||
          matchesDistrict
        );
      }

      return true;
    });
  }, [
    lessonsLearned,
    project,
    variant,
    showOnlyCurrentProject,
    selectedDomain,
    selectedCategory,
    selectedDistrict,
    searchQuery,
  ]);

  const handleOpenModal = () => {
    setLessonModalContext({
      projectId: project?.id,
      pilotId: project?.fieldPilot?.id,
      defaultCategory:
        variant === 'field_pilot' ? 'Field & Community Adoption' : 'Technical & Engineering',
      stage: project?.lifecycleStage || (variant === 'field_pilot' ? 'Field Pilot' : 'Research'),
      isPilotSpecific: variant === 'field_pilot',
    });
    setIsLessonModalOpen(true);
  };

  const handleCopyInsight = (lesson: LessonLearned) => {
    const text = `LESSON LEARNED: ${lesson.title}\nProject: ${lesson.projectTitle} (${lesson.domain})\nAuthor: ${lesson.authorName} (${lesson.authorRole})\n\n[CHALLENGE ENCOUNTERED]:\n${lesson.challengeEncountered}\n\n[HOW IT WAS OVERCOME]:\n${lesson.resolutionStrategy}\n\n[KEY INSIGHTS GAINED]:\n${lesson.keyInsights}\n\n[PREVENTATIVE ADVICE FOR FUTURE PLANNING]:\n${lesson.preventativeAdvice}`;
    navigator.clipboard.writeText(text);
    setCopiedId(lesson.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const isProjectCompleted = project?.status === 'Completed' || project?.progressPercentage === 100;
  const isPilotCompleted = project?.fieldPilot?.status === 'Completed';

  return (
    <div className="space-y-4" id={`lessons-learned-module-${variant}`}>
      {/* 1. MENTOR & LEAD PROMPT BANNER */}
      {variant !== 'standalone_planning' && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl border border-blue-800 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-500/20 text-blue-300 rounded-lg backdrop-blur-xs flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  {variant === 'field_pilot'
                    ? 'Field Pilot Knowledge Transfer Protocol'
                    : 'Project Lifecycle Lessons Learned Prompt'}
                </span>
                {(isProjectCompleted || isPilotCompleted) && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-full border border-amber-500/30">
                    Handover Required
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold font-heading">
                {variant === 'field_pilot'
                  ? isPilotCompleted
                    ? 'Field Pilot Completed: Archive Final Ground Truths'
                    : 'Prompt for Team Leads & Mentors: Document Field Pilot Realities'
                  : isProjectCompleted
                  ? 'Project Sign-Off: Document Key Insights for Statewide Reuse'
                  : 'Document Challenges, Solutions & Hard-Won Insights'}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {variant === 'field_pilot'
                  ? 'Field testing in rural panchayats reveals critical environmental wear, community adoption friction, and unexpected telemetry outages. Document how your team solved these challenges to protect future university projects.'
                  : 'Before transitioning phases or completing project milestones, faculty mentors and team leads are prompted to document significant bottlenecks encountered, resolution tactics, and actionable advice for future project planning.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {variant === 'field_pilot' && project && !isPilotCompleted && (
                <button
                  type="button"
                  onClick={() => completeFieldPilot(project.id)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Pilot Completed & Prompt Review</span>
                </button>
              )}

              {variant === 'lifecycle' && project && !isProjectCompleted && (
                <button
                  type="button"
                  onClick={() => completeProject(project.id)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sign-Off Project & Complete Handover</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleOpenModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Document Lesson Learned</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-4 pt-3.5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Documented in Platform:</span>
              <span className="text-white font-bold text-sm">
                {lessonsLearned.length} Validated Insights
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Average Reusability:</span>
              <span className="text-emerald-400 font-bold text-sm">4.8 / 5.0 Rating</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Districts Covered:</span>
              <span className="text-blue-300 font-bold text-sm">Gumla, Latehar, Dhanbad +</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Estimated Re-work Avoided:</span>
              <span className="text-purple-300 font-bold text-sm">~340 Engineering Hours</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. SEARCH & FILTER TOOLBAR FOR FUTURE PROJECT PLANNING */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges, solutions, insights, keywords (e.g. biofouling, battery, Jal Sahiya, NABL)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Action & Scope Switch */}
          <div className="flex items-center gap-2 shrink-0">
            {project && variant !== 'standalone_planning' && (
              <button
                type="button"
                onClick={() => setShowOnlyCurrentProject(!showOnlyCurrentProject)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                  showOnlyCurrentProject
                    ? 'bg-blue-50 border-blue-300 text-blue-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>{showOnlyCurrentProject ? 'Current Project Only' : 'All Past Projects'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenModal}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Document Insight</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs border-t border-slate-100">
          <div className="flex items-center gap-1 text-slate-500 text-[11px] font-bold uppercase tracking-wider mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            {categories
              .filter((c) => c !== 'All')
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>

          {/* Domain Dropdown */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Domains</option>
            {domains
              .filter((d) => d !== 'All')
              .map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
          </select>

          {/* District Dropdown */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Districts</option>
            {districts
              .filter((d) => d !== 'All')
              .map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
          </select>

          {/* Active Results Badge */}
          <span className="ml-auto text-[11px] text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredLessons.length}</strong> recorded
            insights
          </span>
        </div>
      </div>

      {/* 3. LESSONS LIST CARDS */}
      {filteredLessons.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 font-heading">
            No Lessons Found Matching Criteria
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query or filters, or document the first lesson learned for this
            phase.
          </p>
          <button
            type="button"
            onClick={handleOpenModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Document New Lesson Learned</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLessons.map((lesson) => {
            const isExpanded = expandedLessonId === lesson.id;
            const isCopied = copiedId === lesson.id;

            return (
              <div
                key={lesson.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all overflow-hidden"
              >
                {/* Header Strip */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 text-[11px] font-bold rounded-full border border-blue-200">
                        {lesson.category}
                      </span>
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-full">
                        {lesson.domain}
                      </span>
                      {lesson.district && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{lesson.district}</span>
                        </span>
                      )}
                      {lesson.isPilotSpecific && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                          Field Pilot Tested
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lesson.date}</span>
                      </div>
                      <div className="flex items-center text-amber-500 font-bold" title="Reusability Rating">
                        ★ {lesson.reusabilityRating}.0
                      </div>
                    </div>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h4 className="text-base font-bold text-slate-900 font-heading hover:text-blue-600 transition-colors">
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-700">{lesson.projectTitle}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>
                          {lesson.authorName} ({lesson.authorRole})
                        </span>
                      </span>
                    </p>
                  </div>

                  {/* High Level Snippet: Challenge vs Resolution */}
                  <div className="grid md:grid-cols-2 gap-3 pt-1 text-xs">
                    {/* Challenge Box */}
                    <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-900 font-bold text-[11px] uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Challenge Encountered</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed line-clamp-3">
                        {lesson.challengeEncountered}
                      </p>
                    </div>

                    {/* How Overcome Box */}
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-[11px] uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>How It Was Overcome</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed line-clamp-3">
                        {lesson.resolutionStrategy}
                      </p>
                    </div>
                  </div>

                  {/* Expandable Section: Key Insights & Preventative Planning Advice */}
                  {isExpanded && (
                    <div className="space-y-3 pt-2 border-t border-slate-100 animate-fadeIn">
                      {/* Key Insights */}
                      <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-3.5 space-y-1">
                        <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-[11px] uppercase tracking-wider">
                          <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Key Insights Gained</span>
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed font-medium">
                          {lesson.keyInsights}
                        </p>
                      </div>

                      {/* Preventative Advice for Future Project Planning */}
                      {lesson.preventativeAdvice && (
                        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3.5 space-y-1">
                          <div className="flex items-center gap-1.5 text-sky-900 font-bold text-[11px] uppercase tracking-wider">
                            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                            <span>Actionable Advice for Future Project Planning</span>
                          </div>
                          <p className="text-xs text-slate-800 leading-relaxed font-medium">
                            {lesson.preventativeAdvice}
                          </p>
                        </div>
                      )}

                      {/* Tags List */}
                      {lesson.tags && lesson.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span>Tags:</span>
                          </span>
                          {lesson.tags.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-md hover:bg-slate-200 transition-colors"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Bottom Toolbar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      type="button"
                      onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>
                        {isExpanded ? 'Hide Planning Details' : 'View Full Insights & Planning Advice'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyInsight(lesson)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 border text-xs ${
                          isCopied
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                        title="Copy to Clipboard for Project Proposals & Planning Documents"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied to Plan!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Copy for Project Proposal</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
