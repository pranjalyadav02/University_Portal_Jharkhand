import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import {
  University,
  UserRole,
  Challenge,
  Project,
  FacultyMember,
  Student,
  UniversityLab,
  EquipmentItem,
  ReusableSolution,
  NotificationItem,
  AuditLogItem,
  TRLEvidence,
  LessonLearned,
  BudgetItem,
  ProjectScopeReport,
  IndustryProposal,
  IndustryEOI,
} from '../types';
import {
  UNIVERSITIES,
  CHALLENGES,
  FACULTY_MEMBERS,
  STUDENTS,
  PROJECTS,
  UNIVERSITY_LABS,
  EQUIPMENT_REGISTRY,
  REUSABLE_SOLUTIONS,
  NOTIFICATIONS,
  AUDIT_LOGS,
  INITIAL_LESSONS_LEARNED,
} from '../data/seedData';

export type NavigationTab =
  | 'command_center'
  | 'challenges_marketplace'
  | 'recommended_challenges'
  | 'saved_challenges'
  | 'accepted_challenges'
  | 'research_projects'
  | 'project_gantt'
  | 'innovation_projects'
  | 'existing_solutions'
  | 'lessons_learned'
  | 'my_teams'
  | 'ai_team_builder'
  | 'faculty_mentors'
  | 'student_talent_pool'
  | 'labs_facilities'
  | 'equipment'
  | 'collaboration_industry'
  | 'collaboration_govt'
  | 'trl_tracker'
  | 'field_pilots'
  | 'community_feedback'
  | 'ipr_outputs'
  | 'startups_incubation'
  | 'impact_dashboard'
  | 'audit_logs';

interface UniversityContextType {
  // Institution & User
  selectedUniversity: University;
  setSelectedUniversity: (uni: University) => void;
  currentUserRole: UserRole;
  currentUserName: string;
  currentUserEmail: string;

  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Data Collections
  universities: University[];
  challenges: Challenge[];
  projects: Project[];
  assignedProjects: Project[];
  facultyMembers: FacultyMember[];
  students: Student[];
  labs: UniversityLab[];
  equipment: EquipmentItem[];
  solutions: ReusableSolution[];
  deployedSolutions: ReusableSolution[];
  lessonsLearned: LessonLearned[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];

  // Selected Items for modals/workspaces
  selectedChallengeId: string | null;
  setSelectedChallengeId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;

  // Modals & Panels
  isEvaluationModalOpen: boolean;
  setIsEvaluationModalOpen: (open: boolean) => void;
  isTeamBuilderModalOpen: boolean;
  setIsTeamBuilderModalOpen: (open: boolean) => void;
  isResearchAssistantOpen: boolean;
  setIsResearchAssistantOpen: (open: boolean) => void;
  isDemoGuideOpen: boolean;
  setIsDemoGuideOpen: (open: boolean) => void;
  demoMode: 'demo1' | 'demo2' | null;
  setDemoMode: (mode: 'demo1' | 'demo2' | null) => void;
  isLessonModalOpen: boolean;
  setIsLessonModalOpen: (open: boolean) => void;
  lessonModalContext: {
    projectId?: string;
    pilotId?: string;
    defaultCategory?: string;
    stage?: string;
    isPilotSpecific?: boolean;
  } | null;
  setLessonModalContext: (ctx: {
    projectId?: string;
    pilotId?: string;
    defaultCategory?: string;
    stage?: string;
    isPilotSpecific?: boolean;
  } | null) => void;

  // Actions
  acceptChallenge: (challengeId: string) => void;
  rejectChallenge: (challengeId: string, reason: string) => void;
  toggleSaveChallenge: (challengeId: string) => void;
  createProjectFromChallenge: (challengeId: string, teamData?: any) => string;
  assignProjectByDean: (
    challengeId: string,
    assignment: {
      leadFaculty: string;
      coMentors: string[];
      studentLeads: string[];
      initialBudget: string;
      targetDeadline?: string;
    }
  ) => string;
  updateProjectScopeAndBudget: (
    projectId: string,
    scopeReport: ProjectScopeReport,
    itemizedBudget: BudgetItem[]
  ) => void;
  dispatchToIndustryPlatform: (projectId: string, corporateSponsorshipTarget?: number) => void;
  advanceProjectTRL: (projectId: string, newTRL: number, evidence: Omit<TRLEvidence, 'trlLevel' | 'status'>) => boolean;
  toggleTaskStatus: (projectId: string, taskId: string) => void;
  bookEquipment: (equipmentId: string, projectId: string) => void;
  addLessonLearned: (lesson: Omit<LessonLearned, 'id' | 'date'>) => LessonLearned;
  completeFieldPilot: (projectId: string) => void;
  completeProject: (projectId: string) => void;
  markNotificationAsRead: (id: string) => void;
  addAuditLog: (action: string, entityId: string, details: string) => void;

  // Helpers
  getUniversityMatchScore: (challenge: Challenge) => number;
}

const UniversityContext = createContext<UniversityContextType | undefined>(undefined);

export const UniversityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedUniversity, setSelectedUniversity] = useState<University>(UNIVERSITIES[0]); // IIT ISM Dhanbad default

  // Authentication & Persona Lock from login credentials / URL params
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const paramRole = params.get('role');
  const paramEmail = params.get('email');
  const paramName = params.get('name');

  const savedRole = typeof window !== 'undefined' ? (sessionStorage.getItem('uni_role') as UserRole | null) : null;
  const savedEmail = typeof window !== 'undefined' ? sessionStorage.getItem('uni_email') : null;
  const savedName = typeof window !== 'undefined' ? sessionStorage.getItem('uni_name') : null;

  const initialRole: UserRole = (paramRole === 'leadership' || paramRole === 'faculty' || paramRole === 'student')
    ? paramRole
    : (savedRole === 'leadership' || savedRole === 'faculty' || savedRole === 'student' ? savedRole : 'faculty');

  const initialEmail: string = paramEmail || savedEmail || (
    initialRole === 'leadership' ? 'dean@ism.ac.in' :
    initialRole === 'student' ? 'student.aakash@ism.ac.in' :
    'prof.anurag@ism.ac.in'
  );

  const initialName: string = paramName || savedName || (
    initialRole === 'leadership' ? 'Prof. Rajiv Shekhar (Dean R&D)' :
    initialRole === 'student' ? 'Aakash Verma (M.Tech Researcher)' :
    'Prof. (Dr.) Anurag Bhattacharya (Faculty PI)'
  );

  if (typeof window !== 'undefined') {
    sessionStorage.setItem('uni_role', initialRole);
    sessionStorage.setItem('uni_email', initialEmail);
    sessionStorage.setItem('uni_name', initialName);
  }

  // Persona role is strictly decided by login credentials - no in-app switching!
  const [currentUserRole] = useState<UserRole>(initialRole);
  const [currentUserName] = useState<string>(initialName);
  const [currentUserEmail] = useState<string>(initialEmail);

  const [activeTab, setActiveTab] = useState<NavigationTab>('command_center');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [challenges, setChallenges] = useState<Challenge[]>(CHALLENGES);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [facultyMembers] = useState<FacultyMember[]>(FACULTY_MEMBERS);
  const [students] = useState<Student[]>(STUDENTS);
  const [labs] = useState<UniversityLab[]>(UNIVERSITY_LABS);
  const [equipment, setEquipment] = useState<EquipmentItem[]>(EQUIPMENT_REGISTRY);
  const [solutions] = useState<ReusableSolution[]>(REUSABLE_SOLUTIONS);
  const [lessonsLearned, setLessonsLearned] = useState<LessonLearned[]>(INITIAL_LESSONS_LEARNED);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(AUDIT_LOGS);

  // Projects strictly assigned to the current user's authenticated identity
  const assignedProjects = useMemo(() => {
    if (currentUserRole === 'leadership') {
      // Deans and Vice Deans have institutional oversight of all projects
      return projects;
    }
    if (currentUserRole === 'student') {
      // Students only work on projects where they are in studentLeads
      return projects.filter((p) =>
        p.studentLeads.some((s) => s.toLowerCase().includes('aakash') || s.toLowerCase().includes(currentUserName.toLowerCase()))
      );
    }
    // Faculty PI works only on projects where they are Lead Faculty or Co-Mentor
    return projects.filter((p) =>
      p.leadFaculty.toLowerCase().includes('anurag') ||
      p.leadFaculty.toLowerCase().includes(currentUserName.toLowerCase()) ||
      p.coMentors.some((m) => m.toLowerCase().includes('anurag') || m.toLowerCase().includes(currentUserName.toLowerCase()))
    );
  }, [projects, currentUserRole, currentUserName]);

  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() => {
    return assignedProjects[0]?.id || PROJECTS[0].id;
  });

  // Ensure selected project is always within user's assigned projects
  React.useEffect(() => {
    if (assignedProjects.length > 0 && !assignedProjects.some((p) => p.id === selectedProjectId)) {
      setSelectedProjectId(assignedProjects[0].id);
    }
  }, [assignedProjects, selectedProjectId]);

  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState<boolean>(false);
  const [isTeamBuilderModalOpen, setIsTeamBuilderModalOpen] = useState<boolean>(false);
  const [isResearchAssistantOpen, setIsResearchAssistantOpen] = useState<boolean>(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);
  const [demoMode, setDemoMode] = useState<'demo1' | 'demo2' | null>(null);

  const [isLessonModalOpen, setIsLessonModalOpen] = useState<boolean>(false);
  const [lessonModalContext, setLessonModalContext] = useState<{
    projectId?: string;
    pilotId?: string;
    defaultCategory?: string;
    stage?: string;
    isPilotSpecific?: boolean;
  } | null>(null);

  // Backend API Sync on mount
  React.useEffect(() => {
    fetch('/api/v1/university/challenges')
      .then(r => r.ok ? r.json() : null)
      .then(res => {
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setChallenges(res.data);
        }
      })
      .catch(() => {});

    fetch('/api/v1/university/projects')
      .then(r => r.ok ? r.json() : null)
      .then(res => {
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setProjects(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const getUniversityMatchScore = (challenge: Challenge): number => {
    const match = challenge.matchBreakdown[selectedUniversity.id];
    return match ? match.overallScore : 78;
  };

  const addAuditLog = (action: string, entityId: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      user: currentUserRole === 'faculty' ? 'Prof. (Dr.) Anurag Bhattacharya' : 'Authorized ' + currentUserRole,
      role: currentUserRole.toUpperCase(),
      action,
      entityId,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const acceptChallenge = (challengeId: string) => {
    if (currentUserRole !== 'leadership') {
      addAuditLog('ACCESS_DENIED', challengeId, 'Only a Dean, Vice Dean, or other institutional leadership role can assign a new project.');
      return;
    }
    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, status: 'accepted' } : c))
    );
    addAuditLog('ACCEPTED_CHALLENGE', challengeId, `Institutional acceptance confirmed for ${challengeId}.`);
    
    // Sync to backend API
    fetch(`/api/v1/university/challenges/${challengeId}/adopt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadFacultyId: 'fac-1' }),
    }).catch(() => {});

    // Open AI team builder immediately to guide user
    setSelectedChallengeId(challengeId);
    setIsTeamBuilderModalOpen(true);
  };

  const rejectChallenge = (challengeId: string, reason: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, status: 'rejected' } : c))
    );
    addAuditLog('REJECTED_CHALLENGE', challengeId, `Challenge declined. Reason: ${reason}`);
  };

  const toggleSaveChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, savedByUniversity: !c.savedByUniversity } : c))
    );
  };

  const createProjectFromChallenge = (challengeId: string, teamData?: any): string => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) return '';

    const newProjectId = `PR-2026-00${Math.floor(50 + Math.random() * 40)}`;
    const newProject: Project = {
      id: newProjectId,
      challengeId: challenge.id,
      title: `${challenge.title.split(':')[0] || challenge.title} — Innovation Initiative`,
      domain: challenge.domain,
      universityId: selectedUniversity.id,
      leadFaculty: teamData?.leadFaculty || 'Prof. (Dr.) Anurag Bhattacharya',
      coMentors: teamData?.coMentors || ['Dr. Shalini Mukhopadhyay', 'Dr. Rajeshwar Soren'],
      studentLeads: teamData?.studentLeads || ['Aakash Verma', 'Pooja Murmu', 'Rohan Gupta'],
      teamId: `TM-${Math.floor(100 + Math.random() * 900)}`,
      teamSize: (teamData?.studentLeads?.length || 3) + (teamData?.coMentors?.length || 2) + 1,
      currentTRL: 2,
      trlHistory: [
        {
          trlLevel: 1,
          title: 'Basic Principles Observed & Reported',
          description: 'Problem statement synthesized from verified government challenge baseline.',
          approvedBy: 'State Innovation Council & Principal Investigator',
          approvalRole: 'Principal Investigator',
          approvalDate: new Date().toISOString().split('T')[0],
          documentRef: `DOC-${newProjectId}-TRL1.pdf`,
          status: 'Approved',
        },
        {
          trlLevel: 2,
          title: 'Technology Concept & Multidisciplinary Plan Formulated',
          description: 'Multidisciplinary team assembled; research questions and architectural concept established.',
          approvedBy: teamData?.leadFaculty || 'Prof. (Dr.) Anurag Bhattacharya',
          approvalRole: 'Lead Faculty Mentor',
          approvalDate: new Date().toISOString().split('T')[0],
          documentRef: `DOC-${newProjectId}-TRL2-PLAN.pdf`,
          status: 'Approved',
        },
      ],
      status: 'Research',
      lifecycleStage: 'Research',
      progressPercentage: 20,
      funding: {
        totalBudget: challenge.fundingAvailable.split(' ')[0] || '₹14,00,000',
        sanctioned: challenge.fundingAvailable.split(' ')[0] || '₹14,00,000',
        received: '₹3,50,000',
        expended: '₹50,000',
        remaining: '₹13,50,000',
        source: challenge.fundingAvailable,
      },
      scopeReport: {
        problemDiagnosis: challenge.description,
        objectives: [
          `Develop scalable, field-ready prototype to address ${challenge.title.slice(0, 40)}`,
          `Validate telemetry and hardware robustness under rural ${challenge.location.district} field conditions`,
          `Prepare comprehensive report and dispatch to industry for CSR co-funding`,
        ],
        scopeOfWork: `Phase 1: Lab prototyping and mathematical modeling. Phase 2: Benchtop pilot testing. Phase 3: Village field trials in ${challenge.location.district}.`,
        technicalMethodology: challenge.possibleMethodologies?.join('. ') || 'Benchtop experimental prototyping and IoT telemetry integration.',
        deliverables: [
          'Hardware / Software Functional Prototype',
          'NABL Certified Lab Validation Report',
          'Industry Co-funding Dossier',
          'Field Pilot Deployment Telemetry',
        ],
        targetBeneficiaries: `${challenge.affectedPopulation.toLocaleString()} citizens in ${challenge.location.district} district.`,
        status: 'Draft',
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      itemizedBudget: [
        { id: 'b-1', category: 'Capital Equipment', item: 'Lab Sensors & Testing Instrumentation', amount: 350000, justification: 'Precision test bench calibration and prototype hardware.' },
        { id: 'b-2', category: 'Consumables & Hardware', item: 'Components, Microcontrollers & Enclosures', amount: 280000, justification: 'PCB fabrication, sensors, and weatherproof casings.' },
        { id: 'b-3', category: 'Field Trials & Testing', item: 'District Site Deployment & Transportation', amount: 350000, justification: `Field trips to ${challenge.location.district}, village installations, and telemetry verification.` },
        { id: 'b-4', category: 'Researcher Stipends & Manpower', item: 'Student Research Fellowships (6 Months)', amount: 280000, justification: 'Stipends for graduate student researchers allocated to the project.' },
        { id: 'b-5', category: 'Institutional Overhead & Contingency', item: 'Contingency, SIM Connectivity & Consumables', amount: 140000, justification: 'Institutional infrastructure, cloud telemetry, and unexpected component costs.' },
      ],
      industryProposal: {
        status: 'Under Preparation',
        totalBudgetRequested: 1400000,
        corporateSponsorshipTarget: 1000000,
        executiveSummary: `${selectedUniversity.name} research initiative targeting ${challenge.domain} in ${challenge.location.district}. Complete project report and scope prepared for corporate CSR/R&D sponsorship.`,
        expressionsOfInterest: [],
      },
      milestones: [
        {
          id: 'M-1',
          title: 'Literature Review & Baseline Sensor Formulation',
          targetDate: '2026-10-30',
          trlTarget: 3,
          status: 'In Progress',
          fundingTranche: 'Tranche 1 (25%)',
          fundingPercentage: 25,
          isUnlocked: true,
          deliverables: ['Research benchmark document', 'Lab test rig blueprint'],
        },
        {
          id: 'M-2',
          title: 'Benchtop Prototype & Lab Validation',
          targetDate: '2026-11-30',
          trlTarget: 4,
          status: 'Upcoming',
          fundingTranche: 'Tranche 2 (30%)',
          fundingPercentage: 30,
          isUnlocked: false,
          deliverables: ['Component calibration', 'Lab test report'],
        },
        {
          id: 'M-3',
          title: 'Controlled Field Environment Demonstration',
          targetDate: '2026-12-30',
          trlTarget: 6,
          status: 'Upcoming',
          fundingTranche: 'Tranche 3 (25%)',
          fundingPercentage: 25,
          isUnlocked: false,
          deliverables: ['Field test node', 'Data logging'],
        },
      ],
      tasks: [
        {
          id: 'TSK-01',
          title: 'Finalize component BOM and order telemetry transceivers',
          assignee: 'Aakash Verma',
          dueDate: '2026-09-20',
          status: 'in_progress',
          priority: 'High',
          tags: ['Hardware', 'Procurement'],
        },
        {
          id: 'TSK-02',
          title: 'Collect ground truth soil and water samples from pilot district',
          assignee: 'Pooja Murmu',
          dueDate: '2026-09-22',
          status: 'todo',
          priority: 'High',
          tags: ['Fieldwork', 'Chemistry'],
        },
      ],
      prototypes: [
        {
          version: 'v0.1-spec',
          name: 'System Architecture Document',
          type: 'Software',
          releaseDate: new Date().toISOString().split('T')[0],
          notes: 'Initial conceptual block diagram and sensor pinouts.',
          status: 'Lab Testing',
        },
      ],
      industryPartners: [
        {
          id: 'IND-99',
          name: 'Tata Steel CSR Foundation',
          type: 'CSR Foundation',
          domains: [challenge.domain],
          contributionOffered: ['Technical Mentorship & Co-funding'],
          contactPerson: 'Dr. Niloy Sen',
          matchScore: 92,
          status: 'In Discussion',
        },
      ],
      risks: [],
      iprStatus: {
        type: 'Under Prep',
        title: `Novel System for ${challenge.title.slice(0, 45)}`,
      },
      publications: [],
      communityValidationScore: 78,
    };

    setProjects((prev) => [newProject, ...prev]);
    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, status: 'in_project' } : c))
    );
    setSelectedProjectId(newProjectId);
    setActiveTab('research_projects');
    addAuditLog('CREATED_PROJECT', newProjectId, `Project ${newProjectId} initialized from ${challengeId}.`);
    return newProjectId;
  };

  const assignProjectByDean = (
    challengeId: string,
    assignment: {
      leadFaculty: string;
      coMentors: string[];
      studentLeads: string[];
      initialBudget: string;
      targetDeadline?: string;
    }
  ): string => {
    if (currentUserRole !== 'leadership') {
      addAuditLog('ACCESS_DENIED', challengeId, 'Only a Dean or Vice Dean can assign new projects.');
      return '';
    }
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) return '';

    const newProjectId = `PR-2026-00${Math.floor(50 + Math.random() * 40)}`;
    const budgetNum = parseInt(assignment.initialBudget.replace(/[^0-9]/g, '')) || 1400000;

    const newProject: Project = {
      id: newProjectId,
      challengeId: challenge.id,
      title: `${challenge.title.split(':')[0] || challenge.title} — Innovation Initiative`,
      domain: challenge.domain,
      universityId: selectedUniversity.id,
      leadFaculty: assignment.leadFaculty || 'Prof. (Dr.) Anurag Bhattacharya',
      coMentors: assignment.coMentors.length > 0 ? assignment.coMentors : ['Dr. Shalini Mukhopadhyay'],
      studentLeads: assignment.studentLeads.length > 0 ? assignment.studentLeads : ['Aakash Verma', 'Pooja Murmu'],
      teamId: `TM-${Math.floor(100 + Math.random() * 900)}`,
      teamSize: (assignment.studentLeads.length || 2) + (assignment.coMentors.length || 1) + 1,
      currentTRL: 2,
      trlHistory: [
        {
          trlLevel: 1,
          title: 'Basic Principles Observed & Synthesized',
          description: `Problem statement synthesized from verified government challenge baseline in ${challenge.location.district}.`,
          approvedBy: currentUserName,
          approvalRole: 'Dean / Institutional Leadership',
          approvalDate: new Date().toISOString().split('T')[0],
          documentRef: `DOC-${newProjectId}-TRL1-DEAN-SANCTION.pdf`,
          status: 'Approved',
        },
        {
          trlLevel: 2,
          title: 'Project Assigned & Multidisciplinary Concept Formulated',
          description: `Assigned to Lead PI ${assignment.leadFaculty}. Team architecture established.`,
          approvedBy: assignment.leadFaculty,
          approvalRole: 'Lead Faculty Mentor',
          approvalDate: new Date().toISOString().split('T')[0],
          documentRef: `DOC-${newProjectId}-TRL2-CHARTER.pdf`,
          status: 'Approved',
        },
      ],
      status: 'Research',
      lifecycleStage: 'Research',
      progressPercentage: 22,
      funding: {
        totalBudget: `₹${budgetNum.toLocaleString('en-IN')}`,
        sanctioned: `₹${Math.round(budgetNum * 0.35).toLocaleString('en-IN')}`,
        received: `₹${Math.round(budgetNum * 0.25).toLocaleString('en-IN')}`,
        expended: '₹45,000',
        remaining: `₹${Math.round(budgetNum * 0.95).toLocaleString('en-IN')}`,
        source: challenge.fundingAvailable,
      },
      scopeReport: {
        problemDiagnosis: challenge.description,
        objectives: [
          `Develop scalable, field-ready prototype to address ${challenge.title.slice(0, 40)}`,
          `Validate telemetry and hardware robustness under rural ${challenge.location.district} field conditions`,
          `Prepare comprehensive report and dispatch to industry for CSR co-funding`,
        ],
        scopeOfWork: `Phase 1: Lab prototyping and mathematical modeling. Phase 2: Benchtop pilot testing. Phase 3: Village field trials in ${challenge.location.district}.`,
        technicalMethodology: challenge.possibleMethodologies?.join('. ') || 'Benchtop experimental prototyping and IoT telemetry integration.',
        deliverables: [
          'Hardware / Software Functional Prototype',
          'NABL Certified Lab Validation Report',
          'Industry Co-funding Dossier',
          'Field Pilot Deployment Telemetry',
        ],
        targetBeneficiaries: `${challenge.affectedPopulation.toLocaleString()} citizens in ${challenge.location.district} district.`,
        status: 'Draft',
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      itemizedBudget: [
        { id: 'b-1', category: 'Capital Equipment', item: 'Lab Sensors & Testing Instrumentation', amount: Math.round(budgetNum * 0.25), justification: 'Precision test bench calibration and prototype hardware.' },
        { id: 'b-2', category: 'Consumables & Hardware', item: 'Components, Microcontrollers & Enclosures', amount: Math.round(budgetNum * 0.20), justification: 'PCB fabrication, sensors, and weatherproof casings.' },
        { id: 'b-3', category: 'Field Trials & Testing', item: 'District Site Deployment & Transportation', amount: Math.round(budgetNum * 0.25), justification: `Field trips to ${challenge.location.district}, village installations, and telemetry verification.` },
        { id: 'b-4', category: 'Researcher Stipends & Manpower', item: 'Student Research Fellowships (6 Months)', amount: Math.round(budgetNum * 0.20), justification: 'Stipends for graduate student researchers allocated to the project.' },
        { id: 'b-5', category: 'Institutional Overhead & Contingency', item: 'Contingency, SIM Connectivity & Consumables', amount: Math.round(budgetNum * 0.10), justification: 'Institutional infrastructure, cloud telemetry, and unexpected component costs.' },
      ],
      industryProposal: {
        status: 'Under Preparation',
        totalBudgetRequested: budgetNum,
        corporateSponsorshipTarget: Math.round(budgetNum * 0.7),
        executiveSummary: `${selectedUniversity.name} research initiative targeting ${challenge.domain} in ${challenge.location.district}. Complete project report and scope prepared for corporate CSR/R&D sponsorship.`,
        expressionsOfInterest: [],
      },
      milestones: [
        {
          id: 'M-1',
          title: 'Literature Review & Baseline Sensor Formulation',
          targetDate: '2026-10-30',
          trlTarget: 3,
          status: 'In Progress',
          fundingTranche: 'Tranche 1 (25%)',
          fundingPercentage: 25,
          isUnlocked: true,
          deliverables: ['Research benchmark document', 'Lab test rig blueprint'],
        },
        {
          id: 'M-2',
          title: 'Benchtop Prototype & Lab Validation',
          targetDate: '2026-11-30',
          trlTarget: 4,
          status: 'Upcoming',
          fundingTranche: 'Tranche 2 (30%)',
          fundingPercentage: 30,
          isUnlocked: false,
          deliverables: ['Component calibration', 'Lab test report'],
        },
        {
          id: 'M-3',
          title: 'Controlled Field Environment Demonstration',
          targetDate: '2026-12-30',
          trlTarget: 6,
          status: 'Upcoming',
          fundingTranche: 'Tranche 3 (25%)',
          fundingPercentage: 25,
          isUnlocked: false,
          deliverables: ['Field test node', 'Data logging'],
        },
      ],
      tasks: [
        {
          id: 'TSK-01',
          title: 'Finalize component BOM and order telemetry transceivers',
          assignee: assignment.studentLeads[0] || 'Aakash Verma',
          dueDate: '2026-09-20',
          status: 'in_progress',
          priority: 'High',
          tags: ['Hardware', 'Procurement'],
        },
        {
          id: 'TSK-02',
          title: 'Collect ground truth samples and survey site in pilot district',
          assignee: assignment.studentLeads[1] || 'Pooja Murmu',
          dueDate: '2026-09-25',
          status: 'todo',
          priority: 'High',
          tags: ['Fieldwork', 'Baseline'],
        },
      ],
      prototypes: [
        {
          version: 'v0.1-spec',
          name: 'System Architecture Document',
          type: 'Software',
          releaseDate: new Date().toISOString().split('T')[0],
          notes: 'Initial conceptual block diagram and sensor pinouts.',
          status: 'Lab Testing',
        },
      ],
      industryPartners: [],
      risks: [],
      iprStatus: {
        type: 'Under Prep',
        title: `Novel System for ${challenge.title.slice(0, 45)}`,
      },
      publications: [],
      communityValidationScore: 78,
    };

    setProjects((prev) => [newProject, ...prev]);
    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, status: 'in_project' } : c))
    );
    setSelectedProjectId(newProjectId);
    setActiveTab('research_projects');
    addAuditLog('ASSIGNED_PROJECT', newProjectId, `Project ${newProjectId} officially assigned to ${assignment.leadFaculty} by Dean.`);
    return newProjectId;
  };

  const updateProjectScopeAndBudget = (
    projectId: string,
    scopeReport: ProjectScopeReport,
    itemizedBudget: BudgetItem[]
  ) => {
    const totalCalc = itemizedBudget.reduce((sum, b) => sum + (b.amount || 0), 0);
    const formattedTotal = `₹${totalCalc.toLocaleString('en-IN')}`;

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          scopeReport,
          itemizedBudget,
          funding: {
            ...p.funding,
            totalBudget: formattedTotal,
          },
          industryProposal: p.industryProposal
            ? {
                ...p.industryProposal,
                totalBudgetRequested: totalCalc,
              }
            : undefined,
        };
      })
    );

    addAuditLog('UPDATED_SCOPE_BUDGET', projectId, `Scope report and itemized budget (${formattedTotal}) updated.`);

    // Sync to backend
    fetch(`/api/v1/university/projects/${projectId}/report`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scopeReport, itemizedBudget }),
    }).catch(() => {});
  };

  const dispatchToIndustryPlatform = (projectId: string, corporateSponsorshipTarget?: number) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;

    const budgetNum = proj.itemizedBudget?.reduce((s, b) => s + (b.amount || 0), 0) || 1450000;
    const target = corporateSponsorshipTarget || Math.round(budgetNum * 0.7);

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const currentProposal = p.industryProposal || {
          status: 'Sent to Industry Platform',
          dispatchedAt: new Date().toISOString().split('T')[0],
          totalBudgetRequested: budgetNum,
          corporateSponsorshipTarget: target,
          executiveSummary: p.scopeReport?.scopeOfWork || p.title,
          expressionsOfInterest: [],
        };
        return {
          ...p,
          industryProposal: {
            ...currentProposal,
            status: 'Sent to Industry Platform',
            dispatchedAt: new Date().toISOString().split('T')[0],
            corporateSponsorshipTarget: target,
          },
        };
      })
    );

    addAuditLog(
      'DISPATCHED_TO_INDUSTRY',
      projectId,
      `Detailed Project Report & Itemized Budget dispatched to Industry Platform for corporate sponsorship.`
    );

    fetch(`/api/v1/university/projects/${projectId}/dispatch-industry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        corporateSponsorshipTarget: target,
        universityId: selectedUniversity.id,
        universityName: selectedUniversity.name,
      }),
    }).catch(() => {});
  };

  const advanceProjectTRL = (
    projectId: string,
    newTRL: number,
    evidence: Omit<TRLEvidence, 'trlLevel' | 'status'>
  ): boolean => {
    const validTRL = newTRL as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newEvidence: TRLEvidence = {
          ...evidence,
          trlLevel: validTRL,
          status: 'Approved',
        };
        const updatedHistory = [...p.trlHistory, newEvidence];
        const newProgress = Math.min(100, Math.round((validTRL / 9) * 100));
        let lifecycleStage: Project['lifecycleStage'] = 'Research';
        if (validTRL >= 8) lifecycleStage = 'Deployment';
        else if (validTRL >= 6) lifecycleStage = 'Field Pilot';
        else if (validTRL >= 4) lifecycleStage = 'Testing';
        else if (validTRL >= 3) lifecycleStage = 'Prototype';

        return {
          ...p,
          currentTRL: validTRL,
          trlHistory: updatedHistory,
          progressPercentage: newProgress,
          lifecycleStage,
        };
      })
    );
    addAuditLog('ADVANCED_TRL', projectId, `TRL advanced to Level ${newTRL} with verified evidence.`);

    // Sync to backend API
    fetch(`/api/v1/university/projects/${projectId}/trl`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newTRL, notes: evidence.title }),
    }).catch(() => {});

    return true;
  };

  const toggleTaskStatus = (projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedTasks = p.tasks.map((t) => {
          if (t.id !== taskId) return t;
          const nextStatus: Record<string, 'todo' | 'in_progress' | 'review' | 'done'> = {
            todo: 'in_progress',
            in_progress: 'review',
            review: 'done',
            done: 'todo',
          };
          return { ...t, status: nextStatus[t.status] };
        });
        return { ...p, tasks: updatedTasks };
      })
    );
  };

  const bookEquipment = (equipmentId: string, projectId: string) => {
    setEquipment((prev) =>
      prev.map((eq) =>
        eq.id === equipmentId ? { ...eq, status: 'In Use', bookedByProject: projectId } : eq
      )
    );
    addAuditLog('BOOKED_EQUIPMENT', equipmentId, `Equipment booked for Project ${projectId}.`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const addLessonLearned = (lessonData: Omit<LessonLearned, 'id' | 'date'>): LessonLearned => {
    const nextNum = lessonsLearned.length + 1;
    const id = `LL-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`;
    const date = '2026-09-06';
    const newLesson: LessonLearned = {
      ...lessonData,
      id,
      date,
    };

    setLessonsLearned((prev) => [newLesson, ...prev]);

    // Also update project's internal lessonsLearned array if matching projectId
    if (lessonData.projectId) {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== lessonData.projectId) return p;
          const current = p.lessonsLearned || [];
          return {
            ...p,
            lessonsLearned: [newLesson, ...current],
          };
        })
      );
    }

    // Add notification for peer visibility
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Lessons Learned Documented',
      message: `${newLesson.authorName} (${newLesson.authorRole}) documented resolution strategy for "${newLesson.title}".`,
      timestamp: 'Just now',
      type: 'milestone',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addAuditLog(
      'DOCUMENTED_LESSON_LEARNED',
      newLesson.projectId,
      `Documented challenge & resolution strategy for "${newLesson.title}" under ${newLesson.category}.`
    );

    return newLesson;
  };

  const completeFieldPilot = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId || !p.fieldPilot) return p;
        return {
          ...p,
          fieldPilot: {
            ...p.fieldPilot,
            status: 'Completed',
          },
        };
      })
    );

    const proj = projects.find((p) => p.id === projectId);
    const title = proj?.title || projectId;

    setLessonModalContext({
      projectId,
      pilotId: proj?.fieldPilot?.id,
      stage: 'Field Pilot',
      defaultCategory: 'Field & Community Adoption',
      isPilotSpecific: true,
    });
    setIsLessonModalOpen(true);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Field Pilot Completed — Reflection Prompt',
      message: `Pilot for ${title.slice(0, 40)} marked completed. Team leads & faculty mentors are prompted to archive field lessons learned.`,
      timestamp: 'Just now',
      type: 'pilot',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addAuditLog(
      'COMPLETED_FIELD_PILOT',
      projectId,
      `Field pilot marked completed. Prompting team lead and mentor to document challenges and lessons learned.`
    );
  };

  const completeProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          status: 'Completed',
          lifecycleStage: 'Completed',
          progressPercentage: 100,
        };
      })
    );

    const proj = projects.find((p) => p.id === projectId);
    const title = proj?.title || projectId;

    setLessonModalContext({
      projectId,
      stage: 'Completed',
      defaultCategory: 'Technical & Engineering',
      isPilotSpecific: false,
    });
    setIsLessonModalOpen(true);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Project Completed — Institutional Handover',
      message: `Project ${title.slice(0, 40)} marked completed. Team leads & mentors prompted to record lessons learned for statewide knowledge reuse.`,
      timestamp: 'Just now',
      type: 'milestone',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addAuditLog(
      'COMPLETED_PROJECT',
      projectId,
      `Project marked completed. Prompting team lead and mentor for lifecycle lessons learned.`
    );
  };

  return (
    <UniversityContext.Provider
      value={{
        selectedUniversity,
        setSelectedUniversity,
        currentUserRole,
        currentUserName,
        currentUserEmail,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        universities: UNIVERSITIES,
        challenges,
        projects,
        assignedProjects,
        facultyMembers,
        students,
        labs,
        equipment,
        solutions,
        deployedSolutions: solutions,
        lessonsLearned,
        notifications,
        auditLogs,
        selectedChallengeId,
        setSelectedChallengeId,
        selectedProjectId,
        setSelectedProjectId,
        isEvaluationModalOpen,
        setIsEvaluationModalOpen,
        isTeamBuilderModalOpen,
        setIsTeamBuilderModalOpen,
        isResearchAssistantOpen,
        setIsResearchAssistantOpen,
        isDemoGuideOpen,
        setIsDemoGuideOpen,
        demoMode,
        setDemoMode,
        isLessonModalOpen,
        setIsLessonModalOpen,
        lessonModalContext,
        setLessonModalContext,
        acceptChallenge,
        rejectChallenge,
        toggleSaveChallenge,
        createProjectFromChallenge,
        assignProjectByDean,
        updateProjectScopeAndBudget,
        dispatchToIndustryPlatform,
        advanceProjectTRL,
        toggleTaskStatus,
        bookEquipment,
        addLessonLearned,
        completeFieldPilot,
        completeProject,
        markNotificationAsRead,
        addAuditLog,
        getUniversityMatchScore,
      }}
    >
      {children}
    </UniversityContext.Provider>
  );
};

export const useUniversity = () => {
  const context = useContext(UniversityContext);
  if (!context) {
    throw new Error('useUniversity must be used within a UniversityProvider');
  }
  return context;
};
