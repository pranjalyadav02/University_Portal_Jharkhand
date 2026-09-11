export type UserRole =
  | 'leadership' // Vice Chancellor / Dean / Director
  | 'faculty'    // Faculty Mentor / Principal Investigator
  | 'student'    // Student Researcher / Lead
  | 'innovation' // Incubation & Innovation Head
  | 'industry'   // Industry / CSR Collaborator
  | 'government';// Government Liaison Officer

export interface University {
  id: string;
  name: string;
  shortName: string;
  type: 'IIT' | 'NIT' | 'State University' | 'Central University' | 'Private/Deemed';
  district: string;
  location: string;
  established: number;
  studentsCount: number;
  facultyCount: number;
  patentsCount: number;
  activeProjectsCount: number;
  departments: string[];
  keyStrengths: string[];
  incubatorName: string;
  logoColor: string;
}

export type ChallengeDomain =
  | 'Water & Sanitation'
  | 'Agriculture & Irrigation'
  | 'Healthcare & Rural Health'
  | 'Roads & Infrastructure'
  | 'Clean Energy & Microgrids'
  | 'Waste & Environment'
  | 'Education & Skill'
  | 'Disaster & Mining Safety';

export type ChallengePriority = 'Critical' | 'High' | 'Medium';

export type ChallengeStatus =
  | 'available'
  | 'under_evaluation'
  | 'accepted'
  | 'team_formed'
  | 'in_project'
  | 'rejected';

export interface AIMatchBreakdown {
  overallScore: number; // 0 - 100
  departmentFit: number;
  facultyExpertiseFit: number;
  labEquipmentFit: number;
  studentSkillsFit: number;
  pastProjectRelevance: number;
  reasons: string[];
  suggestedDisciplines: string[];
  suggestedTechnologies: string[];
}

export interface Challenge {
  id: string; // e.g. CH-2026-00421
  title: string;
  summary: string;
  description: string;
  citizenReportId: string;
  location: {
    state: string;
    district: string;
    block: string;
    panchayat: string;
    villagesCount: number;
    coordinates?: string;
  };
  domain: ChallengeDomain;
  priority: ChallengePriority;
  severityScore: number; // 1-10
  affectedPopulation: number;
  estimatedBeneficiaries: number;
  verifiedByGovt: boolean;
  govtDepartment: string;
  assignedOfficer: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
  submissionDate: string;
  targetDeadline: string;
  suggestedTRL: number;
  estimatedComplexity: 'Moderate' | 'High' | 'Complex';
  fundingAvailable: string; // e.g. "₹12,00,000 (DST / State Innovation Fund)"
  industryInterest: string; // e.g. "Tata Steel CSR & Dalmia Foundation"
  status: ChallengeStatus;
  savedByUniversity?: boolean;
  matchBreakdown: Record<string, AIMatchBreakdown>; // keyed by university id
  researchQuestions: string[];
  possibleMethodologies: string[];
  availableDatasets: string[];
  similarReportsCount: number;
  clusterTag: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  universityId: string;
  expertise: string[];
  researchInterests: string[];
  publicationsCount: number;
  patentsCount: number;
  activeProjects: number;
  mentorshipCapacity: 'Available' | 'Moderate' | 'Full';
  email: string;
  avatarUrl?: string;
}

export interface Student {
  id: string;
  name: string;
  department: string;
  year: string;
  universityId: string;
  skills: string[];
  programmingLanguages: string[];
  aiMlSkills: string[];
  researchInterests: string[];
  projectsCompleted: number;
  certifications: string[];
  availabilityHoursPerWeek: number;
  preferredDomains: string[];
  status: 'Ready for Assignment' | 'On Active Team' | 'Graduating';
  email: string;
}

export interface TeamMemberRecommendation {
  personId: string;
  name: string;
  type: 'faculty' | 'student';
  department: string;
  assignedRole: string;
  matchScore: number;
  rationale: string;
  avatarInitials: string;
  availability: string;
}

export type TRLStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface TRLEvidence {
  trlLevel: TRLStage;
  title: string;
  description: string;
  approvedBy: string;
  approvalRole: string;
  approvalDate: string;
  documentRef: string;
  status: 'Approved' | 'Under Review' | 'Pending Evidence';
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  trlTarget: number;
  status: 'Completed' | 'In Progress' | 'Upcoming' | 'Blocked';
  fundingTranche: string;
  fundingPercentage: number;
  isUnlocked: boolean;
  deliverables: string[];
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
}

export interface PrototypeVersion {
  version: string;
  name: string;
  type: 'Hardware' | 'Software' | 'IoT Firmware' | 'CAD / Enclosure' | 'ML Model';
  releaseDate: string;
  notes: string;
  downloadUrl?: string;
  status: 'Lab Testing' | 'Field Ready' | 'Deprecated';
}

export interface FieldPilot {
  id: string;
  location: string;
  district: string;
  block: string;
  panchayat: string;
  govtLiaisonOfficer: string;
  communityContact: string;
  deploymentDate: string;
  durationMonths: number;
  targetBeneficiaries: number;
  actualBeneficiariesSoFar: number;
  status: 'Active Field Testing' | 'Completed' | 'Scaling Up' | 'Preparing Site';
  metrics: {
    name: string;
    baseline: string;
    target: string;
    currentResult: string;
    unit: string;
  }[];
  validationScore: number; // e.g. 88 out of 100
  citizenFeedbackSummary: {
    satisfactionRate: number; // percentage
    usabilityRating: number; // out of 5
    effectivenessRating: number; // out of 5
    totalResponses: number;
    keyQuotes: {
      citizenName: string;
      role: string;
      village: string;
      quote: string;
      sentiment: 'positive' | 'constructive';
    }[];
  };
  lessonsLearned?: LessonLearned[];
}

export type LessonLearnedCategory =
  | 'Technical & Engineering'
  | 'Field & Community Adoption'
  | 'Logistics & Supply Chain'
  | 'Regulatory & Governance'
  | 'Environmental & Durability'
  | 'Sensor & Hardware Deployment'
  | 'Data & Connectivity';

export type LessonLearnedAuthorRole =
  | 'Team Lead'
  | 'Faculty Mentor'
  | 'Student Lead'
  | 'Govt Liaison'
  | 'Field Researcher';

export interface LessonLearned {
  id: string;
  projectId: string;
  projectTitle: string;
  pilotId?: string;
  pilotLocation?: string;
  district?: string;
  domain: ChallengeDomain;
  lifecycleStage: 'Research' | 'Prototype' | 'Testing' | 'Field Pilot' | 'Deployment' | 'Completed';
  trlStage?: TRLStage;
  authorName: string;
  authorRole: LessonLearnedAuthorRole;
  date: string;
  category: LessonLearnedCategory;
  title: string;
  challengeEncountered: string; // significant challenge encountered
  resolutionStrategy: string; // how they were overcome
  keyInsights: string; // key insights gained
  preventativeAdvice: string; // actionable recommendation for future project planning
  tags: string[];
  reusabilityRating: number; // 1 to 5 scale
  verifiedBy?: string;
  isPilotSpecific?: boolean;
}

export interface IndustryPartner {
  id: string;
  name: string;
  type: 'CSR Foundation' | 'Enterprise' | 'Startup' | 'PSU';
  domains: string[];
  contributionOffered: string[];
  contactPerson: string;
  matchScore: number;
  status: 'Committed' | 'In Discussion' | 'Identified';
}

export interface ProjectRisk {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: 'Milestone Delay' | 'Field Access' | 'Equipment Bottleneck' | 'Funding' | 'Community Adoption';
  description: string;
  suggestedResolution: string;
  status: 'Active Alert' | 'Mitigated';
}

export interface BudgetItem {
  id: string;
  category: 'Capital Equipment' | 'Consumables & Hardware' | 'Field Trials & Testing' | 'Researcher Stipends & Manpower' | 'Institutional Overhead & Contingency';
  item: string;
  amount: number; // In INR
  justification: string;
}

export interface ProjectScopeReport {
  problemDiagnosis: string;
  objectives: string[];
  scopeOfWork: string;
  technicalMethodology: string;
  deliverables: string[];
  targetBeneficiaries: string;
  status: 'Draft' | 'Finalized' | 'Approved by Dean';
  lastUpdated: string;
}

export interface IndustryEOI {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  pledgedAmount: number;
  mode: 'CSR Funding' | 'Technology Co-Development' | 'Deployment & Manufacturing Partner';
  contactPerson: string;
  contactEmail: string;
  message: string;
  date: string;
  status: 'Received' | 'Discussion Scheduled' | 'MoA Finalized';
}

export interface IndustryProposal {
  status: 'Not Submitted' | 'Under Preparation' | 'Sent to Industry Platform' | 'Partner Matched';
  dispatchedAt?: string;
  totalBudgetRequested: number;
  corporateSponsorshipTarget: number;
  expressionsOfInterest: IndustryEOI[];
  executiveSummary: string;
}

export interface Project {
  id: string; // PR-2026-0019
  challengeId: string; // CH-2026-00421
  title: string;
  domain: ChallengeDomain;
  universityId: string;
  leadFaculty: string;
  coMentors: string[];
  studentLeads: string[];
  teamId: string;
  teamSize: number;
  currentTRL: TRLStage;
  trlHistory: TRLEvidence[];
  status: 'Research' | 'Prototype' | 'Testing' | 'Field Pilot' | 'Deployment' | 'Completed';
  lifecycleStage: 'Research' | 'Prototype' | 'Testing' | 'Field Pilot' | 'Deployment' | 'Completed';
  progressPercentage: number;
  funding: {
    totalBudget: string;
    sanctioned: string;
    received: string;
    expended: string;
    remaining: string;
    source: string;
  };
  scopeReport?: ProjectScopeReport;
  itemizedBudget?: BudgetItem[];
  industryProposal?: IndustryProposal;
  milestones: Milestone[];
  tasks: Task[];
  prototypes: PrototypeVersion[];
  fieldPilot?: FieldPilot;
  industryPartners: IndustryPartner[];
  risks: ProjectRisk[];
  iprStatus: {
    type: 'Provisional Patent' | 'Published Patent' | 'Copyright' | 'Open Source' | 'Under Prep';
    applicationNumber?: string;
    title: string;
    filingDate?: string;
  };
  publications: {
    title: string;
    venue: string;
    year: number;
    status: 'Published' | 'Under Review' | 'Draft';
  }[];
  startupIncubation?: {
    incubatorName: string;
    ventureName: string;
    stage: 'Ideation' | 'Pre-Incubation' | 'Incubation' | 'MVP / Pilot' | 'Incorporated';
    potentialMarket: string;
  };
  communityValidationScore: number;
  lessonsLearned?: LessonLearned[];
}

export interface UniversityLab {
  id: string;
  name: string;
  universityId: string;
  department: string;
  facilityManager: string;
  capacity: string;
  equipmentCount: number;
  keyEquipment: string[];
  status: 'Operational & Bookable' | 'Maintenance' | 'High Utilization';
  activeBookings: number;
}

export interface EquipmentItem {
  id: string;
  name: string;
  labId: string;
  universityId: string;
  model: string;
  type: string;
  status: 'Available' | 'In Use' | 'Reserved';
  bookedByProject?: string;
}

export interface ReusableSolution {
  id: string;
  title: string;
  problemSolved: string;
  originalDistrict: string;
  domain: ChallengeDomain;
  technologyStack: string[];
  developedByUniversity: string;
  trlAchieved: number;
  costEstimate: string;
  deploymentStatus: 'Deployed in 3 Panchayats' | 'Commercialized' | 'Open Public Asset';
  impactSummary: string;
  beneficiariesCount: number;
  iprLicense: string;
  replicationReadiness: 'Immediate Turnkey' | 'Requires Minor Customization';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'challenge' | 'milestone' | 'funding' | 'risk' | 'pilot' | 'govt';
  read: boolean;
  actionUrl?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entityId: string;
  details: string;
}
