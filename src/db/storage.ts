import fs from 'fs';
import path from 'path';
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

const SHARED_DIR = path.resolve(process.cwd(), '..', 'shared_data');
const LOCAL_DIR = path.resolve(process.cwd(), 'data');
const SHARED_FILE = path.join(SHARED_DIR, 'university_store.json');
const LOCAL_FILE = path.join(LOCAL_DIR, 'db.json');

export interface UniversityStoreData {
  universities: any[];
  challenges: any[];
  faculty: any[];
  students: any[];
  projects: any[];
  labs: any[];
  equipment: any[];
  solutions: any[];
  notifications: any[];
  auditLogs: any[];
  lessons: any[];
}

class UniversityStorageEngine {
  private filePath: string;
  private data: UniversityStoreData;

  constructor() {
    if (fs.existsSync(SHARED_DIR) || fs.existsSync(path.resolve(process.cwd(), '..', 'Government_Command_Jharkhand'))) {
      if (!fs.existsSync(SHARED_DIR)) {
        try { fs.mkdirSync(SHARED_DIR, { recursive: true }); } catch (e) {}
      }
      this.filePath = SHARED_FILE;
    } else {
      if (!fs.existsSync(LOCAL_DIR)) {
        try { fs.mkdirSync(LOCAL_DIR, { recursive: true }); } catch (e) {}
      }
      this.filePath = LOCAL_FILE;
    }

    this.data = this.loadData();
  }

  private loadData(): UniversityStoreData {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.projects)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('University store load error:', e);
    }

    const initial: UniversityStoreData = {
      universities: UNIVERSITIES,
      challenges: CHALLENGES,
      faculty: FACULTY_MEMBERS,
      students: STUDENTS,
      projects: PROJECTS,
      labs: UNIVERSITY_LABS,
      equipment: EQUIPMENT_REGISTRY,
      solutions: REUSABLE_SOLUTIONS,
      notifications: NOTIFICATIONS,
      auditLogs: AUDIT_LOGS,
      lessons: INITIAL_LESSONS_LEARNED,
    };
    this.saveData(initial);
    return initial;
  }

  public saveData(custom?: UniversityStoreData): void {
    const toSave = custom || this.data;
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(toSave, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving UniversityStore:', e);
    }
  }

  // Overview
  public getOverview() {
    return {
      activeProjectsCount: this.data.projects.length,
      adoptedChallengesCount: this.data.challenges.filter(c => c.status === 'Adopted' || c.status === 'In Progress').length,
      availableChallengesCount: this.data.challenges.filter(c => c.status === 'Open' || c.status === 'Recommended').length,
      facultyMentorsCount: this.data.faculty.length,
      studentsEngagedCount: this.data.students.length,
      prototypesCount: this.data.solutions.length,
      labsAvailableCount: this.data.labs.length,
      fieldPilotsActive: this.data.projects.filter(p => p.currentTRL >= 6).length,
    };
  }

  // Challenges
  public getChallenges(filter?: { domain?: string; status?: string; query?: string }) {
    let list = [...this.data.challenges];
    if (filter?.domain && filter.domain !== 'All') {
      list = list.filter(c => c.domain?.toLowerCase() === filter.domain?.toLowerCase());
    }
    if (filter?.status && filter.status !== 'All') {
      list = list.filter(c => c.status?.toLowerCase() === filter.status?.toLowerCase());
    }
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      list = list.filter(c => 
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q))
      );
    }
    return list;
  }

  public adoptChallenge(challengeId: string, leadFacultyId: string, title: string) {
    const challenge = this.data.challenges.find(c => c.id === challengeId);
    if (challenge) {
      challenge.status = 'Adopted';
      challenge.adoptedByUniversityId = 'univ-bit-mesra';
    }

    const newProject = {
      id: `PRJ-JH-${Date.now().toString().slice(-4)}`,
      title: title || challenge?.title || 'Adopted Innovation Project',
      challengeId,
      universityId: 'univ-bit-mesra',
      currentTRL: 3,
      targetTRL: 7,
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      leadFacultyId: leadFacultyId || 'fac-1',
      studentTeam: [],
      budgetAllocated: 250000,
      createdAt: new Date().toISOString()
    };
    this.data.projects.unshift(newProject);
    this.saveData();
    return newProject;
  }

  // Projects
  public getProjects() {
    return this.data.projects;
  }

  public getProjectById(id: string) {
    return this.data.projects.find(p => p.id?.toLowerCase() === id.toLowerCase());
  }

  public updateProjectTRL(id: string, newTRL: number, notes: string) {
    const target = this.getProjectById(id);
    if (!target) return undefined;
    target.currentTRL = newTRL;
    target.updatedAt = new Date().toISOString();
    target.lastTRLNotes = notes;
    this.saveData();
    return target;
  }

  // Labs
  public getLabs() {
    return this.data.labs;
  }

  public bookLab(labId: string, date: string, purpose: string) {
    const lab = this.data.labs.find(l => l.id === labId);
    if (!lab) return undefined;
    const booking = {
      id: `book-${Date.now()}`,
      labId,
      date,
      purpose,
      status: 'Confirmed'
    };
    if (!Array.isArray(lab.bookings)) lab.bookings = [];
    lab.bookings.push(booking);
    this.saveData();
    return booking;
  }

  // Solutions
  public getSolutions() {
    return this.data.solutions;
  }

  // Faculty & Students
  public getFaculty() {
    return this.data.faculty;
  }

  public getStudents() {
    return this.data.students;
  }

  // Lessons
  public getLessons() {
    return this.data.lessons;
  }

  public updateProjectReportAndBudget(id: string, scopeReport: any, itemizedBudget: any) {
    const target = this.getProjectById(id);
    if (!target) return undefined;
    target.scopeReport = scopeReport;
    target.itemizedBudget = itemizedBudget;
    target.updatedAt = new Date().toISOString();
    this.saveData();
    return target;
  }

  public dispatchProjectToIndustry(id: string, sponsorshipTarget: number, universityInfo: any) {
    const target = this.getProjectById(id);
    if (!target) return undefined;

    if (!target.industryProposal) {
      target.industryProposal = {
        status: 'Sent to Industry Platform',
        dispatchedAt: new Date().toISOString().split('T')[0],
        totalBudgetRequested: target.funding?.totalBudget || '₹14,50,000',
        corporateSponsorshipTarget: sponsorshipTarget || 1000000,
        executiveSummary: target.scopeReport?.scopeOfWork || target.title,
        expressionsOfInterest: []
      };
    } else {
      target.industryProposal.status = 'Sent to Industry Platform';
      target.industryProposal.dispatchedAt = new Date().toISOString().split('T')[0];
      target.industryProposal.corporateSponsorshipTarget = sponsorshipTarget || 1000000;
    }
    target.updatedAt = new Date().toISOString();
    this.saveData();

    // Cross-sync with shared_data/industry_store.json
    try {
      const industryFile = path.join(SHARED_DIR, 'industry_store.json');
      if (fs.existsSync(industryFile)) {
        const indData = JSON.parse(fs.readFileSync(industryFile, 'utf-8'));
        if (Array.isArray(indData.opportunities)) {
          const existingIdx = indData.opportunities.findIndex((o: any) => o.id === target.id);
          const challenge = this.data.challenges.find(c => c.id === target.challengeId);
          const budgetNum = typeof target.funding?.totalBudget === 'number'
            ? target.funding.totalBudget
            : parseInt(String(target.funding?.totalBudget || '1450000').replace(/[^0-9]/g, '')) || 1450000;

          const oppObj = {
            id: target.id,
            challengeRefId: target.challengeId,
            title: target.title,
            type: 'University Project',
            domain: target.domain,
            district: challenge?.location?.district || 'Gumla',
            block: challenge?.location?.block || 'Raidih',
            village: challenge?.location?.panchayat || 'Bakhratoli',
            university: universityInfo?.universityName || 'IIT (ISM) Dhanbad',
            facultyLead: target.leadFaculty,
            studentTeamCount: target.teamSize || 6,
            govtDepartment: challenge?.govtDepartment || 'Drinking Water & Sanitation Dept',
            trl: target.currentTRL || 4,
            currentStage: target.lifecycleStage || 'Field Pilot',
            fundingRequired: budgetNum,
            fundingCommitted: Math.round(budgetNum * 0.4),
            beneficiaries: challenge?.affectedPopulation || 18400,
            deadline: challenge?.targetDeadline || '2026-11-30',
            matchScore: 94,
            problemStatement: target.scopeReport?.problemDiagnosis || challenge?.description || target.title,
            solutionOverview: target.scopeReport?.technicalMethodology || challenge?.summary || target.title,
            techStack: challenge?.matchBreakdown?.[universityInfo?.universityId || 'iit-ism-dhanbad']?.suggestedTechnologies || ['IoT', 'LoRaWAN', 'Electrochemical Sensing'],
            readiness: {
              technology: 88,
              manufacturing: 75,
              cost: 82,
              regulatory: 78,
              infrastructure: 85,
              government: 90,
              community: 88,
              overall: 84
            },
            pilotReady: true,
            csrEligible: true,
            communityValidationScore: 90,
            milestones: (target.milestones || []).map((m: any) => ({
              name: m.title,
              stage: target.lifecycleStage || 'Research',
              amount: Math.round(budgetNum * ((m.fundingPercentage || 25) / 100)),
              completed: m.status === 'Completed',
              verificationEvidence: m.deliverables?.join(', ')
            }))
          };

          if (existingIdx >= 0) {
            indData.opportunities[existingIdx] = { ...indData.opportunities[existingIdx], ...oppObj };
          } else {
            indData.opportunities.unshift(oppObj);
          }
          fs.writeFileSync(industryFile, JSON.stringify(indData, null, 2), 'utf-8');
        }
      }
    } catch (err) {
      console.warn('Could not sync to industry_store.json:', err);
    }

    return target;
  }

  public addLesson(lesson: any) {
    const newLesson = {
      id: `les-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...lesson
    };
    this.data.lessons.unshift(newLesson);
    this.saveData();
    return newLesson;
  }
}

export const universityStorage = new UniversityStorageEngine();
