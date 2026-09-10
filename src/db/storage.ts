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
