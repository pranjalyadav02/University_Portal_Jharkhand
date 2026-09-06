import React, { useState, useMemo } from 'react';
import {
  Filter,
  Sparkles,
  MapPin,
  Users,
  AlertTriangle,
  DollarSign,
  Building,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronRight,
  Info,
  Layers,
  ArrowUpDown,
  Search,
} from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';
import { Challenge, ChallengeDomain, ChallengePriority } from '../../types';

interface ChallengeMarketplaceProps {
  recommendedOnly?: boolean;
  acceptedOnly?: boolean;
  savedOnly?: boolean;
}

export const ChallengeMarketplace: React.FC<ChallengeMarketplaceProps> = ({
  recommendedOnly = false,
  acceptedOnly = false,
  savedOnly = false,
}) => {
  const {
    challenges,
    selectedUniversity,
    setSelectedChallengeId,
    setIsEvaluationModalOpen,
    setIsTeamBuilderModalOpen,
    acceptChallenge,
    rejectChallenge,
    toggleSaveChallenge,
    getUniversityMatchScore,
    searchQuery,
  } = useUniversity();

  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'severity' | 'beneficiaries'>('match');
  const [rejectingChallengeId, setRejectingChallengeId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  // Domains & Districts available
  const domains = useMemo(() => {
    return ['All', ...new Set(challenges.map((c) => c.domain))];
  }, [challenges]);

  const districts = useMemo(() => {
    return ['All', ...new Set(challenges.map((c) => c.location.district))];
  }, [challenges]);

  // Filtered challenges
  const filteredChallenges = useMemo(() => {
    return challenges
      .filter((c) => {
        if (recommendedOnly && getUniversityMatchScore(c) < 80) return false;
        if (acceptedOnly && c.status !== 'accepted' && c.status !== 'in_project') return false;
        if (savedOnly && !c.savedByUniversity) return false;

        if (selectedDomain !== 'All' && c.domain !== selectedDomain) return false;
        if (selectedDistrict !== 'All' && c.location.district !== selectedDistrict) return false;
        if (selectedPriority !== 'All' && c.priority !== selectedPriority) return false;

        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchTitle = c.title.toLowerCase().includes(q);
          const matchDesc = c.description.toLowerCase().includes(q);
          const matchLoc = c.location.district.toLowerCase().includes(q);
          const matchDomain = c.domain.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchLoc && !matchDomain) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') {
          return getUniversityMatchScore(b) - getUniversityMatchScore(a);
        }
        if (sortBy === 'severity') {
          return b.severityScore - a.severityScore;
        }
        if (sortBy === 'beneficiaries') {
          return b.affectedPopulation - a.affectedPopulation;
        }
        return 0;
      });
  }, [
    challenges,
    recommendedOnly,
    acceptedOnly,
    savedOnly,
    selectedDomain,
    selectedDistrict,
    selectedPriority,
    sortBy,
    searchQuery,
    selectedUniversity,
  ]);

  return (
    <div className="space-y-5 pb-12">
      {/* Header & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-heading">
              {recommendedOnly
                ? 'AI Matched Challenges'
                : acceptedOnly
                ? 'Institutional Accepted Challenges'
                : savedOnly
                ? 'Saved Challenges'
                : 'AI Challenge Marketplace'}
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {filteredChallenges.length} Opportunities
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Government-verified societal problems routed from Jharkhand district administrations and line departments.
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden focus:border-blue-500"
          >
            <option value="match">AI Match Score (Highest first)</option>
            <option value="severity">Severity / Urgency Score</option>
            <option value="beneficiaries">Affected Population Size</option>
          </select>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Domain Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500 font-medium">Domain:</span>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 font-medium"
          >
            {domains.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* District Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500 font-medium">District:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 font-medium"
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500 font-medium">Priority:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 font-medium"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Only</option>
            <option value="Medium">Medium</option>
          </select>
        </div>

        {(selectedDomain !== 'All' || selectedDistrict !== 'All' || selectedPriority !== 'All') && (
          <button
            onClick={() => {
              setSelectedDomain('All');
              setSelectedDistrict('All');
              setSelectedPriority('All');
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Challenges List Grid */}
      <div className="space-y-4">
        {filteredChallenges.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
            <Layers className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-sm font-bold text-slate-800">No challenges matching criteria</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your domain or district filters, or clear your search term.
            </p>
          </div>
        ) : (
          filteredChallenges.map((challenge) => {
            const matchScore = getUniversityMatchScore(challenge);
            const isAccepted = challenge.status === 'accepted' || challenge.status === 'in_project';
            const isSaved = challenge.savedByUniversity;

            return (
              <div
                key={challenge.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all p-5 space-y-4 relative"
              >
                {/* Header Row: Domain, Priority, District, Match Score */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      {challenge.domain}
                    </span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded ${
                        challenge.priority === 'Critical'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {challenge.priority} (Severity: {challenge.severityScore}/10)
                    </span>
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {challenge.location.district} District ({challenge.location.block} Block)
                      </span>
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-mono text-[11px]">{challenge.id}</span>
                  </div>

                  {/* AI Match Badge */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        matchScore >= 90
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : matchScore >= 80
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>{matchScore}% Institutional Match</span>
                    </div>

                    <button
                      onClick={() => toggleSaveChallenge(challenge.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                      title={isSaved ? 'Saved to bookmarks' : 'Save challenge'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Challenge Title & Summary */}
                <div>
                  <h3
                    onClick={() => setSelectedChallengeId(challenge.id)}
                    className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors font-heading"
                  >
                    {challenge.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{challenge.description}</p>
                </div>

                {/* Government & Impact Key Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                      Affected Population
                    </span>
                    <span className="font-bold text-slate-800">
                      {challenge.affectedPopulation.toLocaleString()} citizens ({challenge.location.villagesCount} villages)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                      Available Funding
                    </span>
                    <span className="font-bold text-emerald-700">{challenge.fundingAvailable.split('(')[0]}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                      Government Dept
                    </span>
                    <span className="font-medium text-slate-700 truncate block" title={challenge.govtDepartment}>
                      {challenge.govtDepartment.split(',')[0]}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                      Target TRL Level
                    </span>
                    <span className="font-bold text-purple-700">TRL {challenge.suggestedTRL} ➔ TRL 6+</span>
                  </div>
                </div>

                {/* AI Why Matched Reasons Snippet */}
                {challenge.matchBreakdown[selectedUniversity.id] && (
                  <div className="bg-purple-50/50 p-2.5 rounded-lg border border-purple-100 text-xs flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="font-bold text-purple-900">Why {selectedUniversity.shortName} matches: </span>
                      <span className="text-purple-950">
                        {challenge.matchBreakdown[selectedUniversity.id].reasons[0]}
                      </span>
                    </div>
                  </div>
                )}

                {/* Disciplines & Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-semibold text-slate-500 text-[11px]">Required Disciplines:</span>
                    {challenge.matchBreakdown[selectedUniversity.id]?.suggestedDisciplines.map((d) => (
                      <span
                        key={d}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Operational Action Buttons (Accept, Reject, Request Info, Form Team) */}
                  <div className="flex items-center gap-2">
                    {/* View Details Modal Button */}
                    <button
                      onClick={() => setSelectedChallengeId(challenge.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      View Workspace
                    </button>

                    {/* Reject Dialog Trigger */}
                    {!isAccepted && (
                      <button
                        onClick={() => setRejectingChallengeId(challenge.id)}
                        className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                        title="Decline / Reject Challenge"
                      >
                        Reject
                      </button>
                    )}

                    {/* Evaluate Button */}
                    <button
                      onClick={() => {
                        setSelectedChallengeId(challenge.id);
                        setIsEvaluationModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                    >
                      Evaluate Fit
                    </button>

                    {/* Accept / Form Team Hero Button */}
                    {isAccepted ? (
                      <button
                        onClick={() => {
                          setSelectedChallengeId(challenge.id);
                          setIsTeamBuilderModalOpen(true);
                        }}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Team Assembled / View Team</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => acceptChallenge(challenge.id)}
                        className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Accept & Form AI Team</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Rejection Modal Input Inline if active */}
                {rejectingChallengeId === challenge.id && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 animate-in fade-in">
                    <div className="text-xs font-bold text-rose-900">
                      Provide authorized reason for declining this challenge:
                    </div>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="E.g., Lack of specialized hydraulic flume testing equipment or faculty currently on sabbatical..."
                      className="w-full text-xs p-2 rounded-lg border border-rose-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setRejectingChallengeId(null)}
                        className="px-2.5 py-1 text-xs text-slate-600 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (rejectReason.trim()) {
                            rejectChallenge(challenge.id, rejectReason);
                            setRejectingChallengeId(null);
                            setRejectReason('');
                          }
                        }}
                        disabled={!rejectReason.trim()}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                      >
                        Confirm Decline
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
