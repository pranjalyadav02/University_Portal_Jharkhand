import React from 'react';
import {
  Layers,
  Award,
  Users,
  Building,
  Radio,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  ShieldAlert,
  Droplets,
  DollarSign,
  ChevronRight,
  GraduationCap,
  Play,
  HeartHandshake,
  FileCheck2,
  Cpu,
  Tv,
} from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';
import { Challenge, Project } from '../../types';

export const CommandCenter: React.FC = () => {
  const {
    selectedUniversity,
    challenges,
    projects,
    setActiveTab,
    setSelectedChallengeId,
    setSelectedProjectId,
    setIsEvaluationModalOpen,
    setIsTeamBuilderModalOpen,
    setIsDemoGuideOpen,
    setDemoMode,
    getUniversityMatchScore,
  } = useUniversity();

  // Metrics computation
  const activeProjectsCount = projects.length;
  const govChallengesCount = challenges.length;
  const projectsInPilot = projects.filter((p) => p.lifecycleStage === 'Field Pilot').length;
  const socialImpactCount = '37.2k';

  // Sorted recommended challenges for this university
  const recommendedChallenges = [...challenges].sort(
    (a, b) => getUniversityMatchScore(b) - getUniversityMatchScore(a)
  );

  const topMatch = recommendedChallenges[0];
  const primaryProject = projects[0];

  return (
    <div className="space-y-6 pb-12">
      {/* 4 Metric Cards Row from Professional Polish Theme */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Projects */}
        <div
          onClick={() => setActiveTab('research_projects')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
        >
          <div className="text-xs font-semibold text-slate-500 uppercase mb-1 tracking-wider">
            Active Projects
          </div>
          <div className="text-2xl font-bold text-slate-900 font-heading">{activeProjectsCount}</div>
          <div className="text-[10px] text-emerald-600 mt-1 font-medium">+2 since last week</div>
        </div>

        {/* Gov Challenges */}
        <div
          onClick={() => setActiveTab('challenges_marketplace')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
        >
          <div className="text-xs font-semibold text-slate-500 uppercase mb-1 tracking-wider">
            Gov Challenges
          </div>
          <div className="text-2xl font-bold text-slate-900 font-heading">{govChallengesCount}</div>
          <div className="text-[10px] text-blue-600 mt-1 font-medium">8 AI Matches found</div>
        </div>

        {/* Field Pilots */}
        <div
          onClick={() => setActiveTab('field_pilots')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
        >
          <div className="text-xs font-semibold text-slate-500 uppercase mb-1 tracking-wider">
            Field Pilots
          </div>
          <div className="text-2xl font-bold text-slate-900 font-heading">0{projectsInPilot || 2}</div>
          <div className="text-[10px] text-slate-500 mt-1">3 Pending Validation</div>
        </div>

        {/* Social Impact */}
        <div
          onClick={() => setActiveTab('existing_solutions')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
        >
          <div className="text-xs font-semibold text-slate-500 uppercase mb-1 tracking-wider">
            Social Impact
          </div>
          <div className="text-2xl font-bold text-slate-900 font-heading">{socialImpactCount}</div>
          <div className="text-[10px] text-emerald-600 mt-1 font-medium">Citizens benefited</div>
        </div>
      </div>

      {/* 12-Column Grid from Professional Polish Theme */}
      <div className="grid grid-cols-12 gap-6 min-h-0">
        {/* Left 8 Cols: Project Focus & TRL Progression Ladder */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-bold text-slate-900 text-sm md:text-base font-heading">
              Project Focus: {primaryProject?.title || 'Solar Fluoride Desalination Sensor'}
            </h2>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
              TRL {primaryProject?.currentTRL || 5}: Validated in Relevant Env
            </span>
          </div>

          <div className="p-6 flex flex-col space-y-6">
            {/* TRL Progress Stepper (Professional Polish styling) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 tracking-widest">
                <span>BASIC PRINCIPLES</span>
                <span>PROTOTYPE</span>
                <span>DEPLOYMENT</span>
              </div>

              <div className="relative h-10 flex items-center px-2">
                <div className="absolute left-0 w-full h-1.5 bg-slate-100 rounded-full" />
                <div
                  className="absolute left-0 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-500"
                  style={{ width: `${((primaryProject?.currentTRL || 5) / 9) * 100}%` }}
                />

                <div className="relative w-full flex justify-between items-center">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => {
                    const currentLvl = primaryProject?.currentTRL || 5;
                    const isCompleted = lvl < currentLvl;
                    const isActive = lvl === currentLvl;

                    if (isActive) {
                      return (
                        <div
                          key={lvl}
                          className="w-8 h-8 rounded-full bg-white border-4 border-blue-600 shadow-md flex items-center justify-center text-[11px] font-black text-blue-600 ring-2 ring-blue-100 z-10"
                        >
                          {lvl}
                        </div>
                      );
                    }
                    if (isCompleted) {
                      return (
                        <div
                          key={lvl}
                          className="w-5 h-5 rounded-full bg-blue-500 border-3 border-white shadow-xs ring-2 ring-blue-500/30 z-10"
                        />
                      );
                    }
                    return (
                      <div
                        key={lvl}
                        className="w-5 h-5 rounded-full bg-slate-200 border-3 border-white shadow-xs z-10"
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Inner 2-Column Split: AI Team & AI Research Assistant + Partners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Sub-card: AI Multi-Disciplinary Team */}
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      AI Multi-Disciplinary Team
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedChallengeId(topMatch?.id || 'CH-2026-001');
                        setIsTeamBuilderModalOpen(true);
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800"
                    >
                      Manage Roster
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs">
                        Dr
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {primaryProject?.leadFaculty || 'Dr. Arjan Mehta'}
                        </div>
                        <div className="text-[10px] text-slate-500">Environmental Science Lead</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 font-bold text-xs">
                        AI
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">Sarah Chen</div>
                        <div className="text-[10px] text-slate-500">Senior Student • TinyML & Edge Vision</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-xs">
                        IoT
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">Vijay Kumar</div>
                        <div className="text-[10px] text-slate-500">Hardware Systems Architecture</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sub-card: AI Research Assistant & Industry Partners */}
              <div className="flex flex-col space-y-4">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                  <h3 className="text-xs font-bold text-blue-800 uppercase mb-2 tracking-wider">
                    AI Research Assistant
                  </h3>
                  <p className="text-[11px] text-blue-700 leading-relaxed mb-3">
                    &ldquo;Based on recent hydrology datasets from Gumla fracture aquifers, I suggest advancing pilot testing to TRL 6 by including real-time sensor telemetry validation at the Bakhratoli village borehole site.&rdquo;
                  </p>
                  <button
                    onClick={() => setActiveTab('research_projects')}
                    className="text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md shadow-xs transition-colors"
                  >
                    Approve Methodology
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1">
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">
                    Industry Partners
                  </h3>
                  <div className="flex space-x-2">
                    <div className="w-11 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-2xs">
                      TATA
                    </div>
                    <div className="w-11 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-2xs">
                      CCL
                    </div>
                    <div className="w-11 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-2xs">
                      Infosys
                    </div>
                    <div className="w-11 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-2xs">
                      ADANI
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: AI Challenge Match Card & Resource Allocation */}
        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-6">
          {/* AI Challenge Match Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm font-heading">AI Challenge Match</h3>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                High Priority
              </span>
            </div>

            {/* Inner Dark Card from Theme */}
            <div className="bg-slate-900 rounded-xl p-4 text-white shadow-xs">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] uppercase font-bold text-blue-400">
                  Match Score: {topMatch ? getUniversityMatchScore(topMatch) : 94}%
                </div>
                <div className="text-[10px] text-slate-400">
                  Domain: {topMatch?.domain || 'Agri-Tech'}
                </div>
              </div>

              <div className="text-sm font-bold mb-2 text-white font-heading">
                {topMatch?.title || 'Smart Groundwater Fluoride Sensing Mesh'}
              </div>

              <div className="text-[10px] text-slate-300 leading-relaxed line-clamp-3 mb-3">
                Government verified problem in {topMatch?.location.district || 'Gumla'} region. Affects{' '}
                {topMatch?.affectedPopulation.toLocaleString() || '40,000'} citizens. Requires Environmental Chemistry + IoT Telemetry.
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    if (topMatch) {
                      setSelectedChallengeId(topMatch.id);
                      setIsTeamBuilderModalOpen(true);
                    }
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-[10px] font-bold py-1.5 rounded transition-colors"
                >
                  Accept & Form Team
                </button>
                <button
                  onClick={() => {
                    if (topMatch) {
                      setSelectedChallengeId(topMatch.id);
                    }
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold py-1.5 rounded transition-colors"
                >
                  Request Info
                </button>
              </div>
            </div>

            {/* Why Matched List */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-500 border-b border-slate-100 pb-1">
                Why Matched?
              </div>
              <ul className="text-[11px] space-y-2 text-slate-600">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                  <span>Matches {selectedUniversity.shortName}&apos;s water chemistry publications</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                  <span>Utilizes existing NABL accredited water testing bench</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                  <span>Aligns with Jal Jeevan Mission state mandate</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Resource Allocation Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-4 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-4 font-heading">
                Resource Allocation
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm">
                      💻
                    </div>
                    <div className="text-[11px]">
                      <div className="font-bold text-slate-900">HPC Cluster 01</div>
                      <div className="text-slate-500">6 Nodes Available</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Online
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm">
                      🔬
                    </div>
                    <div className="text-[11px]">
                      <div className="font-bold text-slate-900">Nanotech & Water Lab</div>
                      <div className="text-slate-500">Booked: Team Alpha</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    Busy
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm">
                      🛰️
                    </div>
                    <div className="text-[11px]">
                      <div className="font-bold text-slate-900">Drone Fleet (4 Units)</div>
                      <div className="text-slate-500">Ready for Deployment</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Online
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>IPR & PATENTS</span>
                <span className="text-slate-900 font-bold">14 Active Filings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
