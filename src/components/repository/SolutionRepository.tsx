import React, { useState } from 'react';
import {
  Package,
  Award,
  TrendingUp,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Users,
  Search,
  Download,
  Share2,
  Sparkles,
  GitCommit,
  Building,
  Check,
} from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';
import { ReusableSolution } from '../../types';

export const SolutionRepository: React.FC = () => {
  const { solutions, deployedSolutions, selectedUniversity, searchQuery } = useUniversity();
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedSolutionId, setSelectedSolutionId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);
  const [scaleSuccessId, setScaleSuccessId] = useState<string | null>(null);

  // Safe fallback to prevent any undefined error
  const rawList: ReusableSolution[] = deployedSolutions || solutions || [];

  const domains = ['All', ...Array.from(new Set(rawList.map((s) => s.domain)))];

  const filteredSolutions = rawList.filter((sol) => {
    if (selectedDomain !== 'All' && sol.domain !== selectedDomain) return false;
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = sol.title?.toLowerCase().includes(q);
      const matchDistrict = sol.originalDistrict?.toLowerCase().includes(q);
      const matchStack = (sol.technologyStack || []).some((s) => s.toLowerCase().includes(q));
      const matchDomain = sol.domain?.toLowerCase().includes(q);
      if (!matchTitle && !matchDistrict && !matchStack && !matchDomain) return false;
    }
    return true;
  });

  const totalBeneficiaries = rawList.reduce((acc, s) => acc + (s.beneficiariesCount || 0), 0);

  const handleDownloadBlueprint = (sol: ReusableSolution) => {
    setDownloadSuccessId(sol.id);
    setTimeout(() => setDownloadSuccessId(null), 3000);
  };

  const handleScalingRequest = (sol: ReusableSolution) => {
    setScaleSuccessId(sol.id);
    setTimeout(() => setScaleSuccessId(null), 3000);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-heading">
              Impact & Solution Repository
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {rawList.length} Deployed Innovations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Proven, field-validated solutions engineered by Jharkhand HEIs, ready for statewide scaling, open-source replication, and CSR adoption.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Domain:</span>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700"
          >
            {domains.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Domains' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Aggregate Impact Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Citizens Impacted
          </span>
          <div className="text-xl font-bold text-slate-900 mt-0.5 font-heading">
            {totalBeneficiaries.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Across Jharkhand Districts</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Avg SROI (Social Return)
          </span>
          <div className="text-xl font-bold text-emerald-700 mt-0.5 font-heading">6.8x</div>
          <span className="text-[11px] text-slate-500">₹6.80 return per ₹1 invested</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Replication Blueprints
          </span>
          <div className="text-xl font-bold text-blue-700 mt-0.5 font-heading">100% Open Access</div>
          <span className="text-[11px] text-slate-500">MIT / Creative Commons licensed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Govt Line Depts Adopting
          </span>
          <div className="text-xl font-bold text-purple-700 mt-0.5 font-heading">3 Departments</div>
          <span className="text-[11px] text-slate-500">DWSD, JREDA, Mining</span>
        </div>
      </div>

      {/* Solutions Cards Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredSolutions.map((solution) => (
          <div
            key={solution.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    {solution.domain}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">{solution.id}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    TRL {solution.trlAchieved}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800">
                    {solution.deploymentStatus}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading leading-snug">
                  {solution.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {solution.problemSolved}
                </p>
                {solution.impactSummary && (
                  <p className="text-xs text-emerald-700 font-medium mt-1">
                    ✓ {solution.impactSummary}
                  </p>
                )}
              </div>

              {/* District & Lead Institution */}
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{solution.originalDistrict}</span>
                </span>
                <span>•</span>
                <span className="truncate">Developed by {solution.developedByUniversity}</span>
              </div>

              {/* Key Impact Stats */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Impact</span>
                  <strong className="text-slate-900">
                    {(solution.beneficiariesCount || 0).toLocaleString()} Citizens
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Readiness</span>
                  <strong className="text-emerald-700">{solution.replicationReadiness}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Est. Cost</span>
                  <strong className="text-blue-700">{solution.costEstimate}</strong>
                </div>
              </div>

              {/* Open Source & Tech Stack */}
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-slate-700">Replicable Tech Stack:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(solution.technologyStack || []).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-slate-400 truncate max-w-[200px]" title={solution.iprLicense}>
                License: {solution.iprLicense}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDownloadBlueprint(solution)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                    downloadSuccessId === solution.id
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {downloadSuccessId === solution.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Blueprint Saved</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>CAD / Blueprint</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleScalingRequest(solution)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors ${
                    scaleSuccessId === solution.id
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {scaleSuccessId === solution.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Request Forwarded</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Statewide Scaling Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
