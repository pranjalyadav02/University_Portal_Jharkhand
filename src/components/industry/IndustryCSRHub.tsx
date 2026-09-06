import React, { useState } from 'react';
import {
  Handshake,
  Building,
  DollarSign,
  Award,
  CheckCircle2,
  FileCheck,
  Search,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';

export const IndustryCSRHub: React.FC = () => {
  const { selectedUniversity } = useUniversity();

  const [partners, setPartners] = useState([
    {
      id: 'ind-01',
      name: 'Tata Steel CSR (TSRDS)',
      domain: 'Water Security & Public Health',
      status: 'Active MoU',
      committedFunding: '₹45,00,000',
      deployedFunding: '₹22,00,000',
      activeProjects: ['PRJ-2026-001 (Gumla Water)'],
      facilitiesOffered: 'TSRDS Field Water Quality Testing Vans & Jamshedpur Metallurgy Labs',
      ipAgreement: 'Shared IPR (University holds academic rights; Tata holds non-exclusive field trial rights)',
      contactPerson: 'Shri Sourav Roy (Chief CSR, Tata Steel)',
    },
    {
      id: 'ind-02',
      name: 'Central Coalfields Limited (CCL CSR)',
      domain: 'Disaster Safety & Slope Telemetry',
      status: 'In Discussion',
      committedFunding: '₹60,00,000',
      deployedFunding: '₹0 (Awaiting MoU execution)',
      activeProjects: ['CCL-North-Karanpura-OpenCast'],
      facilitiesOffered: 'Access to North Karanpura active open cast mine face for sensor mesh testing',
      ipAgreement: 'Joint patent with Coal India R&D wing',
      contactPerson: 'Dr. B. K. Pandey (GM CSR, CCL)',
    },
    {
      id: 'ind-03',
      name: 'Adani Power Jharkhand Ltd CSR',
      domain: 'Renewable Micro-grids & Agriculture',
      status: 'Active MoU',
      committedFunding: '₹35,00,000',
      deployedFunding: '₹18,00,000',
      activeProjects: ['Godda Solar Cold Storage Trial'],
      facilitiesOffered: 'Godda Thermal Power complex instrumentation & calibration workshops',
      ipAgreement: 'Open innovation model for community farmers',
      contactPerson: 'Ms. Priyadarshini Sen (CSR Lead)',
    },
  ]);

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-heading">
              Industry & CSR Collaboration Hub
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              ₹1.40 Cr Committed Co-funding
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Institutional matching engine connecting university research projects with corporate CSR mandates, industrial test beds, and joint commercialization pathways.
          </p>
        </div>

        <button
          onClick={() => alert('New CSR Partner Expression of Interest dialog')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Invite New CSR Partner</span>
        </button>
      </div>

      {/* Corporate Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
            Total CSR Grants Committed
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-0.5 font-heading">₹1,40,00,000</div>
          <span className="text-xs text-emerald-700 font-medium">₹40L disbursed to date</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
            Active Industrial Test Beds
          </span>
          <div className="text-2xl font-bold text-blue-700 mt-0.5 font-heading">4 Corporate Labs</div>
          <span className="text-xs text-slate-500">Metallurgy, Open Cast Mines, Solar Labs</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
            Standardized IP Framework
          </span>
          <div className="text-2xl font-bold text-purple-700 mt-0.5 font-heading">Jharkhand HEI-IPR 2026</div>
          <span className="text-xs text-slate-500">Dual ownership & student equity protection</span>
        </div>
      </div>

      {/* Corporate Partners List */}
      <div className="space-y-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 font-heading">{partner.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  {partner.domain}
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                  partner.status === 'Active MoU'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {partner.status}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">Committed Co-funding:</span>
                <strong className="text-slate-900 text-sm font-bold">{partner.committedFunding}</strong>
                <div className="text-emerald-700 font-medium">Disbursed: {partner.deployedFunding}</div>
              </div>
              <div>
                <span className="text-slate-500 block">Facilities / Equipment Shared:</span>
                <div className="text-slate-700 font-medium">{partner.facilitiesOffered}</div>
              </div>
              <div>
                <span className="text-slate-500 block">Nodal Contact:</span>
                <div className="text-slate-900 font-bold">{partner.contactPerson}</div>
              </div>
            </div>

            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-purple-900">Intellectual Property Framework: </span>
                <span className="text-purple-950">{partner.ipAgreement}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
