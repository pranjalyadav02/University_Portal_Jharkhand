import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Building, Send, Award } from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';

export const ChallengeEvaluationModal: React.FC = () => {
  const {
    isEvaluationModalOpen,
    setIsEvaluationModalOpen,
    selectedChallengeId,
    challenges,
    selectedUniversity,
    acceptChallenge,
    rejectChallenge,
    addAuditLog,
  } = useUniversity();

  const [techFeasibility, setTechFeasibility] = useState(4);
  const [infraAvailability, setInfraAvailability] = useState(5);
  const [financialViability, setFinancialViability] = useState(4);
  const [impactPotential, setImpactPotential] = useState(5);
  const [evaluatorNotes, setEvaluatorNotes] = useState('');
  const [decision, setDecision] = useState<'accept' | 'reject' | 'refer'>('accept');
  const [referralTarget, setReferralTarget] = useState('NIT Jamshedpur');

  if (!isEvaluationModalOpen || !selectedChallengeId) return null;

  const challenge = challenges.find((c) => c.id === selectedChallengeId);
  if (!challenge) return null;

  const totalScore = Math.round(((techFeasibility + infraAvailability + financialViability + impactPotential) / 20) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (decision === 'accept') {
      acceptChallenge(challenge.id);
      addAuditLog(
        'EVALUATION_APPROVED',
        challenge.id,
        `Institutional review score: ${totalScore}%. Challenge approved for multidisciplinary team assembly.`
      );
    } else if (decision === 'reject') {
      rejectChallenge(challenge.id, evaluatorNotes || 'Institutional feasibility score below required threshold.');
    } else if (decision === 'refer') {
      addAuditLog(
        'EVALUATION_REFERRED',
        challenge.id,
        `Referred to ${referralTarget}. Note: ${evaluatorNotes}`
      );
    }
    setIsEvaluationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 md:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Institutional Evaluation Form
            </div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 font-heading">
              {challenge.title}
            </h2>
          </div>
          <button
            onClick={() => setIsEvaluationModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Total Score Badge */}
          <div className="flex items-center justify-between p-3.5 bg-blue-50/70 rounded-xl border border-blue-200">
            <div>
              <span className="text-xs font-bold text-blue-900">Institutional Suitability Index:</span>
              <p className="text-[11px] text-blue-700">Combined score across technical, laboratory, and impact criteria</p>
            </div>
            <div className="text-xl font-bold text-blue-800 font-heading">{totalScore} / 100</div>
          </div>

          {/* Sliders Grid */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>1. Technical & Research Feasibility</span>
                <span className="font-bold text-blue-600">{techFeasibility} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={techFeasibility}
                onChange={(e) => setTechFeasibility(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>High Research Uncertainty</span>
                <span>Established Methodology</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>2. Infrastructure & Laboratory Availability</span>
                <span className="font-bold text-blue-600">{infraAvailability} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={infraAvailability}
                onChange={(e) => setInfraAvailability(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Missing Key Instruments</span>
                <span>Full Test Bench Ready</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>3. Financial & Grant Viability</span>
                <span className="font-bold text-blue-600">{financialViability} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={financialViability}
                onChange={(e) => setFinancialViability(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>4. Societal Impact & Scalability Potential</span>
                <span className="font-bold text-blue-600">{impactPotential} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={impactPotential}
                onChange={(e) => setImpactPotential(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Evaluator Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Evaluator Assessment Notes:
            </label>
            <textarea
              value={evaluatorNotes}
              onChange={(e) => setEvaluatorNotes(e.target.value)}
              placeholder="Detail reasons for decision, key faculty to involve, lab equipment requirements, or barriers..."
              className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              rows={3}
            />
          </div>

          {/* Decision Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-900 block">
              Institutional Recommendation:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                  decision === 'accept'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value="accept"
                  checked={decision === 'accept'}
                  onChange={() => setDecision('accept')}
                  className="sr-only"
                />
                Accept Challenge
              </label>

              <label
                className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                  decision === 'reject'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value="reject"
                  checked={decision === 'reject'}
                  onChange={() => setDecision('reject')}
                  className="sr-only"
                />
                Decline / Reject
              </label>

              <label
                className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                  decision === 'refer'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value="refer"
                  checked={decision === 'refer'}
                  onChange={() => setDecision('refer')}
                  className="sr-only"
                />
                Refer Institution
              </label>
            </div>

            {decision === 'refer' && (
              <div className="pt-2">
                <label className="text-[11px] text-slate-600 block mb-1">Select Recommended Institution:</label>
                <select
                  value={referralTarget}
                  onChange={(e) => setReferralTarget(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="BIT Sindri">BIT Sindri (Chemical & Hydraulics)</option>
                  <option value="NIT Jamshedpur">NIT Jamshedpur (Robotics & Telemetry)</option>
                  <option value="BIT Mesra">BIT Mesra (GIS & Remote Sensing)</option>
                  <option value="Central University of Jharkhand">Central University of Jharkhand (Energy & Tribal)</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEvaluationModalOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Submit Official Evaluation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
