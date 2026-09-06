import React, { useState, useMemo, useRef } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Layers,
  Filter,
  Eye,
  ArrowRight,
  GitCommit,
  CheckSquare,
  FileText,
  Flag,
  ShieldCheck,
  DollarSign,
  User,
  Sparkles,
  Download,
  Info,
  X,
  Target,
} from 'lucide-react';
import { Project, Milestone, Task, TRLEvidence, TRLStage } from '../../types';
import { useUniversity } from '../../context/UniversityContext';

interface ProjectGanttChartProps {
  project: Project;
  onAdvanceTRLClick?: () => void;
}

type TrackFilter = 'all' | 'milestones' | 'trl' | 'tasks';
type StatusFilter = 'all' | 'completed' | 'in_progress' | 'upcoming';
type TimeScale = 'fit' | 'monthly' | 'quarterly';

interface GanttItem {
  id: string;
  type: 'milestone' | 'trl' | 'task';
  title: string;
  startDate: Date;
  endDate: Date;
  status: 'Completed' | 'In Progress' | 'Upcoming' | 'Blocked';
  progress: number;
  trlLevel?: number;
  fundingTranche?: string;
  fundingPercentage?: number;
  assignee?: string;
  priority?: 'Low' | 'Medium' | 'High';
  deliverables?: string[];
  approvedBy?: string;
  documentRef?: string;
  rawMilestone?: Milestone;
  rawTask?: Task;
  rawTRL?: TRLEvidence;
}

// Current reference date for the platform
const CURRENT_DATE = new Date('2026-09-06T00:00:00');

export const ProjectGanttChart: React.FC<ProjectGanttChartProps> = ({
  project,
  onAdvanceTRLClick,
}) => {
  const { toggleTaskStatus } = useUniversity();
  const timelineScrollRef = useRef<HTMLDivElement>(null);

  const [trackFilter, setTrackFilter] = useState<TrackFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [timeScale, setTimeScale] = useState<TimeScale>('monthly');
  const [showTodayLine, setShowTodayLine] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GanttItem | null>(null);

  const [expandedSections, setExpandedSections] = useState({
    milestones: true,
    trl: true,
    tasks: true,
  });

  const toggleSection = (section: 'milestones' | 'trl' | 'tasks') => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // 1. Process Milestones, TRL Progression, and Tasks into unified Gantt items
  const { items, minDate, maxDate, milestoneItems, trlItems, taskItems } = useMemo(() => {
    const rawMilestones = [...project.milestones].sort(
      (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
    );

    // Baseline project start date
    let projectStartDate = new Date('2026-03-01T00:00:00');
    if (rawMilestones.length > 0) {
      const firstTarget = new Date(rawMilestones[0].targetDate);
      const computedStart = new Date(firstTarget);
      computedStart.setDate(computedStart.getDate() - 30);
      if (computedStart < projectStartDate) {
        projectStartDate = computedStart;
      }
    }
    if (project.trlHistory.length > 0) {
      const firstApproval = new Date(project.trlHistory[0].approvalDate);
      if (firstApproval < projectStartDate) {
        projectStartDate = new Date(firstApproval);
        projectStartDate.setDate(projectStartDate.getDate() - 15);
      }
    }

    // Milestones transformation
    const mItems: GanttItem[] = rawMilestones.map((m, idx) => {
      const target = new Date(m.targetDate);
      let start: Date;
      if (idx === 0) {
        start = new Date(projectStartDate);
      } else {
        const prevTarget = new Date(rawMilestones[idx - 1].targetDate);
        start = new Date(prevTarget);
      }
      if (start >= target) {
        start = new Date(target);
        start.setDate(start.getDate() - 25);
      }

      const progress =
        m.status === 'Completed'
          ? 100
          : m.status === 'In Progress'
          ? 65
          : m.status === 'Blocked'
          ? 20
          : 0;

      return {
        id: `M-${m.id}`,
        type: 'milestone',
        title: `${m.id}: ${m.title}`,
        startDate: start,
        endDate: target,
        status: m.status,
        progress,
        trlLevel: m.trlTarget,
        fundingTranche: m.fundingTranche,
        fundingPercentage: m.fundingPercentage,
        deliverables: m.deliverables,
        rawMilestone: m,
      };
    });

    // TRL items transformation
    // Include all 9 TRL levels mapped to actual approval dates or projected target dates
    const trlStageTitles: Record<number, string> = {
      1: 'TRL 1: Basic Principles Observed',
      2: 'TRL 2: Technology Concept Formulated',
      3: 'TRL 3: Experimental Proof of Concept',
      4: 'TRL 4: Component / Subsystem Validation in Lab',
      5: 'TRL 5: System / Subsystem in Relevant Environment',
      6: 'TRL 6: Prototype Demo in Relevant Field Setting',
      7: 'TRL 7: Integrated System Demo in Operational Setting',
      8: 'TRL 8: Actual System Completed & Qualified',
      9: 'TRL 9: Proven System via Full Statewide Deployment',
    };

    const tItems: GanttItem[] = [];
    const trlMap = new Map<number, TRLEvidence>();
    project.trlHistory.forEach((h) => trlMap.set(h.trlLevel, h));

    for (let level = 1; level <= 9; level++) {
      const evidence = trlMap.get(level);
      const isApproved = level <= project.currentTRL && !!evidence;
      const isCurrent = level === project.currentTRL + 1;

      // Find matching milestone if any
      const matchingMilestone = rawMilestones.find((m) => m.trlTarget === level);

      let targetDate: Date;
      let startDate: Date;

      if (evidence && evidence.approvalDate) {
        targetDate = new Date(evidence.approvalDate);
        // compute start date: previous TRL date or 30 days before
        const prevLevel = trlMap.get(level - 1);
        if (prevLevel && prevLevel.approvalDate) {
          startDate = new Date(prevLevel.approvalDate);
        } else {
          startDate = new Date(targetDate);
          startDate.setDate(startDate.getDate() - 30);
        }
      } else if (matchingMilestone) {
        targetDate = new Date(matchingMilestone.targetDate);
        startDate = new Date(targetDate);
        startDate.setDate(startDate.getDate() - 35);
      } else {
        // Project based on current progression
        const lastKnownDate =
          project.trlHistory.length > 0
            ? new Date(project.trlHistory[project.trlHistory.length - 1].approvalDate)
            : new Date('2026-08-30');
        const offsetWeeks = (level - project.currentTRL) * 5;
        targetDate = new Date(lastKnownDate);
        targetDate.setDate(targetDate.getDate() + offsetWeeks * 7);
        startDate = new Date(targetDate);
        startDate.setDate(startDate.getDate() - 30);
      }

      let status: 'Completed' | 'In Progress' | 'Upcoming' | 'Blocked' = 'Upcoming';
      let progress = 0;
      if (isApproved) {
        status = 'Completed';
        progress = 100;
      } else if (isCurrent) {
        status = 'In Progress';
        progress = 45;
      }

      tItems.push({
        id: `TRL-${level}`,
        type: 'trl',
        title: trlStageTitles[level] || `TRL ${level}`,
        startDate,
        endDate: targetDate,
        status,
        progress,
        trlLevel: level,
        approvedBy: evidence?.approvedBy,
        documentRef: evidence?.documentRef,
        rawTRL: evidence,
      });
    }

    // Tasks transformation
    const taskList = project.tasks || [];
    const tskItems: GanttItem[] = taskList.map((t) => {
      const due = new Date(t.dueDate);
      const start = new Date(due);
      start.setDate(start.getDate() - 14); // default 14-day task duration

      const statusMap: Record<string, 'Completed' | 'In Progress' | 'Upcoming' | 'Blocked'> = {
        done: 'Completed',
        in_progress: 'In Progress',
        todo: 'Upcoming',
        review: 'In Progress',
      };

      const progressMap: Record<string, number> = {
        done: 100,
        in_progress: 50,
        review: 85,
        todo: 0,
      };

      return {
        id: `TSK-${t.id}`,
        type: 'task',
        title: `${t.id}: ${t.title}`,
        startDate: start,
        endDate: due,
        status: statusMap[t.status] || 'Upcoming',
        progress: progressMap[t.status] || 0,
        assignee: t.assignee,
        priority: t.priority,
        rawTask: t,
      };
    });

    // Find absolute bounds
    const allDates: Date[] = [
      projectStartDate,
      CURRENT_DATE,
      ...mItems.flatMap((i) => [i.startDate, i.endDate]),
      ...tItems.flatMap((i) => [i.startDate, i.endDate]),
      ...tskItems.flatMap((i) => [i.startDate, i.endDate]),
    ];

    const minTs = Math.min(...allDates.map((d) => d.getTime()));
    const maxTs = Math.max(...allDates.map((d) => d.getTime()));

    // Pad slightly to beginning of first month and end of last month
    const paddedMin = new Date(minTs);
    paddedMin.setDate(1); // 1st of that month
    paddedMin.setHours(0, 0, 0, 0);

    const paddedMax = new Date(maxTs);
    paddedMax.setMonth(paddedMax.getMonth() + 1);
    paddedMax.setDate(0); // last day of that month
    paddedMax.setHours(23, 59, 59, 999);

    const merged = [...mItems, ...tItems, ...tskItems];

    return {
      items: merged,
      minDate: paddedMin,
      maxDate: paddedMax,
      milestoneItems: mItems,
      trlItems: tItems,
      taskItems: tskItems,
    };
  }, [project]);

  // 2. Generate Time Scale Columns (Months & Weeks)
  const timelineColumns = useMemo(() => {
    const cols: {
      date: Date;
      label: string;
      quarter: string;
      year: number;
      monthIndex: number;
      widthPercent: number;
      startPercent: number;
    }[] = [];

    const totalDuration = maxDate.getTime() - minDate.getTime();
    if (totalDuration <= 0) return cols;

    const curr = new Date(minDate);
    while (curr <= maxDate) {
      const monthStart = new Date(curr.getFullYear(), curr.getMonth(), 1);
      const nextMonth = new Date(curr.getFullYear(), curr.getMonth() + 1, 1);
      const monthEnd = new Date(nextMonth.getTime() - 1);

      const effectiveStart = monthStart < minDate ? minDate : monthStart;
      const effectiveEnd = monthEnd > maxDate ? maxDate : monthEnd;

      const duration = effectiveEnd.getTime() - effectiveStart.getTime();
      const widthPercent = (duration / totalDuration) * 100;
      const startPercent = ((effectiveStart.getTime() - minDate.getTime()) / totalDuration) * 100;

      const monthName = effectiveStart.toLocaleDateString('en-US', { month: 'short' });
      const year = effectiveStart.getFullYear();
      const quarter = `Q${Math.floor(effectiveStart.getMonth() / 3) + 1} ${year}`;

      cols.push({
        date: new Date(effectiveStart),
        label: `${monthName} '${String(year).slice(2)}`,
        quarter,
        year,
        monthIndex: effectiveStart.getMonth(),
        widthPercent,
        startPercent,
      });

      curr.setMonth(curr.getMonth() + 1);
      curr.setDate(1);
    }

    return cols;
  }, [minDate, maxDate]);

  // 3. Compute Position Helper
  const totalSpanMs = maxDate.getTime() - minDate.getTime();
  const getXPercent = (d: Date) => {
    if (totalSpanMs <= 0) return 0;
    const offset = d.getTime() - minDate.getTime();
    return Math.max(0, Math.min(100, (offset / totalSpanMs) * 100));
  };

  const todayX = getXPercent(CURRENT_DATE);

  // 4. Filter Items
  const filteredMilestones = useMemo(() => {
    if (trackFilter !== 'all' && trackFilter !== 'milestones') return [];
    if (statusFilter === 'all') return milestoneItems;
    return milestoneItems.filter((i) => {
      if (statusFilter === 'completed') return i.status === 'Completed';
      if (statusFilter === 'in_progress') return i.status === 'In Progress';
      if (statusFilter === 'upcoming') return i.status === 'Upcoming';
      return true;
    });
  }, [milestoneItems, trackFilter, statusFilter]);

  const filteredTRL = useMemo(() => {
    if (trackFilter !== 'all' && trackFilter !== 'trl') return [];
    if (statusFilter === 'all') return trlItems;
    return trlItems.filter((i) => {
      if (statusFilter === 'completed') return i.status === 'Completed';
      if (statusFilter === 'in_progress') return i.status === 'In Progress';
      if (statusFilter === 'upcoming') return i.status === 'Upcoming';
      return true;
    });
  }, [trlItems, trackFilter, statusFilter]);

  const filteredTasks = useMemo(() => {
    if (trackFilter !== 'all' && trackFilter !== 'tasks') return [];
    if (statusFilter === 'all') return taskItems;
    return taskItems.filter((i) => {
      if (statusFilter === 'completed') return i.status === 'Completed';
      if (statusFilter === 'in_progress') return i.status === 'In Progress';
      if (statusFilter === 'upcoming') return i.status === 'Upcoming';
      return true;
    });
  }, [taskItems, trackFilter, statusFilter]);

  // 5. Pacing Analytics
  const analytics = useMemo(() => {
    const totalM = milestoneItems.length;
    const completedM = milestoneItems.filter((m) => m.status === 'Completed').length;
    const activeM = milestoneItems.find((m) => m.status === 'In Progress');

    const totalT = taskItems.length;
    const completedT = taskItems.filter((t) => t.status === 'Completed').length;
    const overdueTasks = taskItems.filter(
      (t) => t.status !== 'Completed' && t.endDate < CURRENT_DATE
    ).length;

    // Days remaining to active milestone
    let daysToNextMilestone: number | null = null;
    if (activeM) {
      const diffMs = activeM.endDate.getTime() - CURRENT_DATE.getTime();
      daysToNextMilestone = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }

    // TRL pacing velocity
    const targetTRL = project.currentTRL + 1;
    const nextTRLItem = trlItems.find((t) => t.trlLevel === targetTRL);
    let daysToNextTRL: number | null = null;
    if (nextTRLItem) {
      const diff = nextTRLItem.endDate.getTime() - CURRENT_DATE.getTime();
      daysToNextTRL = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    // Overall pace status
    const isPacingGood = overdueTasks === 0 && (daysToNextMilestone === null || daysToNextMilestone > 0);

    return {
      totalM,
      completedM,
      milestoneRate: totalM > 0 ? Math.round((completedM / totalM) * 100) : 0,
      activeM,
      daysToNextMilestone,
      totalT,
      completedT,
      overdueTasks,
      targetTRL,
      daysToNextTRL,
      isPacingGood,
    };
  }, [milestoneItems, taskItems, trlItems, project.currentTRL]);

  // Scroll to Today
  const handleScrollToToday = () => {
    if (timelineScrollRef.current) {
      const containerWidth = timelineScrollRef.current.scrollWidth;
      const scrollPos = (todayX / 100) * containerWidth - 300;
      timelineScrollRef.current.scrollTo({ left: Math.max(0, scrollPos), behavior: 'smooth' });
    }
  };

  // Color helper for bars
  const getBarColor = (item: GanttItem) => {
    if (item.type === 'milestone') {
      if (item.status === 'Completed') return 'bg-emerald-500 border-emerald-600 text-emerald-950';
      if (item.status === 'In Progress') return 'bg-blue-600 border-blue-700 text-white shadow-xs';
      if (item.status === 'Blocked') return 'bg-rose-500 border-rose-600 text-white';
      return 'bg-slate-200 border-slate-300 text-slate-700';
    }
    if (item.type === 'trl') {
      if (item.status === 'Completed') return 'bg-purple-600 border-purple-700 text-white';
      if (item.status === 'In Progress') return 'bg-gradient-to-r from-purple-600 to-indigo-600 border-indigo-700 text-white ring-2 ring-purple-300 ring-offset-1';
      return 'bg-purple-100 border-purple-200 text-purple-800 border-dashed';
    }
    // Tasks
    if (item.status === 'Completed') return 'bg-emerald-400/90 border-emerald-500 text-emerald-950';
    if (item.status === 'In Progress') return 'bg-amber-500 border-amber-600 text-white';
    if (item.priority === 'High') return 'bg-rose-400 border-rose-500 text-white';
    return 'bg-sky-400/80 border-sky-500 text-sky-950';
  };

  return (
    <div className="space-y-4">
      {/* 1. Top Executive Pacing Header & Health Indicators */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3.5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Project Pacing & GANTT Timeline
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                  {project.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                    analytics.isPacingGood
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      analytics.isPacingGood ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  {analytics.isPacingGood ? 'Pacing on Track' : 'Pacing Attention Needed'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic execution schedule mapping research milestones, TRL advancement gates, and task deadlines across Jharkhand project lifecycle.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={handleScrollToToday}
              className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              title="Jump viewport to current execution date"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Center on Today</span>
            </button>
            {onAdvanceTRLClick && (
              <button
                onClick={onAdvanceTRLClick}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <GitCommit className="w-3.5 h-3.5" />
                <span>Advance TRL</span>
              </button>
            )}
          </div>
        </div>

        {/* Key Pacing Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Metric 1: Milestone Progress */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold flex items-center gap-1">
                <Flag className="w-3.5 h-3.5 text-blue-600" />
                Milestone Adherence
              </span>
              <span className="font-bold text-blue-700">{analytics.milestoneRate}%</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-heading">
              {analytics.completedM} / {analytics.totalM} Completed
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {analytics.activeM
                ? `Next: ${analytics.activeM.title.split(':')[1] || analytics.activeM.title}`
                : 'All milestones completed'}
            </p>
          </div>

          {/* Metric 2: Next TRL Progression Gate */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold flex items-center gap-1">
                <GitCommit className="w-3.5 h-3.5 text-purple-600" />
                Next TRL Target
              </span>
              <span className="font-bold text-purple-700">TRL {analytics.targetTRL}</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-heading flex items-center gap-1.5">
              <span>TRL {project.currentTRL}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-purple-700">TRL {analytics.targetTRL}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {analytics.daysToNextTRL !== null
                ? analytics.daysToNextTRL >= 0
                  ? `${analytics.daysToNextTRL} days to target gate`
                  : `${Math.abs(analytics.daysToNextTRL)} days past target`
                : 'Fully Qualified at TRL 9'}
            </p>
          </div>

          {/* Metric 3: Active Task Velocity */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                Task Delivery
              </span>
              <span className="font-bold text-emerald-700">
                {analytics.totalT > 0
                  ? Math.round((analytics.completedT / analytics.totalT) * 100)
                  : 100}
                %
              </span>
            </div>
            <div className="text-base font-bold text-slate-900 font-heading">
              {analytics.completedT} / {analytics.totalT} Finished
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {analytics.overdueTasks > 0 ? (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {analytics.overdueTasks} tasks overdue
                </span>
              ) : (
                <span className="text-emerald-600">All task deadlines on schedule</span>
              )}
            </p>
          </div>

          {/* Metric 4: Funding Release Pacing */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                Tranche Release
              </span>
              <span className="font-bold text-indigo-700">{project.funding.received}</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-heading">
              {project.funding.expended} Spent
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              Remaining: <span className="font-semibold text-slate-700">{project.funding.remaining}</span>
            </p>
          </div>
        </div>

        {/* 2. Filter and View Control Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Track Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Tracks:
            </span>
            {(
              [
                { id: 'all', label: 'All Tracks' },
                { id: 'milestones', label: 'Milestones' },
                { id: 'trl', label: 'TRL Gates' },
                { id: 'tasks', label: 'Tasks' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTrackFilter(t.id)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  trackFilter === t.id
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <span className="text-[11px] font-bold text-slate-500 px-2">Status:</span>
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'completed', label: 'Completed' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'upcoming', label: 'Upcoming' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-2 py-1 rounded-md font-semibold transition-all ${
                  statusFilter === s.id
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Options: Today line toggle */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 font-medium">
              <input
                type="checkbox"
                checked={showTodayLine}
                onChange={(e) => setShowTodayLine(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 h-3.5 w-3.5"
              />
              <span>Show Today Pin (06 Sep)</span>
            </label>
            <div className="text-[11px] text-slate-400 hidden lg:block">
              Click any bar to inspect deliverables & dependencies
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main GANTT Interactive Canvas */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Visual GANTT Header Legend */}
        <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-700 uppercase tracking-wider">Legend:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-blue-600" />
              <span>Milestone & Funding Tranche</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-purple-600" />
              <span>TRL 1–9 Progression Gate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-500" />
              <span>Sprint Task & Deadline</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500" />
              <span>Completed / Approved</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Project Inception: <strong>{minDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</strong></span>
            <span>→</span>
            <span>Target Completion: <strong>{maxDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</strong></span>
          </div>
        </div>

        {/* Scrollable Timeline Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          {/* Left Column: Fixed Item Titles & Status (4 cols on lg) */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white select-none">
            {/* Left Header */}
            <div className="h-16 px-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Item & Deliverables Structure</span>
              <span className="text-[11px] text-slate-400 font-normal">Target / Due Date</span>
            </div>

            {/* Item List Rows Matching Timeline */}
            <div className="divide-y divide-slate-100 text-xs">
              {/* SECTION 1: Milestones */}
              {filteredMilestones.length > 0 && (
                <div>
                  <button
                    onClick={() => toggleSection('milestones')}
                    className="w-full px-3 py-2 bg-blue-50/70 hover:bg-blue-50 text-blue-900 font-bold flex items-center justify-between text-xs transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      {expandedSections.milestones ? (
                        <ChevronDown className="w-3.5 h-3.5 text-blue-700" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-blue-700" />
                      )}
                      <Flag className="w-3.5 h-3.5 text-blue-600" />
                      Major Milestones & Tranches ({filteredMilestones.length})
                    </span>
                    <span className="text-[10px] text-blue-700 font-semibold uppercase">TRL Gate</span>
                  </button>

                  {expandedSections.milestones &&
                    filteredMilestones.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`h-12 px-3 flex items-center justify-between hover:bg-blue-50/40 cursor-pointer transition-colors ${
                          selectedItem?.id === item.id ? 'bg-blue-50 font-bold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              item.status === 'Completed'
                                ? 'bg-emerald-500'
                                : item.status === 'In Progress'
                                ? 'bg-blue-600'
                                : 'bg-slate-300'
                            }`}
                          />
                          <span className="truncate text-slate-800 font-medium" title={item.title}>
                            {item.title}
                          </span>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5 text-[11px] text-slate-500">
                          {item.fundingPercentage ? (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                              {item.fundingPercentage}%
                            </span>
                          ) : null}
                          <span>
                            {item.endDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* SECTION 2: TRL Gates */}
              {filteredTRL.length > 0 && (
                <div>
                  <button
                    onClick={() => toggleSection('trl')}
                    className="w-full px-3 py-2 bg-purple-50/70 hover:bg-purple-50 text-purple-900 font-bold flex items-center justify-between text-xs transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      {expandedSections.trl ? (
                        <ChevronDown className="w-3.5 h-3.5 text-purple-700" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-purple-700" />
                      )}
                      <GitCommit className="w-3.5 h-3.5 text-purple-600" />
                      TRL 1–9 Progression Gates ({filteredTRL.length})
                    </span>
                    <span className="text-[10px] text-purple-700 font-semibold uppercase">Stage Level</span>
                  </button>

                  {expandedSections.trl &&
                    filteredTRL.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`h-12 px-3 flex items-center justify-between hover:bg-purple-50/40 cursor-pointer transition-colors ${
                          selectedItem?.id === item.id ? 'bg-purple-50 font-bold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span
                            className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0 ${
                              item.status === 'Completed'
                                ? 'bg-purple-600 text-white'
                                : item.status === 'In Progress'
                                ? 'bg-indigo-600 text-white animate-pulse'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {item.trlLevel}
                          </span>
                          <span className="truncate text-slate-800 font-medium" title={item.title}>
                            {item.title}
                          </span>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5 text-[11px] text-slate-500">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              item.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-700'
                                : item.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {item.status === 'Completed'
                              ? 'Approved'
                              : item.status === 'In Progress'
                              ? 'Active'
                              : 'Target'}
                          </span>
                          <span>
                            {item.endDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* SECTION 3: Sprint Tasks */}
              {filteredTasks.length > 0 && (
                <div>
                  <button
                    onClick={() => toggleSection('tasks')}
                    className="w-full px-3 py-2 bg-amber-50/70 hover:bg-amber-50 text-amber-900 font-bold flex items-center justify-between text-xs transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      {expandedSections.tasks ? (
                        <ChevronDown className="w-3.5 h-3.5 text-amber-700" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
                      )}
                      <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
                      Operational Tasks & Deadlines ({filteredTasks.length})
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold uppercase">Assignee</span>
                  </button>

                  {expandedSections.tasks &&
                    filteredTasks.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`h-12 px-3 flex items-center justify-between hover:bg-amber-50/40 cursor-pointer transition-colors ${
                          selectedItem?.id === item.id ? 'bg-amber-50 font-bold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              item.status === 'Completed'
                                ? 'bg-emerald-500'
                                : item.priority === 'High'
                                ? 'bg-rose-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          <span className="truncate text-slate-800 font-medium" title={item.title}>
                            {item.title}
                          </span>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5 text-[11px] text-slate-500">
                          {item.assignee && (
                            <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                              {item.assignee.split(' ')[0]}
                            </span>
                          )}
                          <span>
                            {item.endDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Timeline Gantt Bars Canvas (8 cols on lg) */}
          <div
            ref={timelineScrollRef}
            className="lg:col-span-8 overflow-x-auto relative bg-slate-50/30"
          >
            {/* Inner fixed-width container for smooth horizontal alignment */}
            <div className="min-w-[800px] w-full relative">
              {/* Timeline Header Rows (Quarter & Months) */}
              <div className="h-16 border-b border-slate-200 bg-slate-50 sticky top-0 z-20">
                {/* Months Bar */}
                <div className="h-16 relative flex">
                  {timelineColumns.map((col, idx) => (
                    <div
                      key={idx}
                      style={{ width: `${col.widthPercent}%` }}
                      className="h-full border-r border-slate-200/80 px-2 py-1 flex flex-col justify-center text-center select-none"
                    >
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {col.quarter}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {col.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vertical Today Line through all tracks */}
              {showTodayLine && (
                <div
                  style={{ left: `${todayX}%` }}
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-30 pointer-events-none"
                >
                  <div className="sticky top-1 -ml-11 bg-amber-600 text-white font-bold px-2 py-0.5 rounded-full text-[10px] shadow-sm flex items-center gap-1 z-40 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>TODAY: 06 Sep</span>
                  </div>
                </div>
              )}

              {/* Background Month Strip Grid Lines */}
              <div className="absolute inset-0 top-16 pointer-events-none flex">
                {timelineColumns.map((col, idx) => (
                  <div
                    key={idx}
                    style={{ width: `${col.widthPercent}%` }}
                    className={`h-full border-r border-slate-200/60 ${
                      idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-100/30'
                    }`}
                  />
                ))}
              </div>

              {/* GANTT BARS: SECTION 1 - Milestones */}
              {filteredMilestones.length > 0 && (
                <div>
                  {/* Category separator height matching left header */}
                  <div className="h-8 bg-blue-50/30 border-b border-slate-100" />
                  {expandedSections.milestones &&
                    filteredMilestones.map((item) => {
                      const leftPercent = getXPercent(item.startDate);
                      const rightPercent = getXPercent(item.endDate);
                      const widthPercent = Math.max(2.5, rightPercent - leftPercent);
                      const isSelected = selectedItem?.id === item.id;

                      return (
                        <div
                          key={item.id}
                          className="h-12 border-b border-slate-100 relative flex items-center px-1"
                        >
                          <div
                            onClick={() => setSelectedItem(item)}
                            style={{
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                            }}
                            className={`absolute h-7 rounded-lg border cursor-pointer transition-all duration-150 flex items-center px-2.5 text-xs select-none shadow-xs group z-10 ${getBarColor(
                              item
                            )} ${isSelected ? 'ring-2 ring-blue-600 ring-offset-1 z-20 scale-[1.02]' : 'hover:scale-[1.01]'}`}
                            title={`${item.title} (${item.startDate.toLocaleDateString()} - ${item.endDate.toLocaleDateString()})`}
                          >
                            {/* Inner Progress fill bar */}
                            {item.status === 'In Progress' && (
                              <div
                                className="absolute inset-0 bg-blue-700/40 rounded-lg overflow-hidden pointer-events-none"
                                style={{ width: `${item.progress}%` }}
                              />
                            )}

                            {/* Label & Chips */}
                            <div className="relative z-10 flex items-center justify-between w-full gap-2 truncate">
                              <span className="font-bold truncate text-[11px]">
                                {item.rawMilestone?.id || item.title.split(':')[0]}: {item.title.split(':')[1] || item.title}
                              </span>
                              <div className="flex items-center gap-1 shrink-0">
                                {item.fundingTranche && (
                                  <span className="px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-bold">
                                    {item.fundingTranche.split(' ')[0]}
                                  </span>
                                )}
                                {item.status === 'Completed' && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950 shrink-0" />
                                )}
                              </div>
                            </div>

                            {/* End target diamond marker */}
                            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-white border-2 border-blue-600 shadow-xs z-20" />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* GANTT BARS: SECTION 2 - TRL Gates */}
              {filteredTRL.length > 0 && (
                <div>
                  <div className="h-8 bg-purple-50/30 border-b border-slate-100" />
                  {expandedSections.trl &&
                    filteredTRL.map((item) => {
                      const leftPercent = getXPercent(item.startDate);
                      const rightPercent = getXPercent(item.endDate);
                      const widthPercent = Math.max(3, rightPercent - leftPercent);
                      const isSelected = selectedItem?.id === item.id;

                      return (
                        <div
                          key={item.id}
                          className="h-12 border-b border-slate-100 relative flex items-center px-1"
                        >
                          <div
                            onClick={() => setSelectedItem(item)}
                            style={{
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                            }}
                            className={`absolute h-7 rounded-lg border cursor-pointer transition-all duration-150 flex items-center px-2.5 text-xs select-none shadow-xs group z-10 ${getBarColor(
                              item
                            )} ${isSelected ? 'ring-2 ring-purple-600 ring-offset-1 z-20 scale-[1.02]' : 'hover:scale-[1.01]'}`}
                            title={`${item.title} (TRL ${item.trlLevel})`}
                          >
                            <div className="flex items-center justify-between w-full gap-2 truncate">
                              <span className="font-bold truncate text-[11px] flex items-center gap-1">
                                <span className="px-1.5 py-0.2 rounded bg-white/25 text-[10px]">
                                  TRL {item.trlLevel}
                                </span>
                                <span className="truncate">{item.title.split(':')[1] || item.title}</span>
                              </span>
                              {item.status === 'Completed' ? (
                                <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
                              ) : (
                                <span className="text-[10px] text-white/90 font-medium">
                                  {item.status === 'In Progress' ? 'Testing' : 'Target'}
                                </span>
                              )}
                            </div>

                            {/* TRL Milestone Gate Pin */}
                            <div
                              className={`absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold shadow-xs z-20 ${
                                item.status === 'Completed'
                                  ? 'bg-purple-700 text-white'
                                  : item.status === 'In Progress'
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-300 text-slate-700'
                              }`}
                            >
                              {item.trlLevel}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* GANTT BARS: SECTION 3 - Sprint Tasks */}
              {filteredTasks.length > 0 && (
                <div>
                  <div className="h-8 bg-amber-50/30 border-b border-slate-100" />
                  {expandedSections.tasks &&
                    filteredTasks.map((item) => {
                      const leftPercent = getXPercent(item.startDate);
                      const rightPercent = getXPercent(item.endDate);
                      const widthPercent = Math.max(2.5, rightPercent - leftPercent);
                      const isSelected = selectedItem?.id === item.id;

                      return (
                        <div
                          key={item.id}
                          className="h-12 border-b border-slate-100 relative flex items-center px-1"
                        >
                          <div
                            onClick={() => setSelectedItem(item)}
                            style={{
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                            }}
                            className={`absolute h-6 rounded-md border cursor-pointer transition-all duration-150 flex items-center px-2 text-xs select-none shadow-xs group z-10 ${getBarColor(
                              item
                            )} ${isSelected ? 'ring-2 ring-amber-500 ring-offset-1 z-20 scale-[1.02]' : 'hover:scale-[1.01]'}`}
                            title={`${item.title} (Due: ${item.endDate.toLocaleDateString()})`}
                          >
                            <div className="flex items-center justify-between w-full gap-2 truncate">
                              <span className="font-semibold truncate text-[10px]">
                                {item.title}
                              </span>
                              <div className="flex items-center gap-1 shrink-0 text-[9px]">
                                {item.priority === 'High' && (
                                  <span className="px-1 py-0.2 rounded bg-rose-600 text-white font-bold">
                                    HIGH
                                  </span>
                                )}
                                {item.status === 'Completed' && (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-900" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Interactive Detail Drawer / Inspector Panel */}
      {selectedItem ? (
        <div className="bg-slate-900 text-white rounded-xl p-4 shadow-md border border-slate-800 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  selectedItem.type === 'milestone'
                    ? 'bg-blue-600 text-white'
                    : selectedItem.type === 'trl'
                    ? 'bg-purple-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {selectedItem.type === 'milestone'
                  ? 'Milestone'
                  : selectedItem.type === 'trl'
                  ? 'TRL Progression Gate'
                  : 'Operational Task'}
              </span>
              <h4 className="text-sm font-bold font-heading">{selectedItem.title}</h4>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
              <div className="text-slate-400 text-[11px]">Schedule Interval</div>
              <div className="font-semibold text-slate-200 mt-0.5">
                {selectedItem.startDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                →{' '}
                {selectedItem.endDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Duration: {Math.ceil((selectedItem.endDate.getTime() - selectedItem.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
              </div>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
              <div className="text-slate-400 text-[11px]">Execution Status</div>
              <div className="font-semibold text-slate-200 mt-0.5 flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    selectedItem.status === 'Completed'
                      ? 'bg-emerald-400'
                      : selectedItem.status === 'In Progress'
                      ? 'bg-blue-400 animate-pulse'
                      : 'bg-slate-400'
                  }`}
                />
                {selectedItem.status} ({selectedItem.progress}%)
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {selectedItem.endDate < CURRENT_DATE && selectedItem.status !== 'Completed' ? (
                  <span className="text-rose-400 font-bold">Past target date</span>
                ) : (
                  <span className="text-emerald-400">Pacing aligned with schedule</span>
                )}
              </div>
            </div>

            {selectedItem.type === 'milestone' && (
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
                <div className="text-slate-400 text-[11px]">Funding Tranche</div>
                <div className="font-semibold text-indigo-300 mt-0.5">
                  {selectedItem.fundingTranche || 'N/A'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Target Gate: TRL {selectedItem.trlLevel}
                </div>
              </div>
            )}

            {selectedItem.type === 'trl' && (
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
                <div className="text-slate-400 text-[11px]">Approval Evidence</div>
                <div className="font-semibold text-purple-300 mt-0.5 truncate">
                  {selectedItem.approvedBy || 'Pending Formal Review'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  Doc: {selectedItem.documentRef || 'Not yet submitted'}
                </div>
              </div>
            )}

            {selectedItem.type === 'task' && (
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
                <div className="text-slate-400 text-[11px]">Assigned Researcher</div>
                <div className="font-semibold text-slate-200 mt-0.5 truncate">
                  {selectedItem.assignee || 'Unassigned'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Priority: <span className="font-bold text-amber-300">{selectedItem.priority}</span>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 flex flex-col justify-center gap-1.5">
              <div className="text-slate-400 text-[11px]">Quick Action</div>
              {selectedItem.rawTask ? (
                <button
                  onClick={() => {
                    toggleTaskStatus(selectedItem.rawTask!.id);
                    setSelectedItem(null);
                  }}
                  className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>
                    {selectedItem.rawTask.status === 'done' ? 'Reopen Task' : 'Mark Task Done'}
                  </span>
                </button>
              ) : selectedItem.type === 'trl' && onAdvanceTRLClick ? (
                <button
                  onClick={onAdvanceTRLClick}
                  className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <GitCommit className="w-3.5 h-3.5" />
                  <span>Advance TRL Stage</span>
                </button>
              ) : (
                <div className="text-slate-300 text-[11px]">
                  {selectedItem.deliverables?.length || 0} Deliverables tracked
                </div>
              )}
            </div>
          </div>

          {/* Deliverables checklist if milestone */}
          {selectedItem.deliverables && selectedItem.deliverables.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                Required Verification Deliverables:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {selectedItem.deliverables.map((deliv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-slate-800/50 px-2.5 py-1.5 rounded-md border border-slate-700 text-slate-300 text-xs"
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${
                        selectedItem.status === 'Completed' ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    />
                    <span className="truncate">{deliv}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Pacing Insight:</strong> Active field pilot testing in Gumla district is scheduled through <strong>15 Oct 2026</strong>. 3 operational tasks are currently running concurrently on the critical path to TRL 7 gate certification.
            </span>
          </div>
          <button
            onClick={handleScrollToToday}
            className="text-blue-600 hover:text-blue-800 font-bold shrink-0 ml-2"
          >
            Locate Current Date →
          </button>
        </div>
      )}
    </div>
  );
};
