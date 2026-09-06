import React from 'react';
import { ShieldCheck, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useUniversity();

  return (
    <div className="space-y-5 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-heading">
              Institutional Governance & Audit Trail
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Immutable Log
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Verifiable chronological log of challenge evaluations, team assignments, funding authorizations, and TRL level verifications.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 font-mono">{log.action}</span>
                    {log.targetId && (
                      <span className="px-2 py-0.2 bg-blue-100 text-blue-800 rounded font-mono text-[10px]">
                        {log.targetId}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 mt-0.5">{log.details}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-400 shrink-0 text-[11px] self-end sm:self-center">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span>•</span>
                <span>Actor: {log.actor}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
